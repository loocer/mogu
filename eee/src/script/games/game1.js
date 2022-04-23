/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
  import utl from "../utl.js"
  import newTouch from "../hand/speedTouch.js"
  import newTor from "../hand/leftTouch.js"
  import fire from "../hand/fire.js"
  import rightTouch from "../hand/rightTouch.js"
  import leftRote from "../hand/leftRote.js"
  import rightRote from "../hand/rightRote.js"
  import Bullet from "../entity/bullet.js"
  import Enemy from "../entity/enemy.js"
  import {socketMain} from "../net/index"
  // import {getServiceAddress} from "../net/index"
  let temp =0,spled = {x:0,y:0,z:0},dfew=0
  let flagod = false
  let fireFlag = false
  let touchs = [
    ['newTouch',{flag:false,Tclass:newTouch}],
    // ['newTor',{flag:false,Tclass:newTor}],
    // ['fire',{flag:false,Tclass:fire}],
    // ['rightTouch',{flag:false,Tclass:rightTouch}],
    // ['leftRote',{flag:false,Tclass:leftRote}],
    // ['rightRote',{flag:false,Tclass:rightRote}]
  ]

let flag = true  

function updateMove(obj){
    utl.box.transform.translate(new Laya.Vector3(utl.speedMove/5,0,0),true)
}
function tweend(){

    let tweenObj= {
        x:0
    } 
    Laya.Tween.to(
                tweenObj,
                {x:10,
                update:new Laya.Handler(this,updateMove,[tweenObj])},
                50,
                Laya.Ease.linearNone,
                Laya.Handler.create(this,tweend,[tweenObj]),
            0);
    // flag = true
}

