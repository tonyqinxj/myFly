// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var GameData = (function () {
    function GameData() {
    }
    GameData.initFont = function () {
        var texture = RES.getRes("flydata_png");
        var config = RES.getRes("myfont_json");
        this.myFont = new egret.BitmapFont(texture, config); //RES.getRes('myfont_fnt');
    };
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
    GameData.genBulletList = function () {
        var speed = GameData.main_weapon.speed;
        if (speed <= 10) {
            return;
        }
        var len = 10; // 走多少步之后，从i到达i+1
        var last = 10; // i等级对应的speed
        var i = 1; // i -> i+1排子弹区间
        for (; i < 11; i++) {
            if (speed > last && speed <= last + len) {
                // 落入了区间
                break;
            }
            last += len;
            len += 5;
        }
        var a = speed - last;
        var b = len - a;
        var g = [];
        if (a > b) {
            g.push({
                num: a,
                index: i + 1,
            });
            g.push({
                num: b,
                index: i
            });
        }
        else if (a < b) {
            g.push({
                num: b,
                index: i
            });
            g.push({
                num: a,
                index: i + 1,
            });
        }
        else {
            GameData.bulletList = [i, i + 1];
            return;
        }
        GameData.bulletList = [];
        var n = Math.floor(g[0].num / g[1].num);
        var c = 0;
        for (var i_1 = 0; i_1 < g[0].num; i_1++) {
            GameData.bulletList.push(g[0].index);
            c++;
            if (c == n) {
                GameData.bulletList.push(g[1].index);
                c = 0;
            }
        }
    };
    GameData.genLevelData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                json = RES.getRes(this.cur_level + '_json');
                this.level_configs = json;
                return [2 /*return*/];
            });
        });
    };
    // 所有的全局游戏数据放置到这里
    GameData.myFont = null;
    GameData.main = null; // main 指针
    GameData.openid = ''; // 玩家的openid
    GameData.total_money = ''; // 玩家当前拥有的金币
    GameData.cur_level = 1; // 当前处于关卡
    GameData.score = 0; // 当前分数
    GameData.main_weapon = { attack: 3, speed: 11, bullet_speed: 2, bullet_rate: 100 }; // 主武器属性
    GameData.sub_weapon = { attack: 1, strength: 10 }; // 副武器属性
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
                { time: 500, id: 106, level: 1, x: 350 },
                { time: 500, id: 110, level: 3, x: 200 },
                { time: 500, id: 110, level: 3, x: 300 },
                { time: 500, id: 110, level: 3, x: 400 },
                { time: 500, id: 110, level: 3, x: 500 },
                { time: 500, id: 110, level: 3, x: 600 },
                { time: 500, id: 112, level: 3, x: 700 },
                { time: 3500, id: 101, level: 0, x: 100 },
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