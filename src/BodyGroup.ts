/**
 * Created by Administrator on 2019/4/8 0008.
 */
class BodyGroup{
    public static G_BOAT = Math.pow(2,1)    // 飞船
    public static G_BULLET = Math.pow(2,2)  // 子弹，包括僚机
    public static G_ENEMY_1 = Math.pow(2,3) // 普通敌人
    public static G_ENEMY_2 = Math.pow(2,4) // 有碰撞的敌人
    public static G_WALL = Math.pow(2,30)   // 墙壁

    public static M_BOAT = BodyGroup.G_ENEMY_1|BodyGroup.G_ENEMY_2
    public static M_BULLET = BodyGroup.G_ENEMY_1|BodyGroup.G_ENEMY_2
    public static M_ENEMY_1 = BodyGroup.G_BOAT|BodyGroup.G_BULLET|BodyGroup.G_WALL|BodyGroup.G_ENEMY_2
    public static M_ENEMY_2 = BodyGroup.G_BOAT|BodyGroup.G_BULLET|BodyGroup.G_WALL|BodyGroup.G_ENEMY_2|BodyGroup.G_ENEMY_1
    public static M_WALL = BodyGroup.G_ENEMY_1|BodyGroup.G_ENEMY_2
}