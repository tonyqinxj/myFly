var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2019/4/8 0008.
 */
var BodyGroup = (function () {
    function BodyGroup() {
    }
    BodyGroup.G_BOAT = Math.pow(2, 1); // 飞船
    BodyGroup.G_BULLET = Math.pow(2, 2); // 子弹，包括僚机
    BodyGroup.G_ENEMY_1 = Math.pow(2, 3); // 普通敌人
    BodyGroup.G_ENEMY_2 = Math.pow(2, 4); // 有碰撞的敌人
    BodyGroup.G_WALL = Math.pow(2, 30); // 墙壁
    BodyGroup.M_BOAT = BodyGroup.G_ENEMY_1 | BodyGroup.G_ENEMY_2;
    BodyGroup.M_BULLET = BodyGroup.G_ENEMY_1 | BodyGroup.G_ENEMY_2;
    BodyGroup.M_ENEMY_1 = BodyGroup.G_BOAT | BodyGroup.G_BULLET | BodyGroup.G_WALL | BodyGroup.G_ENEMY_2;
    BodyGroup.M_ENEMY_2 = BodyGroup.G_BOAT | BodyGroup.G_BULLET | BodyGroup.G_WALL | BodyGroup.G_ENEMY_2 | BodyGroup.G_ENEMY_1;
    BodyGroup.M_WALL = BodyGroup.G_ENEMY_1 | BodyGroup.G_ENEMY_2;
    return BodyGroup;
}());
__reflect(BodyGroup.prototype, "BodyGroup");
//# sourceMappingURL=BodyGroup.js.map