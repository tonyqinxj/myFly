/**
 * Created by Administrator on 2019/4/15 0015.
 */
class FxMgr{
    private static fxmap=[];

    public static init():void{
        Object.keys(StarData.StarConfig).forEach((key)=>{
            let config = StarData.StarConfig[key];

            if(config['fx']){

                this.fxmap.push({
                    t:config['fx'].texture,
                    j:config['fx'].json,
                    s:this.loadFx(config['fx'].texture, config['fx'].json)
                })
            }
        })
    }

    private static loadFx(texture:string, json:string):particle.GravityParticleSystem{
        let t = RES.getRes(texture);
        let j = RES.getRes(json);
        let s = new particle.GravityParticleSystem(t, j);

        s.emitterX = 0;
        s.emitterY = 0;

        return s;


    }

    public  static getFx(t:string, j:string):particle.GravityParticleSystem{
        for(let i=0;i<this.fxmap.length;i++){
            let info = this.fxmap[i]
            if(info.t==t && info.j==j){
                this.fxmap.splice(i,1)
                return info.s;
            }
        }

        return this.loadFx(t,j);

    }
}