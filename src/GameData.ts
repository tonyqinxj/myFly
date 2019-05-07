// TypeScript file

class GameData {
    // 成长
    /**
     1. 金币价值 y=6x
     2. 挂机收益 y=12x
     3. 升级消耗的金币
     前200级: y=14x^2.43
     200级以后： y=30000x
     */
    // 所有的全局游戏数据放置到这里
    public static bulletModel = {
        '1': 'b1',   // 普通子弹
        '2': 'b2',   // 黄金子弹
        '3': 'b3',   // 击退子弹
        '4': 'b4',   // 强化火力
        '23': 'b23',
        '24': 'b24',
        '34': 'b34',
        '234': 'b234'
    };// 主武器子弹模型


    public static weaponOpenLevels = [20, 60, 100];//僚机开放等级（关卡等级）
    public static weaponNames = ['UI_json.fuwuqi_gbd', 'UI_json.fuwuqi_pt', 'UI_json.fuwuqi_cjb', 'UI_json.fuwuqi_sdq'];

    public static MAX_LEVEL = 40;

    public static UserInfo = {
        openid: '',  // 玩家的openid
        tili: 80,    // 体力
        totalMoney: 20000000,  // 玩家当前拥有的金币
        totalDiamond: 10,   // 钻石
        curLevel: 1, // 当前处于关卡
        nextLevel: 8, // 下一个需要通过的关卡，通常和cur_level一样，但可以选咋cur_level为已经通过的关卡，此时就不一样了
        goldCostLevel: 1,    // 金币价值等级
        goldTimeLevel: 1,    // 挂机收益等级
        MainWeapon: {
            attack: 1,
            speed: 1,
        },
        SubWeapons: [
            {
                id: 1,
                strength: 1,
                attack: 1,
                open: 1,
                openlevel: 0,
            },
            {
                id: 2,
                strength: 1,
                attack: 1,
                open: 1,
                openlevel: 1,
            },
            {
                id: 3,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 2,
            },
            {
                id: 4,
                strength: 1,
                attack: 1,
                open: 0,
                openlevel: 3,
            }
        ],
        curSubWeaponId: 1,
        lastGetGoldTime: 0,          //
        lastGetTiliTime: 0,     //
        failTry: {
            failTimes: 0,    // 连续失败次数， >=3则给一次僚机满级试用，每天最多给2次机会，关卡20级之前，用share，否则用视频
                             // 如果满级还是未通关，则给一次免费升级主机或者金币的机会
                             // 机会在内存中，如果重启就没了，或者进入关卡就消失
            tryTimes: 0,  // 今日试用次数
            lastTryTime: 0,  // 上次试用时间
        }
    }


    public static needSaveUserInfo = false; //
    public static total_blood = 0; // 关卡总血量
    public static colors_blood = []; // 血量颜色值
    public static main: Main = null; // main 指针
    public static start:StartUI = null;

    public static score: number = 0;   // 当前分数
    public static myFont: egret.BitmapFont = null; // 美术数字
    public static main_weapon: any = {
        bullet_speed: 2,    // 子弹飞行速度
        bullet_rate: 100,    // 子弹发射频率
        bullet_scale_time: 100, // 子弹从收拢到扩散的时间(ms)
    }; // 主武器参数

    public static bulletList: Array<number> = [1];    // 子弹发送顺序，发几颗

    public static level_configs = [] // 当前关卡数据，由/levels/*.json提供数据

    public static init(): void {
        this.score = 0;
        this.genBulletList();
        this.genLevelData().catch();
    }

    // 美术字的初始化
    public static initFont(): void {
        let texture: egret.Texture = RES.getRes("flydata_png");
        let config = RES.getRes("myfont_json");
        this.myFont = new egret.BitmapFont(texture, config);//RES.getRes('myfont_fnt');
    }

    public static getMainAttack(): number {
        let item = MonsterTools.getItem('addHitAttack')

        let attck = this.UserInfo.MainWeapon.attack
        if (item) attck += item['config']['ratio']
        attck = Math.floor(attck);
        let value = attck;
        if (attck > 10 && attck <= 30) value = 2 * attck - 10;
        if (attck > 30 && attck <= 50) value = 3 * attck - 40;
        if (attck > 50) value = Math.floor(10 * Math.exp(0.05 * attck));


        return value;
    }

    public static getMainSpeed(): number {
        return this.UserInfo.MainWeapon.speed + 10;
    }

