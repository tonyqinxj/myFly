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

	private img_share_x:number = 0;
	private haveVideo:boolean = false;

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
			let lastId = 1;
			for(let i=0;i<list.length;i++) {
				let itemdata = list[i]
				lastId = itemdata.id;
			}


			while(list.length < 5){
				list.push({
					id:lastId++,
					up_get:2,
				})
			}

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
		HttpTools.httpPost('https://www.nskqs.com/getinvitelist', {name:GameData.gameName, openid:GameData.UserInfo.openid, page:this.curPage}).then(ret=>{
			if(ret && ret.errcode == 0 && ret.data && ret.data.errcode == 0){
				let data = ret.data;
				this.data = {
					count:data.count,
					list:data.list
				}

				
			}else{
				if(!this.data){
					this.data = {
						count:0,
						list:[]
					}
				}
			}

			this.updateData();
		})
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		this.fetchData();

		this.img_share_x = this.img_share.horizontalCenter;

		this.rect_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rect_all_click, this);
		this.gp_data.addEventListener(egret.TouchEvent.TOUCH_TAP, this.none_click, this);
		if(window.platform.haveVideoAd()){ // 有视频，则有此按钮，否则， 没有这个按钮
			this.haveVideo = true;
			this.img_kan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.img_kan_click, this);
		}else{
			this.img_kan && this.img_kan.parent && this.img_kan.parent.removeChild(this.img_kan);
			this.img_share.horizontalCenter = 0;// 居中
		}

		this.img_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.img_share_click, this);
		this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.img_left_click, this);
		this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.img_right_click, this);
	}

	private none_click(e:egret.TouchEvent):void{}
	private rect_all_click(e:egret.TouchEvent):void{
		this.rect_all.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rect_all_click, this);
		this.gp_data.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.none_click, this);
		if(this.haveVideo) this.img_kan.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.img_kan_click, this);
		this.img_share.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.img_share_click, this);
		this.img_left.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.img_left_click, this);
		this.img_right.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.img_right_click, this);
		this.parent && this.parent.removeChild(this)
	}
	private img_kan_click(e:egret.TouchEvent):void{
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


		// 看视频的钻石
		ResTools.playAd(GameData.main, GameData.start, 'd_kan').then(ret=>{
			if(ret == 0){
				GameData.addDiamond(10);
				GameData.UserInfo.d_kan.times++;
				GameData.UserInfo.d_kan.lastTime = new Date().getTime();
			}
		})
	}
	private img_share_click(e:egret.TouchEvent):void{
		ResTools.share(GameData.main, GameData.start, 'd_share');
	}
	private img_left_click(e:egret.TouchEvent):void{
		if(this.curPage <= 1) return;
		this.clearData();
		this.curPage --;
		this.fetchData();
	}
	private img_right_click(e:egret.TouchEvent):void{
		if(this.curPage >= this.pages) return;
		this.clearData();
		this.curPage ++;
		this.fetchData();
	}
	
}