/**
 * Created by Administrator on 2019/4/18 0018.
 */

// 本接口处理怪物相关的一些事宜，
class MonsterTools {
    // 减速设置，可以设置多重
    public static pushSnow(star: any, type: string, speedRatio: number, snowTime: number): void {
        if (!star.snowlist) star.snowlist = [];
        for (let i = 0; i < star.snowlist.length; i++) {
            if (star.snowlist[i].type == type) {
                star.snowlist[i].snowTime = snowTime;
                return;
            }
        }

        star.snowlist.push({
            type: type,
            speedRatio: speedRatio,  // 减速比例，可以重叠
            snowTime: snowTime,      // 总共需要减速的时间
            time: 0,                 // 当前减速的时间
        })
    }

    // 获取怪物当前的减速比例
    public static getSnowRatio(star: any, deltaTime: number): number {
        if (!star.snowlist) return 1;

        let ratio = 1;
        for (let i = 0; i < star.snowlist.length;) {
            ratio *= star.snowlist[i].speedRatio;
            star.snowlist[i].time += deltaTime;
            if (star.snowlist[i].time > star.snowlist[i].snowTime) {
                star.snowlist.splice(i, 1)
            } else {
                i++;
            }
        }

        let itemAddStarMove = this.getItem('addStarMove');
        if (itemAddStarMove) {
            ratio *= itemAddStarMove['config']['ratio'];
        }

        let itemReduceStarMove = this.getItem('reduceStarMove');
        if (itemReduceStarMove) {
            ratio *= itemReduceStarMove['config']['ratio'];
        }

        return ratio;
    }

    //public static pushScaleInfo(star:any, )

    // 体型影响因素
    /*
     1. 创建时：根据level来确定基础体型,只需要一个level就可以
     2. 随star存在的时间进行变化：scale_info进行的控制
     3. 全局道具的原因导致：检测道具是否存在
     4. 被攻击的时候有个缩小在恢复的功效：
     5. 黑洞变大
     6. 被黑洞吸收，变小
     */
    public static doScale(star: any, deltaTime_snow:number): void {
        // 黑洞不再此列
        if(star.starConfig['eat']) return;

        let scale = StarData.scaleWithLevel[star.level]; // 来自体型的

        if(star['size']) scale = star['size']
        else if(star['bosssize']){
            scale = StarData.scaleWithLevel[star['bosssize']];
        }

        if(star.starConfig['group']&StarData.CAN_ATTACK){
            let itemBigStar = this.getItem('bigStar')
            if (itemBigStar) {
                scale *= itemBigStar['config']['ratio'];    // 累计上来自全局道具的
            }
        }

        let lastscale = {
            scaleX: 1,
            scaleY: 1,
        }

        if (star.starConfig['scale_info']) {
            let scaleInfo = star.starConfig['scale_info']
            lastscale.scaleX = scaleInfo.start.scaleX;
            lastscale.scaleY = scaleInfo.start.scaleY;

            if (scaleInfo.change) {
                let totalTime = 0;
                let lastinfo = null;
                scaleInfo.change.scalelist.forEach(info => {
                    totalTime += info.time;
                    lastinfo = info;
                })

                let lifeTime = star.lifeTime;
                if (!scaleInfo.change.loop && lifeTime >= totalTime) {
                    //
                    lastscale.scaleX = lastinfo.scaleX;
                    lastscale.scaleY = lastinfo.scaleY;
                } else {
                    if (scaleInfo.change.loop) {
                        lifeTime %= totalTime;
                    }

                    // 线性插值
                    let curTime = 0;
                    let lastinfo = null;
                    for (let i = 0; i < scaleInfo.change.scalelist.length; i++) {
                        lastinfo = scaleInfo.change.scalelist[i]
                        if (lifeTime < curTime + lastinfo.time && lifeTime >= curTime) {
                            break;
                        }
                        curTime += lastinfo.time;
                        lastscale.scaleX = lastinfo.scaleX;
                        lastscale.scaleY = lastinfo.scaleY;
                    }


                    let r = (lifeTime - curTime) / lastinfo.time;

                    lastscale.scaleX = lastscale.scaleX * (1-r) + lastinfo.scaleX *  r;
                    lastscale.scaleY = lastscale.scaleY * (1-r) + lastinfo.scaleY *  r;
                }

            }
        }

        if(deltaTime_snow && star['hurtScale']){
            let hurtScale = star['hurtScale'];
            hurtScale.time += deltaTime_snow;

            if(hurtScale.time > hurtScale.maxtime){
                delete star['hurtScale']
            }else if(hurtScale.time > hurtScale.maxtime/2){
                // 后半程
                let r1 = (hurtScale.time - hurtScale.maxtime/2)/(hurtScale.maxtime/2)
                let r2 = 1-r1
                let s = hurtScale.scale * r2 + r1;
                scale *= s;
            }else{
                let r1 = (hurtScale.maxtime/2 - hurtScale.time)/(hurtScale.maxtime/2)
                let r2 = 1-r1
                let s = hurtScale.scale * r2 + r1;
                scale *= s;
            }
        }

        star.model.scaleX = lastscale.scaleX * scale;
        star.model.scaleY = lastscale.scaleY * scale;
    }

