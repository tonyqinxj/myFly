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
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.goStart().catch(e => {
            console.log(e);
        })

        // let timer:egret.Timer = new egret.Timer(100, 0);
        // timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
        //     console.log('timer....')
        // }, this)
        // timer.start();
    }

    private async goStart() {
        await this.loadResource()
        this.setPage("start");

        const loginInfo = await platform.login();
        console.log('loginInfo:', loginInfo);

        if (loginInfo && loginInfo.code) {
            const res = await HttpTools.httpPost("https://www.nskqs.com/getOpenId", { code: loginInfo.code, name: 'myfruit', num: 333 });
            console.log('res:', res);
            if (res.errcode == 0) {
                let data = JSON.parse(res.data);
                GameData.UserInfo.openid = data.openid;
            }
        }

    }

    private async loadResource() {
        try {
            await RES.loadConfig("default.res.json", "/resource");
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
