class wuqi_1 extends eui.Component implements eui.UIComponent {

	public wuqidh: egret.tween.TweenGroup;

	private type:string = 'main';

	public constructor(type:string) {
		super();

		this.type = type;
		let sub_weapon = GameData.getSubWeapon();
		if(sub_weapon){
			if(type == "friend"){
				this.skinName = "resource/eui_skins/wuqi_"+(sub_weapon.id+5)+".exml";
				return;
			}

			this.skinName = "resource/eui_skins/wuqi_"+sub_weapon.id+".exml";
		}else{
			this.skinName = "resource/eui_skins/wuqi_6.exml";
		}

	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.anchorOffsetX = this.width / 2;
		this.anchorOffsetY = this.height / 2;
		// if(GameData.getSubWeapon().id == 2){
		// 	var shape: egret.Shape = this.maskShape = new egret.Shape();
		// 	shape.graphics.clear();
		// 	shape.graphics.beginFill(0x00ffff, 1);
		// 	shape.graphics.drawRect(this.wuqi_4.x, this.wuqi_4.y+this.wuqi_4.height, this.wuqi_4.width, this.wuqi_4.height);
		// 	shape.graphics.endFill();
		// 	this.addChild(shape);
		// 	this.wuqi_4.mask = shape;
		// }

		this.wuqidh.addEventListener('complete', this.onTweenGroupComplete, this);
		//this.TG_1.addEventListener('itemComplete', this.onTweenItemComplete, this);
		this.loaded = true;
		this.doplay();
	}


	/**
		 * 动画组播放完成
		 */
	private onTweenGroupComplete(): void {
		//console.log('TweenGroup play completed.');
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
			//this.updateMask(1);
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
		let sub_weapon  = GameData.getSubWeapon();
		if(sub_weapon && sub_weapon.id == 2){
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
	private wuqi_4:eui.Image;
	private maskShape:egret.Shape = null;

	private target:egret.DisplayObject = null;
	public setTarget(target:egret.DisplayObject):void{
		this.target = target;
	}

	public updateMask(ratio:number):void{
		if(!this.maskShape){
			this.maskShape = new egret.Shape();
			this.wuqi_4.mask = this.maskShape;
		}

		var shape: egret.Shape = this.maskShape;
		if(shape){
			shape.graphics.clear();
			shape.graphics.beginFill(0x00ffff, 1);
			shape.graphics.drawRect(this.wuqi_4.x, this.wuqi_4.y + Math.floor(this.wuqi_4.height*(1-ratio)), this.wuqi_4.width, Math.floor(this.wuqi_4.height));
			shape.graphics.endFill();
			this.addChild(shape);
		}
	}

}