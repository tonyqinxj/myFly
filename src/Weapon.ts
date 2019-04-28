/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon{
    protected p:eui.Group = null;
    protected id:number = 0;
    protected config:any = null;
    protected mainWeapon:eui.Component = null;

    // 参数重置
    public constructor(p:eui.Group, mainWeapon:eui.Component, id:number, attack:number, strength:number){
        this.p = p;
        this.id = id;
        this.mainWeapon = mainWeapon;
        this.config = WingMan.WingConfig[this.id];
    }

    // 启动
    public start():void{

    }

    // 暂停
    public stop():void{

    }

    public clear():void{

    }
    // 帧函数
    public update(deltaTime:number, deltaTime_snow:number,  star_flys:Array<any>):void{

    }

    public getAttack():number{
        let fun = this.config['getAttack'];
        if(fun) return fun(GameData.getSubAttack())

        return GameData.getSubAttack();
    }

    public getStrength():number{
        let fun = this.config['getStrength'];
        if(fun) return fun(GameData.getSubStrenth())

        return GameData.getSubStrenth();
    }

    public updateProperty():void{};
}