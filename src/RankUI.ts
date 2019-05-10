class RankUI extends eui.Component implements  eui.UIComponent {

	private rect_all:eui.Rect;

	private gp_data:eui.Group;
	private img_left:eui.Image;
	private img_right:eui.Image;
	private img_share:eui.Image;

	private openDataContext:any=null;

	public constructor() {
		super();

		if(platform &&　platform['openDataContext']){
			this.openDataContext = platform['openDataContext'];
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	private rank_bitmap: egret.Bitmap = null;

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.rect_all.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			this.parent && this.parent.removeChild(this);

		}, this);

		this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{

			if(this.openDataContext){
				this.openDataContext.postMessage({
					command:'rank_left',
					openid:GameData.UserInfo.openid
				})
			}

		}, this);

		this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			if(this.openDataContext){
				this.openDataContext.postMessage({
					command:'rank_right',
					openid:GameData.UserInfo.openid
				})
			}
		}, this);

		this.img_share.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			ResTools.share(GameData.main, GameData.start, 'r_share');
		}, this);

		if(this.openDataContext){

			let h = this.height;
			if (window["canvas"]) {

				let r_w = window["canvas"].width;
				let r_h = window["canvas"].height;

				h = Math.floor(r_h * this.width / r_w);
			}

			this.rank_bitmap = this.openDataContext.createDisplayObject(null, this.width, h);
			this.addChild(this.rank_bitmap);

			this.openDataContext.postMessage({
				command:'rank_init',
				openid:GameData.UserInfo.openid,
				startY:this.gp_data.y+122
			})
		}


	}
	
}