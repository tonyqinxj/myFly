class Tools {
	public constructor() {
	}

	// 中心点在中间的2个物体的碰撞检测，AABB碰撞
	public static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {

		let obj1_global = obj1.localToGlobal(0, 0)
		let obj2_global = obj2.localToGlobal(0, 0)

		let rect1 = new egret.Rectangle(
			obj1_global.x - obj1.width/2*obj1.scaleX,
			obj1_global.y - obj1.width/2*obj1.scaleY,
			obj1.width*obj1.scaleX,
			obj1.height*obj1.scaleY)

		let rect2 = new egret.Rectangle(
			obj2_global.x - obj2.width/2*obj2.scaleX,
			obj2_global.y - obj2.width/2*obj2.scaleY,
			obj2.width*obj2.scaleX,
			obj2.height*obj2.scaleY)


		let ret = rect1.intersects(rect2);

		return ret;
	}

	/** 获取碰撞相交矩形区域 */
	public static intersectionRectangle(obj1: egret.DisplayObject, obj2: egret.DisplayObject): egret.Rectangle {

		let obj1_global = obj1.localToGlobal(0, 0)
		let obj2_global = obj2.localToGlobal(0, 0)

		let rect1 = new egret.Rectangle(
			obj1_global.x - obj1.width/2*obj1.scaleX,
			obj1_global.y - obj1.width/2*obj1.scaleY,
			obj1.width*obj1.scaleX,
			obj1.height*obj1.scaleY)

		let rect2 = new egret.Rectangle(
			obj2_global.x - obj2.width/2*obj2.scaleX,
			obj2_global.y - obj2.width/2*obj2.scaleY,
			obj2.width*obj2.scaleX,
			obj2.height*obj2.scaleY)


		let ret = rect1.intersects(rect2);
		if(!ret) return new egret.Rectangle();

		return new egret.Rectangle(
			Math.max(rect1.x, rect2.x),
			Math.max(rect1.y, rect2.y),
			Math.min(( rect1.x + rect1.width ) - Math.max(rect1.x, rect2.x), ( rect2.x + rect2.width ) - Math.max(rect1.x, rect2.x)),
			Math.min(( rect1.y + rect1.height ) - Math.max(rect1.y, rect2.y), ( rect2.y + rect2.height ) - Math.max(rect1.y, rect2.y))
		);

	}


	public static hitTestEx(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean{


		let obj1_global = obj1.localToGlobal(0, 0)
		let obj2_global = obj2.localToGlobal(0, 0)

		let rect1 = new egret.Rectangle(
			obj1_global.x - obj1.width/2*obj1.scaleX,
			obj1_global.y - obj1.width/2*obj1.scaleY,
			obj1.width*obj1.scaleX,
			obj1.height*obj1.scaleY)

		let rect2 = new egret.Rectangle(
			obj2_global.x - obj2.width/2*obj2.scaleX,
			obj2_global.y - obj2.width/2*obj2.scaleY,
			obj2.width*obj2.scaleX,
			obj2.height*obj2.scaleY)


		let ret = rect1.intersects(rect2);

		if(!ret) return false;



		let hitRect = new egret.Rectangle(
			Math.max(rect1.x, rect2.x),
			Math.max(rect1.y, rect2.y),
			Math.min(( rect1.x + rect1.width ) - Math.max(rect1.x, rect2.x), ( rect2.x + rect2.width ) - Math.max(rect1.x, rect2.x)),
			Math.min(( rect1.y + rect1.height ) - Math.max(rect1.y, rect2.y), ( rect2.y + rect2.height ) - Math.max(rect1.y, rect2.y))
		);


		for(let i=0;i<hitRect.width;i++){
			for(let j=0;j<hitRect.height;j++){
				// 取得obj1在此处的color
				obj1.matrix
			}
		}
		return true;
	}

	// 2个星球的碰撞检测, 都看成是球
	public static starCoTest(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean{
		// 把球心位置转成全局坐标
		let obj1_global = obj1.localToGlobal(0, 0)
		let obj2_global = obj2.localToGlobal(0, 0)
		//let p:egret.Point = new egret.Point(obj1_global.x - obj2_global.x, obj1_global.y-obj2_global.y);
		let p:egret.Point = new egret.Point(obj1.x - obj2.x, obj1.y-obj2.y);


		let r1 = obj1.width/2*obj1.scaleX;
		let r2 = obj2.width/2*obj2.scaleX;

		if(r1+r2 <= p.length){
			return false;
		}

		return true;
	}

	// 吞噬检测
	public static eatTest(eat:egret.DisplayObject, star:egret.DisplayObject):boolean{
		let r1 = eat.width/2*eat.scaleX;
		let r2 = star.width/2*star.scaleX;

		if(r1 < r2) return false;

		// 把球心位置转成全局坐标
		let obj1_global = eat.localToGlobal(0, 0)
		let obj2_global = star.localToGlobal(0, 0)
		let p:egret.Point = new egret.Point(obj1_global.x - obj2_global.x, obj1_global.y-obj2_global.y);
		if(r1 - r2 <= p.length){
			return false;
		}

		return true;
	}

	public static bombTest(x:number,y:number,r:number, star:egret.DisplayObject):boolean{
		let p:egret.Point = new egret.Point(x-star.x, y-star.y);
		if(p.length < r) return true;
		return false;

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