 import utl from "../utl.js"
export default class fire{
    constructor(){
            this.scaleTime = 100;
            this.width = 150
            this.height = 150
            this.x = Laya.stage.width-250;
            this.y = Laya.stage.height - 250;
            this.moveX = 0
            this.moveY = 0

            this.tx=Laya.stage.width/4;
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
          if(x<this.width+this.x&&
            x>this.x&&
            y>this.y&&
            y<this.y+this.height
            ){
            return true
          }else{
            // return false
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
          utl.fireOnOff = true
        }

}