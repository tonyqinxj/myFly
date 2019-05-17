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
    GameData.setOpenid = function (openid) {
        var _this = this;
        this.UserInfo.openid = openid;
        if (!this.UserInfo.sendInvite) {
            var query = platform.getLaunchQuery();
            console.log('query:', query);
            if (query && query.openid) {
                // let obj = Tools.getQueryString(query)
                // if(obj && obj.openid){
                HttpTools.httpPost("https://www.nskqs.com/inviteok", { name: GameData.gameName, inviter: query.openid, openid: openid }).then(function (ret) {
                    if (ret && ret.errcoce == 0 && ret.data && ret.data.errcode == 0) {
                        _this.UserInfo.sendInvite = true;
                        _this.needSaveUserInfo = true;
                    }
                });
                //}
            }
        }
    };
    GameData.init = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.score = 0;
            _this.genBulletList();
            _this.genLevelData().then(function () {
                resolve(true);
            }).catch(function () {
                resolve(false);
            });
        });
    };
    // 美术字的初始化
    GameData.initFont = function () {
        var texture = RES.getRes("flydata_png");
        var config = RES.getRes("myfont_json");
        this.myFont = new egret.BitmapFont(texture, config); //RES.getRes('myfont_fnt');
    };
    GameData.getMainAttack = function () {
        var item = MonsterTools.getItem('addHitAttack');
        var attck = this.UserInfo.MainWeapon.attack;
        if (item)
            attck += item['config']['ratio'];
        attck = Math.floor(attck);
        var value = attck;
        if (attck > 10 && attck <= 30)
            value = 2 * attck - 10;
        if (attck > 30 && attck <= 50)
            value = 3 * attck - 40;
        if (attck > 50)
            value = Math.floor(10 * Math.exp(0.05 * attck));
        return value;
    };
    GameData.getMainSpeed = function () {
        return this.UserInfo.MainWeapon.speed + 10;
    };
    GameData.getSubWeapon = function () {
        if (this.UserInfo.curSubWeaponId <= 0)
            return null;
        if (this.failTryId && this.failTryState == 2 && this.UserInfo.curSubWeaponId == this.failTryId) {
            return this.UserInfo.SubWeapons[this.failTryId - 1];
        }
        return this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
    };
    GameData.getSubStrenth = function () {
        if (this.UserInfo.curSubWeaponId <= 0)
            return 0;
        if (this.failTryId && this.failTryState == 2 && this.UserInfo.curSubWeaponId == this.failTryId) {
            return 33;
        }
        return this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1].strength;
    };
    GameData.getSubAttack = function () {
        if (this.UserInfo.curSubWeaponId <= 0)
            return 0;
        if (this.failTryId && this.failTryState == 2 && this.UserInfo.curSubWeaponId == this.failTryId) {
            return 200;
        }
        var attack = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1].attack;
        return attack;
    };
    GameData.getGoldCost = function () {
        return this.UserInfo.goldCostLevel * 6;
    };
    // 每10s增加的金币数
    GameData.getGoldTime = function () {
        return this.UserInfo.goldTimeLevel * 12;
    };
    // 最大金币存储量
    GameData.getGoldTimeMax = function () {
        return this.getGoldTime() * 4 * 60 * 6; // 每10秒增加一次, 最多加2小时, 这是4小时
    };
    GameData.getCurGoldTime = function () {
        if (this.UserInfo.lastGetGoldTime == 0) {
            this.UserInfo.lastGetGoldTime = new Date().getTime();
            this.needSaveUserInfo = true;
            return 0;
        }
        var time = new Date().getTime() - this.UserInfo.lastGetGoldTime;
        var gold = time * this.getGoldTime() / 10000;
        var max = this.getGoldTimeMax();
        //gold = max/3;
        return Math.ceil(Math.min(gold, max));
    };
    GameData.onGetGoldTime = function (ratio) {
        this.addGold(this.curTimeGold * ratio);
        this.UserInfo.lastGetGoldTime = new Date().getTime();
        this.curTimeGold = 0;
        this.needSaveUserInfo = true;
    };
    // 第一次登陆的时候计算
    GameData.onCheckTili = function (txt) {
        if (this.UserInfo.tili >= 80) {
            txt.text = '';
            return;
        }
        if (this.UserInfo.lastGetTiliTime) {
            var deltaTime = new Date().getTime() - this.UserInfo.lastGetTiliTime;
            var add = Math.floor(deltaTime / 1000 / 60 / 6);
            if (add > 0) {
                this.UserInfo.tili += add;
                if (this.UserInfo.tili > 80) {
                    txt.text = '';
                    this.UserInfo.tili == 80;
                }
                this.UserInfo.lastGetTiliTime = new Date().getTime();
                this.needSaveUserInfo = true;
            }
            else {
                deltaTime = Math.floor(deltaTime / 1000);
                deltaTime = 6 * 60 - deltaTime;
                var fen = Math.floor(deltaTime / 60);
                var miao = deltaTime - fen * 60;
                txt.text = fen + ':' + miao + '+1';
            }
        }
        else {
            this.UserInfo.lastGetTiliTime = new Date().getTime();
            txt.text = '';
        }
    };
    GameData.onBuyGoldByDiamond = function (diamond) {
        if (diamond > this.UserInfo.totalDiamond)
            return;
        this.UserInfo.totalDiamond -= diamond;
        this.addGold(this.getGoldCost() * 500 * diamond);
        this.UserInfo.lastGetTiliTime = new Date().getTime();
        this.needSaveUserInfo = true;
    };
    GameData.onHandleResult = function (ratio) {
        var gold = this.score * ratio;
        this.score = 0;
        this.addGold(gold);
    };
    // 对一波怪物的血量进行初始化
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
        console.log('blood gen:', batchInfo.blood, starCount);
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
    // 根据主武器的射速生成弹夹
    GameData.genBulletList = function () {
        // 晋级   步长(晋级需要的级别)
        // 1->2: 10
        // 2->3: 15
        // 3->4: 20
        // 4->5: 25
        // ...
        // 根据当前武器的level，确定其级别范围，比如落在3->4之间
        // 然后根据步长，计算出3和4的比例，最后将3和4按比例平均分配到一个数组中，数组有可能很长的～～
        var speed = this.getMainSpeed(); // 取出主武器的级别
        var item = MonsterTools.getItem('addHitSpeed');
        if (item) {
            speed += item['config']['ratio']; // 全局加速道具加持
        }
        if (speed <= 10) {
            return;
        }
        // 根据speed决定其落在哪个区间，区间为i->i+1
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
        // 按照比例分配弹夹（将少的平均插入到多的一方）
        var a = speed - last;
        var b = len - a;
        // 排个顺序，多的在前面
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
        // 将少的一方插入多的一方的数组中
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
    // 装载关卡数据
    GameData.genLevelData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RES.getResByUrl(GameData.domain + '/resource/levels/' + this.UserInfo.curLevel + '.json')];
                    case 1:
                        json = _a.sent();
                        this.level_configs = json;
                        if (json)
                            console.log('level data count:' + json.length);
                        this.total_blood = 0;
                        json.forEach(function (j) {
                            _this.total_blood += j['blood'] || 0;
                            j.init.forEach(function (s) {
                                if (s['bossblood']) {
                                    _this.total_blood += s['bossblood']; // boss 额外加血
                                }
                            });
                            j.add_ons.forEach(function (s) {
                                if (s['bossblood']) {
                                    _this.total_blood += s['bossblood'];
                                }
                            });
                        });
                        this.colors_blood = [];
                        StarData.colorLevels.forEach(function (r) {
                            _this.colors_blood.push(_this.total_blood * r);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameData.getColorName = function (blood) {
        var i = 0;
        for (; i < this.colors_blood.length; i++) {
            if (blood >= this.colors_blood[i])
                break;
        }
        return StarData.colorNames[i];
    };
    GameData.addDiamond = function (diamond) {
        this.UserInfo.totalDiamond += diamond;
        this.needSaveUserInfo = true;
        return true;
    };
    GameData.addGold = function (gold) {
        this.UserInfo.totalMoney += gold;
        this.needSaveUserInfo = true;
        return true;
    };
    GameData.delGold = function (gold) {
        if (this.UserInfo.totalMoney > gold) {
            this.UserInfo.totalMoney -= gold;
            this.needSaveUserInfo = true;
            return true;
        }
        else {
            return false;
        }
    };
    GameData.hasVideoAd = function () {
        if (this.UserInfo.nextLevel < 20)
            return false;
        return window.platform.haveVideoAd();
    };
    GameData.passLevel = function () {
        var ret = false;
        this.UserInfo.curLevel++;
        if (this.UserInfo.nextLevel <= this.UserInfo.curLevel) {
            this.UserInfo.nextLevel++;
            // this.UserInfo.tili+=6;
            // if(this.UserInfo.tili>80) this.UserInfo.tili = 80;
            //this.showTips('通关新关卡+6体力')
            ret = true;
        }
        if (this.UserInfo.curLevel > this.MAX_LEVEL)
            this.UserInfo.curLevel = this.MAX_LEVEL;
        if (this.UserInfo.nextLevel > this.MAX_LEVEL)
            this.UserInfo.nextLevel = this.MAX_LEVEL;
        for (var i = 0; i < this.UserInfo.SubWeapons.length; i++) {
            var sub = this.UserInfo.SubWeapons[i];
            if (sub.open == 0) {
                if (this.UserInfo.nextLevel > sub.openlevel) {
                    // todo:提示新的僚机获得
                    this.hasneedWeapon = true;
                    sub.open = 1;
                    this.needSaveUserInfo = true;
                }
                break;
            }
        }
        this.needSaveUserInfo = true;
        if (platform && platform['openDataContext']) {
            platform['openDataContext'].postMessage({
                command: 'rank_save',
                score: '' + this.UserInfo.nextLevel,
            });
        }
        return ret;
    };
    GameData.selectWeapon = function (id) {
        // 选择当前僚机
        if (id > this.UserInfo.SubWeapons.length)
            return;
        var sub = this.UserInfo.SubWeapons[id - 1];
        if (sub.open) {
            this.UserInfo.curSubWeaponId = id;
            return 0;
        }
        else {
            //todo: 提示武器将在某个等级开放
            return sub.openlevel;
        }
    };
    GameData.saveUserInfo = function () {
        if (this.needSaveUserInfo) {
            this.needSaveUserInfo = false;
            var key = "myUserData";
            egret.localStorage.setItem(key, JSON.stringify(GameData.UserInfo));
        }
    };
    GameData.loadUserInfo = function () {
        var key = "myUserData";
        var userinfo = egret.localStorage.getItem(key);
        if (userinfo) {
            var userinfo_data = JSON.parse(userinfo);
            if (userinfo_data) {
                // if (userinfo_data.totalMoney) GameData.UserInfo.totalMoney = userinfo_data.totalMoney
                // if (userinfo_data.totalDiamond) GameData.UserInfo.totalDiamond = userinfo_data.totalDiamond
                // if (userinfo_data.curLevel) GameData.UserInfo.curLevel = userinfo_data.curLevel
                // if (userinfo_data.nextLevel) GameData.UserInfo.nextLevel = userinfo_data.nextLevel
                // if (userinfo_data.goldCostLevel) GameData.UserInfo.goldCostLevel = userinfo_data.goldCostLevel
                // if (userinfo_data.goldTimeLevel) GameData.UserInfo.goldTimeLevel = userinfo_data.goldTimeLevel
                // if (userinfo_data.MainWeapon) GameData.UserInfo.MainWeapon = userinfo_data.MainWeapon
                // if (userinfo_data.SubWeapons) GameData.UserInfo.SubWeapons = userinfo_data.SubWeapons
                // if (userinfo_data.curSubWeaponId) GameData.UserInfo.curSubWeaponId = userinfo_data.curSubWeaponId
                // if (userinfo_data.tili) GameData.UserInfo.tili = userinfo_data.tili
                // if (userinfo_data.lastGetGoldTime) GameData.UserInfo.lastGetGoldTime = userinfo_data.lastGetGoldTime
                // if (userinfo_data.lastGetTiliTime) GameData.UserInfo.lastGetTiliTime = userinfo_data.lastGetTiliTime
                // if (userinfo_data.failTry) GameData.UserInfo.failTry = userinfo_data.failTry
                // if (userinfo_data.d_kan) GameData.UserInfo.d_kan = userinfo_data.d_kan
            }
        }
    };
    // 当前是否可以升级主武器
    GameData.canUpMain = function () {
        var needGold = this.getCost('main_attack');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        needGold = this.getCost('main_speed');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        return false;
    };
    // 当前是否可以升级副武器
    GameData.canUpSub = function () {
        var needGold = this.getCost('sub_attack');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        needGold = this.getCost('sub_attack');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        return false;
    };
    // 当前是否可以升级金币
    GameData.canUpGold = function () {
        var needGold = this.getCost('gold_cost');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        needGold = this.getCost('gold_time');
        if (needGold && needGold <= this.UserInfo.totalMoney)
            return true;
        return false;
    };
    GameData.getCost = function (type) {
        var needGold = 0;
        switch (type) {
            case 'main_attack':
                if (this.UserInfo.MainWeapon.attack < 220)
                    needGold = 14 * Math.pow(this.UserInfo.MainWeapon.attack, 2.43);
                else
                    needGold = 30000 * this.UserInfo.MainWeapon.attack;
                break;
            case 'main_speed':
                if (this.UserInfo.MainWeapon.speed < 220)
                    needGold = 14 * Math.pow(this.UserInfo.MainWeapon.speed, 2.43) / 3;
                else
                    needGold = 10000 * this.UserInfo.MainWeapon.speed;
                break;
            case 'gold_cost':
                if (this.UserInfo.goldCostLevel < 220)
                    needGold = 14 * Math.pow(this.UserInfo.goldCostLevel, 2.43);
                else
                    needGold = 30000 * this.UserInfo.goldCostLevel;
                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x
                if (this.UserInfo.goldTimeLevel < 220)
                    needGold = 14 * Math.pow(this.UserInfo.goldTimeLevel, 2.43);
                else
                    needGold = 30000 * this.UserInfo.goldTimeLevel;
                break;
            case 'sub_attack':
                // var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                //
                // if (sub.attack <= 220) needGold = 14 * Math.pow(sub.attack, 2.43);
                // else needGold = 30000 * sub.attack;
                if (this.start.weapon)
                    needGold = this.start.weapon.getAttackCost();
                break;
            case 'sub_speed':
                // var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                //
                // if (sub.strength <= 220) needGold = 14 * Math.pow(sub.strength, 2.43);
                // else needGold = 30000 * sub.strength;
                if (this.start.weapon)
                    needGold = this.start.weapon.getStrengthCost();
                break;
        }
        return needGold;
    };
    GameData.levelup_free = function (type) {
        switch (type) {
            case 'main_attack':
                this.UserInfo.MainWeapon.attack++;
                break;
            case 'main_speed':
                this.UserInfo.MainWeapon.speed++;
                break;
            case 'gold_cost':
                this.UserInfo.goldCostLevel++;
                break;
            case 'gold_time':
                this.UserInfo.goldTimeLevel++;
                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                sub.attack++;
                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                sub.strength++;
                break;
            default:
                break;
        }
        this.needSaveUserInfo = true;
    };
    GameData.levelup = function (type) {
        var needGold = this.getCost(type);
        if (needGold <= 0)
            return false;
        this.needSaveUserInfo = false;
        switch (type) {
            case 'main_attack':
                if (this.delGold(needGold)) {
                    this.UserInfo.MainWeapon.attack++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'main_speed':
                if (this.delGold(needGold)) {
                    this.UserInfo.MainWeapon.speed++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'gold_cost':
                if (this.delGold(needGold)) {
                    this.UserInfo.goldCostLevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x
                if (this.delGold(needGold)) {
                    this.UserInfo.goldTimeLevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                if (sub.attack >= this.UserInfo.MainWeapon.attack) {
                    this.showTips('副武器火力不能高于主武器');
                    break;
                }
                if (this.delGold(needGold)) {
                    sub.attack++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
                if (sub.strength >= 32) {
                    this.showTips('强度已经满级');
                    break;
                }
                if (this.delGold(needGold)) {
                    sub.strength++;
                    this.needSaveUserInfo = true;
                }
                break;
        }
        if (this.needSaveUserInfo) {
            platform.playMusic('sounds/WeaponLevelUp.mp3', 1);
        }
        return false;
    };
    GameData.setWin = function (win) {
        // 满级使用条件检测
        if (this.UserInfo.SubWeapons[0].open == 0)
            return;
        if (win) {
            if (this.UserInfo.failTry.failTimes > 0) {
                this.needSaveUserInfo = true;
            }
            this.UserInfo.failTry.failTimes = 0;
        }
        else {
            this.UserInfo.failTry.failTimes++;
            this.needSaveUserInfo = true;
            if (this.UserInfo.failTry.failTimes >= 3) {
                // 连续失败三次, 给一次满级试用资格, 每天最多2次
                if (this.UserInfo.failTry.lastTryTime > 0) {
                    var day = new Date(this.UserInfo.failTry.lastTryTime);
                    var tnow = new Date();
                    if (day.getDate() != tnow.getDate() || day.getFullYear() != tnow.getFullYear()) {
                        this.UserInfo.failTry.lastTryTime == 0;
                        this.UserInfo.failTry.tryTimes = 0;
                    }
                }
                if (this.UserInfo.failTry.tryTimes >= 2)
                    return;
                var count_1 = 0;
                this.UserInfo.SubWeapons.forEach(function (s) {
                    if (s.open)
                        count_1++;
                });
                this.failTryId = Tools.GetRandomNum(1, count_1);
                this.failTryState = 1;
                this.UserInfo.failTry.failTimes = 0;
            }
        }
    };
    GameData.clearWin = function (win) {
        if (this.failTryState > 0) {
            this.UserInfo.failTry.tryTimes++;
            this.UserInfo.failTry.lastTryTime = new Date().getTime();
            this.needSaveUserInfo = true;
            if (!win) {
                // 随机一个免费的主武器或者金币的升级资格,需要播放视频
                this.upfree = Tools.GetRandomNum(1, 4);
            }
        }
        this.failTryState = 0;
        this.failTryId = 0;
    };
    GameData.showTips = function (tip) {
        var item = new ShowTips(tip);
        item.horizontalCenter = 0;
        item.y = 550;
        this.start.addChild(item);
    };
    GameData.gameName = 'flygame';
    //public static domain = 'https://nskqs.oss-cn-hangzhou.aliyuncs.com/flygame16';
    GameData.domain = '';
    //  public static gameName = 'flygame';
    // 成长
    /**
     1. 金币价值 y=6x
     2. 挂机收益 y=12x
     3. 升级消耗的金币
     前200级: y=14x^2.43
     200级以后： y=30000x
     */
    // 所有的全局游戏数据放置到这里
    GameData.bulletModel = {
        '1': 'b1',
        '2': 'b2',
        '3': 'b3',
        '4': 'b4',
        '23': 'b23',
        '24': 'b24',
        '34': 'b34',
        '234': 'b234'
    }; // 主武器子弹模型
    GameData.wxuserinfo = null;
    GameData.hasneedWeapon = false;
    GameData.weaponOpenLevels = [20, 60, 100]; //僚机开放等级（关卡等级）
    GameData.weaponNames = ['fuwuqi_gbd', 'fuwuqi_pt', 'fuwuqi_cjb', 'fuwuqi_sdq'];
    GameData.MAX_LEVEL = 100;
    GameData.UserInfo = {
        sendInvite: false,
        openid: '',
        tili: 80,
        totalMoney: 0,
        totalDiamond: 10,
        curLevel: 1,
        nextLevel: 1,
        goldCostLevel: 1,
        goldTimeLevel: 1,
        MainWeapon: {
            attack: 1,
            speed: 1,
        },
        SubWeapons: [
            {
                id: 1,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 1,
            },
            {
                id: 2,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 2,
            },
            {
                id: 3,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 3,
            },
            {
                id: 4,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 4,
            }
        ],
        curSubWeaponId: 0,
        lastGetGoldTime: 0,
        lastGetTiliTime: 0,
        failTry: {
            failTimes: 0,
            // 如果满级还是未通关，则给一次免费升级主机或者金币的机会
            // 机会在内存中，如果重启就没了，或者进入关卡就消失
            tryTimes: 0,
            lastTryTime: 0,
        },
        d_kan: {
            times: 0,
            lastTime: 0,
        }
    };
    GameData.showBox = false; // 是否显示碰撞盒子
    GameData.needSaveUserInfo = false; //
    GameData.total_blood = 0; // 关卡总血量
    GameData.kill_blood = 0; // 当前kill的血量
    GameData.colors_blood = []; // 血量颜色值
    GameData.main = null; // main 指针
    GameData.start = null;
    GameData.real_height = 1624;
    GameData.score = 0; // 当前分数
    GameData.myFont = null; // 美术数字
    GameData.main_weapon = {
        bullet_speed: 2,
        bullet_rate: 100,
        bullet_scale_time: 100,
    }; // 主武器参数
    GameData.bulletList = [1]; // 子弹发送顺序，发几颗
    GameData.level_configs = []; // 当前关卡数据，由/levels/*.json提供数据
    GameData.curTimeGold = 0;
    GameData.failTryId = 0; // 僚机id
    GameData.failTryState = 0; // 1: 表示需要播放视频，2：表示可以使用，0：表示不可使用
    GameData.upfree = 0; // 免费升级资格
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map