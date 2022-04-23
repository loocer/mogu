 import utl from "../utl.js"
 import Bullet from "../entity/bullet.js"
export default class newTwo{
    constructor(){
            this.x = 0;
            this.y = 0;

            this.tx= Laya.stage.width - 600
            
            this.twidth = 200
            this.theight = 200
            this.ty =Laya.stage.height - 400
            this.tempX = 0
            this.tempY = 0
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
       onFire(){
              let aum =utl.bullet.clone();
              let script = aum.addComponent(Bullet);
              utl.newScene.addChild(aum)
        }
       scaleSmall(x,y)
        {    
          if(this.tx-0<x&&x<this.tx+this.twidth+0&&y>this.ty-0&&y<this.ty+this.theight+0
            ){
             utl.fireOnOff = true
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
          let rx = tempy*5
          let ry = tempx*5
          utl.roteGun.x  = rx
          utl.roteGun.y = -ry
            // let shipcar = utl.bullet.getChildByName('ship')
            // let obj = shipcar.getChildByName('Cube')

            // obj.transform.rotate(new Laya.Vector3(0,-this.tempX* Math.PI / 180,0),true);
            // obj.transform.rotate(new Laya.Vector3(0,0,-this.tempY* Math.PI / 180),true);
            // obj.transform.rotate(new Laya.Vector3(0,rx* Math.PI / 180,0),true);
            // obj.transform.rotate(new Laya.Vector3(0,0,ry* Math.PI / 180),true);

            // this.tempX = rx
            // this.tempY = ry
            // utl.fireOnOff = true
           

        }

}