    public static getSubWeapon(): any {
        if (this.failTryId && this.failTryState == 2&& this.UserInfo.curSubWeaponId == this.failTryId){
            return this.UserInfo.SubWeapons[this.failTryId - 1];
        }

        return this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];
    }

    public static getSubStrenth(): number {
        if (this.failTryId &&  this.failTryState == 2 && this.UserInfo.curSubWeaponId == this.failTryId ){
            return 33;
        }

        return this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1].strength;
    }

    public static getSubAttack(): number {
        if (this.failTryId && this.failTryState == 2&& this.UserInfo.curSubWeaponId == this.failTryId){
            return 200;
        }

        let attack = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1].attack;
        return attack;
    }

    public static getGoldCost(): number {
        return this.UserInfo.goldCostLevel * 6;
    }

    public static getGoldTime(): number {
        return this.UserInfo.goldTimeLevel * 12;
    }

    public static getGoldTimeMax(): number {
        return this.getGoldTime() * 4 * 60 * 6; // 每10秒增加一次, 最多加2小时
    }

    public static getCurGoldTime(): number {
        if (this.UserInfo.lastGetGoldTime == 0) {
            this.UserInfo.lastGetGoldTime = new Date().getTime();
            this.needSaveUserInfo = true;
            return 0;
        }

        let time = new Date().getTime() - this.UserInfo.lastGetGoldTime;
        let gold = time * this.getGoldTime() / 10000;
        let max = this.getGoldTimeMax();

        //gold = max/3;

        return Math.ceil(Math.min(gold, max));
    }

    public static onGetGoldTime(ratio:number): void {
        this.addGold(this.getCurGoldTime()*ratio)
        this.UserInfo.lastGetGoldTime = new Date().getTime();
        this.needSaveUserInfo = true;
    }

    // 第一次登陆的时候计算
    public static onCheckTili(txt:eui.Label): void {
        if (this.UserInfo.tili >= 80) {
            txt.text = ''
            return;
        }

        if (this.UserInfo.lastGetTiliTime) {
            let deltaTime = new Date().getTime() - this.UserInfo.lastGetTiliTime
            let add = Math.floor(deltaTime / 1000 / 60 / 6)
            if (add > 0) {
                this.UserInfo.tili += add;
                if (this.UserInfo.tili > 80) {
                    txt.text = ''
                    this.UserInfo.tili == 80
                }

                this.UserInfo.lastGetTiliTime = new Date().getTime();
                this.needSaveUserInfo = true;
            }else{
                deltaTime = Math.floor(deltaTime/1000)
                deltaTime = 6*60 - deltaTime;
                let fen = Math.floor(deltaTime/60);
                let miao = deltaTime - fen*60;
                txt.text = fen+':'+miao+'+1'
            }

        } else {
            this.UserInfo.lastGetTiliTime = new Date().getTime();
            txt.text = ''
        }
    }

    public static onBuyGoldByDiamond(diamond:number):void{
        if(diamond > this.UserInfo.totalDiamond) return;

        this.UserInfo.totalDiamond -= diamond;

        this.addGold(this.getGoldCost() * 500*diamond);

        this.UserInfo.lastGetTiliTime = new Date().getTime();
        this.needSaveUserInfo = true;
    }


    public static onHandleResult(ratio: number): void {
        let gold = this.score * ratio;
        this.score = 0;

        this.addGold(gold);
    }

    // 对一波怪物的血量进行初始化
    public static bloodGen(batchInfo: any): void {
        let starCount = batchInfo.init.length + batchInfo.add_ons.length;
        let rands = [];
        for (let i = 0; i < starCount; i++) {
            rands.push(Tools.GetRandomNum(1, 100));
        }

        let rand_sums = 0;
        rands.forEach(r => {
            rand_sums += r;
        })

        let index = 0;
        batchInfo.init.forEach(star => {
            star["blood"] = Math.ceil(rands[index] / rand_sums * batchInfo.blood);
            index++;
        })

        batchInfo.add_ons.forEach(star => {
            star["blood"] = Math.ceil(rands[index] / rand_sums * batchInfo.blood);
            index++;
        })
    }

    // 根据主武器的射速生成弹夹
    public static genBulletList(): void {
        // 晋级   步长(晋级需要的级别)
        // 1->2: 10
        // 2->3: 15
        // 3->4: 20
        // 4->5: 25
        // ...
        // 根据当前武器的level，确定其级别范围，比如落在3->4之间
        // 然后根据步长，计算出3和4的比例，最后将3和4按比例平均分配到一个数组中，数组有可能很长的～～


        let speed = this.getMainSpeed(); // 取出主武器的级别
        let item = MonsterTools.getItem('addHitSpeed');
        if (item) {
            speed += item['config']['ratio'];// 全局加速道具加持
        }

        if (speed <= 10) {
            return;
        }

        // 根据speed决定其落在哪个区间，区间为i->i+1
        let len = 10;     // 走多少步之后，从i到达i+1
        let last = 10;   // i等级对应的speed
        let i = 1;      // i -> i+1排子弹区间
        for (; i < 11; i++) {
            if (speed > last && speed <= last + len) {
                // 落入了区间
                break;
            }
            last += len;
            len += 5;

        }

        // 按照比例分配弹夹（将少的平均插入到多的一方）
        let a = speed - last;
        let b = len - a;

        // 排个顺序，多的在前面
        let g = [];
        if (a > b) {
            g.push({
                num: a,
                index: i + 1,
            })

            g.push({
                num: b,
                index: i
            })
        } else if (a < b) {
            g.push({
                num: b,
                index: i
            })

            g.push({
                num: a,
                index: i + 1,
            })
        } else {
            GameData.bulletList = [i, i + 1];
            return;
        }

        // 将少的一方插入多的一方的数组中
        GameData.bulletList = [];
        let n = Math.floor(g[0].num / g[1].num);
        let c = 0;
        for (let i = 0; i < g[0].num; i++) {
            GameData.bulletList.push(g[0].index);
            c++;
            if (c == n) {
                GameData.bulletList.push(g[1].index);
                c = 0;
            }
        }

    }

    // 装载关卡数据
    public static async genLevelData() {

        let json = await RES.getResByUrl('/resource/levels/' + this.UserInfo.curLevel + '.json');
        this.level_configs = json;

        this.total_blood = 0;
        json.forEach(j => {
            this.total_blood += j['blood'] || 0;
            j.init.forEach(s => {
                if (s['bossblood']) {
                    this.total_blood += s['bossblood'] // boss 额外加血
                }
            })

            j.add_ons.forEach(s => {
                if (s['bossblood']) {
                    this.total_blood += s['bossblood']
                }
            })
        })

        this.colors_blood = [];
        StarData.colorLevels.forEach(r => {
            this.colors_blood.push(this.total_blood * r)
        })


    }

    public static getColorName(blood: number): string {
        let i = 0;
        for (; i < this.colors_blood.length; i++) {
            if (blood >= this.colors_blood[i]) break;
        }

        return StarData.colorNames[i];
    }

    public static addGold(gold: number): boolean {
        this.UserInfo.totalMoney += gold;
        this.needSaveUserInfo = true;
        return true;
    }

    public static delGold(gold: number): boolean {
        if (this.UserInfo.totalMoney > gold) {
            this.UserInfo.totalMoney -= gold;
            this.needSaveUserInfo = true;
            return true;
        } else {
            return false;
        }
    }


    public static passLevel(): void {

        this.UserInfo.curLevel++;
        if (this.UserInfo.nextLevel <= this.UserInfo.curLevel) this.UserInfo.nextLevel++;

        if (this.UserInfo.curLevel > this.MAX_LEVEL) this.UserInfo.curLevel = this.MAX_LEVEL;
        if (this.UserInfo.nextLevel > this.MAX_LEVEL) this.UserInfo.nextLevel = this.MAX_LEVEL;


        for (let i = 0; i < this.UserInfo.SubWeapons.length; i++) {
            let sub = this.UserInfo.SubWeapons[i]
            if (sub.open == 0) {
                if (this.UserInfo.nextLevel > sub.openlevel) {
                    // todo:提示新的僚机获得
                    sub.open = 1;
                    this.needSaveUserInfo = true;
                }
                break;
            }
        }

        this.needSaveUserInfo = true;
    }

    public static selectWeapon(id: number): number {
        // 选择当前僚机
        if (id > this.UserInfo.SubWeapons.length) return;
        let sub = this.UserInfo.SubWeapons[id - 1]

        if (sub.open) {
            this.UserInfo.curSubWeaponId = id;
            return 0;
        } else {
            //todo: 提示武器将在某个等级开放
            return sub.openlevel
        }
    }

    public static saveUserInfo() {

        if (this.needSaveUserInfo) {
            this.needSaveUserInfo = false;
            var key: string = "myUserData";
            egret.localStorage.setItem(key, JSON.stringify(GameData.UserInfo));
        }

    }

    public static loadUserInfo(): void {
        var key: string = "myUserData";
        let userinfo = egret.localStorage.getItem(key);
        if (userinfo) {
            let userinfo_data: any = JSON.parse(userinfo);
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

            }
        }
    }

    public static getCost(type: string): number {
        let needGold = 0;
        switch (type) {
            case 'main_attack':
                if (this.UserInfo.MainWeapon.attack <= 220) needGold = 14 * Math.pow(this.UserInfo.MainWeapon.attack, 2.43);
                else needGold = 30000 * this.UserInfo.MainWeapon.attack;

                break;
            case 'main_speed':
                if (this.UserInfo.MainWeapon.speed <= 220) needGold = 14 * Math.pow(this.UserInfo.MainWeapon.speed, 2.43) / 3;
                else needGold = 10000 * this.UserInfo.MainWeapon.speed;

                break;
            case 'gold_cost':
                if (this.UserInfo.goldCostLevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldCostLevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldCostLevel;

                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x

                if (this.UserInfo.goldTimeLevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldTimeLevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldTimeLevel;

                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];

                if (sub.attack <= 220) needGold = 14 * Math.pow(sub.attack, 2.43);
                else needGold = 30000 * sub.attack;

                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];

                if (sub.strength <= 220) needGold = 14 * Math.pow(sub.strength, 2.43);
                else needGold = 30000 * sub.strength;

                break;

        }

        return needGold;
    }

    public static levelup_free(type:string):void{
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
    }

    public static levelup(type: string): boolean {
        let needGold = 0;
        this.needSaveUserInfo = false;
        switch (type) {
            case 'main_attack':
                if (this.UserInfo.MainWeapon.attack <= 220) needGold = 14 * Math.pow(this.UserInfo.MainWeapon.attack, 2.43);
                else needGold = 30000 * this.UserInfo.MainWeapon.attack;
                if (this.delGold(needGold)) {
                    this.UserInfo.MainWeapon.attack++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'main_speed':
                if (this.UserInfo.MainWeapon.speed <= 220) needGold = 14 * Math.pow(this.UserInfo.MainWeapon.speed, 2.43) / 3;
                else needGold = 10000 * this.UserInfo.MainWeapon.speed;
                if (this.delGold(needGold)) {
                    this.UserInfo.MainWeapon.speed++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'gold_cost':
                if (this.UserInfo.goldCostLevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldCostLevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldCostLevel;
                if (this.delGold(needGold)) {
                    this.UserInfo.goldCostLevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x

                if (this.UserInfo.goldTimeLevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldTimeLevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldTimeLevel;
                if (this.delGold(needGold)) {
                    this.UserInfo.goldTimeLevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];

                if (sub.attack <= 220) needGold = 14 * Math.pow(sub.attack, 2.43);
                else needGold = 30000 * sub.attack;
                if (this.delGold(needGold)) {
                    sub.attack++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.curSubWeaponId - 1];

                if (sub.strength <= 220) needGold = 14 * Math.pow(sub.strength, 2.43);
                else needGold = 30000 * sub.strength;
                if (this.delGold(needGold)) {
                    sub.strength++;
                    this.needSaveUserInfo = true;
                }
                break;

        }


        if(this.needSaveUserInfo){
            platform.playMusic('resource/sounds/WeaponLevelUp.mp3',1);
        }


        return false;
    }

    public static  failTryId = 0;   // 僚机id
    public static  failTryState = 0; // 1: 表示需要播放视频，2：表示可以使用，0：表示不可使用

    public static setWin(win:boolean):void{
        if(win){
            if(this.UserInfo.failTry.failTimes > 0){
                this.needSaveUserInfo = true;
            }
            this.UserInfo.failTry.failTimes = 0;
        }else{
            this.UserInfo.failTry.failTimes++;
            this.needSaveUserInfo = true;

            if(this.UserInfo.failTry.failTimes >=3 ){
                // 连续失败三次, 给一次满级试用资格, 每天最多2次
                if(this.UserInfo.failTry.lastTryTime > 0){
                    let day = new Date(this.UserInfo.failTry.lastTryTime);
                    let tnow = new Date();
                    if(day.getDate() != tnow.getDate() || day.getFullYear() != tnow.getFullYear()){
                        this.UserInfo.failTry.lastTryTime == 0;
                        this.UserInfo.failTry.tryTimes = 0;
                    }
                }

                if(this.UserInfo.failTry.tryTimes >=2) return;

                let count = 0;
                this.UserInfo.SubWeapons.forEach(s=>{
                    if(s.open) count++;
                })

                this.failTryId = Tools.GetRandomNum(1, count);
                this.failTryState = 1;

                this.UserInfo.failTry.failTimes = 0;
            }
        }
    }


    public static upfree:number = 0;   // 免费升级资格
    public static clearWin(win:boolean):void{
        if(this.failTryState > 0){
            this.UserInfo.failTry.tryTimes++;
            this.UserInfo.failTry.lastTryTime = new Date().getTime();
            this.needSaveUserInfo = true;

            if(!win){
                // 随机一个免费的主武器或者金币的升级资格,需要播放视频
                this.upfree = Tools.GetRandomNum(1,4)

            }
        }

        this.failTryState = 0;
        this.failTryId = 0;
    }

}