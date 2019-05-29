// TypeScript file

class EventManager extends egret.EventDispatcher{
    public constructor(){
        super();
    }
 
    private static instance : EventManager = null;
 
    private static getInstance():EventManager{
 
        if(!EventManager.instance){
            EventManager.instance =  new EventManager();
        }
        return EventManager.instance;
    }
    //派发事件
    public static dispatchEvent(type:string,data:any):void{
        EventManager.getInstance().dispatchEventWith(type,false,data);
    }
    //注册该事件的侦听， 在需要侦听事件的类里面注册该类事件，实现侦听该类事件
    public static register(type:string,callback:Function,thisObject:any):void{
        EventManager.getInstance().addEventListener(type,callback,thisObject);
    }

    public static unregistr(type:string, callback:Function, thisObject:any):void{
        EventManager.getInstance().removeEventListener(type, callback, thisObject);
    }
 
}