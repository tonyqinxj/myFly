var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2019/4/15 0015.
 */
var FxMgr = (function () {
    function FxMgr() {
    }
    FxMgr.init = function () {
        var _this = this;
        Object.keys(StarData.StarConfig).forEach(function (key) {
            var config = StarData.StarConfig[key];
            if (config['fx']) {
                _this.fxmap.push({
                    t: config['fx'].texture,
                    j: config['fx'].json,
                    s: _this.loadFx(config['fx'].texture, config['fx'].json)
                });
            }
        });
    };
    FxMgr.loadFx = function (texture, json) {
        var t = RES.getRes(texture);
        var j = RES.getRes(json);
        var s = new particle.GravityParticleSystem(t, j);
        s.emitterX = 0;
        s.emitterY = 0;
        return s;
    };
    FxMgr.getFx = function (t, j) {
        for (var i = 0; i < this.fxmap.length; i++) {
            var info = this.fxmap[i];
            if (info.t == t && info.j == j) {
                this.fxmap.splice(i, 1);
                return info.s;
            }
        }
        return this.loadFx(t, j);
    };
    FxMgr.releaseFx = function (t, j, s) {
        this.fxmap.push({
            t: t, j: j, s: s
        });
    };
    FxMgr.fxmap = [];
    return FxMgr;
}());
__reflect(FxMgr.prototype, "FxMgr");
//# sourceMappingURL=FxMgr.js.map