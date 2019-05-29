class WeaponRender extends eui.ItemRenderer {
    public static last_sel: WeaponRender = null;
    public static cur_sel: WeaponRender = null;
    public static try_sel: WeaponRender = null;

    public static selectWeapon(): void {
        if (this.cur_sel) {
            // this.cur_sel.data.sel = "1";
            // this.last_sel.data.sel = "0";
            this.cur_sel.sel.text = '1';
            this.cur_sel.doChange();
            if (this.last_sel) {
                this.last_sel.sel.text = '0';
                this.last_sel.doChange();
            }

            this.last_sel = this.cur_sel;
            this.cur_sel = null;

        }
    }

    public id: eui.Label;
    public open: eui.Label;
    public sel: eui.Label;
    public img_weapon: eui.Image;
    public img_select: eui.Image;
    public gp_weapon: eui.Group;
    public img_try: eui.Image;
    private img_new: eui.Image;

    private last_open: string = '0';

    public constructor() {
        super();
        this.skinName = "weaponSkin";
    }

    protected createChildren(): void {
        super.createChildren();

        this.gp_weapon.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let id = parseInt(this.id.text);
            if (GameData.failTryId && id == GameData.failTryId && GameData.failTryState == 1) {

                if(!GameData.canShare){
                    this.doSelect();
                    return;
                }

                // 满级试用
                if(GameData.hasVideoAd()){
                    ResTools.playAd(GameData.main, GameData.start, 'failtry').then(ret => {
                        if (ret == 0) {
                            this.doSelect();
                        }
                    });
                }else{
                    ResTools.share(GameData.main, GameData.start, 'failtry');
                }

                return;
            }

            this.doSelect();
        }, this);
    }

    public doSelect(): void {
        let id = parseInt(this.id.text);
        if (GameData.failTryId && id == GameData.failTryId && GameData.failTryState == 1) {
            GameData.failTryState = 2
        }

        //if (WeaponRender.last_sel == this) return;

        console.log('选中了：', this.id.text);
        WeaponRender.cur_sel = this;
        EventManager.dispatchEvent('selectWeapon', { id: this.id.text })

        if(GameData.UserInfo.guide == 3 && GameData.start.guide_index == 1){
            GameData.start.guide_index = 2;
            GameData.start.updateGuide();
        }

        if(id == GameData.openedNewWID){
            GameData.openedNewWID = 0; // 点击之后就去掉新的武器的提示，下次上线也不提示了，这是个内存中存在的临时变量
        }
    }

    protected dataChanged(): void {
        console.log('datachanged...', this.id.text, this.sel.text)
        if (this.sel.text == '1') WeaponRender.last_sel = this;
        let id = parseInt(this.id.text);
        if (GameData.failTryId && id == GameData.failTryId) {
            WeaponRender.try_sel = this;
        }
        this.doChange();

    }

    public doChange(): void {
        console.log('doChange...', this.id.text, this.sel.text, this.open.text)
        let id = parseInt(this.id.text);

        if (this.sel.text == '1') {
            this.gp_weapon.addChild(this.img_select);
            //this.img_select.visible = true;

        } else {
            this.img_select && this.img_select.parent && this.img_select.parent.removeChild(this.img_select);
            //this.img_select.visible = false;
        }

        if (this.open.text == '1') {
            if (this.last_open == '0') {
                this.img_weapon.texture = ResTools.createUITexture(GameData.weaponNames[id - 1])
            }
            this.last_open = '1'
            // 还原
            //this.img_weapon.filters = [];
        } else {

            if (this.last_open == '0') {
                this.img_weapon.texture = ResTools.createUITexture(GameData.weaponNames[id - 1] + '_1')
            }
            this.last_open = '0'

            // 灰度化
            // var colorMatrix = [
            //     0.2, 0, 0, 0, 55,
            //     0, 0.2, 0, 0, 55,
            //     0, 0, 0.2, 0, 55,
            //     0, 0, 0, 1, 0
            // ];
            // var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            // this.img_weapon.filters = [colorFlilter];
        }


        if (GameData.failTryId && id == GameData.failTryId && GameData.failTryState == 1) {
            // 被选为试用武器
            this.gp_weapon.addChild(this.img_try);
            if(GameData.hasVideoAd()){
                this.img_try.texture = ResTools.createUITexture('sq_fu_5')
            }else{
                this.img_try.texture = ResTools.createUITexture('sq_fu_6')
            }
        } else {
            this.img_try && this.img_try.parent && this.img_try.parent.removeChild(this.img_try);
        }

        if(id == GameData.openedNewWID){
            this.img_new.visible = true;
        }else{
            this.img_new.visible = false;
        }
    }

    //
    // public setColorFilter(isGray: boolean): void {
    // 	if (isGray) {
    // 		var colorMatrix = [
    // 			0.3, 0, 0, 0, 100,
    // 			0.3, 0, 0, 0, 0,
    // 			0.3, 0, 0, 0, 0,
    // 			0, 0, 0, 1, 0
    // 		];
    // 		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
    //
    // 		for (let i = 0; i < this.fklist.length; i++) {
    // 			this.fklist[i].filters = [colorFlilter];
    // 		}
    //
    // 	} else {
    // 		for (let i = 0; i < this.fklist.length; i++) {
    // 			this.fklist[i].filters = [];
    // 		}
    // 	}
    //
    // }
}