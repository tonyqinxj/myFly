class loginUI extends eui.Component implements  eui.UIComponent {

	private  img_bottom:eui.Image;
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

		this.img_bottom.y = GameData.real_height - 333;

		console.log('GameData.real_height:', GameData.real_height)

		this.goStart().catch(e => {
			console.log(e);
		})

	}

	private async goStart(){

		const userInfo = await platform.getUserInfo();
		console.log('userinfo:', userInfo);

		const loginInfo = await platform.login();
		console.log('loginInfo:', loginInfo);

		// let avatarUrl = userInfo.avatarUrl||'';
		// let nickName = userInfo.nickName ||'';

		let avatarUrl = '';
		let nickName = '';

		if(userInfo && userInfo.avatarUrl) avatarUrl = userInfo.avatarUrl
		if(userInfo && userInfo.nickName) nickName = userInfo.nickName


		if (loginInfo && loginInfo.code) {
			// myFly flygame
			const res = await HttpTools.httpPost("https://www.nskqs.com/getOpenId", { code: loginInfo.code, name: GameData.gameName, num: 333,
				avatarUrl:avatarUrl,
				nickName:nickName,
			});
			console.log('res:', res);
			if (res.errcode == 0 && res.data && res.data.errcode == 0 ) {
				GameData.setOpenid(res.data.openid);
				//GameData.UserInfo.openid = data.openid;
			}
		}



		//GameData.main.setPage("start");

		this.loadResource().catch(e => {
			console.log(e);
		})
	}

	private async loadResource() {
		try {
			const loadingView = new LoadingUI();
			this.addChild(loadingView);
			await RES.loadGroup("game", 0, loadingView);
			this.removeChild(loadingView);

			GameData.main.setPage("start");
		}
		catch (e) {
			console.error(e);
		}
	}
	
}