    // 击退设置，可以设置多重，但是单个类型的击退只有一次，并且是后来者覆盖前面的
    public static pushJitui(star: any, type: string, up: number): void {
        if (!star.jitui) star.jitui = [];
        for (let i = 0; i < star.jitui.length; i++) {
            if (star.jitui[i].type == type) {
                star.jitui[i].up = up;
                return;
            }
        }

        star.jitui.push({
            type: type,
            up: up,                 // 当前减速的时间
        })
    }

    // 每帧结束通过击退进行一次矫正
    public static doJitui(star: any): void {
        let up = 0;
        if (!star.jitui) return;

        star.jitui.forEach(tui => {
            up += tui.up
        })

        star.model.y -= up;
        if (star.model.y < 0) star.model.y = 0;

        star.jitui = [];
    }

    // 怪物减血
    public static delHp(star: any, hp: number): void {
        star.blood -= hp;
        if (star.blood < 0) {
            star.blood = 0;
        }

        if(!star['hurtScale']){
            star['hurtScale'] = {
                time:0,
                maxtime:StarData.hurtScale.time,
                scale:StarData.hurtScale.scale
            }
        }
    }

    public static itemPanel: eui.Component = null;
    public static itemYs = [150, 300, 450, 600, 750]; // 位置, 5个, 关于道具随机，一旦同时爆出了5个不同类型的道具，以后都在这个范围内爆
    public static items = []; // 全局道具icon
    public static itemMap = {}; // key :y, value:item

    public static itemInGames = []; // 当前存在的item，最多5种

    public static pushItemToGame(id:string){
        for(let i=0;i<this.itemInGames.length;i++){
            if(this.itemInGames[i].id == id){
                this.itemInGames[i].nums ++;
                return;
            }
        }

        this.itemInGames.push({
            id:id,
            nums:1
        })
    }

    public static popItemFromGame(id:string){
        for(let i=0;i<this.itemInGames.length;i++){
            if(this.itemInGames[i].id == id){
                this.itemInGames[i].nums --;
                if(this.itemInGames[i].nums == 0){
                    this.itemInGames.splice(i,1);
                }
                return;
            }
        }
    }

    public static testRandItem(){
        if(this.itemInGames.length == this.itemYs.length){
            let rand = Tools.GetRandomNum(1, this.itemYs.length);
            let id = this.itemInGames[rand-1].id
            return ItemData.getItemConfig(id);
        }

        return null;
    }

    public static clearItems():void{
        this.items.forEach(item=>{
            item.model && item.model.parent && item.model.parent.removeChild(item.model);
        })
        this.items =[];
        this.itemMap ={};
        this.itemInGames = [];
    }

    protected static findItemEmptyPos(): number {
        let y = 0;
        for (let i = 0; i < this.itemYs.length; i++) {
            let thisY = this.itemYs[i];
            if (this.itemMap[thisY]) continue;
            y = thisY;
            break;
        }

        return y;
    }


    public static  addItem(config: any): void {
        // 看是否有同类道具存在，有的话，只延长时间
        for (let j = 0; j < this.items.length; j++) {
            let item = this.items[j]
            if (config.id == item.config.id) {
                item.time = 0;
                this.setItemTime(item);
                return;
            }
        }

        // 增加一个新道具
        let model = new ItemIcon(config.time, config.icon, config.jindu); //ResTools.createUIBitmap(config.icon);
        model.x = 640;

        // 没有同类道具，则需要找一个新的位置
        let y = this.findItemEmptyPos();
        let item = {
            y: y,
            time: 0,
            config: config,
            model: model,
        }

        this.items.push(item)

        if (y > 0) {
            model.y = y;
            this.itemPanel.addChild(model);
            this.itemMap[y] = item;
            this.setItemTime(item);
        }

        this.itemBegin(item);
    }

    // 延长道具时间
    public static setItemTime(item: any): void {
        // 时间进度条更新
    }

    // update, 全局道具
    public static updateItems(deltaTime: number): void {
        // 先计算过期
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            item.time += deltaTime
            item.model.setTime(item.time);
            if (item.time >= item.config.time) {
                // 结束
                if (item.y > 0) delete this.itemMap[item.y]

                this.items.splice(i, 1)
                i--

                this.itemEnd(item);
            }
        }
    }

    public static itemEnd(item: any): void {
        if(item.config.id == 'addHitSpeed'){
            GameData.genBulletList();
        }
        if(item.config.id == 'friend'){
            GameData.start.RemoveFriend();
        }

        item.model && item.model.parent && item.model.parent.removeChild(item.model);

        this.popItemFromGame(item.config.id);
    }

    public static itemBegin(item: any): void {
        //if(item.id == 'addStarMove' || item.id == 'reduceStarMove')
        if(item.config.id == 'addHitSpeed'){
            GameData.genBulletList();
        }

        if(item.config.id == 'friend'){
            GameData.start.CreateFriend();
        }
    }

    public static getItem(id: string): boolean {
        for (let i = 0; i < this.items.length; i++) {
            if (id == this.items[i].config.id) return this.items[i];
        }

        return null;
    }


    public static getBulletName():string{
        let gold = this.getItem('gold'); //b2
        let hitBack = this.getItem('hitBack'); // b3
        let addHitAttack = this.getItem('addHitAttack'); // b4
        if(gold && hitBack && addHitAttack) return 'b234'
        if(gold && hitBack) return 'b23'
        if(gold && addHitAttack) return 'b24'
        if(hitBack && addHitAttack) return 'b34'
        if(gold) return 'b2'
        if(hitBack) return 'b3'
        if(addHitAttack) return 'b4'
        return 'b1'
    }
}