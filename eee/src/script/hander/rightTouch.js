 import utl from "../utl.js"
export default class newtach{
    constructor(){
            
            this.scaleTime = 100;
            this.width = Laya.stage.width/2 
            this.height = Laya.stage.height
            this.x = Laya.stage.width/2;
            this.y = 0;
            this.moveX = 0
            this.moveY = 0
            this.tx=Laya.stage.width - 150;
            this.twidth = 100
            this.theight = 600
            this.ty = Laya.stage.height - 650;
            this.flag = false
            console.log(this.maind)
        }
        outEvent(){
          utl.tachLeftFlag = false
        }
       scaleBig(e)
        {        
            console.log('MOUSE_UP')
            utl.tachLeftFlag = false
            //变大还原的缓动效果
            utl.moveX = 0
            utl.moveY = 0
            utl.takeSpeed.x = 0
            utl.takeSpeed.y = 0
            // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
        }
        scaleSmall(x,y)
        {    
          if(this.tx<x&&
            x<this.tx+this.twidth&&
            this.ty<y&&
            y<this.ty+this.theight
            ){
            return true
          }else{
            return false
          }
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
        leftFormatMovePosition(px,py) {
          
          // utl.ani.play("hello");
          // let pobj = {}
          // pobj.y = (py - this.ty) / this.theight
          utl.speedMove = (py - this.ty) / this.theight
          // utl.takeSpeed.y = py - this.ty - this.theight/2
          // utl.box.transform.rotate(new Laya.Vector3(0,utl.rote* Math.PI / 180, 0), true);
          // utl.rote = this.getRoteImg(pobj) 
          // // tools.getRoteImg(pobj, databus.leftPositions)
          // let r = 1 / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
          // utl.moveX = (pobj.x1 - pobj.x2) * r /10
          // utl.moveY = (pobj.y1 - pobj.y2) * r/10
          // utl.box.transform.rotate(new Laya.Vector3(0,-utl.rote* Math.PI / 180,0), true);
          // console.log(this.moveX,this.moveY,utl.box.transform.position)
        }
}