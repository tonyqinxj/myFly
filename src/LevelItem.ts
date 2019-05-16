class LevelItem extends eui.Component implements  eui.UIComponent {

	private txt_level:eui.Label;
	private level:number = 0;

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
		this.txt_level.text = ''+this.level
	}

	public setLevel(level:number):void{
		this.level = level;
		this.txt_level.text = ''+this.level
	}
}