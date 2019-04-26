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
    private kill_blood  = 0;

    private fx = []; // 特效
    private star_add_blood = []; // 给别人加血

    private canReLife = true;   // 可以复活
    private cantdietime = 0;    // 无敌时间剩余


    // ui components
    private gp_root: eui.Group; // 根层级

    private gp_layer_1: eui.Group;// 最底层，放特效等
    private gp_layer_2: eui.Group;// 普通星球
    private gp_layer_3: eui.Group;// 特殊星球，比如黑洞
    private gp_layer_4: eui.Group;// 子弹层级

    private gp_b1: eui.Group;
    private gp_b2: eui.Group;
    private gp_b3: eui.Group;
    private gp_ui: eui.Group;

    private gp_goldtime: eui.Group;
    private gp_left: eui.Group;
    private gp_top: eui.Group;

    private txt_gold: eui.Label;
    private txt_tili: eui.Label;
    private txt_diamond: eui.Label;

    private img_luntan: eui.Image;
    private img_zhuanshi: eui.Image;
    private img_paihang: eui.Image;
    private img_jindu: eui.Image;
    private img_getGoldTime: eui.Image;
    private txt_goldtime: eui.Label;

    private img_main: eui.Image;
    private img_sub: eui.Image;
    private img_gold: eui.Image;

    private txt_up1: eui.Label;
    private txt_up1_lv: eui.Label;
    private txt_up1_value: eui.Label;
    private txt_up1_cost: eui.Label;
    private img_up1: eui.Image;

    private txt_up2: eui.Label;
    private txt_up2_lv: eui.Label;
    private txt_up2_value: eui.Label;
    private txt_up2_cost: eui.Label;
    private img_up2: eui.Image;

    private img_up_bg: eui.Image;

    private gp_relife: eui.Group;
    private img_relife: eui.Image;
    private txt_relife_time: eui.Label;

    private gp_result: eui.Group;
    private img_re_gold: eui.Image;
    private txt_re_gold: eui.Label;
    private img_re_gold3: eui.Image;
    private txt_re_gold3: eui.Label;

    private img_gold_dest: eui.Image;



    private gp_ui_lv1:eui.Group;
    private txt_ui_lv1_1:eui.Label;
    private txt_ui_lv1_2:eui.Label;
    private txt_ui_lv1_3:eui.Label;
    private gp_ui_lv2:eui.Group;
    private txt_ui_lv2_1:eui.Label;
    private txt_ui_lv2_2:eui.Label;
    private txt_ui_lv2_3:eui.Label;
    private txt_ui_lv2_4:eui.Label;
    private txt_ui_lv2_5:eui.Label;
    private txt_ui_lv2_6:eui.Label;
    private txt_ui_lv2_7:eui.Label;
    private img_ui_lv2_1:eui.Image;
    private img_ui_lv2_2:eui.Image;
    private img_ui_lv2_3:eui.Image;
    private img_ui_lv2_4:eui.Image;
    private img_ui_lv2_5:eui.Image;
    private img_ui_lv2_6:eui.Image;
    private img_ui_lv2_7:eui.Image;

    private select_lv:number = 0;

    private initUILv(type:number):void{

        function transTexture(img:eui.Image, sel:boolean):void{
            let name = ''
            if(sel){
                name = 'sy_guanka_3'
            }else{
                name = 'sy_guanka_1'
            }

            img.texture = ResTools.createUITexture(name);
        }

        function checkchange():void{
            let select_list:Array<eui.Image> =[];
            select_list.push(this.img_ui_lv2_1)
            select_list.push(this.img_ui_lv2_2)
            select_list.push(this.img_ui_lv2_3)
            select_list.push(this.img_ui_lv2_4)
            select_list.push(this.img_ui_lv2_5)
            select_list.push(this.img_ui_lv2_6)
            select_list.push(this.img_ui_lv2_7)

            if(this.select_lv >=1 && this.select_lv<= select_list.length){
                transTexture(select_list[this.select_lv-1], false);
            }

            for(let i=0;i<select_list.length;i++){
                let mylv = GameData.UserInfo.nextLevel-6+i
                if(mylv == GameData.UserInfo.curLevel){
                    this.select_lv = i+1;
                    transTexture(select_list[i], true);
                    break;
                }
            }

        }

        function select(index:number):void{
            GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-7+index;
            this.initUILv(1);
        }

        if(type == 1){
            this.gp_ui_lv2.parent && this.gp_ui_lv2.parent.removeChild(this.gp_ui_lv2)
            this.gp_root.addChild(this.gp_ui_lv1);
            this.txt_ui_lv1_1.text = ''+(GameData.UserInfo.curLevel-1);
            this.txt_ui_lv1_2.text = ''+(GameData.UserInfo.curLevel);
            this.txt_ui_lv1_3.text = ''+(GameData.UserInfo.curLevel+1);

            if(GameData.UserInfo.nextLevel >=7){
                this.gp_ui_lv1.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                    this.initUILv(2);
                }, this);
            }
        }else{
            this.gp_ui_lv1.parent && this.gp_ui_lv1.parent.removeChild(this.gp_ui_lv1)
            this.gp_root.addChild(this.gp_ui_lv2);
            this.txt_ui_lv2_1.text = ''+(GameData.UserInfo.nextLevel-6);
            this.txt_ui_lv2_2.text = ''+(GameData.UserInfo.nextLevel-5);
            this.txt_ui_lv2_3.text = ''+(GameData.UserInfo.nextLevel-4);
            this.txt_ui_lv2_4.text = ''+(GameData.UserInfo.nextLevel-3);
            this.txt_ui_lv2_5.text = ''+(GameData.UserInfo.nextLevel-2);
            this.txt_ui_lv2_6.text = ''+(GameData.UserInfo.nextLevel-1);
            this.txt_ui_lv2_7.text = ''+(GameData.UserInfo.nextLevel);

            checkchange.call(this);

            this.txt_ui_lv2_1.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,1);}, this);
            this.txt_ui_lv2_2.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,2);}, this);
            this.txt_ui_lv2_3.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,3);}, this);
            this.txt_ui_lv2_4.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,4);}, this);
            this.txt_ui_lv2_5.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,5);}, this);
            this.txt_ui_lv2_6.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,6);}, this);
            this.txt_ui_lv2_7.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,7);}, this);

            this.img_ui_lv2_1.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,1);}, this);
            this.img_ui_lv2_2.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,2);}, this);
            this.img_ui_lv2_3.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,3);}, this);
            this.img_ui_lv2_4.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,4);}, this);
            this.img_ui_lv2_5.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,5);}, this);
            this.img_ui_lv2_6.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,6);}, this);
            this.img_ui_lv2_7.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{select.call(this,7);}, this);
       

            // this.img_ui_lv2_2.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-5; this.initUILv(1); this.select_lv = 2;}, this);
            // this.img_ui_lv2_3.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-4; this.initUILv(1); this.select_lv = 3;}, this);
            // this.img_ui_lv2_4.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-3; this.initUILv(1); this.select_lv = 4;}, this);
            // this.img_ui_lv2_5.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-2; this.initUILv(1); this.select_lv = 5;}, this);
            // this.img_ui_lv2_6.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel-1; this.initUILv(1); this.select_lv = 6;}, this);
            // this.img_ui_lv2_7.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{GameData.UserInfo.curLevel = GameData.UserInfo.nextLevel; this.initUILv(1); this.select_lv = 7;}, this);




        }
    }

    private initUI(): void {



        this.gp_game_data.parent && this.gp_game_data.parent.removeChild(this.gp_game_data)


        this.gp_root.addChild(this.gp_ui);
        this.gp_root.addChild(this.gp_b1);
        this.gp_root.addChild(this.gp_left);
        this.gp_root.addChild(this.gp_top);
        this.gp_root.addChild(this.gp_goldtime);

        this.gp_relife.parent && this.gp_relife.parent.removeChild(this.gp_relife);
        this.gp_result.parent && this.gp_result.parent.removeChild(this.gp_result);

        this.txt_gold.text = myMath.getString(GameData.UserInfo.totalMoney);
        this.txt_tili.text = myMath.getString(GameData.UserInfo.tili);
        this.txt_diamond.text = myMath.getString(GameData.UserInfo.totalDiamond);

        this.gp_b3.parent && this.gp_b3.parent.removeChild(this.gp_b3);
        this.gp_b2.parent && this.gp_b2.parent.removeChild(this.gp_b2);

        this.gp_b1.y = this.real_height - this.gp_b1.height;
        this.gp_b2.y = this.gp_b1.y - this.gp_b2.height;
        this.gp_b3.y = this.gp_b2.y - this.gp_b3.height;


        this.img_main.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMainClick, this);
        this.img_sub.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSubClick, this);
        this.img_gold.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoldClick, this);

        this.img_up1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLevelUp1, this);
        this.img_up2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLevelUp2, this);

        this.gp_goldtime.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetGoldTime, this);

        this.txt_goldtime.text = myMath.getString(GameData.getCurGoldTime());

        this.initMask();

        egret.Tween.get(this.boat).to({x: 375, y: this.gp_b1.y - this.boat.height}, 500);

        this.initUILv(1);
    }

    private win = false;

    private showResult(win: boolean): void {

        this.win = win;
        let timer_show: egret.Timer = new egret.Timer(1000, 1);
        timer_show.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.showResult_real, this)
        timer_show.start();
    }

    //
    private showResult_real(e: egret.TimerEvent): void {
        this.showGameUI();
        if (this.state == 'result') return;
        this.state = 'result';

        if (this.win) {
            GameData.passLevel();
            // + tili 6
        }

        this.sendEnd();
        this.removeMoveEvent();

        this.addChild(this.gp_result);
        this.txt_re_gold.text = myMath.getString(GameData.score);
        this.txt_re_gold3.text = myMath.getString(GameData.score * 3);
        this.img_re_gold.addEventListener(egret.TouchEvent.TOUCH_TAP, handleGold, this);
        this.img_re_gold3.addEventListener(egret.TouchEvent.TOUCH_TAP, handleGold3, this);


        let self = this;

        function handleGold() {
            handleResult(1)
        }

        function handleGold3() {
            handleResult(3)
        }

        function handleResult(ratio: number) {
            GameData.onHandleResult(ratio);
            self.img_re_gold.removeEventListener(egret.TouchEvent.TOUCH_TAP, handleGold, this);
            self.img_re_gold3.removeEventListener(egret.TouchEvent.TOUCH_TAP, handleGold3, this);

            // 删除游戏画面
            self.init();

            // 播放收集金币动画

            self.initUI();

            GoldFx.playResult({x: 375, y: self.gp_result.y}, {x: self.img_gold_dest.x, y: self.img_gold_dest.y}, self);

            //
            // 进入主页


        }


    }

    private showRelife(): void {
        this.showGameUI();
        this.state = 'relife'
        this.canReLife = false;
        this.sendEnd();
        this.removeMoveEvent();


        this.addChild(this.gp_relife);
        this.txt_relife_time.text = '3';

        let timer: egret.Timer = new egret.Timer(1000, 3);
        let leftTime = 3;
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            leftTime--
            this.txt_relife_time.text = '' + leftTime;
        }, this);

        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.gp_relife.parent && this.gp_relife.parent.removeChild(this.gp_relife);
            this.img_relife.removeEventListener(egret.TouchEvent.TOUCH_TAP, clickRelif, this);
            this.showResult(false)
        }, this);
        timer.start();

        this.img_relife.addEventListener(egret.TouchEvent.TOUCH_TAP, clickRelif, this);
        function clickRelif(e: any): void {
            timer.stop();
            // 播放视频，或者分享
            this.doRelife();
            this.gp_relife.parent && this.gp_relife.parent.removeChild(this.gp_relife);
            this.img_relife.removeEventListener(egret.TouchEvent.TOUCH_TAP, clickRelif, this);
        }
    }

    private resetHB(): void {
        this.txt_gold.text = myMath.getString(GameData.UserInfo.totalMoney);
        this.txt_tili.text = myMath.getString(GameData.UserInfo.tili);
        this.txt_diamond.text = myMath.getString(GameData.UserInfo.totalDiamond);
    }

    private onMainClick(e: egret.TouchEvent): void {
        this.gp_b3.parent && this.gp_b3.parent.removeChild(this.gp_b3)

        this.txt_up1.text = '射速';
        this.txt_up1_lv.text = 'Lv' + (GameData.UserInfo.MainWeapon.speed + 1);
        this.txt_up1_lv.textColor = 0xFF87CE;
        this.txt_up1_value.text = myMath.getString(GameData.getMainSpeed());
        this.txt_up1_cost.text = myMath.getString(GameData.getCost('main_speed'));

        this.txt_up2.text = '火力'
        this.txt_up2_lv.text = 'Lv' + (GameData.UserInfo.MainWeapon.attack + 1);
        this.txt_up2_value.text = myMath.getString(GameData.getMainAttack());
        this.txt_up2_cost.text = myMath.getString(GameData.getCost('main_attack'));

        this.gp_root.addChild(this.gp_b2);
        this.gp_root.addChild(this.gp_b1);
        this.state = 'ui';

        this.img_up_bg.texture = ResTools.createUITexture('sq_zhu')

        egret.Tween.get(this.boat).to({x: 375, y: this.gp_b3.y - this.boat.height}, 500);
    }

    private onSubClick(e: egret.TouchEvent): void {

        let sub = GameData.UserInfo.SubWeapons[GameData.UserInfo.curSubWeaponId - 1];

        this.txt_up1.text = '强度';
        this.txt_up1_lv.text = 'Lv' + (sub.strength + 1);
        this.txt_up1_lv.textColor = 0XCC6FFD;
        this.txt_up1_value.text = myMath.getString(GameData.getSubStrenth());
        this.txt_up1_cost.text = myMath.getString(GameData.getCost('sub_speed'));

        this.txt_up2.text = '火力'
        this.txt_up2_lv.text = 'Lv' + (sub.attack + 1);
        this.txt_up2_value.text = myMath.getString(GameData.getSubAttack());
        this.txt_up2_cost.text = myMath.getString(GameData.getCost('sub_attack'));

        this.gp_root.addChild(this.gp_b2);
        this.gp_root.addChild(this.gp_b3);
        this.gp_root.addChild(this.gp_b1);
        this.state = 'ui';

        this.img_up_bg.texture = ResTools.createUITexture('sq_fu')

        egret.Tween.get(this.boat).to({x: 375, y: this.gp_b3.y - this.boat.height}, 500);
    }

    private onGoldClick(e: egret.TouchEvent): void {
        this.gp_b3.parent && this.gp_b3.parent.removeChild(this.gp_b3)

        this.txt_up1.text = '金币价值';
        this.txt_up1_lv.text = 'Lv' + GameData.UserInfo.goldCostLevel;
        this.txt_up1_lv.textColor = 0xCC6FFD;
        this.txt_up1_value.text = myMath.getString(GameData.getGoldCost());
        this.txt_up1_cost.text = myMath.getString(GameData.getCost('gold_cost'));

        this.txt_up2.text = '日常收益'
        this.txt_up2_lv.text = 'Lv' + GameData.UserInfo.goldTimeLevel;
        this.txt_up2_value.text = myMath.getString(GameData.getGoldTime());
        this.txt_up2_cost.text = myMath.getString(GameData.getCost('gold_time'));

        this.gp_root.addChild(this.gp_b2);
        this.gp_root.addChild(this.gp_b1);
        this.state = 'ui';

        this.img_up_bg.texture = ResTools.createUITexture('sq_jin')

        egret.Tween.get(this.boat).to({x: 375, y: this.gp_b3.y - this.boat.height}, 500);
    }

    private onLevelUp1(e: egret.TouchEvent): void {
        switch (this.txt_up1.text) {
            case '射速':
                GameData.levelup('main_speed')
                this.resetHB();
                this.onMainClick(e);
                break;
            case '强度':
                GameData.levelup('sub_speed')
                this.resetHB();
                this.onSubClick(e);
                break;
            default:
                GameData.levelup('gold_cost')
                this.resetHB();
                this.onGoldClick(e);
                break;
        }
    }

    private onLevelUp2(e: egret.TouchEvent): void {
        switch (this.txt_up1.text) {
            case '射速':
                GameData.levelup('main_attack')
                this.resetHB();
                this.onMainClick(e);
                break;
            case '强度':
                GameData.levelup('sub_attack')
                this.resetHB();
                this.onSubClick(e);
                break;
            default:
                GameData.levelup('gold_time')
                this.resetHB();
                this.onGoldClick(e);
                break;
        }
    }

    private onGetGoldTime(e: egret.TouchEvent): void {
        console.log('onGetGoldTime');
        GameData.onGetGoldTime();
        this.updateMask();
    }


    // game ui
    private gp_game_data: eui.Group;
    private img_game_gold_dest: eui.Image;
    private txt_game_gold: eui.Label;
    private txt_game_jindu: eui.Label;
    private txt_game_lv1: eui.Label;
    private txt_game_lv2: eui.Label;
    private txt_game_lv3: eui.Label;
    private img_game_jindu: eui.Image;
    private img_game_jindu_bg: eui.Image;

    private showGameUI(): void {
        this.addChild(this.gp_game_data);
        this.txt_game_lv1.text = '' + (GameData.UserInfo.curLevel - 1);
        this.txt_game_lv2.text = '' + (GameData.UserInfo.curLevel);
        this.txt_game_lv3.text = '' + (GameData.UserInfo.curLevel + 1);
        this.txt_game_gold.text = myMath.getString(GameData.score);
        let cur = Math.floor(100*(1- this.kill_blood/GameData.total_blood));
        if(cur<0)cur =0
        if(cur>100)cur = 100

        this.txt_game_jindu.text = cur + '%';
        this.img_game_jindu.width = this.img_game_jindu_bg.width * cur / 100;
    }


    private gp_layer = [];
    private boat:wuqi_1 = null;//eui.Image;
    private starCount: egret.BitmapText;
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
        this.create_nums = 0;
        this.canReLife = true;
        this.cantdietime = 0;
        this.noBatch = false;
        this.wait_end = false;
        GameData.init();

        this.state = 'init';

        this.lastFramTime = 0;
        this.game_time = 0;
        this.cur_level_batch = -1;
        this.cur_add_ons = 0;
        this.star_blood = 0;
        this.star_left_blood = 0;
        this.kill_blood = 0;

        // 清空子弹
        this.clearBullet();

        // 清空全局道具
        this.clearItems();

        // 清空怪物
        this.star_fly.forEach(star => {
            star.model && star.model.parent && star.model.parent.removeChild(star.model);
            star.label_blood && star.label_blood.parent && star.label_blood.parent.removeChild(star.label_blood);
        })
        this.star_fly = [];
        this.star_fly_eat = [];
        this.star_add_blood = [];
        this.bomb = [];

        // 僚机的清空
        if (this.weapon) {
            this.weapon.clear();
        }
        let sub_weapon = GameData.getSubWeapon();
        this.weapon = WingMan.createWeapon(this.gp_layer_4, this.boat, sub_weapon.id, sub_weapon.attack, sub_weapon.strength);
    }

    private system: particle.GravityParticleSystem;

    private initBegin(): void {

        this.boat = new wuqi_1();
        this.addChild(this.boat);
        this.boat.play();


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

        this.starCount = new egret.BitmapText();
        this.starCount.font = GameData.myFont;
        this.starCount.text = '';
        this.addChild(this.starCount);

        //
        // this.gp_layer_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        // this.gp_layer_4.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        // this.gp_layer_4.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        // this.gp_layer_4.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.gp_ui.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginUI, this);

        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);

        this.initUI();


        // let anm:Star1 = new Star1('star1');
        // anm.anchorOffsetX = anm.width/2;
        // anm.anchorOffsetY = anm.height/2;

        // anm.x = 0;
        // anm.y = 0;


        // this.addChild(anm);
        // anm.play();


        // let kkk = ResTools.createBitmapByName('gold')
        // kkk.x = 350;
        // kkk.y = 300;

        // this.addChild(kkk);
    }

    private onTouchBeginUI(e: egret.TouchEvent): void {

        console.log('onTouchBeginUI call:', this.last_pos)
        if (this.state == 'ui') {
            this.state = 'init';
            this.gp_b3.parent && this.gp_b3.parent.removeChild(this.gp_b3)
            this.gp_b2.parent && this.gp_b2.parent.removeChild(this.gp_b2)

            egret.Tween.get(this.boat).to({x: 375, y: this.gp_b1.y - this.boat.height}, 500);
        } else if (this.state == 'init') {
            this.gp_b3.parent && this.gp_b3.parent.removeChild(this.gp_b3)
            this.gp_b2.parent && this.gp_b2.parent.removeChild(this.gp_b2)
            this.gp_b1.parent && this.gp_b1.parent.removeChild(this.gp_b1)
            this.gp_ui.parent && this.gp_ui.parent.removeChild(this.gp_ui);
            this.gp_top.parent && this.gp_top.parent.removeChild(this.gp_top)
            this.gp_left.parent && this.gp_left.parent.removeChild(this.gp_left)
            this.gp_goldtime.parent && this.gp_goldtime.parent.removeChild(this.gp_goldtime)
            this.gp_ui_lv1.parent && this.gp_ui_lv1.parent.removeChild(this.gp_ui_lv1)
            this.gp_ui_lv2.parent && this.gp_ui_lv2.parent.removeChild(this.gp_ui_lv2)
            this.state = 'pause';

            this.addMoveEvent();
        }
    }

    private addMoveEvent(): void {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private removeMoveEvent(): void {
        try {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        } catch (e) {
            console.log("removeMoveEvent error")
        }
    }

    // 点击屏幕
    private onTouchTap(e: egret.TouchEvent): void {
        //console.log('onTouchTap call')
        //this.sendBullet();
    }


    // 在屏幕上滑动
    private onTouchBegin(e: egret.TouchEvent): void {
        if (this.state == 'pause' || this.state == 'init') {
            this.state = 'game';
        }

        if (this.state != 'game') return;

        this.last_pos = {
            x: e.stageX,
            y: e.$stageY,
        }

        // console.log('onTouchBegin call:', this.last_pos)
        this.sendStart();
    }

    // 在屏幕上滑动
    private onTouchMove(e: egret.TouchEvent): void {
        if (this.state != 'game') return;

        let deltax = e.stageX - this.last_pos.x;
        let deltay = e.$stageY - this.last_pos.y;

        let ratio = 1
        let item = MonsterTools.getItem('reduceBoatMove');
        if (item) ratio = item['config']['ratio'];
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
        if (this.state != 'game') return;

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

        if (this.state == 'game' || this.state == 'pause' || this.state == 'result') {
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
                deltaTime_snow = deltaTime * 0.2;
            }

            if (this.cantdietime > 0) this.cantdietime -= deltaTime_snow; // 无敌时间扣除

            this.starMove(deltaTime_snow);   // 怪物移动，包括减速等逻辑
            this.checkBullet(deltaTime);    // 主武器子弹逻辑

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


            this.starCount.text = '' + this.star_fly.length;
            this.starCount.anchorOffsetX = this.starCount.width / 2;
            this.starCount.anchorOffsetY = this.starCount.height / 2;
            this.starCount.x = this.boat.x;
            this.starCount.y = this.boat.y;
            //this.checkGameOver();
            this.showGameUI();
        }

        GameData.saveUserInfo();
        this.updateMask();

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


        // 直接死亡，进入结果界面

        this.showResult(true);
    }

    // 进入新的一轮怪物
    private create_nums:number = 0;
    private enterNewBatch(): void {

        if(this.cur_level_batch != -1){
            let batchInfo = GameData.level_configs[this.cur_level_batch];
            if(this.create_nums < batchInfo.init.length+batchInfo.add_ons.length) return; // 确保怪出完才能进入下一bo
        }

        //console.log('enterNewBatch...',this.cur_level_batch )
        if (this.cur_level_batch + 1 < GameData.level_configs.length) {

            this.game_time = 0;
            this.cur_level_batch++;
            this.cur_add_ons = 0;
            this.create_nums = 0;

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
                let y = 0;
                if (conf['y']) y = conf['y'];


                this.createStar(starConfig, conf['items'] || 0, conf.level, conf["blood"], {x: conf.x, y: y}, dir, {
                    bossblood: conf['bossblood']||0,
                    bosssize:conf['bosssize']||0
                })
                this.create_nums++;

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

                // 生命周期结束
                this.removeStar(star);
                this.star_fly.splice(i, 1)
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

            if (dirchange) {
                if (star['fx_data']) {
                    star.fx_data.model.stop();
                    this.deleteFx(star.fx_data);
                    this.createFx(star, star.fx_data.info);
                }
            }


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
                            }, {x: 0, y: 0}, {life:createInfo.life||0})

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
        star && star.model && this.releaseStarByName(star.starConfig.model, star.model);
        star.model = null;
        star.label_blood = null;
    }

    // 检测黑洞
    private checkEat(): void {
        //

        this.star_fly_eat.forEach(e => {
            //this.addChild(e.model);
            //if(e.label_blood) this.addChild(e.label_blood);

            let scale = 0
            let blood = 0;
            let eatInfo = e.starConfig["eat"];
            for (let i = 0; i < this.star_fly.length; i++) {
                let star = this.star_fly[i]
                if (star.starConfig["eat"]) {
                    continue;
                }

                if ((star.starConfig["group"] & StarData.CAN_ATTACK) && Tools.eatTest(e.model, star.model)) {

                    console.log('eat:', star.model.x, star.model.y, star.model.width / 2 * star.model.scaleX
                        , e.model.x, e.model.y, e.model.width / 2 * e.model.scaleX)

                    this.star_fly.splice(i, 1)
                    this.doBeEat(star);

                    scale += eatInfo.scale;
                    //blood += eatInfo.blood

                    e.blood += e.blood * eatInfo.blood;
                    //
                    // e.model.scaleX += eatInfo.scale;
                    // e.model.scaleY += eatInfo.scale;

                    // // 黑洞吞噬怪物，直接消失，不分裂
                    // this.removeStar(star);
                    //
                    // this.star_left_blood -= (star.totalBlood + star.subBlood);
                    // if (this.star_left_blood / this.star_blood < 0.2) {
                    //     this.enterNewBatch();
                    // }
                    // this.checkGameOver();

                    i--;
                }
            }

            if (scale > 0) {
                this.doEat(e, scale);
            }

        })
    }


    private doEat(star: any, scale: number): void {
        egret.Tween.get(star.model).wait(300).to({
            scaleX: star.model.scaleX + scale,
            scaleY: star.model.scaleY + scale
        }, 300);
    }

    private doBeEat(star: any): void {
        egret.Tween.get(star.model).to({scaleY: 0.01, scaleX: 0.01}, 300).call(() => {
            // 黑洞吞噬怪物，直接消失，不分裂
            this.removeStar(star);
            this.star_left_blood -= (star.totalBlood + star.subBlood);
            this.kill_blood += (star.totalBlood + star.subBlood)

            //console.log('kill_blood by eat:',this.kill_blood)
            if (this.star_left_blood / this.star_blood < 0.2) {
                this.enterNewBatch();
            }
            this.checkGameOver();

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
    private checkBullet(deltaTime): void {
        // 子弹飞，并检测是否打到boat
        let speed = GameData.main_weapon.bullet_speed;
        let dis = speed * deltaTime;

        let boat_rect = new egret.Rectangle(this.boat.x - this.boat.width / 4, this.boat.y - this.boat.height / 2, this.boat.width/2, this.boat.height)
        let game_over = false;


        // 先计算star的碰撞盒子
        for (let i = 0; i < this.star_fly.length; i++) {
            let model = this.star_fly[i].model;
            let rect = new egret.Rectangle(model.x - model.width / 2 * model.scaleX, model.y - model.height / 2 * model.scaleY, model.width * model.scaleX, model.height * model.scaleY);
            this.star_fly[i].my_rect = rect;

            if (this.cantdietime <= 0 && boat_rect.intersects(rect)) {
                game_over = true;
            }
        }

        if (game_over) {

            if (this.state == 'relife' || this.state == 'result') return;

            console.log('game_over:', this.canReLife);
            if (this.canReLife) {
                this.showRelife()
            } else {
                this.showResult(false)
            }
            return
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
                        let itemHitBack = MonsterTools.getItem('hitBack')
                        if (itemHitBack) {
                            MonsterTools.pushJitui(star, 'hit', itemHitBack['config']['up']);
                        }

                        // 播放主武器命中特效 todo
                        let fx_y = Math.pow(
                            (star.model.width / 2 * star.model.scaleX) * (star.model.width / 2 * star.model.scaleX)
                            - (star.model.x - bullet.x) * (star.model.x - bullet.x),
                            0.5);

                        HitFx.playFx(bullet.x, star.model.y + fx_y - Tools.GetRandomNum(1, 10), this);
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

    private createGold(x: number, y: number): void {
        let r = 48; // 金币的直径
        let count = Tools.GetRandomNum(1, 3);
        for (let i = 0; i < count; i++) {
            let x1 = x + 2 * r * Math.cos(45 * i + 45);
            let y1 = y + 2 * r * Math.sin(45 * i + 45);

            GoldFx.playFx({x: x1, y: y1}, {x: this.img_game_gold_dest.x, y: this.img_game_gold_dest.y}, this);
        }
    }

    // 怪物死亡, 受伤死亡， 不包括黑洞和炸弹清屏幕
    private checkStarDie(): void {
        for (let i = 0; i < this.star_fly.length;) {
            let star = this.star_fly[i];
            if (star.life == 0 && star.blood <= 0) {
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
                } else {
                    // 产生金币
                    this.createGold(star.model.x, star.model.y);
                }

                // 如果补充库中还有库存，则生成一个
                let batch_info = GameData.level_configs[this.cur_level_batch]
                if (this.cur_add_ons < batch_info.add_ons.length) {
                    let conf = batch_info.add_ons[this.cur_add_ons]

                    let starConfig = StarData.StarConfig[conf.id];
                    let from = {x: 10, y: 0}
                    let to = {x: Tools.GetRandomNum(0, 20), y: 10}
                    let dir = {x: to.x - from.x, y: to.y - from.y}

                    this.createStar(starConfig, conf['items'] || 0, conf.level, conf["blood"], {x: conf.x, y: 0}, dir,{
                        bossblood: conf['bossblood']||0,
                        bosssize:conf['bosssize']||0
                    });

                    this.cur_add_ons++;
                    this.create_nums++;
                }


                this.star_left_blood -= star.totalBlood;
                this.kill_blood += star.totalBlood;
                //console.log('kill_blood:',this.kill_blood)
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
                        }, {x: 0, y: 0}, {life:createInfo.life||0})
                    }
                }
                star.tw = null;


                // 全局道具产生
                if (star.items > 0) {
                    this.createItems(star.model.x, star.model.y, star.items);
                }


                this.star_fly.splice(i, 1);
                this.removeStar(star);
                this.checkGameOver();

            } else {
                i++;
            }
        }
    }

    private checkScale(): void {
        this.star_fly.forEach(star => {
            MonsterTools.doScale(star);
        })
    }

    // 显示血量和星球名称
    private changeBloodLable(): void {
        this.star_fly.forEach(star => {
            let color = GameData.getColorName(star.blood);
            if (color != star.color) {
                star.color = color;
                this.changeStarColor(star);
            }

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

    private stars_free = {};

    private getStarByName(name: string): any {
        if (this.stars_free[name] && this.stars_free[name].length) {
            let model = this.stars_free[name].shift();
            model.play();
            return model;
        }

        let model = new Star1(name);
        if (model) model.play();
        return model;
    }

    private releaseStarByName(name: string, model: any): void {
        if (!this.stars_free[name]) {
            this.stars_free[name] = [];
        }

        model.stop();
        this.stars_free[name].push(model);
    }

    // 创建一只怪
    // info{life, bossblood, bosssize}
    private createStar(starConfig: any, items: number, level: number, blood: number, pos: any, dir: any, info?: any): void {

        //console.log("createStar:", starConfig.id, blood)
        let model = this.getStarByName(starConfig.model)// new Star1(); // ResTools.createBitmapByName(starConfig.model);

        let speed: egret.Point = new egret.Point(dir.x, dir.y);
        speed.normalize(starConfig.speed);
        model.anchorOffsetX = model.width / 2;
        model.anchorOffsetY = model.height / 2;
        model.x = pos.x;
        model.y = pos.y;

        if(info && info['bossblood']){
            blood += info['bossblood']
        }

        let subBlood = 0;// 字体总血量
        if (level > 1) subBlood = Math.ceil(Tools.GetRandomNum(30, 80) / 100 * blood);
        blood -= subBlood; // 母体血量


        let layer = this.gp_layer[starConfig.layer || 0];
        layer.addChild(model);

        //this.gp_layer_2.addChild(model);
        let color = GameData.getColorName(blood);

        let star = {
            lifeTime: 0,         // 存活时间
            model: model,           // 怪物模型
            starConfig: starConfig, // 怪物的配置
            items: items,  // 怪物死亡爆道具数量
            level: level,       // 怪物等级
            speed: speed,       // 当前速度
            totalBlood: blood,   // 自己总血量
            subBlood: subBlood,  // 分裂的总血量
            blood: blood,       // 剩余血量
            color: color,
            //label_blood: null,
            life: 0
        };


        if(info && info.bosssize){
            star['bosssize'] =   info.bosssize
        }

        if (color != StarData.colorNames[0]) {
            // 默认是最高级的颜色，如果不是，则需要替换
            this.changeStarColor(star);
        }


        if (blood > 0) {
            let label_blood: egret.BitmapText = new egret.BitmapText();
            label_blood.font = GameData.myFont;
            label_blood.text = myMath.getString(blood);
            label_blood.x = model.x;
            label_blood.y = model.y;
            label_blood.anchorOffsetX = label_blood.width / 2;
            label_blood.anchorOffsetY = label_blood.height / 2;

            layer.addChild(label_blood);

            star["label_blood"] = label_blood
        }


        if (info && info.life) {
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

    private changeStarColor(star: any): void {
        if (star.model.changeColor) {
            star.model.changeColor(star.color);
        }
    }

    private items = [];// 全局道具
    // 创建全局道具
    private createItems(x: number, y: number, nums: number): void {
        for (let i = 0; i < nums; i++) {
            let rand = Tools.GetRandomNum(1, ItemData.itemConfig.length);
            //let rand = 8;
            let itemConfig = ItemData.itemConfig[rand - 1];

            let model = ResTools.createBitmapByName(itemConfig.model);
            model.x = x + Tools.GetRandomNum(1, 30) - 15;
            model.y = y - Tools.GetRandomNum(1, 30);
            this.addChild(model);

            let speed: egret.Point = new egret.Point(Tools.GetRandomNum(0, 10) - 5, Tools.GetRandomNum(0, 10) - 5);
            speed.normalize(ItemData.itemFlySpeed);

            this.items.push({
                config: itemConfig,
                model: model,
                speed: speed,
                flyTime: 0,
                lifeTime: ItemData.itemFlyTime,
            })
        }
    }

    private clearItems(): void {
        this.items.forEach(item => {
            item.model.parent && item.model.parent.removeChild(item.model);
        })

        this.items = [];

        MonsterTools.clearItems();
    }

    // 全局道具主逻辑
    private checkItem(deltaTime: number): void {
        // fly
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            item.flyTime += deltaTime;
            if (item.flyTime > item.lifeTime) {
                item.model.parent && item.model.parent.removeChild(item.model);
                this.items.splice(i, 1)
                i--
                break;
            }

            item.model.x += item.speed.x * deltaTime;
            item.model.y += item.speed.y * deltaTime;

            if (item.model.x <= 0) {
                item.model.x = 0;
                item.speed.x *= -1;

            }

            if (item.model.x >= 750) {
                item.model.x = 750;
                item.speed.x *= -1;
            }

            if (item.model.y <= 0) {
                item.model.y = 0;
                item.speed.y *= -1;
            }

            if (item.model.y >= this.real_height) {
                item.model.y = 0;
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            if (Tools.starCoTest(this.boat, item.model)) {
                MonsterTools.addItem(item.config);
                item.model.parent && item.model.parent.removeChild(item.model);
                this.items.splice(i, 1)
                i--;
            }
        }
    }

    private createFx(star: any, fxInfo: any) {
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

    private deleteFx(fx) {
        for (let i = 0; i < this.fx.length; i++) {
            if (this.fx[i] == fx) {
                this.fx.splice(i, 1)
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

    private clearBullet(): void {
        for (let i = 0; i < this.bullet_fly.length; i++) {
            let bullet = this.bullet_fly[i].model;
            bullet.parent && bullet.parent.removeChild(bullet);
            this.bullet_idle.push(bullet);
        }

        this.bullet_fly = [];
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


    // 发出一颗子弹， 子弹中间没有空间
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

            egret.Tween.get(bullet).to({x: this.boat.x - (count - 1 - 2 * i) * bullet.width / 2}, GameData.main_weapon.bullet_scale_time);

            this.bullet_fly.push({
                model: bullet,
            });

        }
    }

    // 创建一个子弹模型
    private bulletName: string = 'bomb1'

    private createBullet(): egret.Bitmap {
        let bulletName = MonsterTools.getBulletName();
        if (bulletName != this.bulletName) {
            this.bulletName = bulletName;
            this.changeBullet(bulletName)
        }

        if (this.bullet_idle.length) {
            let bullet = this.bullet_idle.shift();
            return bullet;
        }

        let bullet = ResTools.createBitmapByName(this.bulletName);

        return bullet;
    }

    private changeBullet(bulletName: string): void {
        // 修改存储中的子弹的贴图
        // 修改现有子弹的贴图
        this.bullet_fly.forEach(bullet => {
            bullet.model.texture = ResTools.createTextureByName(bulletName);// RES.getRes('flydata_json.'+bulletName);
        })

        this.bullet_idle.forEach(bullet => {
            bullet.texture = ResTools.createTextureByName(bulletName);// RES.getRes('flydata_json.'+bulletName);
        })
    }

    // 游戏结束检测
    private gameOver(success: boolean): void {
        this.state = 'pause';
        GameData.UserInfo.curLevel++;
        GameData.saveUserInfo();

        this.init();
    }

    // 复活
    private doRelife(): void {

        this.cantdietime = 3000;
        this.state = 'pause'

        this.addMoveEvent();

    }


    private maskGold: egret.Shape = null;

    private initMask(): void {
        var shape: egret.Shape = this.maskGold = new egret.Shape();
        shape.graphics.beginFill(0x00ffff, 1);
        shape.graphics.drawCircle(this.img_jindu.x, this.img_jindu.y, this.img_jindu.height);
        shape.graphics.endFill();
        this.addChild(shape);
        this.img_jindu.mask = shape;

        this.updateMask();
    }

    private updateMask(): void {
        let total = GameData.getGoldTimeMax();
        let cur = Math.floor(GameData.getCurGoldTime());

        this.txt_goldtime.text = myMath.getString(cur);
        this.txt_gold.text = myMath.getString(GameData.UserInfo.totalMoney);
        this.txt_tili.text = myMath.getString(GameData.UserInfo.tili);
        this.txt_diamond.text = myMath.getString(GameData.UserInfo.totalDiamond);


        var shape: egret.Shape = this.maskGold;

        shape.graphics.clear();
        shape.graphics.beginFill(0x00ffff, 1);
        shape.graphics.moveTo(this.img_jindu.x, this.img_jindu.y);
        shape.graphics.lineTo(this.img_jindu.x, this.img_jindu.y - this.img_jindu.height);

        //我们从上开始绘制，则弧度为-90 * Math.PI / 180
        shape.graphics.drawArc(this.img_jindu.x, this.img_jindu.y, this.img_jindu.height, -90 * Math.PI / 180, (360 * cur / total - 90) * Math.PI / 180, false);
        shape.graphics.lineTo(this.img_jindu.x, this.img_jindu.y);
        shape.graphics.endFill();
    }

}