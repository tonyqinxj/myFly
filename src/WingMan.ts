/**
 * Created by Administrator on 2019/4/16 0016.
 */
class WingMan {
    public static upgradeGold = { // 成长体系
        'attack': [],    // 火力提升需要的金币
        'strength': [],  // 强度提升需要的金币
    }

    public static createWeapon(p: eui.Group, mainWeapon: eui.Image, id: number, attack: number, strength: number): Weapon {
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
            'model': 'bb1',
            'weaponRatio': function (strength: number) {
                return 500;
            },                  // 武器充能时间配置，本武器充能好之后，就发射一枚子弹，交叉左右发射
            'bulletRatio': function (strength: number) {
                return 500;
            },  // 每发子弹发送间隔，本武器此属性无用
            'bombScope': function (attack: number) {
                return 300;
            },  // 子弹碰到人之后的爆炸范围
            'bulletScale': function (attack:number) {
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
                'bombfx': 'bbf1',     // 爆炸特效

            },
        }, // 高爆弹
        '2': {
            'model': 'bb1',
            'energySpeed': function (strength: number) {
                return 2; // 每毫秒增加2毫秒的发射时长
            },
            'bulletRatio': function (strength: number) {
                return 200;
            },  // 每发子弹发送间隔
            'maxEnergy': function (strength: number) {
                return 3000;
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
            'model':'bb1',
            'weaponRatio': function (strength: number) {
                return 2000; // 武器充能时间配置，本武器充能好之后，就发射一波子弹
            },
            'bulletRatio': function (strength: number) {
                return 200; // 每发子弹发送间隔
            },
            'bulletCount': function (strength: number) {
                return 3;   // 每次发送的子弹个数，这个也是成长的
            },
            'bulletScale': function (attack:number) {
                return 1;   // 体积成长
            },
            'data':{
                'flySpeed':2.5, // 每ms飞行的距离
                'scale':{
                    'start':0.5,    // 其实大小，相对于原始图
                    'time':100,     // 300ms之内从0.5放到到目标尺寸 （bulletScale）
                },
                'fx':'bbf1'
            }

        }, // 冲击波
    }
}