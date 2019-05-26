class InviteLq extends eui.Component implements  eui.UIComponent {

	private img_head:eui.Image;
	private img_lq:eui.Image;
	private txt_id:eui.Label;
	private txt_lq:eui.Label;

	private data:any = null;
	public constructor(data:any) {
		super();
		this.data = data;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		// id
		if(this.data.id){
			this.txt_id.text = ''+this.data.id
		}

		// head
		if(this.data.icon){
			let imageLoader = new egret.ImageLoader();
			imageLoader.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
				let imageLoader = <egret.ImageLoader>event.currentTarget;
				let texture = new egret.Texture();
				texture._setBitmapData(imageLoader.data);
				this.img_head.texture = texture;
			}, this);
			imageLoader.load(this.data.icon);
		}else{
			this.img_head.texture = ResTools.createUITexture('sq_yonghu')
		}

		// lq状态
		if(this.data.up_get == 1){
			this.txt_lq.visible = true;
			this.img_lq.visible = false;
			this.txt_lq.text = '已领取'
		}else if(this.data.up_get == 0){
			this.txt_lq.visible = false;
			this.img_lq.visible = true;

			this.img_lq.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
				HttpTools.httpPost('https://www.nskqs.com/getInviteGold', {name:GameData.gameName, inviter:GameData.UserInfo.openid, openid:this.data.openid}).then(ret=>{
					if(ret && ret.errcode == 0 && ret.data && ret.data.errcode == 0){
						// fx?
						GameData.addDiamond(10);
						this.data.up_get = 1;
						this.txt_lq.visible = true;
						this.img_lq.visible = false;
					}
				})
			},this);
		}else if(this.data.up_get == 2){
			this.txt_lq.visible = true;
			this.img_lq.visible = false;
			this.txt_lq.text = '未邀请'
		}


	}
	
}