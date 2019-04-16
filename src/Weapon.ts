/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon{
    protected p:eui.Group = null;
    protected attack:number =0;
    protected strength:number = 0;
    protected id:number = 0;
    protected config:any = null;
    protected mainWeapon:eui.Image = null;

    // 参数重置
    public constructor(p:eui.Group, mainWeapon:eui.Image, id:number, attack:number, strength:number){
        this.p = p;
        this.id = id;
        this.attack = attack;
        this.strength = strength;
        this.mainWeapon = mainWeapon;
        this.config = WingMan.WingConfig[this.id];
    }

    // 启动
    public start():void{

    }

    // 暂停
    public stop():void{

    }

    // 帧函数
    public update(deltaTime:number, star_flys:Array<any>):void{

    }
}