class ResultUI extends eui.Component implements  eui.UIComponent {
	private gp_root:eui.Group;
	private gp_top:eui.Group;
	private gp_ui_level:eui.Group;
	private gp_complete:eui.Group;
	private gp_tili:eui.Group;
	private gp_result:eui.Group;

	private img_gold_dest:eui.Image;
	private txt_total_gold:eui.Label;
	private txt_total_tili:eui.Label;

	// private txt_ui_lv1_0:eui.Label;
	// private txt_ui_lv1_1:eui.Label;
	// private txt_ui_lv1_2:eui.Label;

	private img_game_jindu_bg:eui.Image;
	private img_game_jindu:eui.Image;
	private txt_game_jindu:eui.Label;
	private txt_gold:eui.Label;

	private txt_tili:eui.Label;

	private img_re_gold:eui.Image;
	private img_re_gold3:eui.Image;
	private txt_re_gold:eui.Label;
	private txt_re_gold3:eui.Label;

	private win:boolean = false;
	private passlevel:boolean = false;
	private handled:boolean = false;

	// private item1:LevelItem = null;
	// private item2:LevelItem = null;
	// private item3:LevelItem = null;
	// private item4:LevelItem = null;

	public constructor(win:boolean) {
		super();
		this.win = win;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		this.gp_result.y = GameData.real_height - 300 - this.gp_result.height;

		let item1:LevelItem = new LevelItem(GameData.UserInfo.curLevel - 1)
		let item2:LevelItem = new LevelItem(GameData.UserInfo.curLevel)
		let item3:LevelItem = new LevelItem(GameData.UserInfo.curLevel + 1)
		let item4:LevelItem = new LevelItem(GameData.UserInfo.curLevel + 2)



		item1.anchorOffsetX = 77;
		item2.anchorOffsetX = 77;
		item3.anchorOffsetX = 77;
		item4.anchorOffsetX = 77;

		item1.anchorOffsetY = 47;
		item2.anchorOffsetY = 47;
		item3.anchorOffsetY = 47;
		item4.anchorOffsetY = 47;

		item1.x = 175;
		item2.x = 375;
		item3.x = 575;
		item4.x = 650;

		item1.verticalCenter = 0;
		item2.verticalCenter = 0;
		item3.verticalCenter = 0;
		item4.verticalCenter = 0;

		item2.scaleX = 1.2;
		item2.scaleY = 1.2;

		this.gp_ui_level.addChild(item1)
		this.gp_ui_level.addChild(item2)
		this.gp_ui_level.addChild(item3)
		this.gp_ui_level.addChild(item4)

		item4.alpha = 0;
		item4.scaleX = 0.6;
		item4.scaleY = 0.6;

		this.txt_total_gold.text = myMath.getString(GameData.UserInfo.totalMoney);
		this.txt_total_tili.text = ''+GameData.UserInfo.tili;

		let gp_ui_level_y = this.gp_ui_level.y;

		this.gp_ui_level.y = 190;
		this.gp_ui_level.scaleX = 0.6;
		this.gp_ui_level.scaleY = 0.6;

		this.gp_complete.parent && this.gp_complete.parent.removeChild(this.gp_complete)
		this.gp_result.parent && this.gp_result.parent.removeChild(this.gp_result)

		egret.Tween.get(this.gp_ui_level).to({y:gp_ui_level_y, scaleX:1, scaleY:1}, 500).call(()=>{
			if(!this.win){
				this.gp_root.addChild(this.gp_complete);
				this.gp_root.addChild(this.gp_result);

				window.platform.playMusic('sounds/Die.mp3', 1);
			}else{
				egret.Tween.get(GameData.start.boat).to({y:-150}, 500).call(()=>{

				});

				window.platform.playMusic('sounds/win.mp3', 1);
			}
		})

		if(!this.win){
			this.txt_gold.text = myMath.getString(GameData.score);
			let cur = Math.floor(100 * (1 - GameData.kill_blood / GameData.total_blood));
			if (cur < 0) cur = 0
			if (cur > 100) cur = 100
			cur = 100 - cur;

			this.txt_game_jindu.text = '完成度' + cur + '%';
			this.img_game_jindu.width = this.img_game_jindu_bg.width * cur / 100;

			this.gp_tili.parent && this.gp_tili.parent.removeChild(this.gp_tili)
		}else{


			this.gp_tili.alpha = 0;
			this.gp_tili.scaleX = 0.6;
			this.gp_tili.scaleY = 0.6;

			if(GameData.passLevel()){
				this.passlevel = true;
				egret.Tween.get(this.gp_tili).wait(2000).to({scaleX:1, scaleY:1, alpha:1}, 500)
			}

			egret.Tween.get(item1).wait(1000).to({x:100, scaleX:0.6, scaleY:0.6, alpha:0}, 500)
			egret.Tween.get(item2).wait(1000).to({x:175, scaleX:1, scaleY:1}, 500)
			egret.Tween.get(item3).wait(1000).to({x:375, scaleX:1.2, scaleY:1.2}, 500)
			egret.Tween.get(item4).wait(1000).to({x:575, scaleX:1, scaleY:1, alpha:1}, 500).call(()=>{

				item1.updateData();
				item2.updateData();
				item3.updateData();
				item4.updateData();
			})

			egret.Tween.get(this.gp_tili).wait(2500).call(()=>{
				this.gp_root.addChild(this.gp_result);
			})


			// egret.Tween.get(this.gp_ui_level).to({ scaleX:1.2, scaleY:1.2}, 500).call(()=>{
			// 	if(GameData.passLevel()){
			// 		this.passlevel = true;
			// 	}
			// 	// this.txt_ui_lv1_0.text = '' + (GameData.UserInfo.curLevel - 1);
			// 	// this.txt_ui_lv1_1.text = '' + (GameData.UserInfo.curLevel);
			// 	// this.txt_ui_lv1_2.text = '' + (GameData.UserInfo.curLevel + 1);
			// 	egret.Tween.get(this.gp_ui_level).wait(500).to({ scaleX:1, scaleY:1}, 500);
			// })

		}

		this.txt_re_gold.text = myMath.getString(GameData.score);
		this.txt_re_gold3.text = myMath.getString(GameData.score * 3);
		this.img_re_gold.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handleGold, this);

