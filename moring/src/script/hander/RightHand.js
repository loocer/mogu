 import utl from "../utl.js"
export default class ImageRunTime extends Laya.Sprite{
    constructor(){
            super();
            this.scaleTime = 100;
            this.width = 100
            this.height = 600
            this.x = Laya.stage.width - 150;
            this.y = Laya.stage.height - 650;
            this.moveX = 0
            this.moveY = 0
            this.tx=Laya.stage.width - 350
            this.twidth = 200
            this.theight = 600
            this.ty = Laya.stage.height - 350;
            this.flag = false
            console.log(this.maind)
            
            //设置组件的中心点
            this.anchorX = this.anchorY = 0.5;
            //添加鼠标按下事件侦听。按时时缩小按钮。
            // this.on(Laya.Event.MOUSE_DOWN,this,this.scaleSmall);
            // //添加鼠标抬起事件侦听。抬起时还原按钮。
            // this.on(Laya.Event.MOUSE_UP,this, this.scaleBig);
            // //添加鼠标离开事件侦听。离开时还原按钮。
            // this.on(Laya.Event.MOUSE_OUT,this, this.outEvent);
            // this.on(Laya.Event.MOUSE_MOVE,this, this.leftFormatMovePosition);
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
      
        scaleSmall(e)
        {    
          
          if(this.tx<e.stageX&&
            e.stageX<this.tx+this.twidth&&
            this.ty<e.stageY&&
            e.stageY<this.ty+this.theight
            ){
            utl.tachRightFlag = true
          }else{
            utl.tachRightFlag = false
          }
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
            rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90
          } else if (pobj.x1 < pobj.x2) {
            let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
            rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270
          }
          return rotate
        }
        leftFormatMovePosition(e) {
          // console.log(33333)
          // if(!utl.tachRightFlag){
          //   return
          // }
          // // utl.ani.play("hello");
          // let pobj = {}
          // pobj.x1 = e.stageX //点击
          // pobj.x2 =this.tx + this.twidth/2
          // pobj.y1 = e.stageY
          // pobj.y2 = this.ty + this.theight/2
        
          // if((e.stageY - this.ty - this.theight/2) / (this.theight/2) >1){
          //    utl.takeSpeed.z = 1
          // }else{
          //   utl.takeSpeed.z = (e.stageY - this.ty - this.theight/2) / (this.theight/2) 
          // }
          // if((e.stageY - this.ty - this.theight/2) / (this.theight/2) <-1){
          //    utl.takeSpeed.z = -1
          // }else{
          //   utl.takeSpeed.z = (e.stageY - this.ty - this.theight/2) / (this.theight/2) 
          // }
        }

}