class InvitUI extends eui.Component implements  eui.UIComponent {

	private rect_all:eui.Rect;
	private gp_data:eui.Group;
	private img_kan:eui.Image;
	private img_share:eui.Image;
	private img_left:eui.Image;
	private img_right:eui.Image;
	private txt_page:eui.Label;

	// starty:122
	// deltay:101

	private data:any = null;

	private curPage:number = 1;
	private pages:number = 1;

	private items = [];

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	private clearData():void{
		this.items.forEach(item=>{
			item.parent&&item.parent.removeChild(item);
		})
		this.data = null;
		this.items = [];
	}

	private updateData():void{
		if(this.data){
			let count = this.data.count;
			let list = this.data.list;
			this.pages = Math.ceil(count/5) || 1;
			this.txt_page.text = this.curPage + '/' + this.pages;

			if(list.length){
				let y = 122;
				for(let i=0;i<list.length;i++){
					let itemdata = list[i]
					itemdata.id = (this.curPage-1)*5+i+1;
					let item = new InviteLq(itemdata);
					item.x = 22;
					item.y = y;
					y+=101;
					this.gp_data.addChild(item);

					this.items.push(item);
				}

			}
		}
	}

	private fetchData():void{
		HttpTools.httpPost('https://www.nskqs.com/getinvitelist', {name:'flygame', openid:GameData.UserInfo.openid, page:this.curPage}).then(ret=>{
			if(ret && ret.errcode == 0 && ret.data && ret.data.errcode == 0){
				let data = ret.data;
				this.data = {
					count:data.count,
					list:data.list
				}

				this.updateData();
			}
		})
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		this.fetchData();

		this.rect_all.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			this.parent && this.parent.removeChild(this)
		}, this);


		this.gp_data.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{

		}, this);

		this.img_kan.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{

			if(GameData.UserInfo.d_kan.lastTime > 0){
				let day = new Date(GameData.UserInfo.d_kan.lastTime);
				let tnow = new Date();
				if(day.getDate() != tnow.getDate() || day.getFullYear() != tnow.getFullYear()){
					GameData.UserInfo.d_kan.lastTime == 0;
					GameData.UserInfo.d_kan.times = 0;
				}
			}

			if(GameData.UserInfo.d_kan.times >=2) {
				GameData.showTips('今日次数已用完')
				return;
			}


			ResTools.playAd(GameData.main, GameData.start, 'd_kan').then(ret=>{
				if(ret == 0){
					GameData.addDiamond(10);
					GameData.UserInfo.d_kan.times++;
					GameData.UserInfo.d_kan.lastTime = new Date().getTime();
				}
			})

		}, this);

		this.img_share.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			ResTools.share(GameData.main, GameData.start, 'd_share');
		}, this);

		this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			if(this.curPage <= 1) return;
			this.clearData();
			this.curPage --;
			this.fetchData();

		}, this);

		this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
			if(this.curPage >= this.pages) return;
			this.clearData();
			this.curPage ++;
			this.fetchData();
		}, this);
	}
	
}