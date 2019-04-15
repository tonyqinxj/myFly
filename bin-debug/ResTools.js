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
    ResTools.music_off = false;
    return ResTools;
}());
__reflect(ResTools.prototype, "ResTools");
//# sourceMappingURL=ResTools.js.map