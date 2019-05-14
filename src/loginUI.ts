class loginUI extends eui.Component implements  eui.UIComponent {
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

		this.goStart().catch(e => {
			console.log(e);
		})

	}

	private async goStart(){

		const userInfo = await platform.getUserInfo();
		console.log('userinfo:', userInfo);

		const loginInfo = await platform.login();
		console.log('loginInfo:', loginInfo);

		let avatarUrl = userInfo.avatarUrl||'';
		let nickName = userInfo.nickName ||'';

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

		GameData.main.setPage("start");
	}
	
}