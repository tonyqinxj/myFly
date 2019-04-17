/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon3 extends Weapon {
    private timer_send: egret.Timer = null; // 发射子弹

    private weaponRatio: number = 3000;        //  充能时长，每次结束之后都需要充能这么久
    private bulletRatio: number = 300;       //  子弹发送频率
    private bulletCount: number = 3;        //  容量，能量桶
    private flySpeed: number = 0;            // 飞行速度
    private scaleStart: number = 0.4;        // 初始子弹大小
    private scaleTime: number = 400;         // 放大时间
    private bulletScale: number = 1;        // 体积，成长

    private energy: number = 0;              // 当前能量

    private bullets: Array<any> = new Array<any>();
    private bullets_free = [];

    private fx = null;

    private state: number = 0;              // 0的时候充能， 1的时候放能

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
        if (this.fx == null) {
            let modelname = this.config['data']['fx']
            this.fx = ResTools.createBitmapByName(modelname);
            egret.Tween.get(this.fx, {loop: true}).to({alpha: 0.5}, 300).to({alpha: 1}, 300);
        }

        return this.fx
    }

    //
    public constructor(p: eui.Group, mainWeapon: eui.Image, id: number, attack: number, strength: number) {

        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')

        let fun = this.config['weaponRatio'];
        if (fun) this.weaponRatio = fun(this.strength);

        fun = this.config['bulletRatio'];
        if (fun) this.bulletRatio = fun(this.strength);

        fun = this.config['bulletCount'];
        if (fun) this.bulletCount = fun(this.strength);

        fun = this.config['bulletScale'];
        if (fun) this.bulletScale = fun(this.strength);

        this.scaleStart = this.config['data']['scale']['start'];
        this.scaleTime = this.config['data']['scale']['time'];
        this.flySpeed = this.config['data']['flySpeed'];

        // 提前创建2个子弹
        let b = [];
        for (let i = 0; i < 4; i++) {
            b.push(this.createBullet());
        }
        b.forEach(bb => this.bullets_free.push(bb));

        this.createFx()

    }

    // 启动
    public start(): void {
        this.canSend = true;
    }

    // 暂停
    public stop(): void {
        this.canSend = false;
    }

    private canSend = false;
    // 帧函数，子弹的移动，子弹的碰撞检测，子弹的生命周期检测
    public update(deltaTime: number, deltaTime_snow: number, star_flys: Array<any>): void {

        // 充能
        if (this.state == 0) {

            this.energy += deltaTime_snow;
            if (this.energy >= this.bulletRatio) {
                this.energy = 0;
                this.state = 1;
                this.beginSend();

            }


            return;
        }

        // 子弹飞行
        for (let i = 0; i < this.bullets.length; i++) {
            // 先移动
            let data = this.bullets[i];
            let oldy = data.model.y;
            data.model.y -= this.flySpeed * deltaTime;

            let rect: egret.Rectangle = new egret.Rectangle(
                data.model.x - data.model.width / 2 * data.model.scaleX,
                data.model.y - data.model.height / 2 * data.model.scaleY,
                data.model.width * data.model.scaleX,
                data.model.height * data.model.scaleY + this.flySpeed * deltaTime
            )

            for (let j = 0; j < star_flys.length; j++) {
                let star = star_flys[j];
                if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                    let rect_star: egret.Rectangle = new egret.Rectangle(
                        star.model.x - star.model.width / 2 * star.model.scaleX,
                        star.model.y - star.model.height / 2 * star.model.scaleY,
                        star.model.width * star.model.scaleX,
                        star.model.height * star.model.scaleY
                    )

                    if (rect.intersects(rect_star)) {
                        star.need_fx = true;
                        star.blood -= this.attack;
                        if (star.blood < 0) {
                            star.blood = 0;
                        }
                    }

                    // 播放打击特效
                    // 是否
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


    }


    private beginSend(): void {
        this.sendBullet();
        if (this.bulletCount > 1) {
            this.timer_send = new egret.Timer(this.bulletRatio, this.bulletCount);
            this.timer_send.addEventListener(egret.TimerEvent.TIMER, this.sendBullet, this);
            this.timer_send.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.sendOver, this);
            this.timer_send.start();
        }

    }

    private sendOver(): void {
        this.timer_send = null;

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
        }

        this.bullets.push(bulletdata);

        egret.Tween.get(model).to({scaleX: this.bulletScale, scaleY: this.bulletScale}, this.scaleTime);

    }
}