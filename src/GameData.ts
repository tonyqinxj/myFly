// TypeScript file

class GameData {
    // 所有的全局游戏数据放置到这里

    public static main: Main = null; // main 指针

    public static openid: string = '';  // 玩家的openid
    public static total_money: string = '';  // 玩家当前拥有的金币
    public static cur_level: number = 1; // 当前处于关卡

    public static score: number = 0;   // 当前分数


    public static main_weapon: any = { attack: 3, speed: 65, bullet_speed: 2, bullet_rate: 100 }; // 主武器属性
    public static sub_weapon: any = { attack: 30, strength: 10 }; // 副武器属性


    public static bulletList: Array<number> = [1];    // 子弹发送顺序，发几颗

    public static item:any = {
        'jitui':{endtime:0, up:3}
    }; // 全局道具，比如击退什么的

    public static getBlood(star_level:number):number{
        return this.cur_level * 100 *star_level;
    }

    public static getTotalBlood(star_level:number):number{
        if(star_level==1) return this.getBlood(star_level);
        else return 2*this.getTotalBlood(star_level-1)+this.getBlood(star_level);
    }

    public static genBulletList():void{
        let speed = GameData.main_weapon.speed;
        if(speed <= 10){
            return;
        }

        let len = 10;     // 走多少步之后，从i到达i+1
        let last = 10;   // i等级对应的speed
        let i = 1;      // i -> i+1排子弹区间
        for(;i<11;i++){
            if(speed > last && speed <= last + len ){
                // 落入了区间
                break;
            }
            last+=len;
            len+=5;

        }

        let a = speed - last;
        let b = len - a;

        let g = [];
        if(a > b){
            g.push({
                num:a,
                index:i+1,
            })

            g.push({
                num:b,
                index:i
            })
        }else if(a<b){
            g.push({
                num:b,
                index:i
            })

            g.push({
                num:a,
                index:i+1,
            })
        }else{
            GameData.bulletList = [i,i+1];
            return;
        }

        GameData.bulletList = [];
        let n = Math.floor(g[0].num /g[1].num);
        let c = 0;
        for(let i=0;i<g[0].num;i++){
            GameData.bulletList.push(g[0].index);
            c++;
            if(c==n){
                GameData.bulletList.push(g[1].index);
                c=0;
            }
        }

    }

    public static level_configs =
    [
        // 第1波
        {
            blood:1000,
            tip: {

            }, // 提示， 本轮是否有提示
            init: [
                { time: 2000, id: 105, level: 1, x: 350 },
                // { time: 2000, id: 101, level: 1, x: 250 },
                // { time: 2000, id: 101, level: 1, x: 450 },
                // { time: 1000, id: 106, level: 2, x: 350 },
                // { time: 1000, id: 114, level: 2, x: 200 },
                // { time: 1000, id: 111, level: 2, x: 500 },
                // { time: 500, id: 112, level: 6, x: 500 },
                //  { time: 1500, id: 101, level: 1, x: 240 },
                // { time: 2000, id: 101, level: 1, x: 440 },
                // { time: 2000, id: 101, level: 1, x: 375 },
                // { time: 2000, id: 101, level: 1, x: 100 },
            ],  // 初始轮, 按照时间出现
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ], // 补充轮, 初始轮死亡之后的补充

        },
        // 第2波
        {
            blood:1000,
            tip: {

            }, // 提示， 本轮是否有提示
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],  // 初始轮, 按照时间出现
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ], // 补充轮, 初始轮死亡之后的补充

        },
        // 第3波
        {
            blood:1000,
            tip: {

            }, // 提示， 本轮是否有提示
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],  // 初始轮, 按照时间出现
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ], // 补充轮, 初始轮死亡之后的补充

        },

        // 第4波
        {
            blood:2000,
            tip: {
                model: 'BOSS来袭', // 提示的模型
                time: 1000,  // 什么时候提示， 
                wait: 3000,     // 提示之后多久开始出怪
            }, // 提示， 本轮是否有提示
            init: [
                { time: 1000, id: 101, level: 1, x: 375 },
                { time: 1500, id: 101, level: 1, x: 240 },
                { time: 2000, id: 101, level: 1, x: 440 },
                { time: 2000, id: 101, level: 1, x: 375 },
                { time: 2000, id: 101, level: 1, x: 100 },
            ],  // 初始轮, 按照时间出现
            add_ons: [
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 240 },
                { id: 101, level: 1, x: 440 },
                { id: 101, level: 1, x: 375 },
                { id: 101, level: 1, x: 100 },
            ], // 补充轮, 初始轮死亡之后的补充

        },

    ]


    public static bloodGen(batchInfo:any):void{
        let starCount = batchInfo.init.length + batchInfo.add_ons.length;
        let rands = [];
        for(let i=0;i<starCount;i++){
            rands.push(Tools.GetRandomNum(1, 100));
        }
        
        let rand_sums = 0;
        rands.forEach(r=>{
            rand_sums += r;
        })

        let index = 0;
        batchInfo.init.forEach(star=>{
            star["blood"] = Math.ceil(rands[index]/rand_sums * batchInfo.blood);
            index++;
        })

        batchInfo.add_ons.forEach(star=>{
            star["blood"] = Math.ceil(rands[index]/rand_sums * batchInfo.blood);
            index++;
        })
    }
}