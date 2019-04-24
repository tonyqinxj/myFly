// TypeScript file

class GameData {
    // 1624
    // -140     -370
    // 1484        1254
    //
    // 113
    // 4
    // 113  230
    // 140


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

    public static UserInfo = {
        openid: '',  // 玩家的openid
        tili:80,    // 体力
        total_money: 88888888888,  // 玩家当前拥有的金币
        total_diamond: 0,   // 钻石
        cur_level: 1, // 当前处于关卡
        next_level: 1, // 下一个需要通过的关卡，通常和cur_level一样，但可以选咋cur_level为已经通过的关卡，此时就不一样了
        goldcostlevel: 1,    // 金币价值等级
        goldtimelevel: 1,    // 挂机收益等级
        MainWeapon: {
            attack: 60,
            speed: 10,
        },
        SubWeapons: [{
            id: 1,
            strength: 1,
            attack: 1,
        }],
        CurSubWeaponId: 1,
    }

    public static needSaveUserInfo = false; //
    public static goldperstar = 6;  // 每个怪物产生的金币
    public static total_blood = 0; // 关卡总血量
    public static colors_blood = []; // 血量颜色值
    public static main: Main = null; // main 指针

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
        this.goldperstar = this.UserInfo.goldcostlevel * 6;
        this.score = 0;
        this.genBulletList();
        this.genLevelData();
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


        return attck;
    }

    public static getMainSpeed(): number {
        return this.UserInfo.MainWeapon.speed + 10;
    }

    public static getSubWeapon():any{
        return this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId-1];
    }

    public static getSubStrenth():number {
        return this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId-1].strength+20;
    }
    public static getSubAttack():number {
        let attack = this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId-1].attack;
        return attack;
    }

    public static getGoldCost():number {
        return this.UserInfo.goldcostlevel*6;
    }

    public static getGoldTime():number{
        return this.UserInfo.goldtimelevel*12;
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
    public static genLevelData() {
        let json = RES.getRes(this.UserInfo.cur_level + '_json');
        this.level_configs = json;

        this.total_blood = 0;
        json.forEach(j => {
            this.total_blood += j['blood'] || 0;
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
        this.UserInfo.total_money += gold;
        this.needSaveUserInfo = true;
        return true;
    }

    public static delGold(gold: number): boolean {
        if (this.UserInfo.total_money > gold) {
            this.UserInfo.total_money -= gold;
            this.needSaveUserInfo = true;
            return true;
        } else {
            return false;
        }
    }

    public static saveUserInfo() {
        if (this.needSaveUserInfo) {
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
                if (userinfo_data.total_money) GameData.UserInfo.total_money = userinfo_data.total_money
                if (userinfo_data.total_diamond) GameData.UserInfo.total_diamond = userinfo_data.total_diamond
                if (userinfo_data.cur_level) GameData.UserInfo.cur_level = userinfo_data.cur_level
                if (userinfo_data.next_level) GameData.UserInfo.next_level = userinfo_data.next_level
                if (userinfo_data.goldcostlevel) GameData.UserInfo.goldcostlevel = userinfo_data.goldcostlevel
                if (userinfo_data.goldtimelevel) GameData.UserInfo.goldtimelevel = userinfo_data.goldtimelevel
                if (userinfo_data.MainWeapon) GameData.UserInfo.MainWeapon = userinfo_data.MainWeapon
                if (userinfo_data.SubWeapons) GameData.UserInfo.SubWeapons = userinfo_data.SubWeapons
                if (userinfo_data.CurSubWeaponId) GameData.UserInfo.CurSubWeaponId = userinfo_data.CurSubWeaponId
                if (userinfo_data.tili) GameData.UserInfo.tili = userinfo_data.tili
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
                if (this.UserInfo.goldcostlevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldcostlevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldcostlevel;

                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x

                if (this.UserInfo.goldtimelevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldtimelevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldtimelevel;

                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId - 1];

                if (sub.attack <= 220) needGold = 14 * Math.pow(sub.attack, 2.43);
                else needGold = 30000 * sub.attack;

                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId - 1];

                if (sub.strength <= 220) needGold = 14 * Math.pow(sub.strength, 2.43);
                else needGold = 30000 * sub.strength;

                break;

        }

        return needGold;
    }

    public static levelup(type: string): boolean {
        let needGold = 0;
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
                if (this.UserInfo.goldcostlevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldcostlevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldcostlevel;
                if (this.delGold(needGold)) {
                    this.UserInfo.goldcostlevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'gold_time':
                //前220级: y=14x^2.43
                //220级以后： y=30000x

                if (this.UserInfo.goldtimelevel <= 220) needGold = 14 * Math.pow(this.UserInfo.goldtimelevel, 2.43);
                else needGold = 30000 * this.UserInfo.goldtimelevel;
                if (this.delGold(needGold)) {
                    this.UserInfo.goldtimelevel++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_attack':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId - 1];

                if (sub.attack <= 220) needGold = 14 * Math.pow(sub.attack, 2.43);
                else needGold = 30000 * sub.attack;
                if (this.delGold(needGold)) {
                    sub.attack++;
                    this.needSaveUserInfo = true;
                }
                break;
            case 'sub_speed':
                var sub = this.UserInfo.SubWeapons[this.UserInfo.CurSubWeaponId - 1];

                if (sub.strength <= 220) needGold = 14 * Math.pow(sub.strength, 2.43);
                else needGold = 30000 * sub.strength;
                if (this.delGold(needGold)) {
                    sub.strength++;
                    this.needSaveUserInfo = true;
                }
                break;

        }


        return false;
    }

}