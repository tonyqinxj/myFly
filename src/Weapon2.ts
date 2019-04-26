/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon2 extends Weapon {
    public static STATE_EMPTY = 1;  // 冷却状态
    public static STATE_WAIT = 2;   // 等待状态
    public static STATE_SEND = 3;   // 发射状态
    public static STATE_INT = 4;    // 中断状态


    private timer_send: egret.Timer = null; // 武器充能定时器， 因为是一颗子弹一颗子弹的发，所以这里用一个连续的充能定时器即可

    private energySpeed: number = 1;        //  充能速度
    private bulletRatio: number = 200;       //  子弹发送频率
    private maxEnergy: number = 3000;        //  容量，能量桶
    private flySpeed: number = 0;            // 飞行速度

    private energy: number = 0;              //  当前能量(发射时长)

    private bullets: Array<any> = new Array<any>();
    private bullets_free = [];
    private fx = null;

    private state: number = 0;

    private target: any = null; // 当前目标

    private lastSendTime: number = 0;
    public getAttack(): number {
        let attacklevel = this.attack;
        if(attacklevel <=100) return 2* (attacklevel+20)*(attacklevel+20);
        return 140*Math.exp(0.054*attacklevel);
    }



    private setState(state: number) {
        this.state = state;
        switch (state) {
            case Weapon2.STATE_EMPTY:
                break;
            case Weapon2.STATE_WAIT:
                break;
            case Weapon2.STATE_SEND:
                //
                break;
            case Weapon2.STATE_INT:
                break;
        }
    }

    // 充能
    private addEnergy(deltaTime: number): void {
        if (this.state == Weapon2.STATE_EMPTY || this.state == Weapon2.STATE_INT) {
            this.energy += deltaTime * this.energySpeed;
            if (this.energy >= this.maxEnergy) {
                this.energy = this.maxEnergy

                if (this.state == Weapon2.STATE_EMPTY) {
                    this.setState(Weapon2.STATE_WAIT)
                }
            }
        }
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
        if (this.fx == null) {
            let modelname = this.config['data']['lockfx']
            this.fx = ResTools.createBitmapByName(modelname);
            egret.Tween.get(this.fx, {loop: true}).to({alpha: 0.5}, 300).to({alpha: 1}, 300);
        }

        return this.fx
    }

    //
    public constructor(p: eui.Group, mainWeapon: eui.Component, id: number, attack: number, strength: number) {

        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')

        let fun = this.config['energySpeed'];
        if (fun) this.energySpeed = fun(this.strength);

        fun = this.config['bulletRatio'];
        if (fun) this.bulletRatio = fun(this.strength);

        fun = this.config['maxEnergy'];
        if (fun) this.maxEnergy = fun(this.strength);

        this.flySpeed = this.config['data']['flySpeed'];

        // 提前创建2个子弹
        let b = [];
        for (let i = 0; i < 4; i++) {
            b.push(this.createBullet());
        }
        b.forEach(bb => this.bullets_free.push(bb));

        this.createFx()

        this.setState(Weapon2.STATE_EMPTY);
    }

    // 启动
    public start(): void {

    }

    // 暂停
    public stop(): void {

    }

    public clear(): void {
        for (let i = 0; i < this.bullets.length; i++) {
            let data = this.bullets[i];
            data.model.parent && data.model.parent.removeChild(data.model)
            this.bullets_free.push(data.model);
        }

        this.bullets = [];
    }

    // 帧函数，子弹的移动，子弹的碰撞检测，子弹的生命周期检测
    public update(deltaTime: number, deltaTime_snow: number, star_flys: Array<any>): void {
        // 充能
        this.addEnergy(deltaTime_snow);

        // 目标进入不可见范围
        if (this.target) {
            if (this.target.model == null || this.target.model.y > this.mainWeapon.y - this.mainWeapon.height / 2) {
                this.target = null;
                this.setState(Weapon2.STATE_INT)
            }
        }

        // 准备状态，选定一个目标，并进入下一个状态
        if (this.state == Weapon2.STATE_WAIT || this.state == Weapon2.STATE_INT) {
            let len = 2000;
            star_flys.forEach(star => {
                if (star.starConfig['group'] & StarData.CAN_ATTACK && star.model.y < this.mainWeapon.y - this.mainWeapon.height / 2) {
                    let p: egret.Point = new egret.Point(star.model.x - this.mainWeapon.x, star.model.y - this.mainWeapon.y)
                    if (p.length < len) {
                        len = p.length;
                        this.target = star;
                    }
                }
            })

            if(this.target){
                this.setState(Weapon2.STATE_SEND);
            }

        }


        // 子弹飞行
        for (let i = 0; i < this.bullets.length;) {
            // 先移动
            let bdata = this.bullets[i];
            if (this.target == bdata.target) {
                // 本子弹的目标仍然有效
                bdata.speed = new egret.Point(this.target.model.x - bdata.model.x, this.target.model.y - bdata.model.y)
                bdata.speed.normalize(this.flySpeed);
            }

            let oldx = bdata.model.x;
            let oldy = bdata.model.y;
            bdata.model.x += bdata.speed.x * deltaTime;
            bdata.model.y += bdata.speed.y * deltaTime;
            bdata.model.rotation = myMath.angle(bdata.speed) + 90;

            let len = bdata.model.height / 2 + this.flySpeed * deltaTime;
            if (this.target == bdata.target && Tools.bombTest(oldx, oldy, len, this.target.model)) {

                MonsterTools.delHp(this.target, this.getAttack());
                if (this.target.blood <= 0) {
                    this.target = null; // 需要切换target
                    this.setState(Weapon2.STATE_INT)
                }

                // 子弹消失
                bdata.model.parent && bdata.model.parent.removeChild(bdata.model)
                this.bullets_free.push(bdata.model);
                this.bullets.splice(i, 1);
            } else {
                i++;
            }
        }

        // 生命周期检测
        for (let i = 0; i < this.bullets.length;) {
            let data = this.bullets[i];
            if (data.model.x < 0 || data.model.x > 750 || data.model.y < 0) {
                // 飞出屏幕，结束
                data.model.parent && data.model.parent.removeChild(data.model)
                this.bullets_free.push(data.model);
                this.bullets.splice(i, 1)
            } else {
                i++;
            }
        }

        // 发射子弹检测

        if (this.state == Weapon2.STATE_SEND) {
            this.lastSendTime += deltaTime_snow;

            if (this.lastSendTime >= this.bulletRatio) {
                // 到了发射子弹的间隔
                this.lastSendTime -= this.bulletRatio;
                this.sendBullet();

                // 发射一颗子弹，消耗一定的能量
                this.energy -= this.bulletRatio;
                if (this.energy <= 0) {
                    this.target = null;
                    this.setState(Weapon2.STATE_EMPTY);
                }
            }

        }

        if (this.target) {
            this.playFx();
        }else{
            this.stopFx();
        }
    }

    // 播放子弹爆炸特效
    private playFx(): void {
        this.fx.x = this.target.model.x;
        this.fx.y = this.target.model.y;
        this.fx.anchorOffsetX = this.fx.width / 2;
        this.fx.anchorOffsetY = this.fx.height / 2;
        this.p.addChild(this.fx);

    }

    private stopFx(): void {
        this.fx && this.fx.parent && this.fx.parent.removeChild(this.fx);
    }

    // 发送一颗子弹
    private sendBullet(): void {
        if (!this.target) return;

        let bulletconfig = this.config['data']['bulletconfig'];
        let modelname = this.config['model'];

        // 取出本轮应该发射的位置
        bulletconfig.forEach(bconf => {
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

            this.p.addChild(model);

            let speed: egret.Point = new egret.Point(this.target.model.x - model.x, this.target.model.y - model.y)
            speed.normalize(this.flySpeed);

            model.rotation = myMath.angle(speed) + 90;

            let bulletdata = {
                model: model,
                speed: speed,
                target: this.target
            }

            this.bullets.push(bulletdata);
        })


    }
}