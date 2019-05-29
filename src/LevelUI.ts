/**
 * Created by Administrator on 2019/5/24 0024.
 */
class LevelUI{

    private width:number = 0;
    private height:number = 0;
    private p:egret.DisplayObjectContainer = null;

    private curItems:Array<LevelItem> = [];
    private selectItems:Array<LevelItem> = [];

    private curUI:eui.Group = null;  // 大厅部分正常关卡
    private selectUI:eui.Group = null; // 大厅部分选择关卡
    private gameUI:eui.Group = null;

    public constructor(p:egret.DisplayObjectContainer) {
        this.p = p;
        this.width = 750;
        this.height = GameData.real_height;

        this.createCurUI();
        this.createSelectUI();
    }

    private createCurUI():void{
        this.curUI = new eui.Group();
        this.curUI.x = 142;
        this.curUI.y = 447;
        this.curUI.width = 460;
        this.curUI.height = 100;

        this.curUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.curUIClick, this);

        let item1:LevelItem = new LevelItem(GameData.UserInfo.curLevel - 1)
        let item2:LevelItem = new LevelItem(GameData.UserInfo.curLevel)
        let item3:LevelItem = new LevelItem(GameData.UserInfo.curLevel + 1)

        let left:eui.Image = new eui.Image(ResTools.createUITexture('sq_jiantou'));
        let rigth:eui.Image = new eui.Image(ResTools.createUITexture('sq_jiantou'));

        left.verticalCenter = 0;
        rigth.verticalCenter = 0;
        left.left = 135;
        rigth.right = 135;

        this.curUI.addChild(left);
        this.curUI.addChild(rigth);

        item1.left = 0;
        item1.verticalCenter = 0;
        this.curUI.addChild(item1);
        item1.scaleX = 0.8;
        item1.scaleY = 0.8;

        item2.horizontalCenter = 0;
        item2.verticalCenter = 0;
        this.curUI.addChild(item2);

        item3.right = 0;
        item3.verticalCenter = 0;
        this.curUI.addChild(item3);
        item3.scaleX = 0.8;
        item3.scaleY = 0.8;

        this.curItems.push(item1);
        this.curItems.push(item2);
        this.curItems.push(item3);
    }

    private createSelectItem(index:number):void{
        let level = GameData.UserInfo.nextLevel - index;
        let item:LevelItem = new LevelItem(level)
        item.scaleX = 0.8;
        item.scaleY = 0.8;
        this.selectItems.push(item);
        this.selectUI.addChild(item);
        item.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{this.selectLevel(index)}, this);
    }

    private createSelectUI():void{
        this.selectUI = new eui.Group();
        this.selectUI.x = 63;
        this.selectUI.y = 380;
        this.selectUI.width = 625;
        this.selectUI.height = 185;

        for(let i=0;i<7;i++){
           this.createSelectItem(i);
        }

        this.selectItems[0].right = 0;
        this.selectItems[0].verticalCenter = 0;

        this.selectItems[3].horizontalCenter = 0;
        this.selectItems[3].verticalCenter = 0;

        this.selectItems[6].left = 0;
        this.selectItems[6].verticalCenter = 0;

        this.selectItems[1].top = 0;
        this.selectItems[1].horizontalCenter = this.selectUI.width/4 - 30;

        this.selectItems[2].bottom = 0;
        this.selectItems[2].horizontalCenter = this.selectUI.width/4 - 30;

        this.selectItems[5].top = 0;
        this.selectItems[5].horizontalCenter = -this.selectUI.width/4 + 30;

        this.selectItems[4].bottom = 0;
        this.selectItems[4].horizontalCenter = -this.selectUI.width/4 + 30;

    }

    public showCurItem():void{
        this.p.addChild(this.curUI)
        this.curItems[0].setLevel(GameData.UserInfo.curLevel-1)
        this.curItems[1].setLevel(GameData.UserInfo.curLevel)
        this.curItems[2].setLevel(GameData.UserInfo.curLevel+1)
    }

    public hideCurItem():void{
        this.curUI && this.curUI.parent && this.curUI.parent.removeChild(this.curUI);
    }

    public showSelectItem():void{
        this.p.addChild(this.selectUI);
        this.selectItems[0].setLevel(GameData.UserInfo.nextLevel)
        this.selectItems[1].setLevel(GameData.UserInfo.nextLevel-1)
        this.selectItems[2].setLevel(GameData.UserInfo.nextLevel-2)
        this.selectItems[3].setLevel(GameData.UserInfo.nextLevel-3)
        this.selectItems[4].setLevel(GameData.UserInfo.nextLevel-4)
        this.selectItems[5].setLevel(GameData.UserInfo.nextLevel-5)
        this.selectItems[6].setLevel(GameData.UserInfo.nextLevel-6)

    }

    public hideSelectItem():void{
        this.selectUI && this.selectUI.parent && this.selectUI.parent.removeChild(this.selectUI);
    }

    private curUIClick(e:egret.TouchEvent):void{
        if(GameData.UserInfo.nextLevel >= 7){
            this.showSelectItem();
            this.hideCurItem();
        }
    }


    private selectLevel(index:number):void{
        GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel - index;
        GameData.start.selectLevel();
        this.showCurItem();
        this.hideSelectItem();
    }

}
