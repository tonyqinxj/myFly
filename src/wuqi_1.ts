class wuqi_1 extends eui.Component implements eui.UIComponent {

	public wuqidh: egret.tween.TweenGroup;

	public constructor() {
		super();

		this.skinName = "resource/eui_skins/wuqi_"+GameData.getSubWeapon().id+".exml";
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.anchorOffsetX = this.width / 2;
		this.anchorOffsetY = this.height / 2;
		this.wuqidh.addEventListener('complete', this.onTweenGroupComplete, this);
		//this.TG_1.addEventListener('itemComplete', this.onTweenItemComplete, this);
		this.loaded = true;
		this.doplay();
	}


	/**
		 * 动画组播放完成
		 */
	private onTweenGroupComplete(): void {
		console.log('TweenGroup play completed.');
		this.wuqidh.play(0)
	}
    /**
     * 动画组中的一项播放完成
     */
	private onTweenItemComplete(event: egret.Event): void {
		const item = event.data as egret.tween.TweenItem;
		console.log(item.target);
		console.log('TweenItem play completed.');

	}

	private loaded: boolean = false;
	private needplay: boolean = false;
	private doplay(): void {
		if (this.loaded && this.needplay) {
			this.wuqidh.play(0);
		}
	}

	public play(): void {
		this.needplay = true;
		this.doplay();
	}

	public stop(): void {
		this.wuqidh.removeEventListener('complete', this.onTweenGroupComplete, this);
		this.wuqidh.stop();
	}


	public update():void{
		// 特殊情况，炮塔锁定目标
		if(GameData.getSubWeapon().id == 2){
			if(this.target){
				if(this.wuqi_2) {
					let x = this.wuqi_2.x + this.x
					let y = this.wuqi_2.y + this.y
					let p:egret.Point = new egret.Point(this.target.x-x, this.target.y-y)
					this.wuqi_2.rotation = 90+myMath.angle(p);
				}
				if(this.wuqi_3) {
					let x = this.wuqi_3.x + this.x
					let y = this.wuqi_3.y + this.y
					let p:egret.Point = new egret.Point(this.target.x-x, this.target.y-y)
					this.wuqi_3.rotation = 90+myMath.angle(p);
				}
			}else{
				if(this.wuqi_2) this.wuqi_2.rotation = 0;
				if(this.wuqi_3) this.wuqi_3.rotation = 0;
			}
		}
	}

	private wuqi_2:eui.Image;
	private wuqi_3:eui.Image;
	private target:egret.DisplayObject = null;
	public setTarget(target:egret.DisplayObject):void{
		this.target = target;
	}

}