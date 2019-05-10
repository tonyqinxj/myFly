class BuyGold extends eui.Component implements  eui.UIComponent {


	private rect_all:eui.Rect;
	private img_buy:eui.Image;
	private img_jian:eui.Image;
	private img_jia:eui.Image;

	private txt_zs:eui.Label;
	private txt_jinbi:eui.Label;

	private gp_buy:eui.Group;

	private diamond:number = 1;
	private destPos:any = {x:0,y:0};

	private p:eui.Component;

	public constructor(pos:any, p:eui.Component) {
		super();
		this.destPos.x = pos.x;
		this.destPos.y = pos.y;
		this.p = p;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		this.updateTxt();
		this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			console.log('buy click')
			if( this.diamond <=0 ) return;
			GameData.onBuyGoldByDiamond(this.diamond);

			GoldFx.playResult({x: this.img_buy.x+this.gp_buy.x, y: this.img_buy.y+this.gp_buy.y}, {x: this.destPos.x, y: this.destPos.y}, this.p);
			platform.playMusic('resource/sounds/GetGold_result.mp3', 1);
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
		this.txt_jinbi.text = myMath.getString(this.diamond*GameData.getGoldCost()* 500)
	}
	
}