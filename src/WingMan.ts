/**
 * Created by Administrator on 2019/4/16 0016.
 */
class WingMan {

    public static createWeapon(p: eui.Group, mainWeapon: wuqi_1, id: number, attack: number, strength: number): Weapon {
        let w: Weapon = null;
        switch (id) {
            case 1:
                w = new Weapon1(p, mainWeapon, id, attack, strength);
                break;
            case 2:
                w = new Weapon2(p, mainWeapon, id, attack, strength);
                break;
            case 3:
                w = new Weapon3(p, mainWeapon, id, attack, strength);
                break;
            case 4:
                w = new Weapon4(p, mainWeapon, id, attack, strength);
                break;
            case 5:
                w = new Weapon5(p, mainWeapon, id, attack, strength);
                break;
        }
        return w;
    }

    public static WingConfig = {
        '1': {
            'model': 'fuwuqi_1_1',
            'getAttack': function (level:number) {
                if(level <=100) return level*level;
                return 120*Math.exp(0.054*level);
            },
            'getStrength':function (level:number) {
                return Math.floor(0.01*(level+8)*(level+8) - 0.15*(level+8)+3)
            },
            'weaponRatio': function (strength: number) {
                // strength 每10s发射的次数
                return Math.floor(10000/strength);
                //return 500;
            },                  // 武器充能时间配置，本武器充能好之后，就发射一枚子弹，交叉左右发射
            'bulletRatio': function (strength: number) {
                return 500;
            },  // 每发子弹发送间隔，本武器此属性无用
            'bombScope': function (strength: number) {
                return 300;
            },  // 子弹碰到人之后的爆炸范围
            'bulletScale': function (strength:number) {
                return 1;   // 体积成长
            },
            'data': {          // 其他特殊配置
                'bulletconfig': [         // 每次需要发送的子弹的初始值，这个是固定的
                    {
                        startx: 50,  // 子弹开始位置，相对于主机中心
                        starty: 40,  // 子弹开始位置，相对于主机中心
                        angle: 80,   // 子弹偏离方向，相对于x正方向
                    },
                    {
                        startx: -50,  // 子弹开始位置，相对于主机中心
                        starty: 40,  // 子弹开始位置，相对于主机中心
                        angle: 100,  // 子弹偏离方向，相对于x正方向
                    }
                ],
                'flySpeed': 1,       // 每ms飞行的距离
                'flyTime': 800,     // 每颗子弹的生命周期
                'scale':{
                    'start':0.5,    // 其实大小，相对于原始图
                    'time':500,     // 300ms之内从0.5放到到目标尺寸 （bulletScale）
                },
                'bombfx': 'fuwuqi_1_2',     // 爆炸特效

            },
        }, // 高爆弹
        '2': {
            'model': 'fuwuqi_2_1',
            'getAttack': function (level:number) {
                if(level <=100) return 2* (level+20)*(level+20);
                return 140*Math.exp(0.054*level);
            },
            'getStrength':function (level:number) {
                return (level+19)*100;
            },
            'energySpeed': function (strength: number) {
                return strength/5000; // 每毫秒增加2毫秒的发射时长
            },
            'bulletRatio': function (strength: number) {
                return 200;
            },  // 每发子弹发送间隔
            'maxEnergy': function (strength: number) {
                return strength;
            },  // 能量容量(ms)，就是当前充满之后的能量
            'data': {
                'bulletconfig': [         // 每次需要发送的子弹的初始值，这个是固定的
                    {
                        startx: 50,  // 子弹开始位置，相对于主机中心
                        starty: 40,  // 子弹开始位置，相对于主机中心
                    },
                    {
                        startx: -50,  // 子弹开始位置，相对于主机中心
                        starty: 40,  // 子弹开始位置，相对于主机中心
                    },
                    {
                        startx: 150,  // 子弹开始位置，相对于主机中心
                        starty: 0,  // 子弹开始位置，相对于主机中心
                    },
                    {
                        startx: -150,  // 子弹开始位置，相对于主机中心
                        starty: 0,  // 子弹开始位置，相对于主机中心
                    }
                ],
                'flySpeed': 2.5,       // 每ms飞行的距离
                'lockfx': 'bbf1',      // 锁定特效
            }
        }, // 跟踪子弹
        '3':{
            'model':'fuwuqi_3_1',
            'getAttack': function (level:number) {
                if (level <= 100) return 10 * level * level + 750;
                return 1200 * Math.exp(0.054 * level);
            },
            'getStrength':function (level:number) {
                return (level+19)*10;
            },
            'weaponRatio': function (strength: number) {
                return 5000; // 武器充能时间配置，本武器充能好之后，就发射一波子弹
            },
            'bulletRatio': function (strength: number) {
                return 200; // 每发子弹发送间隔
            },
            'bulletCount': function (strength: number) {
                return 3;   // 每次发送的子弹个数，这个也是成长的
            },
            'bulletScale': function (strength:number) {
                return strength;   // 体积成长,就是强度值, 这里宽度的绝对值，这里有个问题
            },
            'data':{
                'flySpeed':2.5, // 每ms飞行的距离
                'fly':{
                    'speedStart':1.3,
                    'speedEnd':3.1,
                    'time':1500,
                }, // 每ms飞行的距离, 一个减速的过程
                'scale':{
                    'start':0.5,    // 其实大小，相对于原始图
                    'time':100,     // 300ms之内从0.5放到到目标尺寸 （bulletScale）
                },
                'fx':'bbf1'
            }

        }, // 冲击波
        '4':{
            'model':'fuwuqi_4_1',
            'getAttack': function (level:number) {
                if(level <=100) return 40* (level + 20)*(level + 20);
                return 600*Math.exp(0.054*level);
            },
            'getStrength':function (level:number) {
                return level;
            },
            'weaponRatio': function (strength: number) {
                return 5000; // 武器充能时间配置，本武器充能好之后，就发射一波子弹
            },
            'bulletScale': function (strength:number) {
                return (19+strength)*2;   // 体积成长
            },
            'bombScope': function (strength: number) {
                return (19+strength)*5;
            },  // 子弹碰到人之后的爆炸范围

            'data':{
                'fly':{
                    'speedStart':0.3,
                    'speedEnd':0.1,
                    'time':1500,
                }, // 每ms飞行的距离, 一个减速的过程
                'scale':{
                    'start':0.5,    // 其实大小，相对于原始图
                    'time':1000,     // 300ms之内从0.5放到到目标尺寸 （bulletScale）
                },
                'fx':'fuwuqi_4_2',        // 爆炸特效
                'snow':{
                    'time':2000,    // 减速时长
                    'speedRatio':0.1,// 减速比例
                }
            }

        }, // 闪点球
    }
}