		if(GameData.hasVideoAd()){
			this.img_re_gold3.texture = ResTools.createUITexture('sq_sanbei_1')
		}else{
			this.img_re_gold3.texture = ResTools.createUITexture('sq_sanbei_2')
		}
		this.img_re_gold3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handleGold3, this);
	}

	private handleGold() {
		this.handleResult(1)
	}

	private handleGold3() {
		if(!GameData.canShare){
			this.handleResult(3)
			return;
		}

		// 战斗结束3倍获取
		if(GameData.hasVideoAd()){
			ResTools.playAd(GameData.main, GameData.start, 'gold3').then((ret) => {
				if (ret == 0) {
					this.handleResult(3)
				}
			});
		}else{
			ResTools.share(GameData.main, GameData.start, 'gold3');
		}

	}

	public handleResult(ratio: number) {
		this.img_re_gold.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handleGold, this);
		this.img_re_gold3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handleGold3, this);
		platform.playMusic('sounds/GetGold_result.mp3', 1);
		GoldFx.playResult({ x: 375, y: this.gp_result.y }, { x: this.img_gold_dest.x, y: this.img_gold_dest.y }, this).then(ok=>{
			console.log('handleResult:'+this.handled)
			if(this.handled) return;

			this.handled = true;
			if(this.passlevel){
				GameData.UserInfo.tili+=5;
				if(GameData.UserInfo.tili>80) GameData.UserInfo.tili = 80;
			}

			GameData.onHandleResult(ratio);

			this.txt_total_gold.text = myMath.getString(GameData.UserInfo.totalMoney);
			this.txt_total_tili.text = ''+GameData.UserInfo.tili;

			egret.Tween.get(this.gp_complete).wait(500).call(()=>{
				GameData.start.onResultOver();
				this.parent && this.parent.removeChild(this);
			})

		});


	}
}