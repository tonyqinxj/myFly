var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StarData = (function () {
    function StarData() {
    }
    StarData.CAN_ATTACK = Math.pow(2, 11); // 可被攻击
    StarData.CAN_CO = Math.pow(2, 12); // 可以被碰
    StarData.StarConfig = {
        '101': {
            id: 101,
            model: '1_png',
            speed: 0.1,
            attack_speed: 0.3,
            snow_time: 200,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
        },
        '102': {
            id: 102,
            model: '2_png',
            speed: 0.2,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
        },
        '103': {
            id: 103,
            model: '3_png',
            speed: 0.1,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
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
            id: 104,
            model: '4_png',
            speed: 0,
            attack_speed: 0,
            group: 0,
        },
        '105': {
            id: 105,
            model: '4_png',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            follow: {
                scope: 100,
                add_speed: 0.003,
            }
        },
        '106': {
            id: 106,
            model: '4_png',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            create_new_star: {
                time: 1000,
                id: '107',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '107': {
            id: 107,
            model: '4_png',
            speed: 0,
            attack_speed: 0,
            group: 0
        },
        '108': {
            id: 108,
            model: '4_png',
            speed: 0.1,
            attack_speed: 0.5,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            create_new_star: {
                time: 0,
                id: '109',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 } // 怪物随时间的缩放，相对于原始尺寸
            }
        },
        '109': {
            id: 109,
            model: '4_png',
            speed: 0,
            attack_speed: 0,
            group: 0
        },
        '110': {
            id: 110,
            model: '4_png',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            rebound: true,
        },
        '111': {
            id: 111,
            model: '4_png',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            scale_info: [
                { time: 1000, wait: true, scaleX: 1, scaleY: 1 },
                { time: 1000, wait: false, scaleX: 2, scaleY: 2 },
                { time: 1000, wait: true, scaleX: 2, scaleY: 2 },
                { time: 1000, wait: false, scaleX: 1, scaleY: 1 },
            ],
            add_blood: {
                times: 10,
                speed: 0.1,
            }
        },
        '112': {
            id: 112,
            model: '8_png',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK,
            eat: {
                blood: 1,
                scale: 0.15,
            },
        },
        '113': {
            id: 113,
            model: '4_png',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
            add_speed: [
                { time: 2000, wait: false, add: 0.0001 },
                { time: 1000, wait: false, add: -0.0002 },
                { time: 2000, wait: true, add: 0 } // wait为true表示等待
            ],
        },
        '114': {
            id: 114,
            model: '4_png',
            speed: 0.15,
            attack_speed: 0.3,
            group: StarData.CAN_ATTACK | StarData.CAN_CO,
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
            id: 107,
            model: '4_png',
            speed: 0,
            attack_speed: 0,
            group: 0,
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