/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon{
    protected p:eui.Group = null;
    protected id:number = 0;
    protected config:any = null;
    protected mainWeapon:wuqi_1 = null;

    // 参数重置
    public constructor(p:eui.Group, mainWeapon:wuqi_1, id:number, attack:number, strength:number){
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

    public getAttackCost():number{
        let sub_weapon = GameData.getSubWeapon();
        if(sub_weapon) {
            let fun = this.config['getAttackCost'];
            if (fun) return fun(sub_weapon.attack);
        }

        return 0;
    }

    public getStrengthCost():number{
        let sub_weapon = GameData.getSubWeapon();
        if(sub_weapon) {
            let fun = this.config['getStrengthCost'];
            if (fun) return fun(sub_weapon.strength);
        }
        return 0;
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