class Star1 extends eui.Component implements  eui.UIComponent {

	public TG_1:egret.tween.TweenGroup;
	public TG_un:egret.tween.TweenGroup;

	public image:eui.Image;

	public static myid:number = 0;

	public curid:number = 0;
	public un:boolean = false;

	public constructor(name:string) {
		super();

		Star1.myid++;
		this.curid = Star1.myid;
		if(name == 'star1') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star2') this.skinName = "resource/eui_skins/guaiwu.exml";
		else if(name == 'star3') this.skinName = "resource/eui_skins/guaiwu.2.exml";
		else if(name == 'star4') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star5') this.skinName = "resource/eui_skins/guaiwu.5.exml";
		else if(name == 'star6') this.skinName = "resource/eui_skins/guaiwu.10.exml";
		else if(name == 'star7') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star8') this.skinName = "resource/eui_skins/guaiwu.3.exml";
		else if(name == 'star9') this.skinName = "resource/eui_skins/guaiwu.1.exml";
		else if(name == 'star10') this.skinName = "resource/eui_skins/guaiwu.9.exml";
		else if(name == 'star11') this.skinName = "resource/eui_skins/guaiwu.8.exml";
		else if(name == 'star12') this.skinName = "resource/eui_skins/guaiwu.7.exml";
		else if(name == 'star13') this.skinName = "resource/eui_skins/guaiwu.4.exml";
		else if(name == 'star14') this.skinName = "resource/eui_skins/guaiwu.6.exml";
		else if(name == 'star15') this.skinName = "resource/eui_skins/guaiwu.11.exml";
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
		//this.TG_1.addEventListener('complete', this.onTweenGroupComplete, this);
        //this.TG_1.addEventListener('itemComplete', this.onTweenItemComplete, this);
		this.loaded = true;
        this.doplay();

		//console.log('createstar.....',this.curid)
	}

	 /**
     * 动画组播放完成
     */
    private onTweenGroupComplete(): void {
       // console.log('TweenGroup play completed.', this.curid);
		 if(this.un){
		 	this.TG_un && this.TG_un.play(0)
		 }else{
			 this.TG_1.play(0)
		 }

    }
    /**
     * 动画组中的一项播放完成
     */
    private onTweenItemComplete(event: egret.Event): void {
        const item = event.data as egret.tween.TweenItem;
        //console.log(item.target);
        //console.log('TweenItem play completed.',this.curid);
		
    }

	private loaded:boolean = false;
	private needplay:boolean = false;
	private doplay():void{
		if(this.loaded && this.needplay){
			this.TG_1.play(0);
			//console.log('doplay ....',this.curid);
		}
	}

	public play():void{
		this.TG_1.addEventListener('complete', this.onTweenGroupComplete, this);
		this.needplay = true;
		this.doplay();
	}

	public stop():void{
		this.TG_1.removeEventListener('complete', this.onTweenGroupComplete, this);
    	this.TG_1.stop();

		//console.log('star stop.....', this.curid)
	}


	public playUn(un:boolean):void{
		this.un = un;
		if(un){
			this.TG_1.removeEventListener('complete', this.onTweenGroupComplete, this);
			this.TG_1.stop();
			this.TG_un.addEventListener('complete', this.onTweenGroupComplete, this);
			this.TG_un.play(0);
		}else{
			this.TG_un.removeEventListener('complete', this.onTweenGroupComplete, this);
			this.TG_un.stop();
			this.TG_1.addEventListener('complete', this.onTweenGroupComplete, this);
			this.TG_1.play(0);
		}
	}

	public changeColor(color:string):void{
		if(this.image)this.image.texture = ResTools.createTextureByName(color);
	}
}