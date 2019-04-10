var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tools = (function () {
    function Tools() {
    }
    Tools.hitTest = function (obj1, obj2) {
        var obj1_global = obj1.localToGlobal(obj1.width / 2, obj1.height / 2);
        var obj2_global = obj2.localToGlobal(obj2.width / 2, obj2.height / 2);
        var rect1 = new egret.Rectangle(obj1_global.x - obj1.width / 2, obj1_global.y - obj1.height / 2, obj1.width, obj1.height);
        var rect2 = new egret.Rectangle(obj2_global.x - obj2.width / 2 * obj2.scaleX, obj2_global.y - obj2.height / 2 * obj2.scaleY, obj2.width * obj2.scaleX, obj2.height * obj2.scaleY);
        var ret = rect1.intersects(rect2);
        return ret;
    };
    // 2个星球的碰撞检测, 都看成是球
    Tools.starCoTest = function (obj1, obj2) {
        // 把球心位置转成全局坐标
        var obj1_global = obj1.localToGlobal(0, 0);
        var obj2_global = obj2.localToGlobal(0, 0);
        var p = new egret.Point(obj1_global.x - obj2_global.x, obj1_global.y - obj2_global.y);
        var r1 = obj1.width / 2 * obj1.scaleX;
        var r2 = obj2.width / 2 * obj2.scaleX;
        if (r1 + r2 <= p.length) {
            return false;
        }
        return true;
    };
    // 吞噬检测
    Tools.eatTest = function (eat, star) {
        var r1 = eat.width / 2 * eat.scaleX;
        var r2 = star.width / 2 * star.scaleX;
        if (r1 < r2)
            return false;
        // 把球心位置转成全局坐标
        var obj1_global = eat.localToGlobal(0, 0);
        var obj2_global = star.localToGlobal(0, 0);
        var p = new egret.Point(obj1_global.x - obj2_global.x, obj1_global.y - obj2_global.y);
        if (r1 - r2 <= p.length) {
            return false;
        }
        return true;
    };
    Tools.GetRandomNum = function (min, max) {
        if (max < min)
            return this.GetRandomNum(max, min);
        else {
            return (min + Math.floor(Math.random() * (max - min + 1)));
        }
    };
    Tools.angle2radian = function (angel) {
        return 0.017453293 * angel;
    };
    return Tools;
}());
__reflect(Tools.prototype, "Tools");
//# sourceMappingURL=Tools.js.map