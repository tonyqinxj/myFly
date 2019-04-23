class StarData {
    public constructor() {
    }

    // layer:层级管理，目前有4个级别，分别为0，1，2，3， 数字大的在前面
    public static scaleWithLevel = [1, 0.3, 0.45, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0]
    public static colorLevels =[0.1,0.01,0.001,0.0001];
    public static colorNames=['x-5', 'x-4', 'x-3', 'x-2', 'x-1'];



    public static CAN_ATTACK = Math.pow(2, 11);// 可被攻击
    public static CAN_CO = Math.pow(2, 12);// 可以被碰
    public static StarConfig = {
        '101': {
            name: '小陨石',
            id: 101,
            model: 'star1',		// 模型名称
            speed: 0.3,			// 移动速度
            attack_speed: 0.3,	// 收到攻击之后的移动速度， 那减速的时间段呢（减速多久）
            snow_time: 200,		// 减速的持续时长
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            // 引力属性，包含参数（）
        },	// 小陨石101
        '102': {
            name: '冲击陨石',
            id: 102,
            model: 'star2',
            speed: 0.2,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
        }, // 冲击陨石 102
        '103': {
            name: '熔岩陨石',
            id: 103,
            model: 'star3',
            speed: 0.1,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: { // 生成新的怪，移动一定时间产生
                time: 1000, // 每移动time的时间，就产生一个新的怪物
                id: '104',	// 怪物id
                level: 0,	// 怪物等级
                life: 5000,	// 怪物的生存时间，ms
                //
                // scaleX: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                // scaleY: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                // scale: {time: 1000, scaleX: 1.4, scaleY: 1}	// 怪物随时间的缩放，相对于原始尺寸
            }
        },//熔岩陨石 103
        '104': {
            name: '岩浆',
            id: 104,
            model: 'star4',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,

            scale_info: {
                start:{
                    scaleX:0.5,
                    scaleY:0.5,
                },
                change: {
                    loop: false,
                    scalelist: [// 缩放规则，time是生存周期时间区间，wait为true，表示这个阶段不变化，否则，在time之间范围内变更为scaleX和scaleY 的缩放比例, 此过程会循环进行
                        {time: 1000, wait: false, scaleX: 1.4, scaleY: 1},
                    ]
                }
            },
        }, // 岩浆（特殊）		104
        '105': {
            name: '磁铁陨石',
            id: 105,
            model: 'star5',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            follow: {		// todo, need test
                scope: 300,// 警戒范围,
                add_speed: 0.0005,// 每ms加速
            }
        }, // 磁铁陨石		105, 跟踪怪
        '106': {
            name: '彗星',
            id: 106,
            model: 'star6',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            //group:0,
            layer: 1,
            // fx: {	// 特殊效果
            //     texture: 'newParticle_png',	// 特效的贴图
            //     json: 'newParticle_json',	// 特效的配置
            // },

            // create_new_star:{ // 生成新的怪，移动一定时间产生
            // 	time:3000, // 每移动time的时间，就产生一个新的怪物
            // 	id:'107',	// 怪物id
            // 	level:0,	// 怪物等级
            // 	life:15000,	// 怪物的生存时间，ms
            //
            // 	scaleX:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
            // 	scaleY:0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
            // 	scale:{time:3000, scaleX:1.4, scaleY:1.0}	// 怪物随时间的缩放，相对于原始尺寸
            // }
        },//彗星
        '107': {
            name: '慧尾',
            id: 107,
            model: 'star7',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
            add_blood_other: 0.1, // 给别人加血, 每秒加
        },// 慧尾

        '108': {
            name: '冰块陨石',
            id: 108,
            model: 'star8',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: { // 生成新的怪
                time: 0, // 每移动time的时间，就产生一个新的怪物, 0表示死亡产生
                id: '8',	// 怪物id
                level: 1,	// 怪物等级
                life: 5000,	// 怪物的生存时间，ms

                scaleX: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                scaleY: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                scale: {time: 1000, scaleX: 1.4, scaleY: 1}	// 怪物随时间的缩放，相对于原始尺寸
            }
        },//冰块陨石
        '109': {
            name: '碎冰',
            id: 109,
            model: 'star9',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
        },// 碎冰（特殊）

        '110': {
            name: '金刚陨石',
            id: 110,
            model: 'star10',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            rebound: true,	// 反弹属性，碰到其他怪之后，会反弹 // todo need test

        },

        '111': {
            name: '星际尘埃',
            id: 111,
            model: 'star1',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            scale_info: {
                start:{
                    scaleX:1,
                    scaleY:1,
                },
                change: {
                    loop: true,
                    scalelist: [// 缩放规则，time是生存周期时间区间，wait为true，表示这个阶段不变化，否则，在time之间范围内变更为scaleX和scaleY 的缩放比例, 此过程会循环进行
                        {time: 1000, wait: true, scaleX: 1, scaleY: 1},
                        {time: 1000, wait: false, scaleX: 2, scaleY: 2},
                        {time: 1000, wait: true, scaleX: 2, scaleY: 2},
                        {time: 1000, wait: false, scaleX: 1, scaleY: 1},
                    ]
                }
            },
            add_blood_self: {	// todo, need test, and need fx
                times: 10,	// 加多少秒
                speed: 0.1, // 每秒增加的比例，按照初始血量来增加
            }, // 这个加血只对自己有效
        },	// 星际尘埃
        '112': {
            name: '黑洞',
            id: 112,
            model: 'star2',
            speed: 0.001,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK,
            layer: 1,
            eat: {
                blood: 1,	// 增加当前血量的比例
                scale: 0.15, // 增加体型的比例, 针对原始尺寸
            }, 	// 是否具有吞噬属性
        }, // 微型黑洞, 黑洞的等级永远为0， 体型为美术给的原始体型
        '113': {
            name: '风暴球团',
            id: 113,
            model: 'star3',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            add_speed: [
                {time: 2000, wait: false, add: 0.0001}, // 每ms增加的速度
                {time: 1000, wait: false, add: -0.0002},
                {time: 2000, wait: true, add: 0}		// wait为true表示等待
            ], // 加速度配置
        }, // 风暴球团

        '114': {
            name: '爆炸卫星',
            id: 114,
            model: 'star4',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: { // 生成新的怪，移动一定时间产生
                time: 0, // 每移动time的时间，就产生一个新的怪物 , 如果配置为0， 表示死亡才生存新怪
                id: '115',	// 怪物id
                level: 1,	// 怪物等级
                life: 5000,	// 怪物的生存时间，ms

                scaleX: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                scaleY: 0.5,	// 怪物初始体型缩放，相对于id的原始尺寸
                scale: {time: 1000, scaleX: 1.4, scaleY: 1}	// 怪物随时间的缩放，相对于原始尺寸
            }
        }, // 爆炸卫星
        '115': {
            name: '卫星碎片',
            id: 107,
            model: 'star5',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
            bomb: {	// todo need test
                scope: 100,			// 伤害范围
                type: 1, // 1 表示摧毁所有物体
            }
        }, // 卫星碎片
    }
}