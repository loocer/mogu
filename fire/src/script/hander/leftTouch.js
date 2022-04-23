 import utl from "../utl.js"
export default class newTwo{
    constructor(){
            this.scaleTime = 100;
            this.width = Laya.stage.width/2 
            this.height = Laya.stage.height
            this.x = 0;
            this.y = 0;
            this.moveX = 0
            this.moveY = 0

            this.tx=250
            this.twidth = 400
            this.theight = 400
            this.ty = Laya.stage.height - 500;
        }
       scaleBig(e)
        {        
            utl.takeSpeed.z = 0
            console.log('MOUSE_UP')
            utl.tachRightFlag = false
            // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
        }
        outEvent(){
          utl.tachRightFlag = false
        }
      
       scaleSmall(x,y)
        {    
          if(x<this.width
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
            rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90
          } else if (pobj.x1 < pobj.x2) {
            let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
            rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270
          }
          return rotate
        }
        leftFormatMovePosition(px,py) {
         
          // utl.ani.play("hello");
          let pobj = {}
          let tempx = 0
          let tempy = 0
          pobj.x1 = px //点击
          pobj.x2 =this.tx + this.twidth/2
          pobj.y1 = py
          pobj.y2 = this.ty + this.theight/2
          if((px - this.tx - this.twidth/2) / (this.twidth/2) >1){
            tempx = 1
          }else{
             tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
          }
          if((px - this.tx - this.twidth/2) / (this.twidth/2) <-1){
            tempx = -1
          }else{
             tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
          }
          if((py - this.ty - this.theight/2) / (this.theight/2) >1){
             tempy = 1
          }else{
            tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
          }
          if((py - this.ty - this.theight/2) / (this.theight/2) <-1){
             tempy = -1
          }else{
            tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
          }
          utl.takeSpeed.x = tempy*20
          utl.takeSpeed.y = -tempx*45
        }

}