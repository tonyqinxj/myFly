class StartUI extends eui.Component implements eui.UIComponent {
    // reopen 需要处理的变量
    private state: string = 'init'; // 'game'
    private lastFramTime = 0;	// 上一帧的执行时间
    private game_time: number = 0;	// 游戏时间，每一波怪开始的时候刷新为0，主要用来生成怪物
    private cur_level_batch = -1; // 当前出去第几批次, -1 表示还没开始
    private cur_add_ons = 0; // 当前已经补充了几个怪物
    private star_fly = [];	// 有效的怪物，star就是怪
    private star_fly_eat = []; // 黑洞列表, 也在star_fly中
    private star_blood = 0; // 当前波怪物的总血量
    private star_left_blood = 0; // 当前波怪物剩余的血量之和，当少于20％的时候，触发下一波怪物的产生

    private fx = []; // 特效
    private star_add_blood = []; // 给别人加血


    // ui components
    private gp_root: eui.Group; // 根层级

    private gp_layer_1: eui.Group;// 最底层，放特效等
    private gp_layer_2: eui.Group;// 普通星球
    private gp_layer_3: eui.Group;// 特殊星球，比如黑洞
    private gp_layer_4: eui.Group;// 子弹层级

    private gp_layer = [];

    private boat: eui.Image;

    private real_height: number = 1624;	// 屏幕使用高度

    private last_pos: any = {x: 0, y: 0}	// 用于主机移动的辅助，记录上一次的位置，用来算每帧之间的相对位置

    private send_index = 0;	// 主机火力辅助变量，控制一次发送几个子弹
    private send_timer: egret.Timer = null;	// 主机子弹发射定时器

    private bullet_fly: Array<any> = new Array<any>();	// 飞行中的有效子弹
    private bullet_idle: Array<egret.Bitmap> = new Array<egret.Bitmap>();	// 无效子弹，形成了一个子弹内存池

    private timer_relife: egret.Timer = null;	// 死亡复活定时器
    private timer_left: number = 3;	// 复活定时器辅助变量

    private bomb = [];

    private weapon: Weapon = null;   // 僚机

    public constructor() {
        super();
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
        super.childrenCreated();

        GameData.initFont();
        MonsterTools.itemPanel = this.gp_layer_2;
        //FxMgr.init();
        this.initBegin();

    }

    private init(): void {

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

        this.star_fly.forEach(star => {
            star.model && star.model.parent && star.model.parent.removeChild(star.model);
            star.label_blood && star.label_blood.parent && star.label_blood.parent.removeChild(star.label_blood);
        })
        this.star_fly = [];
        this.star_fly_eat = [];
        this.star_add_blood = [];
        this.bomb = [];

        if (this.weapon) {
            this.weapon.stop();
        }

        this.weapon = WingMan.createWeapon(this.gp_layer_4, this.boat, GameData.sub_weapon.id, GameData.sub_weapon.attack, GameData.sub_weapon.strength);

    }

    private system: particle.GravityParticleSystem;

    private initBegin(): void {


        this.gp_layer.push(this.gp_layer_1);
        this.gp_layer.push(this.gp_layer_2);
        this.gp_layer.push(this.gp_layer_3);
        this.gp_layer.push(this.gp_layer_4);
        //console.log('initBegin call',)
        if (window["canvas"]) {
            let w = window["canvas"].width;
            let h = window["canvas"].height;
            this.real_height = h / w * 750;
        }
        this.init();

        this.boat.anchorOffsetX = this.boat.width / 2;
        this.boat.anchorOffsetY = this.boat.height / 2;
        this.boat.x += this.boat.width / 2;
        this.boat.y += this.boat.height / 2;


        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);


        let anm:myTestAnm = new myTestAnm();
        anm.x = 375;
        anm.y = 600;
        anm.rotation = 180;
    
        this.addChild(anm);
        anm.play();


        // let kkk=ResTools.createBitmapByName('ihitspeed')
        // kkk.x = 350;
        // kkk.y = 300;

        // this.addChild(kkk);
    }

    // 点击屏幕
    private onTouchTap(e: egret.TouchEvent): void {
        //console.log('onTouchTap call')
        //this.sendBullet();
    }

    // 在屏幕上滑动
    private onTouchBegin(e: egret.TouchEvent): void {
        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        }

        //console.log('onTouchBegin call:', this.last_pos)
        this.state = 'game';
        this.sendStart();
    }

    // 在屏幕上滑动
    private onTouchMove(e: egret.TouchEvent): void {
        let deltax = e.stageX - this.last_pos.x;
        let deltay = e.$stageY - this.last_pos.y;

        let ratio = 1
        let item = MonsterTools.getItem('reduceBoatMove');
        if(item) ratio = item['config']['ratio'];
        this.boat.x += deltax * ratio;
        this.boat.y += deltay * ratio;

        if (this.boat.x > 750) this.boat.x = 750;
        else if (this.boat.x < 0) this.boat.x = 0;

        if (this.boat.y < 0) this.boat.y = 0;
        if (this.boat.y > this.real_height) this.boat.y = this.real_height

        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        }

        //console.log('onTouchMove call:', this.last_pos)
    }

    // 在屏幕上滑动
    private onTouchEnd(e: egret.TouchEvent): void {
        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        }

        //console.log('onTouchEnd call:', this.last_pos)

        this.state = 'pause';
        this.sendEnd();
    }

    // 帧时间，逻辑循环从这里开始
    private onEnterFrame(e: egret.Event): void {

        if (this.state == 'init') return;

        if (this.lastFramTime == 0) this.lastFramTime = egret.getTimer();
        let deltaTime = egret.getTimer() - this.lastFramTime;
        this.lastFramTime = egret.getTimer();
        if (deltaTime < 10 || deltaTime > 500) return;

        let deltaTime_snow = deltaTime;

        if (this.state == 'game') {
            // 处于游戏状态
            this.game_time += deltaTime;
            if (this.cur_level_batch == -1) {
                this.enterNewBatch();
                return;
            }
            // 生成怪物
            this.starCreate(deltaTime);
        } else {
            // 手离开屏幕，则
            // 1. 怪物的移动速度将为原来的20%
            // 2. 子弹速度不变，用于回收已经发出去的子弹
            deltaTime_snow = deltaTime ;
        }

        this.starMove(deltaTime_snow);   // 怪物移动，包括减速等逻辑
        this.checkBulle(deltaTime);    // 主武器子弹逻辑

        this.weapon && this.weapon.update(deltaTime, deltaTime_snow, this.star_fly); // 僚机
        this.checkJitui();  // 击退
        this.checkEat();    // 黑洞
        this.checkBomb();   // 炸弹
        this.checkAddBloodOther(deltaTime); // 给别人加血
        this.checkStarDie();   // 检查怪物死亡(blood<=0)
        this.checkScale();  // 处理体型
        this.changeBloodLable();
        this.checkFx(); // 拖尾等伴随特效
        MonsterTools.updateItems(deltaTime_snow);

        this.checkItem(deltaTime_snow);


        //this.checkGameOver();
    }

    private noBatch = false; // 无怪可刷
    private wait_end = false;

    private checkGameOver(): void {
        if (!this.noBatch) return;


        for (let i = 0; i < this.star_fly.length; i++) {
            let star = this.star_fly[i];
            if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                return;
            }
        }

        if (this.wait_end) return;
        this.wait_end = true;
        // over
        let timer: egret.Timer = new egret.Timer(5000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.gameOver(true);
        }, this)
        timer.start();

    }


    // 进入新的一轮怪物
    private enterNewBatch(): void {
        //console.log('enterNewBatch...',this.cur_level_batch )
        if (this.cur_level_batch + 1 < GameData.level_configs.length) {

            this.game_time = 0;
            this.cur_level_batch++;
            this.cur_add_ons = 0;

            let batchInfo = GameData.level_configs[this.cur_level_batch];
            this.star_left_blood = batchInfo.blood;
            this.star_blood = this.star_left_blood;

            GameData.bloodGen(batchInfo);
        } else {
            this.noBatch = true;
        }
    }

    // 创建怪物, 只针对A轮
    private starCreate(deltaTime): void {

        let last_game_time = this.game_time - deltaTime;
        let batch_info = GameData.level_configs[this.cur_level_batch];
        batch_info.init.forEach(conf => {
            if (conf.time <= this.game_time && conf.time > last_game_time) {
                let starConfig = StarData.StarConfig[conf.id];
                let from = {x: 10, y: 0}
                let to = {x: Tools.GetRandomNum(0, 20), y: 10}
                // let to = { x: 10, y: 10 }
                // if(starConfig.id == 101){
                //     to.x=20;
                // }
                let dir = {x: to.x - from.x, y: to.y - from.y}

                this.createStar(starConfig, conf['items']||0, conf.level, conf["blood"], {x: conf.x, y: 0}, dir)

            }
        })
    }

    // 怪物移动
    private starMove(deltaTime): void {
        // 星星飞

        for (let i = 0; i < this.star_fly.length;) {
            let star = this.star_fly[i];

            // 处理加速度, 根据生命周期，计算出当前的速度
            if (star.starConfig['add_speed']) {
                let addSpeed = star.starConfig['add_speed']
                let totalTime = 0;
                addSpeed.forEach(as => {
                    totalTime += as.time;
                })

                let lifeTime = star.lifeTime % totalTime;
                let curTime = 0;
                let as = null;
                for (let i = 0; i < addSpeed.length; i++) {
                    as = addSpeed[i];
                    if (lifeTime < curTime + as.time && lifeTime >= curTime) {
                        break;
                    }

                    curTime += as.time;
                }

                if (as.wait == false) {
                    let dir: egret.Point = new egret.Point(star.speed.x, star.speed.y);
                    dir.normalize(as.add * deltaTime);
                    star.speed.x += dir.x;
                    star.speed.y += dir.y;
                }
            }

            // 生命周期判断
            star.lifeTime += deltaTime;
            if (star.life > 0 && star.lifeTime >= star.life) {
                // 生命周期结束
                this.removeStar(star);
                this.star_fly.splice(i, 1)
                // 爆炸处理
                if (star.starConfig['bomb']) {
                    let scope = star.starConfig['bomb'].scope,
                        type = star.starConfig['bomb'].scope;
                    this.bomb.push({
                        pos: {
                            x: star.model.x,
                            y: star.model.y,
                        },
                        scope: scope,
                        type: type,
                    })

                }
                continue;
            }

            // 根据速度，计算当前的位置

            // 处理跟踪怪的位移
            let addspeedex = {
                x: 0,
                y: 0,
            }

            if (star.starConfig["follow"]) {
                let follow = star.starConfig["follow"]
                // 进入了区间
                if (star["follow_speed"] == undefined) {
                    star["follow_speed"] = {x: 0, y: 0}
                }

                let follow_speed = star["follow_speed"]

                let dir: egret.Point = new egret.Point(this.boat.x - star.model.x, this.boat.y - star.model.y);
                if (dir.length < follow.scope) {
                    dir.normalize(follow.add_speed * deltaTime);
                    follow_speed.x += dir.x;
                    follow_speed.y += dir.y;
                } else {
                    follow_speed.x = 0;
                    follow_speed.y = 0;
                }

                addspeedex.x += follow_speed.x;
                addspeedex.y += follow_speed.y;
            }

            // 攻击导致的减速结束处理
            let snowRatio = MonsterTools.getSnowRatio(star, deltaTime);
            star.model.x += (star.speed.x + addspeedex.x) * deltaTime * snowRatio;
            star.model.y += (star.speed.y + addspeedex.y) * deltaTime * snowRatio;

            // 反弹检测
            if (star.starConfig["rebound"]) {
                for (let j = 0; j < this.star_fly.length; j++) {
                    let star_other = this.star_fly[j]
                    if (star_other == star) continue;
                    if (star_other.starConfig["group"] & StarData.CAN_CO) {
                        if (Tools.starCoTest(star.model, star_other.model)) {

                            if (star.model.x - star_other.model.x > 0) {
                                star.speed.x = Math.abs(star.speed.x)
                            } else if (star.model.x - star_other.model.x < 0) {
                                star.speed.x = Math.abs(star.speed.x) * -1;
                            }

                            if (star.model.y - star_other.model.y > 0) {
                                star.speed.y = Math.abs(star.speed.y)
                            } else if (star.model.x - star_other.model.x < 0) {
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


            let dirchange = false;
            // 位置根据屏幕进行调整
            if (star.model.y - star.model.height / 2 * star.model.scaleY < 0) {
                star.model.y = star.model.height / 2 * star.model.scaleY;
                star.speed.y *= -1;
                dirchange = true;
            }
            if (star.model.x - star.model.width / 2 * star.model.scaleX < 0) {
                star.model.x = star.model.width / 2 * star.model.scaleX;
                star.speed.x *= -1;
                dirchange = true;
            }
            if (star.model.x + star.model.width / 2 * star.model.scaleX > 750) {
                star.model.x = 750 - star.model.width / 2 * star.model.scaleX;
                star.speed.x *= -1;
                dirchange = true;
            }
            if (star.model.y - star.model.height / 2 * star.model.scaleY >= this.real_height) {
                star.model.y = 0;
                dirchange = true;
            }

            if(dirchange){
                if(star['fx_data']){
                    star.fx_data.model.stop();
                    this.deleteFx(star.fx_data);
                    this.createFx(star, star.fx_data.info);
                }
            }


            // // 体型随时间进行变化
            // if (star.starConfig["scale_info"]) {
            //     let scale_info = star.starConfig['scale_info']
            //     let totalTime = 0;
            //     scale_info.forEach(as => {
            //         totalTime += as.time;
            //     })
            //
            //     let lifeTime = star.lifeTime % totalTime;
            //     let curTime = 0;
            //     let as = null;
            //     let lastscale = {
            //         scaleX: 1,
            //         scaleY: 1,
            //     }
            //     for (let i = 0; i < scale_info.length; i++) {
            //         as = scale_info[i];
            //         if (lifeTime < curTime + as.time && lifeTime >= curTime) {
            //             break;
            //         }
            //
            //         curTime += as.time;
            //         lastscale.scaleX = as.scaleX;
            //         lastscale.scaleY = as.scaleY;
            //     }
            //
            //     let r = (lifeTime - curTime) / as.time;
            //
            //     if (as.wait == false) {
            //         star.model.scaleX = lastscale.scaleX * r + as.scaleX * (1 - r);
            //         star.model.scaleY = lastscale.scaleY * r + as.scaleY * (1 - r);
            //         star.model.scaleX *= star.scale;
            //         star.model.scaleY *= star.scale;
            //
            //         console.log('scale:', r, star.model.scaleX, star.model.scaleY, lastscale, as);
            //     }
            // }

            if (star.starConfig["add_blood_self"]) {
                let addBlood = star.starConfig["add_blood_self"];
                if (star['add_blood_info'] == undefined) {
                    star['add_blood_info'] = {
                        times: 0,
                        last_add_time: egret.getTimer(),
                    };
                }

                let addBloodInfo = star['add_blood_info'];

                if (addBloodInfo.last_add_time + 1000 <= egret.getTimer() && addBloodInfo.times < addBlood.times) {
                    addBloodInfo.times++;
                    addBloodInfo.last_add_time = egret.getTimer();

                    star.blood += addBlood.speed * deltaTime * star["totalBlood"]
                    // todo, 播放加血特效
                }
            }

            // 移动过程中创建新的怪物
            if (star.starConfig["create_new_star"]) {
                let createInfo = star.starConfig["create_new_star"]
                if (createInfo.time > 0) {
                    if (star['last_create']) {
                        if (egret.getTimer() - star['last_create'] >= createInfo.time) {
                            let sconfig = StarData.StarConfig[createInfo.id];
                            this.createStar(sconfig, 0, createInfo.level, 0, {
                                x: star.model.x,
                                y: star.model.y
                            }, {x: 0, y: 0}, createInfo)

                            star['last_create'] = egret.getTimer();
                        }
                    } else {
                        star['last_create'] = egret.getTimer();
                    }
                }
            }

            i++;
        }

    }

    // 击退逻辑，在所有移动和攻击之后调用
    private checkJitui(): void {
        this.star_fly.forEach(star => {
            MonsterTools.doJitui(star);
        })
    }

    private removeStar(star: any): void {
        star && star.fx_data && star.fx_data.parent && star.fx_data.parent.removeChild(star.fx_data);
        this.clear_star_fly_ex(star);
        star && star.model && star.model.parent && star.model.parent.removeChild(star.model);
        star && star.label_blood && star.label_blood.parent && star.label_blood.parent.removeChild(star.label_blood);
        star && star.label_name && star.label_name.parent && star.label_name.parent.removeChild(star.label_name);
    }

    // 检测黑洞
    private checkEat(): void {
        //

        this.star_fly_eat.forEach(e => {
            //this.addChild(e.model);
            //if(e.label_blood) this.addChild(e.label_blood);
            let eatInfo = e.starConfig["eat"];
            for (let i = 0; i < this.star_fly.length; i++) {
                let star = this.star_fly[i]
                if (star.starConfig["eat"]) {
                    continue;
                }

                if ((star.starConfig["group"] & StarData.CAN_ATTACK) && Tools.eatTest(e.model, star.model)) {
                    e.blood += e.blood * eatInfo.blood;

                    e.model.scaleX += eatInfo.scale;
                    e.model.scaleY += eatInfo.scale;

                    // 黑洞吞噬怪物，直接消失，不分裂
                    this.removeStar(star);
                    this.star_fly.splice(i, 1)
                    this.star_left_blood -= (star.totalBlood + star.subBlood);

                    if (this.star_left_blood / this.star_blood < 0.2) {
                        this.enterNewBatch();
                    }
                    this.checkGameOver();

                    i--;
                }
            }
        })
    }

    // 处理炸弹效果
    private checkBomb(): void {
        this.bomb.forEach(bomb => {
            if (bomb.type == 1) {
                for (let i = 0; i < this.star_fly.length; i++) {
                    let star = this.star_fly[i]
                    if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                        let dir: egret.Point = new egret.Point(star.model.x - bomb.pos.x, star.model.y - bomb.pos.y);
                        if (dir.length < bomb.scope) {
                            // 被炸掉
                            this.removeStar(star);
                            this.star_fly.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        })

        this.bomb = [];
    }

    private clear_star_fly_ex(star: any): void {
        for (let i = 0; i < this.star_fly_eat.length; i++) {
            if (this.star_fly_eat[i] == star) {
                this.star_fly_eat.splice(i, 1)
                break;
            }
        }

        for (let i = 0; i < this.star_add_blood.length; i++) {
            if (this.star_add_blood[i] == star) {
                this.star_add_blood.splice(i, 1)
            }
        }
    }

    // 子弹移动，并进行攻击检测
    private checkBulle(deltaTime): void {
        // 子弹飞，并检测是否打到boat
        let speed = GameData.main_weapon.bullet_speed;
        let dis = speed * deltaTime;

        let boat_rect = new egret.Rectangle(this.boat.x - this.boat.width / 2, this.boat.y - this.boat.height / 2, this.boat.width, this.boat.height)
        let game_over = false;

        // 先计算star的碰撞盒子
        for (let i = 0; i < this.star_fly.length; i++) {
            let model = this.star_fly[i].model;
            let rect = new egret.Rectangle(model.x - model.width / 2 * model.scaleX, model.y - model.height / 2 * model.scaleY, model.width * model.scaleX, model.height * model.scaleY);
            this.star_fly[i].my_rect = rect;

            if (boat_rect.intersects(rect)) {
                game_over = true;
            }
        }

        if (game_over) {
            //return this.gameOver(false);
        }

        // 遍历子弹，看是否命中，一次只命中一个？
        for (let i = 0; i < this.bullet_fly.length;) {
            let bullet = this.bullet_fly[i].model
            bullet.y -= dis;

            let rect = new egret.Rectangle(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height + dis);
            let hit = false;

            for (let j = 0; j < this.star_fly.length; j++) {
                let star = this.star_fly[j];
                if (star.starConfig['group'] & StarData.CAN_ATTACK) {
                    if (rect.intersects(star.my_rect)) {

                        // 命中减速效果，只是设置个时间
                        if (star.starConfig.snow_time) {
                            MonsterTools.pushSnow(star, 'hit', star.starConfig.attack_speed || 1, star.starConfig.snow_time);
                        }

                        // 击退效果
                        let itemHitBack =MonsterTools.getItem('hitBack')
                        if (itemHitBack) {
                            MonsterTools.pushJitui(star, 'hit', itemHitBack['config']['up']);
                        }

                        // 播放主武器命中特效 todo
                        MonsterTools.delHp(star, GameData.getMainAttack());
                        hit = true;

                        break;
                    }
                }
            }

            if (hit) {
                bullet.parent && bullet.parent.removeChild(bullet)
                this.bullet_idle.push(bullet);
                this.bullet_fly.splice(i, 1);

            } else {
                i++;
            }
        }

        this.checkBulletOver(); // 主武器子弹消失
    }

    // 怪物死亡, 受伤死亡， 不包括黑洞和炸弹清屏幕
    private checkStarDie(): void {
        for (let i = 0; i < this.star_fly.length;) {
            let star = this.star_fly[i];
            if (star.life == 0 && star.blood <= 0) {
                this.star_fly.splice(i, 1);
                this.removeStar(star);

                if (star.level > 1) {
                    // 生成2个新的star
                    let hitpos = {x: this.boat.x, y: star.model.y + star.model.height}
                    let pos1 = {x: star.model.x - star.model.width / 2, y: star.model.y}
                    let pos2 = {x: star.model.x + star.model.width / 2, y: star.model.y}

                    let dir1: egret.Point = new egret.Point(pos1.x - hitpos.x, pos1.y - hitpos.y)
                    let dir2: egret.Point = new egret.Point(pos2.x - hitpos.x, pos2.y - hitpos.y)

                    let blood1 = Math.ceil(star.subBlood * Tools.GetRandomNum(30, 70) / 100);
                    let blood2 = star.subBlood - blood1;

                    if (blood1 <= 0) blood1 = 1;
                    if (blood2 <= 0) blood2 = 1;
                    this.createStar(star.starConfig, 0, star.level - 1, blood1, pos1, dir1)
                    this.createStar(star.starConfig, 0, star.level - 1, blood2, pos2, dir2)
                }

                // 如果补充库中还有库存，则生成一个
                let batch_info = GameData.level_configs[this.cur_level_batch]
                if (this.cur_add_ons < batch_info.add_ons.length) {
                    let conf = batch_info.add_ons[this.cur_add_ons]

                    let starConfig = StarData.StarConfig[conf.id];
                    let from = {x: 10, y: 0}
                    let to = {x: Tools.GetRandomNum(0, 20), y: 10}
                    let dir = {x: to.x - from.x, y: to.y - from.y}
                    this.createStar(starConfig, conf['items']||0, conf.level, conf["blood"], {x: conf.x, y: 0}, dir);

                    this.cur_add_ons++;
                }



                this.star_left_blood -= star.totalBlood;
                if (this.star_left_blood / this.star_blood < 0.2) {
                    this.enterNewBatch();
                }

                if (star.starConfig["create_new_star"]) {
                    let createInfo = star.starConfig["create_new_star"]
                    if (createInfo.time == 0) {
                        let sconfig = StarData.StarConfig[createInfo.id];
                        this.createStar(sconfig, 0, createInfo.level, 0, {
                            x: star.model.x,
                            y: star.model.y
                        }, {x: 0, y: 0}, createInfo)
                    }
                }
                star.tw = null;


                // 全局道具产生
                if(star.items > 0){
                    this.createItems(star.model.x, star.model.y, star.items);
                }

                this.checkGameOver();

            } else {
                i++;
            }
        }
    }

    private checkScale():void{
        this.star_fly.forEach(star=>{
            MonsterTools.doScale(star);
        })
    }
    // 显示血量和星球名称
    private changeBloodLable(): void {
        this.star_fly.forEach(star => {
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


        })
    }

    // 创建一只怪
    private createStar(starConfig: any, items:number, level: number, blood: number, pos: any, dir: any, info?: any): void {

        console.log("createStar:", level, blood, pos, dir, info)

        let model = ResTools.createBitmapByName(starConfig.model);

        let speed: egret.Point = new egret.Point(dir.x, dir.y);
        speed.normalize(starConfig.speed);
        model.anchorOffsetX = model.width / 2;
        model.anchorOffsetY = model.height / 2;


        model.x = pos.x;
        model.y = pos.y;

        // if (info) {
        //     model.scaleX = info.scaleX;
        //     model.scaleY = info.scaleY;
        //     egret.Tween.get(model).to({scaleX: info.scale.scaleX, scaleY: info.scale.scaleY}, info.scale.time);
        // }

        let subBlood = 0;
        if (level > 1) subBlood = Math.ceil(Tools.GetRandomNum(30, 80) / 100 * blood);
        blood -= subBlood;

        //this.addChild(model);

        let layer = this.gp_layer[starConfig.layer || 0];
        // if (layer != this.gp_layer_2) {
        //     console.log('not gplayer2:', starConfig.layer || 0);
        // }
        layer.addChild(model);

        //this.gp_layer_2.addChild(model);

        let star = {
            lifeTime: 0,         // 存活时间
            model: model,           // 怪物模型
            starConfig: starConfig, // 怪物的配置
            items:items,  // 怪物死亡爆道具数量
            level: level,       // 怪物等级
            speed: speed,       // 当前速度
            totalBlood: blood,   // 自己总血量
            subBlood: subBlood,  // 分裂的总血量
            blood: blood,       // 剩余血量
            //label_blood: null,
            life: 0,
            scale: 0.3 + 0.7 * level / 6,      // 初始scale

        };


        if (blood > 0) {
            let label_blood: egret.BitmapText = new egret.BitmapText();
            label_blood.font = GameData.myFont;
            label_blood.text = myMath.getString(blood);


            //let label_blood = new eui.Label(myMath.getString(blood));
            //label_blood.size = 60;
            label_blood.x = model.x;
            label_blood.y = model.y;
            label_blood.anchorOffsetX = label_blood.width / 2;
            label_blood.anchorOffsetY = label_blood.height / 2;
            let layer = this.gp_layer[starConfig.layer || 0];
            layer.addChild(label_blood);
            //this.addChild(label_blood);
            //this.gp_layer_3.addChild(label_blood);

            star["label_blood"] = label_blood
        }

        // let label_name = new eui.Label(starConfig['name']);
        // label_name.size = 20;
        // label_name.anchorOffsetX = label_name.width / 2;
        // label_name.anchorOffsetY = label_name.height / 2;
        // label_name.x = model.x;
        // label_name.y = model.y - model.height / 2 * model.scaleY - label_name.height / 2;
        // this.gp_layer[starConfig.layer || 0].addChild(label_name);
        // star["label_name"] = label_name;


        // star.model.scaleX = star.scale;
        // star.model.scaleY = star.scale;

        if (info) {
            star.life = info.life;
        }


        this.star_fly.push(star)
        if (starConfig["eat"]) {
            this.star_fly_eat.push(star);
        }

        if (starConfig["fx"]) {
            let fxInfo = starConfig["fx"];
            this.createFx(star, fxInfo);
        }

        if (starConfig["add_blood_other"]) {
            this.star_add_blood.push(star);
        }

        MonsterTools.doScale(star);
    }


    private items=[];// 全局道具
    // 创建全局道具
    private createItems(x:number, y:number, nums:number):void{
        for(let i=0;i<nums;i++){
            let rand = Tools.GetRandomNum(1, ItemData.itemConfig.length);
            //let rand = 8;
            let itemConfig = ItemData.itemConfig[rand-1];

            let model = ResTools.createBitmapByName(itemConfig.model);
            model.x =x + Tools.GetRandomNum(1, 30) - 15;
            model.y =y - Tools.GetRandomNum(1, 30) ;
            this.addChild(model);

            let speed:egret.Point = new egret.Point(Tools.GetRandomNum(0, 10)-5, Tools.GetRandomNum(0, 10)-5);
            speed.normalize(ItemData.itemFlySpeed);

            this.items.push({
                config:itemConfig,
                model:model,
                speed:speed,
                flyTime:0,
                lifeTime:ItemData.itemFlyTime,
            })
        }
    }

    // 全局道具主逻辑
    private checkItem(deltaTime:number):void{
        // fly
        for(let i=0;i<this.items.length;i++){
            let item = this.items[i]
            item.flyTime += deltaTime;
            if(item.flyTime > item.lifeTime){
                item.model.parent && item.model.parent.removeChild(item.model);
                this.items.splice(i,1)
                i--
                break;
            }

            item.model.x += item.speed.x * deltaTime;
            item.model.y += item.speed.y * deltaTime;

            if(item.model.x <= 0){
                item.model.x =0;
                item.speed.x *=-1;

            }

            if(item.model.x >= 750){
                item.model.x = 750;
                item.speed.x *= -1;
            }

            if(item.model.y <= 0){
                item.model.y = 0;
                item.speed.y *= -1;
            }

            if(item.model.y >= this.real_height){
                item.model.y = 0;
            }
        }

        for(let i=0;i<this.items.length;i++){
            let item = this.items[i]
            if(Tools.starCoTest(this.boat, item.model)){
                MonsterTools.addItem(item.config);
                item.model.parent && item.model.parent.removeChild(item.model);
                this.items.splice(i,1)
                i--;
            }
        }
    }



    private createFx(star:any, fxInfo:any){
        let s = FxMgr.getFx(fxInfo.texture, fxInfo.json);
        // let t = RES.getRes(fxInfo.texture);
        // let j = RES.getRes(fxInfo.json);
        // let s = new particle.GravityParticleSystem(t, j);
        let myFx = {
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


    private deleteFx(fx){
        for(let i=0;i<this.fx.length;i++){
            if(this.fx[i] == fx){
                this.fx.splice(i,1)
                //FxMgr.releaseFx(fx.info.texture, fx.info.json, fx.model);
                break;
            }
        }
    }


    // 特效跟随
    private checkFx(): void {
        this.fx.forEach(f => {
            if (f.star) {
                f.model.x = f.star.model.x;
                f.model.y = f.star.model.y;
                f.model.rotation = myMath.angle(f.star.speed) + 90;
            }
        })
    }

    // 彗尾给别人加血
    private last_add_boold_time: number = 0;

    private checkAddBloodOther(deltaTime): void {
        if (this.last_add_boold_time + deltaTime > 1000) {
            this.last_add_boold_time = 0;


            this.star_add_blood.forEach(star_add => {
                this.star_fly.forEach(star => {
                    if ((star.starConfig['group'] & StarData.CAN_ATTACK) && Tools.starCoTest(star_add.model, star.model)) {
                        //console.log('addbloodother:', star.model.x, star.model.y, star_add.model.x, star_add.model.y, this.star_add_blood.length)
                        this.addStarBlood(star, star_add.starConfig['add_blood_other']);
                    }
                })
            })

        } else {
            this.last_add_boold_time += deltaTime;
        }
    }

    private addStarBlood(star: any, ratio: number): void {
        star.blood += star["totalBlood"] * ratio;
    }


    // 检测子弹跑出屏幕
    private checkBulletOver(): void {
        for (let i = 0; i < this.bullet_fly.length;) {
            let bullet = this.bullet_fly[i].model;
            if (bullet.y < 0 - bullet.height / 2) {
                bullet.parent && bullet.parent.removeChild(bullet);
                this.bullet_idle.push(bullet);
                this.bullet_fly.splice(i, 1);


            } else {
                i++
            }
        }
    }

    // 开始发送子弹
    private sendStart(): void {
        this.sendBullet();
        if (this.send_timer == null) {
            this.send_timer = new egret.Timer(GameData.main_weapon.bullet_rate, 10);
            this.send_timer.addEventListener(egret.TimerEvent.TIMER, this.sendBullet, this);
            this.send_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
                //console.log('timer end...')
                this.send_timer = null;
                this.sendStart();
            }, this);
            this.send_timer.start();
        }

        this.weapon && this.weapon.start()
    }

    // 子弹发送结束
    private sendEnd(): void {
        if (this.send_timer) {
            this.send_timer.stop();
            this.send_timer = null;
        }

        this.weapon && this.weapon.stop()
    }


    // 发出一颗子弹
    private sendBullet(): void {
        let count = GameData.bulletList[this.send_index];
        this.send_index++;
        if (this.send_index >= GameData.bulletList.length) {
            this.send_index = 0;
        }

        //console.log('sendBullet', count)
        for (let i = 0; i < count; i++) {
            let bullet = this.createBullet();
            bullet.anchorOffsetX = bullet.width / 2;
            bullet.anchorOffsetY = bullet.height / 2;
            bullet.x = this.boat.x; //this.boat.x - (count - 1 - 2 * i) * bullet.width/2;
            bullet.y = this.boat.y - this.boat.height / 2; //this.boat.y - this.boat.height / 2 - bullet.height / 2;
            this.gp_layer_4.addChild(bullet);

            egret.Tween.get(bullet).to({x: this.boat.x - (count - 1 - 2 * i) * bullet.width / 2}, 100);

            this.bullet_fly.push({
                model: bullet,
            });

        }
    }

    // 创建一个子弹模型
    private createBullet(): egret.Bitmap {
        if (this.bullet_idle.length) {
            let bullet = this.bullet_idle.shift();
            return bullet;
        }

        let bullet = ResTools.createBitmapByName('bomb1');

        return bullet;
    }

    // 游戏结束检测
    private gameOver(success: boolean): void {
        this.state = 'pause';
        GameData.cur_level++;

        this.init();
    }

    // 复活
    private doRelife(): void {

    }

    //
    private showResult(): void {

    }
}