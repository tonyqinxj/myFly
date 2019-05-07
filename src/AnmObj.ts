/**
 * Created by Administrator on 2019/5/6 0006.
 */

// 通用无限循环动画播放组件
class AnmObj extends eui.Component implements  eui.UIComponent {

    private sddh:egret.tween.TweenGroup; // 通用动作组
    private maxTimes:number = 1;
    private times:number = 0;

    public constructor(name:string, times:number) {
        super();
        this.skinName = "resource/eui_skins/"+name+".exml";
        this.maxTimes = times;
        this.times = 0;
    }

    protected partAdded(partName:string,instance:any):void
    {
        super.partAdded(partName,instance);
    }

    protected childrenCreated():void
    {
        super.childrenCreated();

        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.sddh.addEventListener('complete', this.onTweenGroupComplete, this);
        //this.sddh.addEventListener('itemComplete', this.onTweenItemComplete, this);
        this.sddh.play(0)
    }

    private onTweenGroupComplete(): void {
        //console.log('TweenGroup play completed.');

        if(this.maxTimes == 0){
            this.sddh.play(0)
        }else{
            this.times++;
            if(this.times < this.maxTimes){
                this.sddh.play(0)
            }else{
                this.parent && this.parent.removeChild(this);
            }
        }

    }
}