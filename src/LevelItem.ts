class LevelItem extends eui.Component implements  eui.UIComponent {

	private img_level_item_bg:eui.Image;
	private txt_level:eui.Label;
	private level:number = 0;
	private img_boss_tag:eui.Image;

	public constructor(level:number) {
		super();
		this.level = level;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.updateData();
	}

	public setLevel(level:number):void{
		if(this.level != level){
			this.level = level;
			this.updateData();
		}
	}

	public updateData():void{
		if(this.level == 0) this.txt_level.text = 'Go'
		else this.txt_level.text = ''+this.level

		if(this.level > 0 && this.level%5 == 0){
			this.img_boss_tag.visible = true;
		}else{
			this.img_boss_tag.visible = false;
		}

		if(this.level == GameData.UserInfo.curLevel){
			this.img_level_item_bg.texture = ResTools.createUITexture('sy_guanka_2')
		}else{
			this.img_level_item_bg.texture = ResTools.createUITexture('sy_guanka_1')
		}
	}
}