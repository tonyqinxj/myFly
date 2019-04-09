var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StarData = (function () {
    function StarData() {
    }
    StarData.StarConfig = {
        '101': {
            id: 101,
            modle: '1_png',
            speed: 0.1,
            attack_speed: 0.3,
            snow_time: 200,
        },
        '102': {
            id: 102,
            modle: '1_png',
            speed: 0.1,
            attack_speed: 0.3,
            add_speed: [
                { time: 2000, wait: false, add: 0.0001 },
                { time: 1000, wait: false, add: -0.0002 },
                { time: 2000, wait: true, add: 0 }
            ],
            create_new_star: {
                time: 1000,
                id: '101',
                level: 1,
                life: 5000,
                scaleX: 0.5,
                scaleY: 0.5,
                scale: { time: 1000, scaleX: 1.4, scaleY: 1 }
            }
        },
    };
    return StarData;
}());
__reflect(StarData.prototype, "StarData");
//# sourceMappingURL=StarData.js.map