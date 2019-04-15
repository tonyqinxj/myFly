var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StarData = (function () {
    function StarData() {
    }
    // layer:层级管理，目前有4个级别，分别为0，1，2，3， 数字大的在前面
    StarData.CAN_ATTACK = Math.pow(2, 11); // 可被攻击
    StarData.CAN_CO = Math.pow(2, 12); // 可以被碰
    StarData.StarConfig = {
        '101': {
            name: '小陨石',
            id: 101,
            model: 'star1',
            speed: 0.1,
            attack_speed: 0.3,
            snow_time: 200,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
        },
        '102': {
            name: '冲击陨石',
            id: 102,
            model: 'star2',
            speed: 0.2,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
        },
        '103': {
            name: '熔岩陨石',
            id: 103,
            model: 'star3',
            speed: 0.1,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: {
                time: 1000,
                id: '104',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '104': {
            name: '岩浆',
            id: 104,
            model: 'star4',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
        },
        '105': {
            name: '磁铁陨石',
            id: 105,
            model: 'star5',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            follow: {
                scope: 300,
                add_speed: 0.0005,
            }
        },
        '106': {
            name: '彗星',
            id: 106,
            model: 'star6',
            speed: 0.1,
            attack_speed: 0.5,
            //group:StarData.CAN_ATTACK|StarData.CAN_CO,
            group: 0,
            layer: 1,
            fx: {
                texture: 'newParticle_png',
                json: 'newParticle_json',
            },
            create_new_star: {
                time: 3000,
                id: '107',
                level: 0,
                life: 15000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 3000, scaleX: 1.4, scaleY: 1.0 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '107': {
            name: '慧尾',
            id: 107,
            model: 'star7',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
            add_blood_other: 0.1,
        },
        '108': {
            name: '冰块陨石',
            id: 108,
            model: 'star8',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: {
                time: 0,
                id: '8',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '109': {
            name: '碎冰',
            id: 109,
            model: 'star9',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
        },
        '110': {
            name: '金刚陨石',
            id: 110,
            model: 'star10',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            rebound: true,
        },
        '111': {
            name: '星际尘埃',
            id: 111,
            model: 'star1',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            scale_info: [
                { time: 1000, wait: true, scaleX: 1, scaleY: 1 },
                { time: 1000, wait: false, scaleX: 2, scaleY: 2 },
                { time: 1000, wait: true, scaleX: 2, scaleY: 2 },
                { time: 1000, wait: false, scaleX: 1, scaleY: 1 },
            ],
            add_blood_self: {
                times: 10,
                speed: 0.1,
            },
        },
        '112': {
            name: '黑洞',
            id: 112,
            model: 'star2',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK,
            layer: 2,
            eat: {
                blood: 1,
                scale: 0.15,
            },
        },
        '113': {
            name: '风暴球团',
            id: 113,
            model: 'star3',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            add_speed: [
                { time: 2000, wait: false, add: 0.0001 },
                { time: 1000, wait: false, add: -0.0002 },
                { time: 2000, wait: true, add: 0 } // wait为true表示等待
            ],
        },
        '114': {
            name: '爆炸卫星',
            id: 114,
            model: 'star4',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            layer: 1,
            create_new_star: {
                time: 0,
                id: '115',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '115': {
            name: '卫星碎片',
            id: 107,
            model: 'star5',
            speed: 0,
            attack_speed: 0,
            group: 0,
            layer: 0,
            bomb: {
                scope: 100,
                type: 1,
            }
        },
    };
    return StarData;
}());
__reflect(StarData.prototype, "StarData");
//# sourceMappingURL=StarData.js.map