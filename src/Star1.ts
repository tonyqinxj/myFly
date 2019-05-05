class Star1 extends eui.Component implements  eui.UIComponent {

	public TG_1:egret.tween.TweenGroup;
	public image:eui.Image;

	public constructor(name:string) {
		super();

		if(name == 'star1') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star2') this.skinName = "resource/eui_skins/guaiwu.2.exml";
		else if(name == 'star3') this.skinName = "resource/eui_skins/guaiwu.3.exml";
		else if(name == 'star4') this.skinName = "resource/eui_skins/guaiwu.4.exml";
		else if(name == 'star5') this.skinName = "resource/eui_skins/guaiwu.5.exml";
		else if(name == 'star6') this.skinName = "resource/eui_skins/guaiwu.6.exml";
		else if(name == 'star7') this.skinName = "resource/eui_skins/guaiwu.7.exml";
		else if(name == 'star8') this.skinName = "resource/eui_skins/guaiwu.8.exml";
		else if(name == 'star9') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star10') this.skinName = "resource/eui_skins/guaiwu.2.exml";
		else if(name == 'star11') this.skinName = "resource/eui_skins/guaiwu.3.exml";
		else if(name == 'star12') this.skinName = "resource/eui_skins/guaiwu.4.exml";
		else if(name == 'star13') this.skinName = "resource/eui_skins/guaiwu.5.exml";
		else if(name == 'star14') this.skinName = "resource/eui_skins/guaiwu.6.exml";
		else if(name == 'star15') this.skinName = "resource/eui_skins/guaiwu.7.exml";
		else this.skinName = "resource/eui_skins/guaiwu.1.exml";

	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();

		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		this.TG_1.addEventListener('complete', this.onTweenGroupComplete, this);
        //this.TG_1.addEventListener('itemComplete', this.onTweenItemComplete, this);
		this.loaded = true;
        this.doplay();
	}

	 /**
     * 动画组播放完成
     */
    private onTweenGroupComplete(): void {
        //console.log('TweenGroup play completed.');
		this.TG_1.play(0)
    }
    /**
     * 动画组中的一项播放完成
     */
    private onTweenItemComplete(event: egret.Event): void {
        const item = event.data as egret.tween.TweenItem;
        console.log(item.target);
        console.log('TweenItem play completed.');
		
    }

	private loaded:boolean = false;
	private needplay:boolean = false;
	private doplay():void{
		if(this.loaded && this.needplay){
			this.TG_1.play(0);
		}
	}

	public play():void{
		this.needplay = true;
		this.doplay();
	}

	public stop():void{
		this.TG_1.removeEventListener('complete', this.onTweenGroupComplete, this);
    	this.TG_1.stop();
	}

	public changeColor(color:string):void{
		if(this.image)this.image.texture = ResTools.createTextureByName(color);
	}
}