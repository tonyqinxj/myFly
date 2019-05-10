/**
 * Created by Administrator on 2019/4/19 0019.
 */
class ItemData {
    public static itemFlyTime = 15000; // 道具在空中飞行的时间
    public static  itemFlyTipTime = 3000; // 道具飞行生命周期低于这个，透明度发生变化，提示
    public static itemFlySpeed = 0.1; // 道具飞行速度
    public static itemConfig = [
        {
            'id':'addStarMove',
            'name': '加速陨石',
            'model': 'iaddss',
            'icon': 'iaddss_1',
            'jindu': 'daoju_jingdu_2',
            'ratio': 1.5,    // 加速比例
            'time': 3000,
        },  // 加速怪物
        {
            'id': 'reduceStarMove',
            'name': '减速陨石',
            'model': 'iraducess',
            'icon': 'iraducess_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 0.5,    // 减速比例
            'time': 3000,
        },  // 减速怪物
        {
            'id': 'bigStar',
            'name': '巨化陨石',
            'model': 'ibig',
            'icon': 'ibig_1',
            'jindu': 'daoju_jingdu_2',
            'ratio': 2,  // 巨化比例
            'time': 3000,
        },  // 巨化陨石
        {
            'id': 'addHitSpeed',
            'name': '强化射速',
            'model': 'ihitspeed',
            'icon': 'ihitspeed_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 200, // todo: 怎么提升
            'time': 3000,
        },  // 强化射速
        {
            'id': 'addHitAttack',
            'name': '强化火力',
            'model': 'iattack',
            'icon': 'iattack_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 200, // todo: 怎么提升
            'time': 3000,
        },  // 强化火力
        {
            'id': 'hitBack',
            'name': '击退子弹',
            'model': 'iback',
            'icon': 'iback_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 2,
            'time': 3000,
            'up': 2,
        },  // 击退子弹
        {
            'id': 'gold',
            'name': '黄金子弹',
            'model': 'igold',
            'icon': 'igold_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 2, // todo: 怎么提升
            'time': 3000,
        },  // 黄金子弹
        {
            'id': 'reduceBoatMove',
            'name': '战机减速',
            'model': 'ireduceBoat',
            'icon': 'ireduceBoat_1',
            'jindu': 'daoju_jingdu_2',
            'ratio': 0.2, // 减速比例
            'time': 3000,
        },  // 战机减速
        {
            'id': 'friend',
            'name': '呼叫支援',
            'model': 'ifriend',
            'icon': 'ifriend_1',
            'jindu': 'daoju_jingdu_1',
            'ratio': 1,
            'time': 3000, // todo： 友机的移动方式，提升方式
        },  // 呼叫支援
    ]

    public static getItemConfig(id:string):any{
        for(let i=0;i< this.itemConfig.length;i++){
            if(id == this.itemConfig[i].id) return this.itemConfig[i]
        }

        return null;
    }
}