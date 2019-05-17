var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var ResTools = (function () {
    function ResTools() {
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    ResTools.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes('flydata_json.' + name);
        result.texture = texture;
        return result;
    };
    ResTools.createTextureByName = function (name) {
        return RES.getRes('flydata_json.' + name);
    };
    ResTools.createUIBitmap = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes('UI_json.' + name);
        result.texture = texture;
        return result;
    };
    ResTools.createUITexture = function (name) {
        return RES.getRes('UI_json.' + name);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。此name 是根据TexturePacker 组合成的一张位图
     */
    ResTools.createBitmapFromSheet = function (name, sheetName) {
        if (sheetName === void 0) { sheetName = "gameRes"; }
        var sheet = RES.getRes(sheetName);
        var texture = sheet.getTexture(name);
        var result = new egret.Bitmap();
        result.texture = texture;
        return result;
    };
    /**
     * 根据name关键字创建一个Texture对象。此name 是根据TexturePacker 组合成的一张位图
     */
    ResTools.getTextureFromSheet = function (name, sheetName) {
        if (sheetName === void 0) { sheetName = "gameRes"; }
        var sheet = RES.getRes(sheetName);
        var result = sheet.getTexture(name);
        return result;
    };
    ResTools.playMusic = function (name, times) {
        if (ResTools.music_off)
            return;
        console.log('play:', name, times);
        var res_name = 'resource/sounds/' + name.match(/(.+)_mp3/)[1] + '.mp3';
        var platform = window.platform;
        platform.playMusic(res_name, times);
    };
    ResTools.printPos = function (name, item) {
        var pos1 = item.localToGlobal(0, 0);
        var pos2 = item.localToGlobal(item.width / 2, item.height / 2);
        console.log(name, 'pos:', item.x, item.y, item.width, item.height);
        console.log(name, 'pos1:', pos1);
        console.log(name, 'pos2:', pos2);
    };
    ResTools.playAd = function (main, game, type) {
        return new Promise(function (resolve, reject) {
            // ResTools.share(main, game, type);
            // resolve(11)
            //
            window.platform.showRewardAd().then(function (ret) {
                console.log('showRewardAd:', ret);
                if (ret == 0) {
                    // 视频播放成功
                    resolve(0);
                }
                else if (ret == 3) {
                    // 视频播放被取消
                    resolve(3);
                }
                else {
                    ResTools.share(main, game, type);
                    resolve(11);
                }
            });
        });
    };
    ResTools.share = function (main, game, type) {
        if (main && game) {
            main.setGame(game, type);
        }
        var n = Tools.GetRandomNum(1, share_data.length);
        var title = share_data[n - 1].title;
        var url = share_data[n - 1].url;
        window.platform.shareAppMessage(title, url, "openid=" + GameData.UserInfo.openid);
    };
    ResTools.showTextTip = function (parent, text) {
        console.log('showTextTip:', text);
        var bitmap = this.createUIBitmap('share_retry_tip');
        bitmap.y = 340;
        bitmap.x = (750 - bitmap.width) / 2;
        parent.addChild(bitmap);
        console.log('bitmap:', bitmap.x, bitmap.y);
        var timer = new egret.Timer(1000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function (e) {
            parent.removeChild(bitmap);
        }, this);
        timer.start();
    };
    ResTools.music_off = false;
    return ResTools;
}());
__reflect(ResTools.prototype, "ResTools");
var share_data = [{
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
    }];
//# sourceMappingURL=ResTools.js.map