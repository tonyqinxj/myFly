class ItemIcon extends eui.Component implements  eui.UIComponent {

	private item:eui.Image;
	private jindu:eui.Image;
	private maskShape: egret.Shape = null;
	private maxTime:number = 0;
	private curTime:number = 0;
	private iconName:string = '';
	private jdName:string = '';

	public constructor(time:number, iconName:string, jdName:string) {
		super();
		this.maxTime = time;
		this.iconName = iconName;
		this.jdName = jdName;
	}

	public setTime(time:number):void{
		this.curTime = time;
		this.updateMask();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.item.texture = ResTools.createUITexture(this.iconName);
		this.jindu.texture = ResTools.createUITexture(this.jdName);

		this.initMask();

	}

	private initMask(): void {
		var shape: egret.Shape = this.maskShape = new egret.Shape();
		shape.graphics.beginFill(0x00ffff, 1);
		shape.graphics.drawCircle(this.jindu.x, this.jindu.y, 150);
		shape.graphics.endFill();
		this.addChild(shape);
		this.jindu.mask = shape;

		this.updateMask();
	}

	private updateMask(): void {
		let total = this.maxTime;
		let cur = total - this.curTime;

		var shape: egret.Shape = this.maskShape;

		shape.graphics.clear();
		shape.graphics.beginFill(0x00ffff, 1);
		shape.graphics.moveTo(this.jindu.x, this.jindu.y);
		shape.graphics.lineTo(this.jindu.x, this.jindu.y - 150);

		//我们从上开始绘制，则弧度为-90 * Math.PI / 180
		shape.graphics.drawArc(this.jindu.x, this.jindu.y, 150, -90 * Math.PI / 180, (360 * cur / total - 90) * Math.PI / 180, false);
		shape.graphics.lineTo(this.jindu.x, this.jindu.y);
		shape.graphics.endFill();
	}
	
}