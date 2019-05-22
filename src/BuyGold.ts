class BuyGold extends eui.Component implements  eui.UIComponent {


	private rect_all:eui.Rect;
	private img_buy:eui.Image;
	private img_jian:eui.Image;
	private img_jia:eui.Image;
	private img_dest:eui.Image;

	private txt_zs:eui.Label;
	private txt_jinbi:eui.Label;

	private gp_buy:eui.Group;

	private diamond:number = 1;
	private destPos:any = {x:0,y:0};

	private p:eui.Component;

	private type:string;

	public constructor(pos:any, p:eui.Component, type:string) {
		super();
		this.destPos.x = pos.x;
		this.destPos.y = pos.y;
		this.p = p;
		this.type = type;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		if(GameData.UserInfo.totalDiamond == 0){
			this.diamond = 0;
		}

		this.updateTxt();
		this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('buy click')
			if( this.diamond <=0 ) {
				GameData.showTips('钻石不足，邀请朋友可以获得钻石')
				GameData.start.openInvite(null);
				return;
			}

			if(this.type == 'gold'){
				GameData.onBuyGoldByDiamond(this.diamond);

				GoldFx.playResult({x: this.img_buy.x+this.gp_buy.x, y: this.img_buy.y+this.gp_buy.y}, {x: this.destPos.x, y: this.destPos.y}, this.p);
				platform.playMusic('sounds/GetGold_result.mp3', 1);
			}else{
				GameData.onBuyTiliByDiamond(this.diamond);
				platform.playMusic('sounds/button.mp3', 1);
			}

			this.parent && this.parent.removeChild(this);

		}, this)
		this.img_jian.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('jian click')
			this.diamond--;
			if(this.diamond < 0) this.diamond = 0
			this.updateTxt()
		}, this)
		this.img_jia.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('jia click')
			this.diamond++;
			if(this.diamond > GameData.UserInfo.totalDiamond) this.diamond = GameData.UserInfo.totalDiamond
			this.updateTxt()
		}, this)
		this.gp_buy.touchEnabled = true;
		this.gp_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('null click')
		}, this);
		this.rect_all.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('bg click')
			this.parent && this.parent.removeChild(this);
		}, this);
	}

	private updateTxt():void{
		this.txt_zs.text = ''+this.diamond;

		if(this.type == "gold"){
			this.img_dest.texture = ResTools.createUITexture("sq_jinbi_2")
			this.txt_jinbi.text = myMath.getString(this.diamond*GameData.getGoldCost()* 500)
		}else{
			this.img_dest.texture = ResTools.createUITexture("sq_shandian")
			this.txt_jinbi.text = myMath.getString(this.diamond*5)
		}

	}
	
}