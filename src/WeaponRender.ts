class WeaponRender extends eui.ItemRenderer {
	public id:eui.Label;
	public open:eui.Label;
	public img_weapon:eui.Image;
	public img_select:eui.Image;
	public gp_weapon:eui.Group;

	public constructor() {
		super();
		this.skinName = "weaponSkin";
	}

	protected createChildren(): void {
		super.createChildren();
		this.gp_weapon.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			console.log('选中了：', this.id.text);
			EventManager.dispatchEvent('selectWeapon', { id: this.id.text })
		}, this);
	}

	protected dataChanged(): void{
		if(this.open.text == '0'){
			// 灰度化
		}else{
			// 去掉灰度
		}
	}
}