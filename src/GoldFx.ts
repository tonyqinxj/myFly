/**
 * Created by Administrator on 2019/4/23 0023.
 */
class GoldFx{
    public static fx =[];
    public static fxname='gold';
    public static fxtime = 500;

    public static fx_free = [];
    public static init():void{
        for(let i=0;i<24;i++){
            let fx = ResTools.createBitmapByName(this.fxname);
            fx.anchorOffsetX = fx.width/2;
            fx.anchorOffsetY = fx.height/2;

            this.fx_free.push(fx);
        }
    }

    private static getOne():egret.Bitmap{
        let fx = null;
        if(this.fx_free.length) {
            fx =this.fx_free.shift();
        }
        else{
            fx = ResTools.createBitmapByName(this.fxname);
        }

        fx.scaleX = 1;
        fx.scaleY = 1;

        fx.anchorOffsetX = fx.width/2;
        fx.anchorOffsetY = fx.height/2;

        return fx;
    }

    public static retOne(fx:egret.Bitmap):void{
        this.fx_free.push(fx);
    }

    public static playFx(src:any, dest:any, p:eui.Component):void{
        let fx = this.getOne();

        fx.x = src.x;
        fx.y = src.y;
        p.addChild(fx);

        egret.Tween.get(fx,{loop:true}).to({scaleX:0.5},100).to({scaleX:1},100);

        egret.Tween.get(fx).to({x:dest.x, y:dest.y}, this.fxtime).call(()=>{
            GameData.score += GameData.getGoldCost();
            platform.playMusic('resource/sounds/GetGold.mp3',1)
            p.removeChild(fx);
            this.retOne(fx);
        });

    }


    private static go(fx:egret.Bitmap, dest1:any, dest2:any, p:eui.Component):void{

        console.log(dest1);
        
        egret.Tween.get(fx,{loop:true}).to({scaleX:0.5},100).to({scaleX:1},100);
        let point:egret.Point = new egret.Point(dest2.x-dest1.x, dest2.y-dest1.y);
        egret.Tween.get(fx).to(dest1, 300).to(dest2, point.length).call(()=>{
            p.removeChild(fx);
            this.retOne(fx);
        })
    }
    public static playResult(src:any, dest:any, p:eui.Component):void{

        console.log('playResult.................')

        let r = 150;
        for(let i=0;i<24;i++){
            let fx = this.getOne();
            fx.x = src.x ;
            fx.y = src.y ;

            let mydest ={
                x:src.x + Math.cos(Math.PI/12*i)*r + Tools.GetRandomNum(10,70),
                y:src.y + Math.sin(Math.PI/12*i)*r + Tools.GetRandomNum(10,70)
            }

            p.addChild(fx);

            this.go(fx, mydest,dest,p);

        }
    }

}
