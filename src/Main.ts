class Main extends eui.UILayer {
    // 主调度模块，主要用于切换子页面

    private curPage: any;

    protected createChildren(): void {
        super.createChildren();

        GameData.main = this;
        this.curPage = null;
        GameData.loadUserInfo();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            window.addEventListener("focus", context.resume, false);
            window.addEventListener("blur", context.pause, false);
        })

        egret.lifecycle.onPause = () => {
            console.log('onPause');
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => { 
            console.log('onResume');
            egret.ticker.resume();
            GameData.resumePlayBgMusic();


            // 检测分享反馈
            if(this.game){
                let shareok:boolean = false;
                if((egret.getTimer() - this.game_set_time) > 6*1000) shareok = true;

                if(!shareok){
                    ResTools.showTextTip(this, '换个朋友试试吧');
                }

                this.game.resume(this.game_set_type, shareok);
                this.game = null;
                this.game_set_time = 0;
                this.game_set_type = '';
            }
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        if (window["canvas"]) {
            let w = window["canvas"].width;
            let h = window["canvas"].height;
            GameData.real_height = h / w * 750;
        }



        this.goStart().catch(e => {
            console.log(e);

            // this.checkJson().catch(e=>{
            //     console.log(e);
            // });
        })

        // let timer:egret.Timer = new egret.Timer(100, 0);
        // timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
        //     console.log('timer....')
        // }, this)
        // timer.start();
    }

    private game:StartUI = null;
    private game_set_type:string = '';
    private game_set_time:number = 0;
    public setGame(game:StartUI, type:string):void{
        this.game = game;
        this.game_set_type = type;
        this.game_set_time = egret.getTimer();
    }

    private async goStart() {
        // let res = await platform.createAuthButton();
        // console.log(res);
        await this.loadResource()
        this.setPage("logon");


    }

    private async checkMe(i:number){
        try{
            RES.getResByUrl(GameData.domain+'/resource/levels/' + i + '.json').then((json)=>{

            });
        }catch(e){
            console.log('check error:'+i, e);
        }

    }

    private async checkJson(){
        for(let i=1;i<=200;i++){
            this.checkMe(i);
        }

    }

    private async loadResource() {
        try {
            //await RES.loadConfig("default.res.json", "/resource");
            await RES.loadConfig("default.res.json", GameData.domain+"/resource");
            await this.loadTheme();
            await RES.loadGroup("start");
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private clearCurScene() {
        if (this.curPage) {
            if (this.curPage.beforeExit != undefined) this.curPage.beforeExit();
            this.removeChild(this.curPage);
        }
    }


    public setPage(page: string) {

        this.clearCurScene();
        switch (page) {
            case 'logon':
                this.curPage = new loginUI();
                break;
            case "start":
                this.curPage = new StartUI();
                break;
            case "game":
                this.curPage = new GameUI();
                break;
            case "over":
                this.curPage = new OverUI();
                break;
            default:
                return;
        }

        this.addChild(this.curPage);
    }

}
