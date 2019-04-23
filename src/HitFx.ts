/**
 * Created by Administrator on 2019/4/23 0023.
 */
// 打击特效管理
class HitFx{

    public static fx =[];
    public static fxname='hit';
    public static fxtime = 100;

    public static playFx(x:number, y:number, p:eui.Component):void{
        let fx = null;
        if(this.fx.length) {
            fx = this.fx.shift();
        }
        else{
            fx = ResTools.createBitmapByName(this.fxname);
        }

        fx.x = x;
        fx.y = y;
        fx.rotation = Tools.GetRandomNum(0,360);
        fx.anchorOffsetX = fx.width/2;
        fx.anchorOffsetY = fx.height/2;

        fx.scaleX = 0.1;
        fx.scaleY = 0.1;
        p.addChild(fx);

        let scale = Tools.GetRandomNum(10,15)/10;

        egret.Tween.get(fx).to({scaleX:scale, scaleY:scale}, this.fxtime).call(()=>{
            p.removeChild(fx);
            this.fx.push(fx);
        });

    }
}