/**
 * Created by Administrator on 2019/4/23 0023.
 */
class GoldFx{
    public static fx =[];
    public static fxname='gold';
    public static fxtime = 500;

    public static playFx(src:any, dest:any, p:eui.Component):void{
        let fx = null;
        if(this.fx.length) {
            fx = this.fx.shift();
        }
        else{
            fx = ResTools.createBitmapByName(this.fxname);
        }

        fx.x = src.x;
        fx.y = src.y;
        fx.anchorOffsetX = fx.width/2;
        fx.anchorOffsetY = fx.height/2;

        fx.scaleX = 1;
        fx.scaleY = 1;
        p.addChild(fx);


        egret.Tween.get(fx,{loop:true}).to({scaleX:0.5},100).to({scaleX:1},100);

        egret.Tween.get(fx).to({x:dest.x, y:dest.y}, this.fxtime).call(()=>{

            GameData.score += GameData.goldperstar;
            p.removeChild(fx);
            this.fx.push(fx);
        });

    }

}
