class myTestAnm extends eui.Component implements  eui.UIComponent {

	public tweenGroup:egret.tween.TweenGroup;

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.tweenGroup.addEventListener('complete', this.onTweenGroupComplete, this);
        this.tweenGroup.addEventListener('itemComplete', this.onTweenItemComplete, this);
	}

	 /**
     * 动画组播放完成
     */
    private onTweenGroupComplete(): void {
        console.log('TweenGroup play completed.');
    }
    /**
     * 动画组中的一项播放完成
     */
    private onTweenItemComplete(event: egret.Event): void {
        const item = event.data as egret.tween.TweenItem;
        console.log(item.target);
        console.log('TweenItem play completed.');
    }

	public play():void{
		this.tweenGroup.play();
	}	
}