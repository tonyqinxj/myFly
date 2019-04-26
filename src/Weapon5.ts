/**
 * Created by Administrator on 2019/4/16 0016.
 */
class Weapon5 extends Weapon {

    //
    public constructor(p: eui.Group, mainWeapon: eui.Component, id: number, attack: number, strength: number) {

        super(p, mainWeapon, id, attack, strength);

        console.log('create weapon...')


    }

    // 启动
    public start(): void {

    }

    // 暂停
    public stop(): void {

    }

    // 帧函数，子弹的移动，子弹的碰撞检测，子弹的生命周期检测
    public update(deltaTime: number, deltaTime_snow: number, star_flys: Array<any>): void {
        // 充能

    }



}