/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon1 extends Weapon {
    private timer_send: egret.Timer = null; // 武器充能定时器， 因为是一颗子弹一颗子弹的发，所以这里用一个连续的充能定时器即可

    private weaponRatio: number = 1000; //  当前武器充能时间
    private bombScope:number = 200;     //  当期子弹爆炸范围
    private lastIndex: number = 0;      //  上一次发送子弹的翼

    private bullets: Array<any> = new Array<any>();

    private scaleStart:number = 0.4;        // 初始子弹大小
    private scaleTime:number = 400;         // 放大时间
    private bulletScale: number = 1;        // 体积，成长

    private bullets_free = [];
    private fxs_free = [];


    private createBullet() {
        if (this.bullets_free.length) {
            return this.bullets_free.shift();
        }

        let modelname = this.config['model'];
        return ResTools.createBitmapByName(modelname);
    }

    private createFx() {
        if (this.fxs_free.length) {
            return this.fxs_free.shift();
        }

        let modelname = this.config['data']['bombfx']
        return ResTools.createBitmapByName(modelname);
    }

    public constructor(p: eui.Group, mainWeapon: eui.Image, id: number, attack: number, strength: number) {

        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')

        let fun = this.config['weaponRatio'];
        if (fun) this.weaponRatio = fun(this.strength);

        fun = this.config['bombScope'];
        if (fun) this.bombScope = fun(this.attack); //火力决定

        fun = this.config['bulletScale'];
        if (fun) this.bulletScale = fun(this.strength);

        this.scaleStart = this.config['data']['scale']['start'];
        this.scaleTime = this.config['data']['scale']['time'];

        // 提前创建2个子弹
        let b = [];
        for (let i = 0; i < 2; i++) {
            b.push(this.createBullet());
        }
        b.forEach(bb => this.bullets_free.push(bb));

        b = [];
        for (let i = 0; i < 2; i++) {
            b.push(this.createFx());
        }
        b.forEach(bb => this.fxs_free.push(bb));
    }

    // 启动
    public start(): void {

        console.log('start weapon...')
        if (this.timer_send == null) {
            this.timer_send = new egret.Timer(this.weaponRatio, 0);
            this.timer_send.addEventListener(egret.TimerEvent.TIMER, this.sendBullet, this);
            this.timer_send.start();
        }
    }

    // 暂停
    public stop(): void {

        console.log('stop weapon...')
        this.timer_send.stop();
        this.timer_send = null;
    }

    // 帧函数，子弹的移动，子弹的碰撞检测，子弹的生命周期检测
    public update(deltaTime: number, deltaTime_snow:number, star_flys: Array<any>): void {

        //console.log('update weapon...' + deltaTime)
        let needBombs = [];
        for (let i = 0; i < this.bullets.length;) {
            // 先移动
            let bdata = this.bullets[i];
            bdata.model.x += bdata.speed.x * deltaTime;
            bdata.model.y += bdata.speed.y * deltaTime;

            // 再碰撞
            let co = false;
            for (let j = 0; j < star_flys.length; j++) {
                let star = star_flys[j]
                if (star.starConfig['group'] & StarData.CAN_ATTACK && Tools.starCoTest(bdata.model, star.model)) {
                    co = true;
                    needBombs.push(bdata);
                    break;
                }
            }

            if (co) {
                this.bullets.splice(i, 1);
            } else {
                i++;
            }
        }

        needBombs.forEach(data => {
            // 计算伤害
            star_flys.forEach(star => {
                if (Tools.bombTest(data.model.x, data.model.y, 0.5 * this.bombScope, star.model)) {
                    star.need_fx = true;
                    star.blood -= GameData.sub_weapon.attack;
                    if (star.blood < 0) star.blood = 0;
                }
            })
            // 子弹消失
            data.model.parent && data.model.parent.removeChild(data.model)
            this.bullets_free.push(data.model);
            // 播放特效
            this.playFx(data.model.x, data.model.y);
        });

        // 生命周期检测
        for (let i = 0; i < this.bullets.length;) {
            let data = this.bullets[i];
            if (data.endTime < egret.getTimer()) {
                // 世间到，结束
                data.model.parent && data.model.parent.removeChild(data.model)
                this.bullets_free.push(data.model);
                this.bullets.splice(i, 1)
            } else {
                i++;
            }
        }
    }

    // 播放子弹爆炸特效
    private playFx(x: number, y: number): void {

        let fx_model = this.createFx();
        fx_model.x = x;
        fx_model.y = y;
        fx_model.anchorOffsetX = fx_model.width / 2;
        fx_model.anchorOffsetY = fx_model.height / 2;


        this.p.addChild(fx_model);

        egret.Tween.get(fx_model).to({scaleX: 1.3, scaleY: 1.3}, 300).call(() => {
            this.p.removeChild(fx_model);
            this.fxs_free.push(fx_model);


        })
    }

    // 发送一颗子弹
    private sendBullet(): void {
        let bulletconfig = this.config['data']['bulletconfig'];
        let modelname = this.config['model'];

        // 取出本轮应该发射的位置
        this.lastIndex %= bulletconfig.length;
        let bconf = bulletconfig[this.lastIndex];
        this.lastIndex++;

        // 发送子弹
        let x = this.mainWeapon.x;
        let y = this.mainWeapon.y;

        x += bconf.startx;
        y += bconf.starty;


        let model = this.createBullet();

        model.x = x;
        model.y = y;
        model.anchorOffsetX = model.width / 2
        model.anchorOffsetY = model.height / 2
        model.rotation = bconf.angle * -1 + 90;
        model.scaleX = this.scaleStart;
        model.scaleY = this.scaleStart;
        this.p.addChild(model);

        let speed: egret.Point = new egret.Point(Math.cos(bconf.angle / 180 * Math.PI), -1 * Math.sin(bconf.angle / 180 * Math.PI));
        speed.normalize(this.config["data"]["flySpeed"]);

        let bulletdata = {
            model: model,
            speed: speed,
            endTime: egret.getTimer() + this.config["data"]["flyTime"],
        }

        this.bullets.push(bulletdata);

        egret.Tween.get(model).to({scaleX:this.bulletScale, scaleY:this.bulletScale}, this.scaleTime);

    }
}