/**
 * Created by Administrator on 2019/5/23 0023.
 */


class Holl{
    private holl_bitmap: egret.Bitmap = null;
    private click_bitmap: egret.Bitmap = null;
    private holl_rect: egret.Rectangle = null;
    private holl_gp: eui.Group = null;
    private holl_button: eui.Group = null;
    private holl_txt_bg:eui.Group = null;

    private p :eui.Component = null;
    private width:number = 0;
    private height:number = 0;

    public constructor(p:eui.Component) {
        this.p = p;
        this.width = 750;
        this.height = GameData.real_height;
    }

    public addHoll(holl_rect:egret.Rectangle) {
        this.holl_rect = holl_rect;
        if (this.holl_rect == null) return;

        this.delHoll();

        // 挖洞


        let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        //创建一个背景
        let bg: egret.Sprite = new egret.Sprite();
        bg.graphics.beginFill(0x000000, 1);
        bg.graphics.drawRect(0, 0, this.width, this.height);
        bg.graphics.endFill();
        bg.alpha = 0.8;


        //洞的大小图片
        let holl: egret.Sprite = new egret.Sprite();
        holl.graphics.beginFill(0x000000, 1);
        holl.graphics.drawRect(this.holl_rect.x, this.holl_rect.y, this.holl_rect.width, this.holl_rect.height);
        holl.graphics.endFill();
        holl.blendMode = egret.BlendMode.ERASE;


        container.addChild(bg);
        container.addChild(holl);


        let renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(container);

        let bitmap: egret.Bitmap = new egret.Bitmap(renderTexture);
        this.p.addChild(bitmap);
        this.holl_bitmap = bitmap;

        this.addClickTip();


        this.holl_gp = new eui.Group();
        this.holl_gp.x = 0;
        this.holl_gp.y = 0;
        this.holl_gp.width = this.width;
        this.holl_gp.height = this.height;
        this.p.addChild(this.holl_gp);


        this.holl_button = new eui.Group();
        this.holl_button.x = this.holl_rect.x;
        this.holl_button.y = this.holl_rect.y;
        this.holl_button.width = this.holl_rect.width;
        this.holl_button.height = this.holl_rect.height;
        this.p.addChild(this.holl_button);

        this.holl_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHollClick, this);

        let tmp_h = 150;
        let tmp_h1 = 96;
        let tmp_txt = "通关啦！即将面临更危险的太空环境\n升级你的主武器，化解危机"

        switch(GameData.UserInfo.guide){
            case 1:
                switch (GameData.start.guide_index){
                    case 0:
                        break;
                    case 1:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '升级火力，提高主武器伤害！'
                        break;
                }
                break;
            case 2:
                switch (GameData.start.guide_index){
                    case 0:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '升级金币价值，获取金币更值钱！'
                        break;
                    case 1:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '升级金币价值，获取金币更值钱！'
                        break;
                }
                break;
            case 3:
                switch (GameData.start.guide_index){
                    case 0:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '解锁副武器，让你的战机更强大'
                        break;
                    case 1:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '点击选择副武器'
                        break;
                    case 2:
                        tmp_h = 108
                        tmp_h1 = 36
                        tmp_txt = '升级火力，提高副武器伤害！'
                        break;
                }
                break;
        }




        this.holl_txt_bg = new eui.Group();
        this.holl_txt_bg.x = 31;
        this.holl_txt_bg.y = this.holl_rect.y - 100 - tmp_h;
        this.holl_txt_bg.width = 688
        this.holl_txt_bg.height = tmp_h;
        this.p.addChild(this.holl_txt_bg);

        let holl_tip_bg = ResTools.createBitmap('sq_beijingkuang_png');
        holl_tip_bg.scale9Grid = new egret.Rectangle(30, 30, 12, 12);
        holl_tip_bg.width = 688;
        holl_tip_bg.height = tmp_h;
        this.holl_txt_bg.addChild(holl_tip_bg);

        let holl_txt:eui.Label = new eui.Label();
        holl_txt.text = tmp_txt;
        holl_txt.size = 36;
        holl_txt.lineSpacing = 24;
        holl_txt.bold = true;
        holl_txt.x = 51
        //holl_txt.y = 29
        holl_txt.verticalCenter = 0;
        holl_txt.width = 600
        holl_txt.height = tmp_h1
        this.holl_txt_bg.addChild(holl_txt);




    }

    public delHoll() {
        this.holl_bitmap && this.holl_bitmap.parent && this.holl_bitmap.parent.removeChild(this.holl_bitmap);
        this.holl_gp && this.holl_gp.parent && this.holl_gp.parent.removeChild(this.holl_gp);
        this.holl_button && this.holl_button.parent && this.holl_button.parent.removeChild(this.holl_button);
        this.holl_txt_bg && this.holl_txt_bg.parent && this.holl_txt_bg.parent.removeChild(this.holl_txt_bg);

        this.delClickTip();
    }

    private onHollClick(e: any): void {
        console.log('onHollClick')
        GameData.start.onHollClick(e);
    }

    private click_anm:AnmObj = null;

    private addClickTip() {
        if (!this.holl_rect) return;

        this.delClickTip();

        this.click_anm = new AnmObj('yindaotishi', 0, true);
        this.click_anm.scaleX = 1.6;
        this.click_anm.scaleY = 1.6;
        this.click_anm.x = this.holl_rect.x + this.holl_rect.width / 2;
        this.click_anm.y = this.holl_rect.y + this.holl_rect.height / 2;
        this.p.addChild(this.click_anm);

        //
        // this.click_bitmap = ResTools.createBitmap('sq_dianji_png');
        // this.click_bitmap.x = this.holl_rect.x + this.holl_rect.width / 2;
        // this.click_bitmap.y = this.holl_rect.y + this.holl_rect.height / 2;
        // this.click_bitmap.anchorOffsetX = this.click_bitmap.width / 2;
        // this.click_bitmap.anchorOffsetY = this.click_bitmap.height / 2;
        //
        // this.p.addChild(this.click_bitmap);
        //
        // egret.Tween.get(this.click_bitmap, {loop: true})
        //     .to({scaleX: 1.2, scaleY: 1.2}, 1000)
        //     .to({scaleX: 1, scaleY: 1}, 500);
    }

    private delClickTip() {
        this.click_anm && this.click_anm.parent && this.click_anm.parent.removeChild(this.click_anm);
        // this.click_bitmap && this.click_bitmap.parent && this.click_bitmap.parent.removeChild(this.click_bitmap);
        // this.click_bitmap = null;
    }
}