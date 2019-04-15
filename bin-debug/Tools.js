var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tools = (function () {
    function Tools() {
    }
    // 中心点在中间的2个物体的碰撞检测，AABB碰撞
    Tools.hitTest = function (obj1, obj2) {
        var obj1_global = obj1.localToGlobal(0, 0);
        var obj2_global = obj2.localToGlobal(0, 0);
        var rect1 = new egret.Rectangle(obj1_global.x - obj1.width / 2 * obj1.scaleX, obj1_global.y - obj1.width / 2 * obj1.scaleY, obj1.width * obj1.scaleX, obj1.height * obj1.scaleY);
        var rect2 = new egret.Rectangle(obj2_global.x - obj2.width / 2 * obj2.scaleX, obj2_global.y - obj2.width / 2 * obj2.scaleY, obj2.width * obj2.scaleX, obj2.height * obj2.scaleY);
        var ret = rect1.intersects(rect2);
        return ret;
    };
    /** 获取碰撞相交矩形区域 */
    Tools.intersectionRectangle = function (obj1, obj2) {
        var obj1_global = obj1.localToGlobal(0, 0);
        var obj2_global = obj2.localToGlobal(0, 0);
        var rect1 = new egret.Rectangle(obj1_global.x - obj1.width / 2 * obj1.scaleX, obj1_global.y - obj1.width / 2 * obj1.scaleY, obj1.width * obj1.scaleX, obj1.height * obj1.scaleY);
        var rect2 = new egret.Rectangle(obj2_global.x - obj2.width / 2 * obj2.scaleX, obj2_global.y - obj2.width / 2 * obj2.scaleY, obj2.width * obj2.scaleX, obj2.height * obj2.scaleY);
        var ret = rect1.intersects(rect2);
        if (!ret)
            return new egret.Rectangle();
        return new egret.Rectangle(Math.max(rect1.x, rect2.x), Math.max(rect1.y, rect2.y), Math.min((rect1.x + rect1.width) - Math.max(rect1.x, rect2.x), (rect2.x + rect2.width) - Math.max(rect1.x, rect2.x)), Math.min((rect1.y + rect1.height) - Math.max(rect1.y, rect2.y), (rect2.y + rect2.height) - Math.max(rect1.y, rect2.y)));
    };
    Tools.hitTestEx = function (obj1, obj2) {
        var obj1_global = obj1.localToGlobal(0, 0);
        var obj2_global = obj2.localToGlobal(0, 0);
        var rect1 = new egret.Rectangle(obj1_global.x - obj1.width / 2 * obj1.scaleX, obj1_global.y - obj1.width / 2 * obj1.scaleY, obj1.width * obj1.scaleX, obj1.height * obj1.scaleY);
        var rect2 = new egret.Rectangle(obj2_global.x - obj2.width / 2 * obj2.scaleX, obj2_global.y - obj2.width / 2 * obj2.scaleY, obj2.width * obj2.scaleX, obj2.height * obj2.scaleY);
        var ret = rect1.intersects(rect2);
        if (!ret)
            return false;
        var hitRect = new egret.Rectangle(Math.max(rect1.x, rect2.x), Math.max(rect1.y, rect2.y), Math.min((rect1.x + rect1.width) - Math.max(rect1.x, rect2.x), (rect2.x + rect2.width) - Math.max(rect1.x, rect2.x)), Math.min((rect1.y + rect1.height) - Math.max(rect1.y, rect2.y), (rect2.y + rect2.height) - Math.max(rect1.y, rect2.y)));
        for (var i = 0; i < hitRect.width; i++) {
            for (var j = 0; j < hitRect.height; j++) {
                // 取得obj1在此处的color
                obj1.matrix;
            }
        }
        return true;
    };
    // 2个星球的碰撞检测, 都看成是球
    Tools.starCoTest = function (obj1, obj2) {
        // 把球心位置转成全局坐标
        var obj1_global = obj1.localToGlobal(0, 0);
        var obj2_global = obj2.localToGlobal(0, 0);
        //let p:egret.Point = new egret.Point(obj1_global.x - obj2_global.x, obj1_global.y-obj2_global.y);
        var p = new egret.Point(obj1.x - obj2.x, obj1.y - obj2.y);
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