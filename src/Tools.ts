class Tools {
	public constructor() {
	}

	public static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {

		let obj1_global = obj1.localToGlobal(obj1.width / 2, obj1.height / 2)
		let obj2_global = obj2.localToGlobal(obj2.width / 2, obj2.height / 2)

		let rect1 = new egret.Rectangle(
			obj1_global.x - obj1.width / 2,
			obj1_global.y - obj1.height / 2,
			obj1.width,
			obj1.height)

		let rect2 = new egret.Rectangle(
			obj2_global.x - obj2.width / 2 * obj2.scaleX,
			obj2_global.y - obj2.height / 2 * obj2.scaleY,
			obj2.width * obj2.scaleX,
			obj2.height * obj2.scaleY)


		let ret = rect1.intersects(rect2);

		return ret;
	}


	public static GetRandomNum(min: number, max: number): number {
		if (max < min) return this.GetRandomNum(max, min);
		else {
			return (min + Math.floor(Math.random() * (max - min + 1)));
		}
	}

	public static angle2radian(angel:number):number{
		return 0.017453293 *angel;
	}
}