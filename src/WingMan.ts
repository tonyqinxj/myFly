/**
 * Created by Administrator on 2019/4/16 0016.
 */
class WingMan{
    public static upgradeGold = { // 成长体系
        'attack':[],    // 火力提升需要的金币
        'strength':[],  // 强度提升需要的金币
    }

    public static createWeapon(p:eui.Group, mainWeapon:eui.Image, id:number, attack:number, strength:number):Weapon{
        let w:Weapon = null;
        if(id == 1){
            w = new Weapon1(p, mainWeapon, id, attack, strength);

        }
        return w;
    }

    public static WingConfig={
        '1':{
            'model':'bb1',
            'weaponRatio':function (strength:number) {
                return 0;       // 本僚机没有充能时间
            },                  // 武器充能时间配置
            'bulletRatio':function (strength:number) {
                return 500;
            },                  // 每发子弹发送间隔，这个是可以成长的, todo:成长公式或者表格
            'data':{          // 其他特殊配置
                'bulletconfig':[         // 每次需要发送的子弹的初始值，这个是固定的
                    {
                        startx:50,  // 子弹开始位置，相对于主机中心
                        starty:40,  // 子弹开始位置，相对于主机中心
                        angle:80,   // 子弹偏离方向，相对于x正方向
                    },
                    {
                        startx:-50,  // 子弹开始位置，相对于主机中心
                        starty:40,  // 子弹开始位置，相对于主机中心
                        angle:100,  // 子弹偏离方向，相对于x正方向
                    }
                ],
                'flySpeed':1,       // 每ms飞行的距离
                'flyTime':800,     // 每颗子弹的生命周期
                'bombScope':300,    // 爆炸范围
                'bombfx':'bbf1',     // 爆炸特效
            },
        }, // 高爆弹
    }
}