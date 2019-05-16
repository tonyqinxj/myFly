class ShowTips extends eui.Component implements  eui.UIComponent {
	
	private txt_tip:eui.Label;

	private tip:string;
	public constructor(tip:string) {
		super();
		this.tip = tip;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.txt_tip.text = this.tip;
		console.log('showtops:', this.txt_tip.width, this.width);
		this.width = this.txt_tip.width;
		this.horizontalCenter = 0;
		egret.Tween.get(this).to({alpla:0.3, y:this.y - 100}, 1500).call(()=>{
			this.parent && this.parent.removeChild(this);
		})
	}
	
}