export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        this.isTwoTouch = false
        this.twoFirst = true
        this.fucntkTemp =0
        this.temprx=0
        this.tempry=0
        this.temprz=0
        this.spled = 0
        this.spledy=0
        this.loadScene("test/TestScene.scene");
        this.newScene = Laya.stage.addChild(new Laya.Scene3D());
        this.loadingElse = new Map(utl.loadingElse)


        utl.newScene = this.newScene
        this.initTouch()
         // this.addMouseEvent();
        this.info = new Laya.Text();
        this.info.text = 'userId:'+utl.id
        this.info.fontSize = 50;
        this.info.color = "#FFFFFF";
        this.info.size(Laya.stage.width, Laya.stage.height);
        this.info.pos(50,50)
        Laya.stage.addChild(this.info);  
        utl.info =  this.info
        this.drawUi()
        temp = this

        // this.newScene.addChild(utl.models.get('light'));  
        var directionLight = this.newScene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));

        socketMain()
       

       
        Laya.timer.loop(5,this,this.onUpdate);
        

        let map2 = utl.models.get('cube')
        map2.getChildByName('on').active = false
        console.log(map2)
        this.newScene.addChild(map2);
        utl.entityMap.set('cube',map2)
       
        let camera = utl.models.get('camera')
        // // camera.active=false
        // camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

        utl.camera = camera
        this.newScene.addChild(camera);



        let  terrain= utl.models.get('plane')
        this.newScene.addChild(terrain);


        let box = utl.models.get('box')
        console.log(map2)
        utl.box = box
        this.newScene.addChild(box);
       
    }
    addMouseEvent(){
        
        //鼠标事件监听
        this.sp.on(Laya.Event.CLICK,this, this.onMouseDown);
    }
    onMouseDown() {
        // let point = new Laya.Vector2();
        // point.x = Laya.MouseManager.instance.mouseX;
        // point.y = Laya.MouseManager.instance.mouseY;
       console.log(6666666666)

    }
    drawUi(){
        this.sp = new Laya.Sprite();
        Laya.stage.addChild(this.sp);
        this.sp.graphics.drawRect(0, 0, 400, 400, "#00000066");

      this.addMouseEvent()
        // let leftHandself = this.loadingElse.get('left')
        // let leftHandselfImg = new  Laya.Image(leftHandself);
        // leftHandselfImg.height = 150
        // leftHandselfImg.width =150
        // leftHandselfImg.pos(Laya.stage.width  -700, Laya.stage.height - 200);
        // Laya.stage.addChild(leftHandselfImg);


        // let rightHandself = this.loadingElse.get('right')
        // let rightHandselfImg = new  Laya.Image(rightHandself);
        // rightHandselfImg.height = 150
        // rightHandselfImg.width =150
        // rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
        // Laya.stage.addChild(rightHandselfImg);




        // let leftHand = this.loadingElse.get('cotrll')
        // let leftHandImg = new  Laya.Image(leftHand);
        // leftHandImg.height = 450
        // leftHandImg.width =450
        // leftHandImg.pos(300, Laya.stage.height - 600);
        // Laya.stage.addChild(leftHandImg);


        // let rightHand = this.loadingElse.get('fire')
        // let rightHandImg = new  Laya.Image(rightHand);
        // rightHandImg.height = 200
        // rightHandImg.width =200
        // rightHandImg.pos(Laya.stage.width - 600, Laya.stage.height -400);
        // Laya.stage.addChild(rightHandImg);


        // // let col = this.loadingElse.get('speed')
        // // let dialog = new  Laya.Image(col);
        // // dialog.height = 600
        // // dialog.width =100
        // // dialog.pos(Laya.stage.width - 100, Laya.stage.height - 650);
        // // Laya.stage.addChild(dialog);

        // //-----------add and less speed
        // let lessSpeed = this.loadingElse.get('lessSpeed')
        // let lessSpeedImg = new  Laya.Image(lessSpeed);
        // lessSpeedImg.height = 100
        // lessSpeedImg.width =100
        // lessSpeedImg.pos(Laya.stage.width - 150, Laya.stage.height - 200);
        // Laya.stage.addChild(lessSpeedImg);


        // let addSpeed = this.loadingElse.get('addSpeed')
        // let addSpeedImg = new  Laya.Image(addSpeed);
        // addSpeedImg.height = 100
        // addSpeedImg.width =100
        // addSpeedImg.pos(Laya.stage.width - 150, Laya.stage.height - 350);
        // Laya.stage.addChild(addSpeedImg);
        //-----------add and less speed
        
    }
    initTouch(){
        for(let touch of touchs){
            touch[1].event = new touch[1].Tclass()
        }
    }
    onFire(){
        if(utl.fireOnOff){
            utl.msType = 'FIRE'
            // let ship = utl.box.getChildByName('shipmain')
            // let shipcar = ship.getChildByName('ship')
            // let aum =utl.bullet.clone();
            
            // // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
            // let script = aum.addComponent(Bullet);
            // this.newScene.addChild(aum)
        }
        
    }
    
    flying(touchCount){

        // this.info.text = touchCount
      
        for(let obj of touchs){
            obj[1].flag = false
        }   
        // let touchCount = this.scene.input.touchCount();
        if (1 === touchCount){
            //判断是否为两指触控，撤去一根手指后引发的touchCount===1
            // if(this.isTwoTouch){
            //     return;
            // }
            let touch = this.newScene.input.getTouch(0);
            for(let obj of touchs){
                if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                    obj[1].flag = true
                    obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y)
                }else{
                    obj[1].flag = false
                }
            }
            
        }
        else if (2 === touchCount){
            // this.isTwoTouch = true;
            //获取两个触碰点
            let touch = this.newScene.input.getTouch(0);
            let touch2 = this.newScene.input.getTouch(1);
            for(let obj of touchs){
                if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                    obj[1].flag = true
                    obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y)
                }
                if(obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                    obj[1].flag = true
                    obj[1].event.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                }
                if(!obj[1].event.scaleSmall(touch.position.x,touch.position.y)&&!obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                    obj[1].flag = false
                }
            }   
                
               
        }
        else if (0 === touchCount){
            // this.text.text = "触控点归零";
            // this.first = true;
            // this.twoFirst = true;
            // // this.lastPosition.x = 0;
            // // this.lastPosition.y = 0;
            // this.isTwoTouch = false;
            // utl.takeSpeed.x = 0
            // utl.takeSpeed.y = 0
        }
        // let touchsMap = new Map(touchs)
        // if(!touchsMap.get('newTor').flag){
        //     utl.takeSpeed.x = 0
        //     utl.takeSpeed.y = 0
        // }
        // if(!touchsMap.get('rightTouch').flag){
        //     utl.roteGun.x = 0
        //     utl.roteGun.y = 0
        // }
        // // if(!fireFlag){
        //     utl.fireOnOff = touchsMap.get('rightTouch').flag
        //     utl.roteLeftFlag = touchsMap.get('leftRote').flag
        //     utl.roteRightFlag = touchsMap.get('rightRote').flag
        // // }
        // this.info.text = flagod+','+touchCount

    }
    gunMove(){
         let ship = utl.box.getChildByName('camermain')
         let acObj = ship.getChildByName('ac')

        

         if(utl.roteGun.x!=utl.roteGunTemp.x){
                 if(Math.abs(utl.roteGun.x-utl.roteGunTemp.x)>.1){
                    utl.roteGunTemp.x = utl.roteGun.x>utl.roteGunTemp.x?utl.roteGunTemp.x+.1:utl.roteGunTemp.x-.1
                }else{
                    if(utl.roteGun.x==0){
                        utl.roteGunTemp.x = 0
                    }
                    
                }
            }
            if(utl.roteGun.y!=utl.roteGunTemp.y){
                if(Math.abs(utl.roteGun.y-utl.roteGunTemp.y)>.1){
                    utl.roteGunTemp.y = utl.roteGun.y>utl.roteGunTemp.y?utl.roteGunTemp.y+.1:utl.roteGunTemp.y-.1
                }else{
                    if(utl.roteGun.y==0){
                        utl.roteGunTemp.y = 0
                    }
                   
                }
            }
            let x = utl.roteGunTemp.x       
            let y = utl.roteGunTemp.y

         


        acObj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
        acObj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
      
        acObj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
        acObj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

       

        utl.roteGunback.x = x
        utl.roteGunback.y = y
    }
    checkFire(){
         let bmain =utl.bullet.getChildByName('ship')
        let bcube = bmain.getChildByName('Cube')
        let from = bcube.getChildByName('e1').transform.position
        let to = bcube.getChildByName('e2').transform.position
        this.newScene.physicsSimulation.raycastFromTo(from, to, utl.hitResult);
        if( utl.hitResult.collider&&utl.hitResult.collider.owner.name=='baga'){
            // utl.hitResult.collider.owner.active=false 
            // console.log(utl.hitResult.normal) 
            // utl.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            // console.log(1111)
        }
       
        // console.log(utl.hitResult.collider)
    }
    checkMovetoGround(){
         let p = utl.box.transform.position
         let x = p.x
         let z = p.z
         let y = p.y
         if(p.x>utl.bestGround){
             x = utl.bestGround
         }
         if(p.x<-utl.bestGround){
             x = -utl.bestGround
         }
         if(p.z>utl.bestGround){
             z = utl.bestGround
         }
         if(p.z<-utl.bestGround){
             z = -utl.bestGround
         }
         if(p.y>utl.bestGround){
             y = utl.bestGround
         }
         utl.box.transform.position = new Laya.Vector3(x,y,z)
    }
    onUpdate() {
        let touchCount = this.newScene.input.touchCount();
        let touch = this.newScene.input.getTouch(0);
        let touch1 = this.newScene.input.getTouch(1);

        // if(touchCount==1){
        //     if(touch.position.x<400&&touch.position.y<400){
        //         console.log(touch.position)
        //         return 
        //     }
        // }
        if(touchCount==0){
         
            touchs[0][1].event.leftFormatMovePosition(null,0) 

        }
        if(touchCount==1){
            let point =  touch.position
            touchs[0][1].event.drawSelect({x:point.x,y:point.y},touchCount) 

        }
        if(touchCount>1){
             let point =  touch.position
            touchs[0][1].event.leftFormatMovePosition(point,touchCount) 
         }   
        // if(touchCount>1){
        //     // console.log(touch,touchCount)
        //     let x = (touch.position.x + touch1.position.x) / 2
        //     let y = (touch.position.y + touch1.position.y) / 2
        //     let z = (touch.position.z + touch1.position.z) / 2
        //     let point =  new Laya.Vector3(x, y, z) 
        //      // let point =  touch.position
        //     this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        //     this.outs = [];
        //         //产生射线
        //     utl.camera.viewportPointToRay(point,this._ray);
        //         //拿到射线碰撞的物体
        //     this.newScene.physicsSimulation.rayCastAll(this._ray,this.outs);
        //         //如果碰撞到物体
        //     if (this.outs.length !== 0)
        //     {

        //             for (let i = 0; i <  this.outs.length; i++){
        //                 if(this.outs[i].collider.owner.name=="plane"){
        //                     touchs[0][1].event.leftFormatMovePosition(this.outs,touchCount)    
        //                 }
        //             }
        //                 //在射线击中的位置添加一个立方体
                      
        //     }


        // }
        // else{
        //    touchs[0][1].event.leftFormatMovePosition(null,0)  
        // }
       
    } 
}
