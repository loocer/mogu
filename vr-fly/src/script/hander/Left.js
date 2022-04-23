 import utl from "../utl.js"
export default class ImageRunTime extends Laya.Sprite{
    constructor(){
            super();
            this.scaleTime = 100;
            this.width = 300
            this.height = 300
            this.x = 50;
            this.y = Laya.stage.height - 350;
            this.moveX = 0
            this.moveY = 0
            console.log(this.maind)
            
            //设置组件的中心点
            this.anchorX = this.anchorY = 0.5;
            //添加鼠标按下事件侦听。按时时缩小按钮。
            this.on(Laya.Event.MOUSE_DOWN,this,this.scaleSmall);
            //添加鼠标抬起事件侦听。抬起时还原按钮。
            this.on(Laya.Event.MOUSE_UP,this, this.scaleBig);
            //添加鼠标离开事件侦听。离开时还原按钮。
            this.on(Laya.Event.MOUSE_OUT,this, this.scaleBig);
            this.on(Laya.Event.MOUSE_MOVE,this, this.leftFormatMovePosition);
        }
       scaleBig(e)
        {        
            console.log('MOUSE_UP')
            //变大还原的缓动效果
            utl.moveX = 0
            utl.moveY = 0
            // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
        }
        scaleSmall(e)
        {    
          utl.tachLeftFlag = true
          console.log('MOUSE_DOWN')
            //缩小至0.8的缓动效果
            // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
        }
        getRoteImg(pobj) {
          let rotate = 0
          if (pobj.x1 == pobj.x2){
            rotate=0
          }
          if (pobj.x1 > pobj.x2) {
            let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
            rotate =~~(Math.atan(atanrotate) / Math.PI * 180) + 90
          } else if (pobj.x1 < pobj.x2) {
            let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
            rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270
          }
          return rotate
        }
        leftFormatMovePosition(e) {
          let pobj = {}
          pobj.x1 = e.stageX //点击
          pobj.x2 =this.x + this.width/2
          pobj.y1 = e.stageY
          pobj.y2 = this.y + this.height/2
          utl.box.transform.rotate(new Laya.Vector3(0, utl.rote* Math.PI / 180, 0), true);
          utl.rote = this.getRoteImg(pobj) 
          // tools.getRoteImg(pobj, databus.leftPositions)
          let r = 1 / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
          utl.moveX = (pobj.x1 - pobj.x2) * r /10
          utl.moveY = (pobj.y1 - pobj.y2) * r/10
          utl.box.transform.rotate(new Laya.Vector3(0, -utl.rote* Math.PI / 180, 0), true);
          // console.log(this.moveX,this.moveY,utl.box.transform.position)
        }
}