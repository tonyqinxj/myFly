// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameData = (function () {
    function GameData() {
    }
    GameData.getBlood = function (star_level) {
        return this.cur_level * 100 * star_level;
    };
    GameData.getTotalBlood = function (star_level) {
        if (star_level == 1)
            return this.getBlood(star_level);
        else
            return 2 * this.getTotalBlood(star_level - 1) + this.getBlood(star_level);
    };
    GameData.bloodGen = function (batchInfo) {
        var starCount = batchInfo.init.length + batchInfo.add_ons.length;
        var rands = [];
        for (var i = 0; i < starCount; i++) {
            rands.push(Tools.GetRandomNum(1, 100));
        }
        var rand_sums = 0;
        rands.forEach(function (r) {
            rand_sums += r;
        });
        var index = 0;
        batchInfo.init.forEach(function (star) {
            star["blood"] = Math.ceil(rands[index] / rand_sums * batchInfo.blood);
            index++;
        });
        batchInfo.add_ons.forEach(function (star) {
            star["blood"] = Math.ceil(rands[index] / rand_sums * batchInfo.blood);
            index++;
        });
    };
    // 所有的全局游戏数据放置到这里
    GameData.main = null; // main 指针
    GameData.openid = ''; // 玩家的openid
    GameData.total_money = ''; // 玩家当前拥有的金币
    GameData.cur_level = 1; // 当前处于关卡
    GameData.score = 0; // 当前分数
    GameData.main_weapon = { attack: 3, speed: 10, bullet_speed: 2, bullet_rate: 100 }; // 主武器属性
    GameData.sub_weapon = { attack: 30, strength: 10 }; // 副武器属性
    GameData.bulletList = [1]; // 子弹发送顺序，发几颗
    GameData.item = {
        'jitui': { endtime: 0, up: 3 }
    }; // 全局道具，比如击退什么的
    GameData.level_configs = [
        // 第1波
        {
            blood: 1000,
            tip: {},
            init: [
                { time: 1000, id: 102, level: 2, x: 375 },
            ],
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ],
        },
        // 第2波
        {
            blood: 1000,
            tip: {},
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ],
        },
        // 第3波
        {
            blood: 1000,
            tip: {},
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ],
        },
        // 第4波
        {
            blood: 2000,
            tip: {
                model: 'BOSS来袭',
                time: 1000,
                wait: 3000,
            },
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ],
        },
    ];
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map