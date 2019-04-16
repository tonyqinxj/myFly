/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon1 extends Weapon {
    private timer_send: egret.Timer = null;
    private bulletRatio: number = 1000;
    private bullets: Array<any> = new Array<any>();

    private bullets_free = [];
    private fxs_free = [];

    private createBullet(){
        if(this.bullets_free.length) {
            return this.bullets_free.shift();
        }

        let modelname = this.config['model'];
        return ResTools.createBitmapByName(modelname);
    }

    private createFx(){
        if(this.fxs_free.length) {
            return this.fxs_free.shift();
        }

        let modelname = this.config['data']['bombfx']
        return ResTools.createBitmapByName(modelname);
    }

    public constructor(p: eui.Group, mainWeapon: eui.Image, id: number, attack: number, strength: number) {
        
        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')

        let fun = this.config['bulletRatio'];
        if (fun) this.bulletRatio = fun(this.strength);

        // 提前创建2个子弹
        let b = [];
        for(let i=0;i<2;i++){
            b.push(this.createBullet());
        }
        b.forEach(bb=>this.bullets_free.push(bb));

        b = [];
        for(let i=0;i<2;i++){
            b.push(this.createFx());
        }
        b.forEach(bb=>this.fxs_free.push(bb));
    }

    // 启动
    public start(): void {

        console.log('start weapon...')
        if (this.timer_send == null) {
            this.timer_send = new egret.Timer(this.bulletRatio, 0);
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

    // 帧函数
    public update(deltaTime: number, star_flys: Array<any>): void {

         //console.log('update weapon...' + deltaTime)
        let needBombs = [];
        for (let i = 0; i < this.bullets.length;) {
            // 先移动
            let bdata = this.bullets[i];
            bdata.model.x += bdata.speed.x * deltaTime;
            bdata.model.y += bdata.speed.y * deltaTime;

            let co = false;
            for (let j = 0; j < star_flys.length; j++) {
                let star = star_flys[j]
                if (star.starConfig['group']&StarData.CAN_ATTACK && Tools.starCoTest(bdata.model, star.model)) {
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
            star_flys.forEach(star=>{
                if(Tools.bombTest(data.model.x, data.model.y, 0.5*this.config["data"]["bombScope"], star.model)){
                    star.need_fx = true;
                    star.blood -= GameData.sub_weapon.attack;
                    if(star.blood < 0) star.blood = 0;
                }
            })
            // 子弹消失
            data.model.parent && data.model.parent.removeChild(data.model)
            this.bullets_free.push(data.model);
            // 播放特效
            this.playFx(data.model.x, data.model.y);
        });

        for (let i = 0; i < this.bullets.length;) {
            let data = this.bullets[i];
            if(data.endTime < egret.getTimer()){
                // 世间到，结束
                data.model.parent && data.model.parent.removeChild(data.model)
                this.bullets_free.push(data.model);
                this.bullets.splice(i,1)
            }else{
                i++;
            }
        }
    }

    private playFx(x:number, y:number):void{

        let fx_model = this.createFx();
        fx_model.x = x;
        fx_model.y = y;
        fx_model.anchorOffsetX = fx_model.width/2;
        fx_model.anchorOffsetY = fx_model.height/2;


        this.p.addChild(fx_model);

        egret.Tween.get(fx_model).to({scaleX:1.3, scaleY:1.3}, 300).call(()=>{
            this.p.removeChild(fx_model);
            this.fxs_free.push(fx_model);


        })
    }

    private sendBullet(): void {
        let bulletconfig = this.config['data']['bulletconfig'];
        let modelname = this.config['model'];
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
            model.rotation = bconf.angle * -1 +90;
            this.p.addChild(model);

            let speed: egret.Point = new egret.Point(Math.cos(bconf.angle/180*Math.PI), -1*Math.sin(bconf.angle/180*Math.PI));
            speed.normalize(this.config["data"]["flySpeed"]);

            let bulletdata = {
                model: model,
                speed: speed,
                bombScope: this.config["data"]["bombScope"],
                endTime: egret.getTimer() + this.config["data"]["flyTime"],
            }

            this.bullets.push(bulletdata);

        })
    }
}