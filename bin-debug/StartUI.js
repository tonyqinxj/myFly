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
        _this.star_blood = 0; // 当前波怪物的总血量
        _this.star_left_blood = 0; // 当前波怪物剩余的血量之和，当少于20％的时候，触发下一波怪物的产生
        _this.real_height = 1624; // 屏幕使用高度
        _this.last_pos = { x: 0, y: 0 }; // 用于主机移动的辅助，记录上一次的位置，用来算每帧之间的相对位置
        _this.send_index = 0; // 主机火力辅助变量，控制一次发送几个子弹
        _this.send_timer = null; // 主机子弹发射定时器
        _this.bullet_fly = new Array(); // 飞行中的有效子弹
        _this.bullet_idle = new Array(); // 无效子弹，形成了一个子弹内存池
        _this.timer_relife = null; // 死亡复活定时器
        _this.timer_left = 3; // 复活定时器辅助变量
        return _this;
    }
    StartUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    StartUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.initBegin();
    };
    StartUI.prototype.init = function () {
        //console.log('init call',)
        this.state = 'init';
        this.gp_setting && this.gp_setting.parent && this.gp_setting.parent.removeChild(this.gp_setting);
        this.gp_restart_form && this.gp_restart_form.parent && this.gp_restart_form.parent.removeChild(this.gp_restart_form);
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
    };
    StartUI.prototype.initBegin = function () {
        var _this = this;
        //console.log('initBegin call',)
        if (window["canvas"]) {
            var w = window["canvas"].width;
            var h = window["canvas"].height;
            this.real_height = h / w * 750;
        }
        this.init();
        this.txt_bullet_speed.text = '' + GameData.main_weapon.bullet_speed;
        this.txt_bullet_rate.text = '' + GameData.main_weapon.bullet_rate;
        this.bt_use.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            try {
                if (_this.bt_use.label == '修改') {
                    _this.bt_use.label = '应用';
                    _this.gp_root.x = 0;
                    _this.gp_root.addChild(_this.gp_setting);
                }
                else {
                    GameData.main_weapon.bullet_speed = Number(_this.txt_bullet_speed.text);
                    GameData.main_weapon.bullet_rate = Number(_this.txt_bullet_rate.text);
                    _this.sendEnd();
                    _this.bt_use.label = '修改';
                    _this.gp_root.removeChild(_this.gp_setting);
                }
            }
            catch (e) {
                //console.log('.......')
            }
        }, this);
        this.bt_close_setting.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.gp_setting.parent && _this.gp_setting.parent.removeChild(_this.gp_setting);
            _this.bt_use.label = '修改';
        }, this);
        this.bt_reopen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.init, this);
        this.boat.anchorOffsetX = this.boat.width / 2;
        this.boat.anchorOffsetY = this.boat.height / 2;
        this.boat.x += this.boat.width / 2;
        this.boat.y += this.boat.height / 2;
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
        if (this.state == 'game') {
            // 处于游戏状态
            if (this.lastFramTime == 0)
                this.lastFramTime = egret.getTimer();
            var deltaTime = egret.getTimer() - this.lastFramTime;
            this.lastFramTime = egret.getTimer();
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
            if (this.lastFramTime == 0)
                this.lastFramTime = egret.getTimer();
            var deltaTime = egret.getTimer() - this.lastFramTime;
            this.lastFramTime = egret.getTimer();
            //this.starMove(deltaTime * 0.2);
            this.starMove(deltaTime); // todo: test use,
            this.checkAttack(deltaTime);
            this.checkBulletOver();
        }
    };
    // 进入新的一轮怪物
    StartUI.prototype.enterNewBatch = function () {
        var _this = this;
        //console.log('enterNewBatch...',this.cur_level_batch )
        if (this.cur_level_batch + 1 < GameData.level_configs.length) {
            this.game_time = 0;
            this.cur_level_batch++;
            this.cur_add_ons = 0;
            var batchInfo = GameData.level_configs[this.cur_level_batch];
            batchInfo.init.forEach(function (conf) {
                _this.star_left_blood += GameData.getTotalBlood(conf.level);
            });
            batchInfo.add_ons.forEach(function (conf) {
                _this.star_left_blood += GameData.getTotalBlood(conf.level);
            });
            this.star_blood = this.star_left_blood;
            GameData.bloodGen(batchInfo);
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
                this_1.removeChild(star.model);
                this_1.removeChild(star.label_blood);
                this_1.star_fly.splice(i, 1);
                return { value: void 0 };
            }
            // 根据速度，计算当前的位置
            // 攻击导致的减速结束处理
            if (star.snowTime > 0) {
                star.model.x += star.speed.x * deltaTime * star.starConfig.attack_speed;
                star.model.y += star.speed.y * deltaTime * star.starConfig.attack_speed;
                if (star.snowTime < egret.getTimer()) {
                    star.snowTime = 0;
                    console.log('速度恢复：', star.speed);
                }
            }
            else {
                star.model.x += star.speed.x * deltaTime;
                star.model.y += star.speed.y * deltaTime;
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
            // 血量的位置，跟随怪物
            star.label_blood.x = star.model.x;
            star.label_blood.y = star.model.y;
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
                    ;
                    star.model.scaleX = lastscale.scaleX * r + as.scaleX * (1 - r);
                    star.model.scaleY = lastscale.scaleY * r + as.scaleY * (1 - r);
                    console.log('scale:', r, star.model.scaleX, star.model.scaleY, lastscale, as);
                }
            }
            // 移动过程中创建新的怪物
            if (star.starConfig["create_new_star"]) {
                if (star['last_create']) {
                    if (egret.getTimer() - star['last_create'] >= star.starConfig["create_new_star"].time) {
                        var sconfig = StarData.StarConfig[star.starConfig["create_new_star"].id];
                        this_1.createStar(sconfig, star.starConfig["create_new_star"].level, 10000, {
                            x: star.model.x,
                            y: star.model.y
                        }, { x: 0, y: 0 }, star.starConfig["create_new_star"]);
                        star['last_create'] = egret.getTimer();
                    }
                }
                else {
                    star['last_create'] = egret.getTimer();
                }
            }
            i++;
            out_i_1 = i;
        };
        var this_1 = this, out_i_1;
        for (var i = 0; i < this.star_fly.length;) {
            var state_1 = _loop_1(i);
            i = out_i_1;
            if (typeof state_1 === "object")
                return state_1.value;
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
            var star = this.star_fly[i].model;
            var rect = new egret.Rectangle(star.x - star.width / 2, star.y - star.height / 2, star.width, star.height);
            this.star_fly[i].my_rect = rect;
            if (boat_rect.intersects(rect)) {
                game_over = true;
            }
        }
        if (game_over) {
            //return this.gameOver();
        }
        // 遍历子弹，看是否命中，一次只命中一个？
        for (var i = 0; i < this.bullet_fly.length;) {
            var bullet = this.bullet_fly[i].modle;
            bullet.y -= dis;
            var rect = new egret.Rectangle(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height + dis);
            var hit = false;
            for (var j = 0; j < this.star_fly.length; j++) {
                var star = this.star_fly[j];
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
                star.label_blood.text = '' + star.blood;
                star.label_blood.anchorOffsetX = star.label_blood.width / 2;
                star.label_blood.anchorOffsetY = star.label_blood.height / 2;
                if (star.tw) {
                    egret.Tween.removeTweens(star.model);
                    star.tw = null;
                }
                if (star.blood <= 0) {
                    this.star_fly.splice(i, 1);
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
    // 创建一只怪
    StartUI.prototype.createStar = function (starConfig, level, blood, pos, dir, info) {
        console.log("createStar:", level, blood, pos, dir, info);
        var model = ResTools.createBitmapByName(starConfig.modle);
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
        this.addChild(model);
        //let blood = GameData.getBlood(level);
        var label_blood = new eui.Label('' + blood);
        label_blood.x = model.x;
        label_blood.y = model.y;
        label_blood.anchorOffsetX = label_blood.width / 2;
        label_blood.anchorOffsetY = label_blood.height / 2;
        this.addChild(label_blood);
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
            label_blood: label_blood,
            life: 0
        };
        if (info) {
            star.life = info.life;
        }
        this.star_fly.push(star);
    };
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
                if (star.level > 1) {
                    // 生成2个新的star
                    var hitpos = { x: _this.boat.x, y: star.model.y + star.model.height };
                    var pos1 = { x: star.model.x - star.model.width / 2, y: star.model.y };
                    var pos2 = { x: star.model.x + star.model.width / 2, y: star.model.y };
                    var dir1 = new egret.Point(pos1.x - hitpos.x, pos1.y - hitpos.y);
                    var dir2 = new egret.Point(pos2.x - hitpos.x, pos2.y - hitpos.y);
                    var blood1 = Math.ceil(star.subBlood * Tools.GetRandomNum(30, 70) / 100);
                    var blood2 = star.subBlood - blood1;
                    _this.createStar(star.starConfig, star.level - 1, blood1, pos1, dir1);
                    _this.createStar(star.starConfig, star.level - 1, blood2, pos2, dir2);
                }
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
                _this.removeChild(star.model);
                _this.removeChild(star.label_blood);
                _this.star_left_blood -= star.totalBlood;
                if (_this.star_left_blood / _this.star_blood < 0.2) {
                    _this.enterNewBatch();
                }
                star.tw = null;
            });
        }
    };
    StartUI.prototype.checkBulletOver = function () {
        for (var i = 0; i < this.bullet_fly.length;) {
            var bullet = this.bullet_fly[i].modle;
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
            this.addChild(bullet);
            egret.Tween.get(bullet).to({ x: this.boat.x - (count - 1 - 2 * i) * bullet.width / 2 }, 100);
            this.bullet_fly.push({
                modle: bullet,
            });
        }
    };
    // 创建一个子弹模型
    StartUI.prototype.createBullet = function () {
        if (this.bullet_idle.length) {
            var bullet_1 = this.bullet_idle.shift();
            return bullet_1;
        }
        var bullet = ResTools.createBitmapByName('bomb1_png');
        return bullet;
    };
    // 游戏结束检测
    StartUI.prototype.gameOver = function () {
        var _this = this;
        this.state = 'pause';
        this.gp_root.addChild(this.gp_restart_form);
        this.timer_left = 3;
        this.txt_relife_time.text = '' + this.timer_left;
        this.timer_relife = new egret.Timer(1000, 3);
        this.timer_relife.addEventListener(egret.TimerEvent.TIMER, function () {
            _this.timer_left--;
            _this.txt_relife_time.text = '' + _this.timer_left;
        }, this);
        this.timer_relife.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            _this.showResult();
        }, this);
        this.timer_relife.start();
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