var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var StartUI = (function (_super) {
    __extends(StartUI, _super);
    function StartUI() {
        var _this = _super.call(this) || this;
        // reopen 需要处理的变量
        _this.state = 'init'; // 'game'
        _this.lastFramTime = 0; // 上一帧的执行时间
        _this.game_time = 0; // 游戏时间，每一波怪开始的时候刷新为0，主要用来生成怪物
        _this.cur_level_batch = -1; // 当前出去第几批次, -1 表示还没开始
        _this.cur_add_ons = 0; // 当前已经补充了几个怪物
        _this.star_fly = []; // 有效的怪物，star就是怪
        _this.star_fly_eat = []; // 黑洞列表, 也在star_fly中
        _this.star_blood = 0; // 当前波怪物的总血量
        _this.star_left_blood = 0; // 当前波怪物剩余的血量之和，当少于20％的时候，触发下一波怪物的产生
        _this.fx = []; // 特效
        _this.star_add_blood = []; // 给别人加血
        _this.gp_layer = [];
        _this.real_height = 1624; // 屏幕使用高度
        _this.last_pos = { x: 0, y: 0 }; // 用于主机移动的辅助，记录上一次的位置，用来算每帧之间的相对位置
        _this.send_index = 0; // 主机火力辅助变量，控制一次发送几个子弹
        _this.send_timer = null; // 主机子弹发射定时器
        _this.bullet_fly = new Array(); // 飞行中的有效子弹
        _this.bullet_idle = new Array(); // 无效子弹，形成了一个子弹内存池
        _this.timer_relife = null; // 死亡复活定时器
        _this.timer_left = 3; // 复活定时器辅助变量
        _this.bomb = [];
        _this.noBatch = false; // 无怪可刷
        _this.wait_end = false;
        // 彗尾给别人加血
        _this.last_add_boold_time = 0;
        return _this;
    }
    StartUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    StartUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        GameData.initFont();
        FxMgr.init();
        this.initBegin();
    };
    StartUI.prototype.test = function () {
        var r = RES.getRes('7_png');
        var p = r.getPixel32(100, 100);
        var pp = '';
        p.forEach(function (p1) {
            pp += p1.toString(16);
        });
        var b = r.getPixels(120, 120, 2, 2);
        var bb = '';
        b.forEach(function (p1) {
            bb += p1.toString(16);
        });
        console.log(pp, bb);
    };
    StartUI.prototype.init = function () {
        //console.log('init call',)
        //this.test();
        this.noBatch = false;
        this.wait_end = false;
        GameData.genBulletList();
        GameData.genLevelData();
        this.state = 'init';
        this.lastFramTime = 0;
        this.game_time = 0;
        this.cur_level_batch = -1;
        this.cur_add_ons = 0;
        this.star_blood = 0;
        this.star_left_blood = 0;
        this.star_fly.forEach(function (star) {
            star.model && star.model.parent && star.model.parent.removeChild(star.model);
            star.label_blood && star.label_blood.parent && star.label_blood.parent.removeChild(star.label_blood);
        });
        this.star_fly = [];
        this.star_fly_eat = [];
        this.star_add_blood = [];
        this.bomb = [];
    };
    StartUI.prototype.initBegin = function () {
        var d1 = ResTools.createBitmapByName('star1'); //RES.getRes("myfly1_json.1");
        d1.x = 300;
        d1.y = 300;
        this.addChild(d1);
        this.gp_layer.push(this.gp_layer_1);
        this.gp_layer.push(this.gp_layer_2);
        this.gp_layer.push(this.gp_layer_3);
        this.gp_layer.push(this.gp_layer_4);
        //console.log('initBegin call',)
        if (window["canvas"]) {
            var w = window["canvas"].width;
            var h = window["canvas"].height;
            this.real_height = h / w * 750;
        }
        this.init();
        this.boat.anchorOffsetX = this.boat.width / 2;
        this.boat.anchorOffsetY = this.boat.height / 2;
        this.boat.x += this.boat.width / 2;
        this.boat.y += this.boat.height / 2;
        //let font = RES.getRes('myfont2_fnt')
        var a = new egret.BitmapText();
        a.font = GameData.myFont;
        a.text = '112';
        a.x = 100;
        a.y = 100;
        this.addChild(a);
        var a1 = new egret.BitmapText();
        a1.font = GameData.myFont;
        a1.text = '1';
        a1.x = 100;
        a1.y = 200;
        this.gp_layer_2.addChild(a1);
        a1.scaleX = 2;
        a1.scaleY = 2;
        var a2 = new egret.BitmapText();
        a2.font = GameData.myFont;
        a2.text = '1m';
        a2.x = 100;
        a2.y = 300;
        this.gp_layer_2.addChild(a2);
        a2.scaleX = 2;
        a2.scaleY = 2;
        var a3 = new egret.BitmapText();
        a3.font = GameData.myFont;
        a3.text = '1111';
        a3.x = 100;
        a3.y = 300;
        this.gp_layer_2.addChild(a3);
        a3.scaleX = 2;
        a3.scaleY = 2;
        var a4 = new egret.BitmapText();
        a4.font = GameData.myFont;
        a4.text = '1m';
        a4.x = 100;
        a4.y = 300;
        this.gp_layer_2.addChild(a4);
        a4.scaleX = 2;
        a4.scaleY = 2;
        // let b: egret.BitmapText = new egret.BitmapText();
        // b.font = GameData.myFont;
        // b.text = '1111'
        // b.width = this.boat.width ;
        // b.height = this.boat.height;
        // b.anchorOffsetX = b.width / 2;
        // b.anchorOffsetY = b.height / 2;
        // this.gp_root.addChild(b);
        //  b.x = this.boat.x;
        // b.y = this.boat.y;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    // 点击屏幕
    StartUI.prototype.onTouchTap = function (e) {
        //console.log('onTouchTap call')
        //this.sendBullet();
    };
    // 在屏幕上滑动
    StartUI.prototype.onTouchBegin = function (e) {
        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        };
        //console.log('onTouchBegin call:', this.last_pos)
        this.state = 'game';
        this.sendStart();
    };
    // 在屏幕上滑动
    StartUI.prototype.onTouchMove = function (e) {
        var deltax = e.stageX - this.last_pos.x;
        var deltay = e.$stageY - this.last_pos.y;
        this.boat.x += deltax;
        this.boat.y += deltay;
        if (this.boat.x > 750)
            this.boat.x = 750;
        else if (this.boat.x < 0)
            this.boat.x = 0;
        if (this.boat.y < 0)
            this.boat.y = 0;
        if (this.boat.y > this.real_height)
            this.boat.y = this.real_height;
        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        };
        //console.log('onTouchMove call:', this.last_pos)
    };
    // 在屏幕上滑动
    StartUI.prototype.onTouchEnd = function (e) {
        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        };
        //console.log('onTouchEnd call:', this.last_pos)
        this.state = 'pause';
        this.sendEnd();
    };
    // 帧时间，逻辑循环从这里开始
    StartUI.prototype.onEnterFrame = function (e) {
        if (this.lastFramTime == 0)
            this.lastFramTime = egret.getTimer();
        var deltaTime = egret.getTimer() - this.lastFramTime;
        this.lastFramTime = egret.getTimer();
        if (this.state == 'game') {
            // 处于游戏状态
            this.game_time += deltaTime;
            if (this.cur_level_batch == -1) {
                this.enterNewBatch();
                return;
            }
            this.starCreate(deltaTime);
            this.starMove(deltaTime);
            this.checkAttack(deltaTime);
            this.checkBulletOver();
        }
        else {
            // 手离开屏幕，则
            // 1. 怪物的移动速度将为原来的20%
            // 2. 子弹速度不变，用于回收已经发出去的子弹
            //this.starMove(deltaTime * 0.2);
            this.starMove(deltaTime); // todo: test use,
            this.checkAttack(deltaTime);
            this.checkBulletOver();
        }
        this.checkEat();
        this.checkBomb();
        this.checkAddBloodOther(deltaTime);
        this.changeBloodLable();
        this.checkFx();
        //this.checkGameOver();
    };
    StartUI.prototype.checkGameOver = function () {
        var _this = this;
        if (!this.noBatch)
            return;
        for (var i = 0; i < this.star_fly.length; i++) {
            var star = this.star_fly[i];
            if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                return;
            }
        }
        if (this.wait_end)
            return;
        this.wait_end = true;
        // over
        var timer = new egret.Timer(5000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            _this.gameOver(true);
        }, this);
        timer.start();
    };
    // 进入新的一轮怪物
    StartUI.prototype.enterNewBatch = function () {
        //console.log('enterNewBatch...',this.cur_level_batch )
        if (this.cur_level_batch + 1 < GameData.level_configs.length) {
            this.game_time = 0;
            this.cur_level_batch++;
            this.cur_add_ons = 0;
            var batchInfo = GameData.level_configs[this.cur_level_batch];
            this.star_left_blood = batchInfo.blood;
            this.star_blood = this.star_left_blood;
            GameData.bloodGen(batchInfo);
        }
        else {
            this.noBatch = true;
        }
    };
    // 创建怪物, 只针对A轮
    StartUI.prototype.starCreate = function (deltaTime) {
        var _this = this;
        var last_game_time = this.game_time - deltaTime;
        var batch_info = GameData.level_configs[this.cur_level_batch];
        batch_info.init.forEach(function (conf) {
            if (conf.time <= _this.game_time && conf.time > last_game_time) {
                var starConfig = StarData.StarConfig[conf.id];
                var from = { x: 10, y: 0 };
                var to = { x: Tools.GetRandomNum(0, 20), y: 10 };
                // let to = { x: 10, y: 10 }
                // if(starConfig.id == 101){
                //     to.x=20;
                // }
                var dir = { x: to.x - from.x, y: to.y - from.y };
                _this.createStar(starConfig, conf.level, conf["blood"], { x: conf.x, y: 0 }, dir);
            }
        });
    };
    // 怪物移动
    StartUI.prototype.starMove = function (deltaTime) {
        // 星星飞
        var _loop_1 = function (i) {
            var star = this_1.star_fly[i];
            // 处理加速度, 根据生命周期，计算出当前的速度
            if (star.starConfig['add_speed']) {
                var addSpeed = star.starConfig['add_speed'];
                var totalTime_1 = 0;
                addSpeed.forEach(function (as) {
                    totalTime_1 += as.time;
                });
                var lifeTime = star.lifeTime % totalTime_1;
                var curTime = 0;
                var as = null;
                for (var i_1 = 0; i_1 < addSpeed.length; i_1++) {
                    as = addSpeed[i_1];
                    if (lifeTime < curTime + as.time && lifeTime >= curTime) {
                        break;
                    }
                    curTime += as.time;
                }
                if (as.wait == false) {
                    var dir = new egret.Point(star.speed.x, star.speed.y);
                    dir.normalize(as.add * deltaTime);
                    star.speed.x += dir.x;
                    star.speed.y += dir.y;
                }
            }
            // 生命周期判断
            star.lifeTime += deltaTime;
            if (star.life > 0 && star.lifeTime >= star.life) {
                // 生命周期结束
                this_1.removeStar(star);
                this_1.star_fly.splice(i, 1);
                this_1.clear_star_fly_ex(star);
                // 爆炸处理
                if (star.starConfig['bomb']) {
                    var scope = star.starConfig['bomb'].scope, type = star.starConfig['bomb'].scope;
                    this_1.bomb.push({
                        pos: {
                            x: star.model.x,
                            y: star.model.y,
                        },
                        scope: scope,
                        type: type,
                    });
                }
                return out_i_1 = i, "continue";
            }
            // 根据速度，计算当前的位置
            // 处理跟踪怪的位移
            var addspeedex = {
                x: 0,
                y: 0,
            };
            if (star.starConfig["follow"]) {
                var follow = star.starConfig["follow"];
                // 进入了区间
                if (star["follow_speed"] == undefined) {
                    star["follow_speed"] = { x: 0, y: 0 };
                }
                var follow_speed = star["follow_speed"];
                var dir = new egret.Point(this_1.boat.x - star.model.x, this_1.boat.y - star.model.y);
                if (dir.length < follow.scope) {
                    dir.normalize(follow.add_speed * deltaTime);
                    follow_speed.x += dir.x;
                    follow_speed.y += dir.y;
                }
                else {
                    follow_speed.x = 0;
                    follow_speed.y = 0;
                }
                addspeedex.x += follow_speed.x;
                addspeedex.y += follow_speed.y;
            }
            // 攻击导致的减速结束处理
            if (star.snowTime > 0) {
                star.model.x += (star.speed.x + addspeedex.x) * deltaTime * star.starConfig.attack_speed;
                star.model.y += (star.speed.y + addspeedex.y) * deltaTime * star.starConfig.attack_speed;
                if (star.snowTime < egret.getTimer()) {
                    star.snowTime = 0;
                    console.log('速度恢复：', star.speed);
                }
            }
            else {
                star.model.x += (star.speed.x + addspeedex.x) * deltaTime;
                star.model.y += (star.speed.y + addspeedex.y) * deltaTime;
            }
            // 反弹检测
            if (star.starConfig["rebound"]) {
                for (var j = 0; j < this_1.star_fly.length; j++) {
                    var star_other = this_1.star_fly[j];
                    if (star_other == star)
                        continue;
                    if (star_other.starConfig["group"] & StarData.CAN_CO) {
                        if (Tools.starCoTest(star.model, star_other.model)) {
                            if (star.model.x - star_other.model.x > 0) {
                                star.speed.x = Math.abs(star.speed.x);
                            }
                            else if (star.model.x - star_other.model.x < 0) {
                                star.speed.x = Math.abs(star.speed.x) * -1;
                            }
                            if (star.model.y - star_other.model.y > 0) {
                                star.speed.y = Math.abs(star.speed.y);
                            }
                            else if (star.model.x - star_other.model.x < 0) {
                                star.speed.y = Math.abs(star.speed.y) * -1;
                            }
                            // if (star.model.x - star_other.model.x < star.model.y - star_other.model.y) {
                            //     star.speed.x *= -1;
                            // } else if (star.model.x - star_other.model.x > star.model.y - star_other.model.y) {
                            //     star.speed.y *= -1;
                            // } else {
                            //     star.speed.x *= -1;
                            //     star.speed.y *= -1;
                            // }
                            break;
                        }
                    }
                }
            }
            // 位置根据屏幕进行调整
            if (star.model.y - star.model.height / 2 * star.model.scaleY < 0) {
                star.model.y = star.model.height / 2 * star.model.scaleY;
                star.speed.y *= -1;
            }
            if (star.model.x - star.model.width / 2 * star.model.scaleX < 0) {
                star.model.x = star.model.width / 2 * star.model.scaleX;
                star.speed.x *= -1;
            }
            if (star.model.x + star.model.width / 2 * star.model.scaleX > 750) {
                star.model.x = 750 - star.model.width / 2 * star.model.scaleX;
                star.speed.x *= -1;
            }
            if (star.model.y - star.model.height / 2 * star.model.scaleY >= this_1.real_height) {
                star.model.y = 0;
            }
            // 体型随时间进行变化
            if (star.starConfig["scale_info"]) {
                var scale_info = star.starConfig['scale_info'];
                var totalTime_2 = 0;
                scale_info.forEach(function (as) {
                    totalTime_2 += as.time;
                });
                var lifeTime = star.lifeTime % totalTime_2;
                var curTime = 0;
                var as = null;
                var lastscale = {
                    scaleX: 1,
                    scaleY: 1,
                };
                for (var i_2 = 0; i_2 < scale_info.length; i_2++) {
                    as = scale_info[i_2];
                    if (lifeTime < curTime + as.time && lifeTime >= curTime) {
                        break;
                    }
                    curTime += as.time;
                    lastscale.scaleX = as.scaleX;
                    lastscale.scaleY = as.scaleY;
                }
                var r = (lifeTime - curTime) / as.time;
                if (as.wait == false) {
                    star.model.scaleX = lastscale.scaleX * r + as.scaleX * (1 - r);
                    star.model.scaleY = lastscale.scaleY * r + as.scaleY * (1 - r);
                    star.model.scaleX *= star.scale;
                    star.model.scaleY *= star.scale;
                    console.log('scale:', r, star.model.scaleX, star.model.scaleY, lastscale, as);
                }
            }
            if (star.starConfig["add_blood_self"]) {
                var addBlood = star.starConfig["add_blood_self"];
                if (star['add_blood_info'] == undefined) {
                    star['add_blood_info'] = {
                        times: 0,
                        last_add_time: egret.getTimer(),
                    };
                }
                var addBloodInfo = star['add_blood_info'];
                if (addBloodInfo.last_add_time + 1000 <= egret.getTimer() && addBloodInfo.times < addBlood.times) {
                    addBloodInfo.times++;
                    addBloodInfo.last_add_time = egret.getTimer();
                    star.blood += addBlood.speed * deltaTime * star["totalBlood"];
                    // todo, 播放加血特效
                }
            }
            // 移动过程中创建新的怪物
            if (star.starConfig["create_new_star"]) {
                var createInfo = star.starConfig["create_new_star"];
                if (createInfo.time > 0) {
                    if (star['last_create']) {
                        if (egret.getTimer() - star['last_create'] >= createInfo.time) {
                            var sconfig = StarData.StarConfig[createInfo.id];
                            this_1.createStar(sconfig, createInfo.level, 0, {
                                x: star.model.x,
                                y: star.model.y
                            }, { x: 0, y: 0 }, createInfo);
                            star['last_create'] = egret.getTimer();
                        }
                    }
                    else {
                        star['last_create'] = egret.getTimer();
                    }
                }
            }
            i++;
            out_i_1 = i;
        };
        var this_1 = this, out_i_1;
        for (var i = 0; i < this.star_fly.length;) {
            _loop_1(i);
            i = out_i_1;
        }
    };
    StartUI.prototype.removeStar = function (star) {
        star && star.model && star.model.parent && star.model.parent.removeChild(star.model);
        star && star.label_blood && star.label_blood.parent && star.label_blood.parent.removeChild(star.label_blood);
        star && star.label_name && star.label_name.parent && star.label_name.parent.removeChild(star.label_name);
    };
    // 检测黑洞
    StartUI.prototype.checkEat = function () {
        //
        var _this = this;
        this.star_fly_eat.forEach(function (e) {
            //this.addChild(e.model);
            //if(e.label_blood) this.addChild(e.label_blood);
            var eatInfo = e.starConfig["eat"];
            for (var i = 0; i < _this.star_fly.length; i++) {
                var star = _this.star_fly[i];
                if (star.starConfig["eat"]) {
                    continue;
                }
                if ((star.starConfig["group"] & StarData.CAN_ATTACK) && Tools.eatTest(e.model, star.model)) {
                    e.blood += e.blood * eatInfo.blood;
                    e.model.scaleX += eatInfo.scale;
                    e.model.scaleY += eatInfo.scale;
                    // 黑洞吞噬怪物，直接消失，不分裂
                    _this.removeStar(star);
                    _this.star_fly.splice(i, 1);
                    _this.clear_star_fly_ex(star);
                    _this.star_left_blood -= (star.totalBlood + star.subBlood);
                    if (_this.star_left_blood / _this.star_blood < 0.2) {
                        _this.enterNewBatch();
                    }
                    _this.checkGameOver();
                    i--;
                }
            }
        });
    };
    StartUI.prototype.checkBomb = function () {
        var _this = this;
        this.bomb.forEach(function (bomb) {
            if (bomb.type == 1) {
                for (var i = 0; i < _this.star_fly.length; i++) {
                    var star = _this.star_fly[i];
                    if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                        var dir = new egret.Point(star.model.x - bomb.pos.x, star.model.y - bomb.pos.y);
                        if (dir.length < bomb.scope) {
                            // 被炸掉
                            _this.removeStar(star);
                            _this.star_fly.splice(i, 1);
                            _this.clear_star_fly_ex(star);
                            i--;
                        }
                    }
                }
            }
        });
        this.bomb = [];
    };
    StartUI.prototype.clear_star_fly_ex = function (star) {
        for (var i = 0; i < this.star_fly_eat.length; i++) {
            if (this.star_fly_eat[i] == star) {
                this.star_fly_eat.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.star_add_blood.length; i++) {
            if (this.star_add_blood[i] == star) {
                this.star_add_blood.splice(i, 1);
            }
        }
    };
    // 攻击检测
    StartUI.prototype.checkAttack = function (deltaTime) {
        // 子弹飞，并检测是否打到boat
        var speed = GameData.main_weapon.bullet_speed;
        var dis = speed * deltaTime;
        var boat_rect = new egret.Rectangle(this.boat.x - this.boat.width / 2, this.boat.y - this.boat.height / 2, this.boat.width, this.boat.height);
        var game_over = false;
        // 先计算star的碰撞盒子
        for (var i = 0; i < this.star_fly.length; i++) {
            var model = this.star_fly[i].model;
            var rect = new egret.Rectangle(model.x - model.width / 2 * model.scaleX, model.y - model.height / 2 * model.scaleY, model.width * model.scaleX, model.height * model.scaleY);
            this.star_fly[i].my_rect = rect;
            if (boat_rect.intersects(rect)) {
                game_over = true;
            }
        }
        if (game_over) {
            //return this.gameOver(false);
        }
        // 遍历子弹，看是否命中，一次只命中一个？
        for (var i = 0; i < this.bullet_fly.length;) {
            var bullet = this.bullet_fly[i].model;
            bullet.y -= dis;
            var rect = new egret.Rectangle(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height + dis);
            var hit = false;
            for (var j = 0; j < this.star_fly.length; j++) {
                var star = this.star_fly[j];
                if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                    if (rect.intersects(star.my_rect)) {
                        star.blood -= GameData.main_weapon.attack;
                        if (star.blood < 0) {
                            star.blood = 0;
                        }
                        // 播放特效
                        star.need_fx = true;
                        hit = true;
                    }
                }
            }
            if (hit) {
                bullet.parent && bullet.parent.removeChild(bullet);
                this.bullet_idle.push(bullet);
                this.bullet_fly.splice(i, 1);
            }
            else {
                i++;
            }
        }
        for (var i = 0; i < this.star_fly.length;) {
            var star = this.star_fly[i];
            if (star.need_fx) {
                star.need_fx = false;
                if (star.tw) {
                    egret.Tween.removeTweens(star.model);
                    star.tw = null;
                }
                if (star.blood <= 0) {
                    // 被打掉
                    this.star_fly.splice(i, 1);
                    this.clear_star_fly_ex(star);
                }
                else {
                    i++;
                }
                this.starPlayFx(star);
            }
            else {
                i++;
            }
        }
    };
    // 显示血量和星球名称
    StartUI.prototype.changeBloodLable = function () {
        this.star_fly.forEach(function (star) {
            if (star && star.label_blood) {
                star.label_blood.text = myMath.getString(star.blood);
                star.label_blood.x = star.model.x;
                star.label_blood.y = star.model.y;
                star.label_blood.anchorOffsetX = star.label_blood.width / 2;
                star.label_blood.anchorOffsetY = star.label_blood.height / 2;
                star.label_blood.scaleX = star.model.scaleX;
                star.label_blood.scaleY = star.model.scaleY;
            }
            // if (star && star.label_name) {
            //
            //     star.label_name.x = star.model.x;
            //     star.label_name.y = star.model.y - star.model.height / 2 * star.model.scaleY - star.label_name.height / 2;
            //
            //     // star.label_name.text = '' + Math.floor(star.model.x) + '|' + Math.floor(star.model.y);
            //     // star.label_name.anchorOffsetY = star.label_name.height / 2;
            //     // star.label_name.anchorOffsetX = star.label_name.width / 2;
            // }
        });
    };
    // 创建一只怪
    StartUI.prototype.createStar = function (starConfig, level, blood, pos, dir, info) {
        //console.log("createStar:", level, blood, pos, dir, info)
        var model = ResTools.createBitmapByName(starConfig.model);
        var speed = new egret.Point(dir.x, dir.y);
        speed.normalize(starConfig.speed);
        model.anchorOffsetX = model.width / 2;
        model.anchorOffsetY = model.height / 2;
        model.x = pos.x;
        model.y = pos.y;
        if (info) {
            model.scaleX = info.scaleX;
            model.scaleY = info.scaleY;
            egret.Tween.get(model).to({ scaleX: info.scale.scaleX, scaleY: info.scale.scaleY }, info.scale.time);
        }
        var subBlood = 0;
        if (level > 1)
            subBlood = Math.ceil(Tools.GetRandomNum(30, 80) / 100 * blood);
        blood -= subBlood;
        //this.addChild(model);
        var layer = this.gp_layer[starConfig.layer || 0];
        // if (layer != this.gp_layer_2) {
        //     console.log('not gplayer2:', starConfig.layer || 0);
        // }
        layer.addChild(model);
        //this.gp_layer_2.addChild(model);
        //let blood = GameData.getBlood(level);
        var star = {
            lifeTime: 0,
            model: model,
            starConfig: starConfig,
            level: level,
            speed: speed,
            snowTime: 0,
            totalBlood: blood,
            subBlood: subBlood,
            blood: blood,
            //label_blood: null,
            life: 0,
            scale: 0.3 + 0.7 * level / 6,
        };
        if (level == 0) {
            star.scale = 1;
        }
        if (blood > 0) {
            var label_blood = new egret.BitmapText();
            label_blood.font = GameData.myFont;
            label_blood.text = myMath.getString(blood);
            //let label_blood = new eui.Label(myMath.getString(blood));
            //label_blood.size = 60;
            label_blood.x = model.x;
            label_blood.y = model.y;
            label_blood.anchorOffsetX = label_blood.width / 2;
            label_blood.anchorOffsetY = label_blood.height / 2;
            var layer_1 = this.gp_layer[starConfig.layer || 0];
            layer_1.addChild(label_blood);
            //this.addChild(label_blood);
            //this.gp_layer_3.addChild(label_blood);
            star["label_blood"] = label_blood;
        }
        // let label_name = new eui.Label(starConfig['name']);
        // label_name.size = 20;
        // label_name.anchorOffsetX = label_name.width / 2;
        // label_name.anchorOffsetY = label_name.height / 2;
        // label_name.x = model.x;
        // label_name.y = model.y - model.height / 2 * model.scaleY - label_name.height / 2;
        // this.gp_layer[starConfig.layer || 0].addChild(label_name);
        // star["label_name"] = label_name;
        star.model.scaleX = star.scale;
        star.model.scaleY = star.scale;
        if (info) {
            star.life = info.life;
        }
        this.star_fly.push(star);
        if (starConfig["eat"]) {
            this.star_fly_eat.push(star);
        }
        if (starConfig["fx"]) {
            var fxInfo = starConfig["fx"];
            var s = FxMgr.getFx(fxInfo.texture, fxInfo.json);
            // let t = RES.getRes(fxInfo.texture);
            // let j = RES.getRes(fxInfo.json);
            // let s = new particle.GravityParticleSystem(t, j);
            var myFx = {
                star: star,
                model: s,
                info: fxInfo,
            };
            this.fx.push(myFx);
            this.gp_layer_1.addChild(s);
            s.start();
            s.emitterX = 0;
            s.emitterY = 0;
            s.x = star.model.x;
            s.y = star.model.y;
            star['fx_data'] = myFx;
        }
        if (starConfig["add_blood_other"]) {
            this.star_add_blood.push(star);
        }
    };
    // 特效跟随
    StartUI.prototype.checkFx = function () {
        this.fx.forEach(function (f) {
            if (f.star) {
                f.model.x = f.star.model.x;
                f.model.y = f.star.model.y;
                f.model.rotation = myMath.angle(f.star.speed);
            }
        });
    };
    StartUI.prototype.checkAddBloodOther = function (deltaTime) {
        var _this = this;
        if (this.last_add_boold_time + deltaTime > 1000) {
            this.last_add_boold_time = 0;
            this.star_add_blood.forEach(function (star_add) {
                _this.star_fly.forEach(function (star) {
                    if ((star.starConfig['group'] & StarData.CAN_ATTACK) && Tools.starCoTest(star_add.model, star.model)) {
                        //console.log('addbloodother:', star.model.x, star.model.y, star_add.model.x, star_add.model.y, this.star_add_blood.length)
                        _this.addStarBlood(star, star_add.starConfig['add_blood_other']);
                    }
                });
            });
        }
        else {
            this.last_add_boold_time += deltaTime;
        }
    };
    StartUI.prototype.addStarBlood = function (star, ratio) {
        star.blood += star["totalBlood"] * ratio;
    };
    // 播放打击特效
    StartUI.prototype.starPlayFx = function (star) {
        var _this = this;
        // 命中减速效果，只是设置个时间
        star.snowTime = star.starConfig.snow_time + egret.getTimer();
        // 命中击退效果
        if (GameData.item['jitui']) {
            star.model.y -= GameData.item['jitui'].up;
            if (star.model.y < 0)
                star.model.y = 0;
        }
        // 死亡效果，包括分裂，补充库的处理
        if (star.blood <= 0) {
            star.tw = egret.Tween.get(star.model);
            star.tw.to({ scaleX: 1.1, scaleY: 1.1 }, 300).to({ scaleX: 0.9, scaleY: 0.9 }, 300).call(function () {
                //console.log('starPlayEx:', star.blood)
                // if (star.level > 1) {
                //     // 生成2个新的star
                //     let hitpos = { x: this.boat.x, y: star.model.y + star.model.height }
                //     let pos1 = { x: star.model.x - star.model.width / 2, y: star.model.y }
                //     let pos2 = { x: star.model.x + star.model.width / 2, y: star.model.y }
                //
                //     let dir1: egret.Point = new egret.Point(pos1.x - hitpos.x, pos1.y - hitpos.y)
                //     let dir2: egret.Point = new egret.Point(pos2.x - hitpos.x, pos2.y - hitpos.y)
                //
                //     let blood1 = Math.ceil(star.subBlood * Tools.GetRandomNum(30, 70) / 100);
                //     let blood2 = star.subBlood - blood1;
                //
                //     if (blood1 <= 0) blood1 = 1;
                //     if (blood2 <= 0) blood2 = 1;
                //     this.createStar(star.starConfig, star.level - 1, blood1, pos1, dir1)
                //     this.createStar(star.starConfig, star.level - 1, blood2, pos2, dir2)
                // }
                // 如果补充库中还有库存，则生成一个
                var batch_info = GameData.level_configs[_this.cur_level_batch];
                if (_this.cur_add_ons < batch_info.add_ons.length) {
                    var conf = batch_info.add_ons[_this.cur_add_ons];
                    var starConfig = StarData.StarConfig[conf.id];
                    var from = { x: 10, y: 0 };
                    var to = { x: Tools.GetRandomNum(0, 20), y: 10 };
                    var dir = { x: to.x - from.x, y: to.y - from.y };
                    _this.createStar(starConfig, conf.level, conf["blood"], { x: conf.x, y: 0 }, dir);
                    _this.cur_add_ons++;
                }
                _this.removeStar(star);
                _this.star_left_blood -= star.totalBlood;
                if (_this.star_left_blood / _this.star_blood < 0.2) {
                    _this.enterNewBatch();
                }
                if (star.starConfig["create_new_star"]) {
                    var createInfo = star.starConfig["create_new_star"];
                    if (createInfo.time == 0) {
                        var sconfig = StarData.StarConfig[createInfo.id];
                        _this.createStar(sconfig, createInfo.level, 0, {
                            x: star.model.x,
                            y: star.model.y
                        }, { x: 0, y: 0 }, createInfo);
                    }
                }
                star.tw = null;
                _this.checkGameOver();
            });
        }
    };
    StartUI.prototype.checkBulletOver = function () {
        for (var i = 0; i < this.bullet_fly.length;) {
            var bullet = this.bullet_fly[i].model;
            if (bullet.y < 0 - bullet.height / 2) {
                bullet.parent && bullet.parent.removeChild(bullet);
                this.bullet_idle.push(bullet);
                this.bullet_fly.splice(i, 1);
            }
            else {
                i++;
            }
        }
    };
    // 开始发送子弹
    StartUI.prototype.sendStart = function () {
        var _this = this;
        this.sendBullet();
        if (this.send_timer == null) {
            this.send_timer = new egret.Timer(GameData.main_weapon.bullet_rate, 10);
            this.send_timer.addEventListener(egret.TimerEvent.TIMER, this.sendBullet, this);
            this.send_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                //console.log('timer end...')
                _this.send_timer = null;
                _this.sendStart();
            }, this);
            this.send_timer.start();
        }
    };
    // 子弹发送结束
    StartUI.prototype.sendEnd = function () {
        if (this.send_timer) {
            this.send_timer.stop();
            this.send_timer = null;
        }
    };
    // 发出一颗子弹
    StartUI.prototype.sendBullet = function () {
        var count = GameData.bulletList[this.send_index];
        this.send_index++;
        if (this.send_index == GameData.bulletList.length) {
            this.send_index = 0;
        }
        //console.log('sendBullet', count)
        for (var i = 0; i < count; i++) {
            var bullet = this.createBullet();
            bullet.anchorOffsetX = bullet.width / 2;
            bullet.anchorOffsetY = bullet.height / 2;
            bullet.x = this.boat.x; //this.boat.x - (count - 1 - 2 * i) * bullet.width/2;
            bullet.y = this.boat.y - this.boat.height / 2; //this.boat.y - this.boat.height / 2 - bullet.height / 2;
            this.gp_layer_4.addChild(bullet);
            egret.Tween.get(bullet).to({ x: this.boat.x - (count - 1 - 2 * i) * bullet.width / 2 }, 100);
            this.bullet_fly.push({
                model: bullet,
            });
        }
    };
    // 创建一个子弹模型
    StartUI.prototype.createBullet = function () {
        if (this.bullet_idle.length) {
            var bullet_1 = this.bullet_idle.shift();
            return bullet_1;
        }
        var bullet = ResTools.createBitmapByName('bomb1');
        return bullet;
    };
    // 游戏结束检测
    StartUI.prototype.gameOver = function (success) {
        this.state = 'pause';
        GameData.cur_level++;
        this.init();
    };
    // 复活
    StartUI.prototype.doRelife = function () {
    };
    //
    StartUI.prototype.showResult = function () {
    };
    return StartUI;
}(eui.Component));
__reflect(StartUI.prototype, "StartUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=StartUI.js.map