/**
 * Created by Administrator on 2019/4/18 0018.
 */

// 本接口处理怪物相关的一些事宜，
class MonsterTools {

    // 减速设置，可以设置多重
    public static pushSnow(star: any, type:string, speedRatio: number, snowTime: number): void {
        if (!star.snowlist) star.snowlist = [];
        for(let i=0;i<star.snowlist.length;i++){
            if(star.snowlist[i].type == type){
                star.snowlist[i].snowTime = snowTime;
                return;
            }
        }

        star.snowlist.push({
            type:type,
            speedRatio:speedRatio,  // 减速比例，可以重叠
            snowTime:snowTime,      // 总共需要减速的时间
            time:0,                 // 当前减速的时间
        })
    }

    // 获取怪物当前的减速比例
    public static getSnowRatio(star:any, deltaTime:number):number{
        if(!star.snowlist) return 1;

        let ratio = 1;
        for(let i=0;i<star.snowlist.length;){
            ratio *= star.snowlist[i].speedRatio;
            star.snowlist[i].time += deltaTime;
            if(star.snowlist[i].time > star.snowlist[i].snowTime){
                star.snowlist.splice(i,1)
            }else{
                i++;
            }
        }

        return ratio;
    }

    // 击退设置，可以设置多重，但是单个类型的击退只有一次，并且是后来者覆盖前面的
    public static pushJitui(star:any, type:string, up:number):void{
        if(!star.jitui) star.jitui =[];
        for(let i=0;i<star.jitui.length;i++){
            if(star.jitui[i].type == type){
                star.jitui[i].up = up;
                return;
            }
        }

        star.jitui.push({
            type:type,
            up:up,                 // 当前减速的时间
        })
    }

    // 每帧结束通过击退进行一次矫正
    public static doJitui(star:any):void{
        let up = 0;
        if(!star.jitui) return;

        star.jitui.forEach(tui=>{
            up += tui.up
        })

        star.model.y -= up;
        if (star.model.y < 0) star.model.y = 0;

        star.jitui = [];
    }

    //
    public static delHp(star:any, hp:number):void{
        star.blood -= hp;
        if (star.blood < 0) {
            star.blood = 0;
        }
    }
}