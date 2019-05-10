// TypeScript file
class ResTools {
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    public static createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes('flydata_json.' + name);
        result.texture = texture;
        return result;
    }

    public static createTextureByName(name: string): egret.Texture {
        return RES.getRes('flydata_json.' + name);
    }


    public static createUIBitmap(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes('UI_json.' + name);
        result.texture = texture;
        return result;
    }

    public static createUITexture(name: string): egret.Texture {
        return RES.getRes('UI_json.' + name);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。此name 是根据TexturePacker 组合成的一张位图
     */
    public static createBitmapFromSheet(name: string, sheetName: string = "gameRes"): egret.Bitmap {
        var sheet: egret.SpriteSheet = RES.getRes(sheetName);
        var texture: egret.Texture = sheet.getTexture(name);
        var result: egret.Bitmap = new egret.Bitmap();
        result.texture = texture;
        return result;
    }

    /**
     * 根据name关键字创建一个Texture对象。此name 是根据TexturePacker 组合成的一张位图
     */

    public static getTextureFromSheet(name: string, sheetName: string = "gameRes"): egret.Texture {
        var sheet: egret.SpriteSheet = RES.getRes(sheetName);
        var result: egret.Texture = sheet.getTexture(name);
        return result;
    }

    public static music_off: boolean = false;

    public static playMusic(name: string, times: number): void {
        if (ResTools.music_off) return;

        console.log('play:', name, times);
        let res_name = 'resource/sounds/' + name.match(/(.+)_mp3/)[1] + '.mp3';

        let platform: Platform = window.platform;
        platform.playMusic(res_name, times);
    }

    public static printPos(name, item: egret.DisplayObject): void {
        let pos1 = item.localToGlobal(0, 0)
        let pos2 = item.localToGlobal(item.width / 2, item.height / 2)
        console.log(name, 'pos:', item.x, item.y, item.width, item.height)
        console.log(name, 'pos1:', pos1)
        console.log(name, 'pos2:', pos2)
    }


    public static playAd(main: Main, game: StartUI, type: string): Promise<number> {
        return new Promise((resolve, reject) => {
            ResTools.share(main, game, type);
            resolve(11)
            //
            // window.platform.showRewardAd().then(ret => {
            //     console.log('showRewardAd:', ret)
            //     if (ret == 0) {
            //         // 视频播放成功
            //         resolve(0)
            //     } else if (ret == 3) {
            //         // 视频播放被取消
            //         resolve(3)
            //     } else {
            //         ResTools.share(main, game, type);
            //         resolve(11)
            //     }
            // });
        })
    }


    public static share(main: Main, game: StartUI, type: string): void {
        if (main && game) {
            main.setGame(game, type);
        }

        let n = Tools.GetRandomNum(1, share_data.length);
        let title = share_data[n - 1].title;
        let url = share_data[n - 1].url;
        window.platform.shareAppMessage(title, url, "openid="+GameData.UserInfo.openid);
    }

    public static showTextTip(parent: egret.DisplayObjectContainer, text: string) {

        console.log('showTextTip:', text);

        let bitmap:egret.Bitmap = this.createUIBitmap('share_retry_tip')
        bitmap.y = 340;
        bitmap.x = (750 - bitmap.width)/2;

        parent.addChild(bitmap)

        console.log('bitmap:', bitmap.x, bitmap.y)

        let timer = new egret.Timer(1000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, (e: egret.TimerEvent) => {
            parent.removeChild(bitmap);
        }, this);
        timer.start();

    }

}

let
    share_data = [{
        title: '俄罗斯方块还能这样玩？99%的人都不知道',
        url: 'https://nskqs.oss-cn-hangzhou.aliyuncs.com/share/share_1.png'
    }, {
        title: '@我，来跟我挑战一下，我不信你能赢！',
        url: 'https://nskqs.oss-cn-hangzhou.aliyuncs.com/share/share_2.png'
    }, {
        title: '据说玩这个游戏的人性格都会...',
        url: 'https://nskqs.oss-cn-hangzhou.aliyuncs.com/share/share_3.png'
    }, {
        title: '智商160的人才能看懂这张图！',
        url: 'https://nskqs.oss-cn-hangzhou.aliyuncs.com/share/share_4.jpg'
    }]

