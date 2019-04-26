/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon4 extends Weapon {
    private timer_send: egret.Timer = null; // 发射子弹

    private weaponRatio: number = 3000;        //  充能时长，每次结束之后都需要充能这么久
    private bulletScale: number = 1;        // 体积，成长
    private bombScope: number = 300;         // 爆炸范围

    private fly: any = {
        speedStart: 1,
        speedEnd: 0.5,
        time: 2000,
    };

    private snow: any = {
        time: 2000,
        speedRatio: 0.2,
    };
    // 飞行速度
    private scaleStart: number = 0.4;        // 初始子弹大小
    private scaleTime: number = 400;         // 放大时间

    private energy: number = 0;              // 当前能量

    private bullets: Array<any> = new Array<any>();
    private bullets_free = [];

    private fx = [];

    private state: number = 0;              // 0的时候充能， 1的时候放能
    public getAttack(): number {
        let attacklevel = this.attack;
        if(attacklevel <=100) return 40* (attacklevel + 20)*(attacklevel + 20);
        return 600*Math.exp(0.054*attacklevel);
    }
    // 子弹创建
    private createBullet() {
        if (this.bullets_free.length) {
            return this.bullets_free.shift();
        }

        let modelname = this.config['model'];
        return ResTools.createBitmapByName(modelname);
    }

    // 特效创建
    private createFx() {
        if (this.fx.length) {
            return this.fx.shift();

        }

        let modelname = this.config['data']['fx']
        return ResTools.createBitmapByName(modelname);
    }

    //
    public constructor(p: eui.Group, mainWeapon: eui.Component, id: number, attack: number, strength: number) {

        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')

        let fun = this.config['weaponRatio'];
        if (fun) this.weaponRatio = fun(this.strength);

        fun = this.config['bulletScale'];
        if (fun) this.bulletScale = fun(this.strength);

        fun = this.config['bombScope'];
        if (fun) this.bombScope = fun(this.strength);

        this.scaleStart = this.config['data']['scale']['start'];
        this.scaleTime = this.config['data']['scale']['time'];
        this.fly = this.config['data']['fly'];
        this.snow = this.config['data']['snow'];

        // 提前创建2个子弹
        let b = [];
        for (let i = 0; i < 4; i++) {
            b.push(this.createBullet());
        }
        b.forEach(bb => this.bullets_free.push(bb));

        this.fx.push(this.createFx());

    }

    // 启动
    public start(): void {
        this.canSend = true;
    }

    // 暂停
    public stop(): void {
        this.canSend = false;
    }

    public clear(): void {
        for (let i = 0; i < this.bullets.length; i++) {
            let data = this.bullets[i];
            data.model.parent && data.model.parent.removeChild(data.model)
            this.bullets_free.push(data.model);
        }

        this.bullets = [];
    }

    private canSend = false;
    // 帧函数，子弹的移动，子弹的碰撞检测，子弹的生命周期检测
    public update(deltaTime: number, deltaTime_snow: number, star_flys: Array<any>): void {

        // 充能
        this.energy += deltaTime_snow;
        if (this.energy >= this.weaponRatio) {
            this.energy = 0;
            this.sendBullet();
        }


        let bombs = [];

        // 子弹飞行
        for (let i = 0; i < this.bullets.length; i++) {
            // 先移动
            let data = this.bullets[i];
            let speed = this.fly.speedStart;
            if (data.flyTime >= this.fly.time) speed = this.fly.speedEnd;
            else if (data.flyTime > 0) {
                let r2 = (this.fly.time - data.flyTime) / this.fly.time;
                let r1 = 1 - r2;
                speed = this.fly.speedStart * r2 + this.fly.speedEnd * r1;
            }

            data.flyTime += deltaTime;

            data.model.y -= speed * deltaTime;

            for (let j = 0; j < star_flys.length; j++) {
                let star = star_flys[j];
                if (star.starConfig['group'] & StarData.CAN_ATTACK) {

                    if (Tools.starCoTest(star.model, data.model)) {
                        // 碰到怪物，则子弹消失，播放子弹爆炸特效，并检测爆炸范围

                        bombs.push({
                            x: data.model.x,
                            y: data.model.y,
                        })

                        this.bullets.splice(i, 1);
                        data.model.parent && data.model.parent.removeChild(data.model);

                        i--;
                        break;
                    }


                }
            }


        }

        // 生命周期检测
        for (let i = 0; i < this.bullets.length;) {
            let data = this.bullets[i];
            if (data.model.x < 0 || data.model.x > 750 || data.model.y < -1 * data.model.height / 2) {
                // 飞出屏幕，结束
                data.model.parent && data.model.parent.removeChild(data.model)
                this.bullets_free.push(data.model);
                this.bullets.splice(i, 1)

                if (this.bullets.length == 0) {
                    this.state = 0;
                }

            } else {
                i++;
            }
        }

        bombs.forEach(p => {

            this.playFx(p.x, p.y);

            for (let j = 0; j < star_flys.length; j++) {
                let star = star_flys[j];
                let r = star.model.width / 2 * star.model.scaleX + this.bombScope / 2;
                if (Tools.bombTest(p.x, p.y, r, star.model)) {

                    // 怪物减速设置
                    if (this.snow) {
                        MonsterTools.pushSnow(star, 'weapon4', this.snow.speedRatio, this.snow.time)
                    }

                    MonsterTools.delHp(star, this.getAttack());

                }

                // 播放打击特效
                // 是否
            }
        })
    }


    private playFx(x: number, y: number): void {
        let fx = this.createFx();
        fx.x = x;
        fx.y = y;
        fx.anchorOffsetX = fx.width / 2;
        fx.anchorOffsetY = fx.height / 2;

        let scale = this.bombScope / fx.width;
        fx.scaleX = scale;
        fx.scaleY = scale;
        fx.alpha = 1;
        this.p.addChild(fx);
        egret.Tween.get(fx).to({alpha: 0.9}, this.snow.time).call(() => {
            this.p.removeChild(fx);
            this.fx.push(fx);
        })
    }

    // 发送一颗子弹
    private sendBullet(): void {
        // 发送子弹
        let x = this.mainWeapon.x;
        let y = this.mainWeapon.y - this.mainWeapon.height / 2;

        let model = this.createBullet();

        model.x = x;
        model.y = y;
        model.anchorOffsetX = model.width / 2
        model.anchorOffsetY = model.height / 2
        model.scaleX = this.scaleStart;
        model.scaleY = this.scaleStart;
        this.p.addChild(model);


        let bulletdata = {
            model: model,
            flyTime: 0,
        }

        this.bullets.push(bulletdata);

        egret.Tween.get(model).to({scaleX: this.bulletScale, scaleY: this.bulletScale}, this.scaleTime);

    }
}