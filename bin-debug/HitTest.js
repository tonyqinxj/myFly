/**
 * Created by Administrator on 2019/4/11 0011.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HitTest = (function () {
    function HitTest() {
    }
    /** 判断两物体是否发生碰撞（可调节精度） */
    HitTest.complexHitTestObject = function (target1, target2, accuracy) {
        if (accuracy === void 0) { accuracy = 1; }
        return this.complexIntersectionRectangle(target1, target2, accuracy).width != 0;
    };
    /** 获取碰撞相交矩形区域 */
    HitTest.intersectionRectangle = function (target1, target2) {
        // 如果有任一对象没加入显示列表，或者两对象hitTestObject的结果为false，则代表两对象没有发生碰撞
        if (!Tools.hitTest(target1, target2))
            return new egret.Rectangle();
        // 分别得到两对象的显示矩形区域
        var bounds1 = target1.getBounds();
        var bounds2 = target2.getBounds();
        // 得出两对象相交部分的矩形区域
        var intersection = new egret.Rectangle();
        intersection.x = Math.max(bounds1.x, bounds2.x);
        intersection.y = Math.max(bounds1.y, bounds2.y);
        intersection.width = Math.min((bounds1.x + bounds1.width) - intersection.x, (bounds2.x + bounds2.width) - intersection.x);
        intersection.height = Math.min((bounds1.y + bounds1.height) - intersection.y, (bounds2.y + bounds2.height) - intersection.y);
        return intersection;
    };
    /** 获取碰撞相交矩形区域（可调节精度） */
    HitTest.complexIntersectionRectangle = function (target1, target2, accuracy) {
        if (accuracy === void 0) { accuracy = 1; }
        //不允许设置accuracy小于0，会抛出错误
        if (accuracy <= 0)
            return new egret.Rectangle();
        //如果两对象hitTestObject的结果为false，则代表两对象没有发生碰撞
        var intersection = Tools.intersectionRectangle(target1, target2);
        if (intersection.width == 0)
            return intersection;
        // 判断重叠区域的长宽任一是否超过碰撞临界值，没超过则视为两对象没有发生碰撞。临界值默认为1，可根据accuracy调节精度
        if (intersection.width * accuracy < 1 || intersection.height * accuracy < 1)
            return new egret.Rectangle();
        //---------------------------------- 核心算法---------------------------------------
        //创建一个用于draw的临时BitmapData对象
        // let render:egret.RenderTexture = new egret.RenderTexture();
        // render
        // //render.drawToTexture()
        // let bd:egret.BitmapData = new egret.BitmapData()
        //
        // var bitmapData: egret.Bitmap = new BitmapData(hitRectangle.width * accuracy, hitRectangle.height * accuracy, false, 0x000000);
        //
        // //把target1的不透明处绘制为指定颜色
        // bitmapData.draw(target1, HitTest.getDrawMatrix(target1, hitRectangle, accuracy), new ColorTransform(1, 1, 1, 1, 255, -255, -255, 255));
        // //把target2的不透明处绘制为指定颜色，并将混合模式设置为DIFFERENCE模式
        // bitmapData.draw(target2, HitTest.getDrawMatrix(target2, hitRectangle, accuracy), new ColorTransform(1, 1, 1, 1, 255, 255, 255, 255), BlendMode.DIFFERENCE);
        //
        // //target1与target2的不透明处如果发生相交，那么相交部分区域的32位颜色信息必为0xFF00FFFF，即得出两对象的像素碰撞区域
        // intersection = bitmapData.getColorBoundsRect(0xFFFFFFFF, 0xFF00FFFF);
        //
        // bitmapData.dispose();
        // //----------------------------------  ---------------------------------------
        //
        // // Alter width and positions to compensate for accurracy
        // //前面是乘以accuracy缩放两对象后，再通过叠加模式计算出相交区域的，因此在此要再除以一次accuracy，恢复原本相交区域大小
        // if (accuracy != 1) {
        //     intersection.x /= accuracy;
        //     intersection.y /= accuracy;
        //     intersection.width /= accuracy;
        //     intersection.height /= accuracy;
        // }
        //
        // intersection.x += hitRectangle.x;
        // intersection.y += hitRectangle.y;
        return intersection;
    };
    HitTest.getDrawMatrix = function (target, hitRectangle, accurracy) {
        // var localToGlobal: egret.Point;
        var matrix;
        //
        // var rootConcatenatedMatrix: egret.Matrix = target.root.transform.concatenatedMatrix;
        //
        // localToGlobal = target.localToGlobal(new egret.Point(0,0));
        // matrix = target.transform.concatenatedMatrix;
        // matrix.tx = localToGlobal.x - hitRectangle.x;
        // matrix.ty = localToGlobal.y - hitRectangle.y;
        //
        // matrix.a = matrix.a / rootConcatenatedMatrix.a;
        // matrix.d = matrix.d / rootConcatenatedMatrix.d;
        // if (accurracy != 1) matrix.scale(accurracy, accurracy);
        return matrix;
    };
    return HitTest;
}());
__reflect(HitTest.prototype, "HitTest");
//# sourceMappingURL=HitTest.js.map