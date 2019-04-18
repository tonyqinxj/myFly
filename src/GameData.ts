// TypeScript file

class GameData {
    // 所有的全局游戏数据放置到这里

    public static bulletModel = {
        '1':'b1',   // 普通子弹
        '2':'b2',   // 黄金子弹
        '3':'b3',   // 击退子弹
        '4':'b4',   // 强化火力
        '23':'b23',
        '24':'b24',
        '34':'b34',
        '234':'b234'
    };// 主武器子弹模型


    public static main: Main = null; // main 指针
    public static openid: string = '';  // 玩家的openid
    public static total_money: string = '';  // 玩家当前拥有的金币
    public static cur_level: number = 1; // 当前处于关卡
    public static score: number = 0;   // 当前分数
    public static myFont:egret.BitmapFont = null; // 美术数字
    public static main_weapon: any = {
        attack: 3,  // 火力，每颗子弹的伤害
        speed: 11, // 射速
        bullet_speed: 2,    // 子弹飞行速度
        bullet_rate: 100    // 子弹发射频率
    }; // 主武器属性
    public static sub_weapon: any = {
        attack: 11,          // 火力
        strength: 10,       // 强度
        id:4,               // id
    }; // 副武器属性
    public static bulletList: Array<number> = [1];    // 子弹发送顺序，发几颗
    public static item: any = {
        'jitui': {
            endtime: 0, // 是道具结束的时间点
            up: 3       // 每次被击退的距离
        },
    }; // 当前全局道具，比如击退什么的
    public static level_configs = [] // 当前关卡数据，由/levels/*.json提供数据

    // 美术字的初始化
    public static initFont():void{
        let texture:egret.Texture = RES.getRes("flydata_png");
        let config = RES.getRes("myfont_json");
        this.myFont = new egret.BitmapFont(texture,config);//RES.getRes('myfont_fnt');
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
        let speed = GameData.main_weapon.speed;
        if (speed <= 10) {
            return;
        }

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

        let a = speed - last;
        let b = len - a;

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
            let json = RES.getRes(this.cur_level+'_json');
            this.level_configs = json;
    }
}