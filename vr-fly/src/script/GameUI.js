/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
  import utl from "./utl.js"
  import newTouch from "./hand/speedTouch.js"
  import newTor from "./hand/leftTouch.js"
  import fire from "./hand/fire.js"
  import rightTouch from "./hand/rightTouch.js"
  import leftRote from "./hand/leftRote.js"
  import rightRote from "./hand/rightRote.js"
  import Bullet from "./entity/bullet.js"
  import Enemy from "./entity/bullet.js"
  import {getServiceAddress} from "./net/index"
  let temp =0,spled = {x:0,y:0,z:0},dfew=0
  let flagod = false
  let fireFlag = false
  let touchs = [
    ['newTouch',{flag:false,Tclass:newTouch}],
    ['newTor',{flag:false,Tclass:newTor}],
    ['fire',{flag:false,Tclass:fire}],
    ['rightTouch',{flag:false,Tclass:rightTouch}],
    ['leftRote',{flag:false,Tclass:leftRote}],
    ['rightRote',{flag:false,Tclass:rightRote}]
  ]

export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        this.isTwoTouch = false
        this.twoFirst = true
        this.fucntkTemp =0
        this.temprx=0
        this.tempry=0
        this.temprz=0
        this.shipRx = 0
        this.shipRy = 0
        this.spled = 0
        this.spledy=0
        this.loadScene("test/TestScene.scene");
        this.newScene = Laya.stage.addChild(new Laya.Scene3D());
        this.loadingElse = new Map(utl.loadingElse)


        utl.newScene = this.newScene
        this.initTouch()
        this.info = new Laya.Text();
        this.info.text = '555777777775'
        this.info.fontSize = 50;
        this.info.color = "#FFFFFF";
        this.info.size(Laya.stage.width, Laya.stage.height);
        this.info.pos(0,100)
        Laya.stage.addChild(this.info);  
        utl.info =  this.info
        this.drawUi()
        Laya.Gyroscope.instance.on(Laya.Event.CHANGE, this, onDeviceorientation);
        function onDeviceorientation(absolute, rotationInfo) {
            // this.info.text =
            //     "alpha:" + Math.floor(rotationInfo.alpha) + '\n' +
            //     "beta :" + Math.floor(rotationInfo.beta) + '\n' +
            //     "gamma:" + Math.floor(rotationInfo.gamma);
            if(utl.operationYype==2){
                utl.takeSpeed.x =  Math.floor(rotationInfo.gamma)
                utl.takeSpeed.y =  Math.floor(rotationInfo.beta)
            }
        }
        temp = this
        this.newScene.addChild(utl.models.get('light'));  
       


        Laya.timer.loop(30,this,this.onUpdate);

       

        var sfe = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
        var material = new Laya.BlinnPhongMaterial();
        sfe.transform.position = new Laya.Vector3(1,20, 3);
        Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                material.albedoTexture = tex;
        }));
        sfe.meshRenderer.material = material;

        let fuckdd = utl.models.get('fuckdd')
        this.newScene.addChild(fuckdd);


        let maton = utl.models.get('maton')
        this.newScene.addChild(maton);

        utl.box = utl.models.get('pler')
        this.newScene.addChild(utl.box);

        utl.bullet = utl.models.get('bullet')
        this.newScene.addChild(utl.bullet);
        
        let ship = utl.box.getChildByName('shipmain')
        let shipcar = ship.getChildByName('ship')
        utl.c1 = shipcar.getChildByName('c1')
        utl.c2 = shipcar.getChildByName('c2')
       
        // Laya.timer.loop(1,this,this.onFire);
        let camera = ship.getChildByName('c1')
        camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

        utl.camera = camera



        let nimabi = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 11,42)));
        var materialr = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                materialr.albedoTexture = tex;
        }));
        nimabi.meshRenderer.material = materialr;
        nimabi.transform.position = new Laya.Vector3(1,20, 6);
        nimabi.addComponent(Bullet);




        
       
        this.createBall()


        let  sum= utl.models.get('sun')
        this.newScene.addChild(sum);
        // Laya.loader.load('https://xuxin.love/img/fly/controll.png', Laya.Handler.create(this, function() {
        //     let monkey2 = Laya.loader.getRes('https://xuxin.love/img/fly/controll.png');
        //     let ape2 = new Laya.Sprite();
        //     Laya.stage.addChild(ape2);
        //     ape2.graphics.drawTexture(monkey2, 100, 100);
        //     ape2.width = 400
        //     ape2.height = 400
        //     ape2.x = 250;
        //     ape2.y = Laya.stage.height - 500;
        // }));

        
        
        // utl.models.get('cube').active=false  
    }
    drawUi(){
           console.log(55555555555555)

        // let fudf = utl.models.get('cotrll')
        // let ape2 = new Laya.Sprite();
        // Laya.stage.addChild(ape2);
        // ape2.graphics.drawTexture(fudf, 100, 100);
        // // ape2.width = 400
        // // ape2.height = 400
        // // ape2.x = 0;
        // // ape2.y = Laya.stage.height - 500;
        // ape2.pos(0,Laya.stage.height - 500)
        let leftHandself = this.loadingElse.get('cotrll')
        let leftHandselfImg = new  Laya.Image(leftHandself);
        leftHandselfImg.height = 200
        leftHandselfImg.width =200
        leftHandselfImg.pos(Laya.stage.width  -700, Laya.stage.height - 200);
        Laya.stage.addChild(leftHandselfImg);


        let rightHandself = this.loadingElse.get('cotrll')
        let rightHandselfImg = new  Laya.Image(rightHandself);
        rightHandselfImg.height = 200
        rightHandselfImg.width =200
        rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
        Laya.stage.addChild(rightHandselfImg);




        let leftHand = this.loadingElse.get('cotrll')
        let leftHandImg = new  Laya.Image(leftHand);
        leftHandImg.height = 450
        leftHandImg.width =450
        leftHandImg.pos(300, Laya.stage.height - 600);
        Laya.stage.addChild(leftHandImg);


        let rightHand = this.loadingElse.get('cotrll')
        let rightHandImg = new  Laya.Image(rightHand);
        rightHandImg.height = 300
        rightHandImg.width =300
        rightHandImg.pos(Laya.stage.width - 600, Laya.stage.height - 500);
        Laya.stage.addChild(rightHandImg);


        let col = this.loadingElse.get('fire')
        let dialog = new  Laya.Image(col);
        dialog.height = 600
        dialog.width =100
        dialog.pos(Laya.stage.width - 100, Laya.stage.height - 650);
        Laya.stage.addChild(dialog);
        // let ape3 = new Laya.Sprite();
        // Laya.stage.addChild(ape3);
        // ape3.graphics.drawTexture(col, 100, 100);
        // ape3.width = 100
        // ape3.height = 100
        // ape3.x = Laya.stage.width/2+200;
        // ape3.y = Laya.stage.height - 500;
        utl.showbox = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        utl.showbox.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var material = new Laya.BlinnPhongMaterial();
        material.color = new Laya.Color(1, 1, 1, 1);
        utl.showbox.meshRenderer.material = material;
        
    }
    initTouch(){
        for(let touch of touchs){
            touch[1].event = new touch[1].Tclass()
        }
    }
    onFire(){
        if(utl.fireOnOff){
            // let ship = utl.box.getChildByName('shipmain')
            // let shipcar = ship.getChildByName('ship')
            let aum =utl.bullet.clone();
            
            // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
            let script = aum.addComponent(Bullet);
            this.newScene.addChild(aum)
        }
        
    }
    createBall(){
        let cube = utl.models.get('cube').clone()
                        // cube.active=true  
                        // let scale = new Laya.Vector3(3, 3, 3);
                        // cube.transform.localScale = scale;
                       
                        cube.addComponent(Enemy);
                        console.log('--------------------',cube)
                        this.newScene.addChild(cube)
                         // cube.transform.position =new Laya.Vector3(0,0,0)
        let ems = utl.models.get('ems')                  
        this.newScene.addChild(cube)
        for(let i =1;i<5;i++){
            let cubeq = utl.models.get('cube').clone()
            cubeq.addComponent(Enemy);
            console.log(ems.getChildByName(i+''))
            let pos = ems.getChildByName(i+'').transform
            this.newScene.addChild(cubeq)
            cubeq.transform.position = new Laya.Vector3(pos.position.x,pos.position.y,pos.position.z)

          
        }


        // let cube1 = utl.models.get('sphere').clone()
        //                 cube1.active=true  
        //                 // let scale = new Laya.Vector3(3, 3, 3);
        //                 // cube.transform.localScale = scale;
                       
        //                 cube1.addComponent(Enemy);
        //                 this.newScene.addChild(cube1)
        //                  cube1.transform.position =new Laya.Vector3(10,10,10)                 
        // for(let z =-1;z<2;z++){
        //     for(let i =-1;i<3;i++){
        //         for(let l =-1;l<4;l++){
        //             // let box4 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 3,6)));
        //             // let material1 = new Laya.BlinnPhongMaterial();
        //             // box4.meshRenderer.material = material1;
        //             // box4.transform.position =new Laya.Vector3(i*40,l*40,z*40)
        //             // box4.addComponent(Enemy);
        //             // this.newScene.addChild(box4)
        //                 let cube = utl.models.get('cube').clone()
        //                 cube.active=true  
        //                 // let scale = new Laya.Vector3(3, 3, 3);
        //                 // cube.transform.localScale = scale;
        //                 cube.transform.position =new Laya.Vector3(i*60,l*80,z*40)
        //                 cube.addComponent(Enemy);
        //                 this.newScene.addChild(cube)
        //         }
        //     }
        // }
    }
    flying(touchCount){

        // this.info.text = touchCount
        flagod=false
        fireFlag = false
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
            // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
                
            //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
            // }

            // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
            //     flagod=true
            //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
            // }
            // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
            //     fireFlag = true
            //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
            // }
            for(let obj of touchs){
                if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                    obj[1].flag = true
                    obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y)
                }
            }
            
        }
        else if (2 === touchCount){
            // this.isTwoTouch = true;
            //获取两个触碰点
            let touch = this.newScene.input.getTouch(0);
            let touch2 = this.newScene.input.getTouch(1);
            //是否为新一次触碰，并未发生移动
            // if (this.twoFirst){
            //     //获取触碰点的位置
            //     // this.disVector1.x = touch.position.x - touch2.position.x;
            //     // this.disVector1.y = touch.position.y - touch2.position.y;
            //     // this.distance = Laya.Vector2.scalarLength(this.disVector1);
            //     // this.sprite3DSacle = this.owner.transform.scale;
            //     this.twoFirst = false;

            // }
            // else{
                //--------------------------------
                // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
                    
                //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                // }
                // if(this.newTouch.scaleSmall(touch2.position.x,touch2.position.y)){
                    
                //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                // }

                // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
                //     flagod=true
                //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
                // }
                // if(this.newTor.scaleSmall(touch2.position.x,touch2.position.y)){
                //     flagod=true
                //     this.newTor.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                // }

                // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
                //     fireFlag=true
                //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                // }
                // if(this.fireTouch.scaleSmall(touch2.position.x,touch2.position.y)){
                //     fireFlag=true
                //     this.fireTouch.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                // }
//---------------------------------------
                for(let obj of touchs){
                    if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                        obj[1].flag = true
                        obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y)
                    }
                    if(obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                        obj[1].flag = true
                        obj[1].event.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                    }
                }   
                

                
                // this.disVector2.x = touch.position.x - touch2.position.x;
                // this.disVector2.y = touch.position.y - touch2.position.y;
                // let distance2 = Laya.Vector2.scalarLength(this.disVector2);
                // //根据移动的距离进行缩放
                // let factor =  0.001 * (distance2 - this.distance);
                // this.sprite3DSacle.x += factor;
                // this.sprite3DSacle.y += factor;
                // this.sprite3DSacle.z += factor;
                // this.owner.transform.scale = this.sprite3DSacle;
                // this.distance = distance2;
            // }   
        }
        else if (0 === touchCount){
            // this.text.text = "触控点归零";
            this.first = true;
            this.twoFirst = true;
            // this.lastPosition.x = 0;
            // this.lastPosition.y = 0;
            this.isTwoTouch = false;
            // utl.takeSpeed.x = 0
            // utl.takeSpeed.y = 0
        }
        let touchsMap = new Map(touchs)
        if(!touchsMap.get('newTor').flag){
            utl.takeSpeed.x = 0
            utl.takeSpeed.y = 0
        }
        if(!touchsMap.get('rightTouch').flag){
            utl.roteGun.x = 0
            utl.roteGun.y = 0
        }
        // if(!fireFlag){
            utl.fireOnOff = touchsMap.get('rightTouch').flag
            utl.roteLeftFlag = touchsMap.get('leftRote').flag
            utl.roteRightFlag = touchsMap.get('rightRote').flag
        // }
        // this.info.text = flagod+','+touchCount

    }
    gunMove(){
        let shipcar = utl.bullet.getChildByName('ship')
        let obj = shipcar.getChildByName('Cube')

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

        obj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
        obj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
      
        obj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
        obj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

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
    setTween(){
        Laya.Tween.to(letterText,{y:100},3000,Laya.Ease.elasticInOut,null,i*1000);
    }
    onUpdate() {
        
        let touchCount = this.newScene.input.touchCount();
        
        this.flying(touchCount)
        // return
        for(let obj of utl.firs){
            obj.toTiome()
        }
        if(utl.box){
           
            let ship = utl.box.getChildByName('shipmain')
            let camera = ship.getChildByName('Main Camera')
            let shipcar = ship.getChildByName('ship')

            // shipc.getChildByName('Cube')
            let shipc = utl.bullet.getChildByName('ship')

            let bcube = shipc 
            if(utl.takeSpeed.x!=utl.speed.x){
                 if(Math.abs(utl.takeSpeed.x-utl.speed.x)>1){
                    utl.speed.x = utl.takeSpeed.x>utl.speed.x?utl.speed.x+.4:utl.speed.x-.4
                }else{
                    if(utl.takeSpeed.x==0){
                        utl.speed.x = 0
                    }
                    
                }
            }
            if(utl.takeSpeed.y!=utl.speed.y){
                if(Math.abs(utl.takeSpeed.y-utl.speed.y)>1){
                    utl.speed.y = utl.takeSpeed.y>utl.speed.y?utl.speed.y+1:utl.speed.y-1
                }else{
                    if(utl.takeSpeed.y==0){
                        utl.speed.y = 0
                    }
                   
                }
            }
            let x = utl.speed.x       
            let y = utl.speed.y
           
                // let x = Math.floor(utl.speed.x)        
                // let y = Math.floor(utl.speed.y)

                // let z = utl.speed.z*90/100
           
            // console.log(utl.box.transform.rotation.x)
                
            let tz = Math.cos(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove
            let tx = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.y)*utl.speedMove
            let ty = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove

            // this.info.text = x+','+y
           
           
            // ship.transform.rotate(new Laya.Vector3(this.temprx* Math.PI / 180,0,0),true);
            let ry = (y - this.tempry)
            let rx = (x - this.temprx)
            let sy = y/30
            let sx = -x/30

            
            // utl.box.transform.rotate(new Laya.Vector3(0,-this.fucntkTemp* Math.PI / 180,0),true);
            // utl.bullet.transform.rotate(new Laya.Vector3(0,-this.fucntkTemp* Math.PI / 180,0),true);

            utl.box.transform.rotate(new Laya.Vector3(0,0,sy* Math.PI / 180,),true);
            utl.box.transform.rotate(new Laya.Vector3(0,sx* Math.PI / 180,0),true);

            utl.bullet.transform.rotate(new Laya.Vector3(0,0,sy* Math.PI / 180,),true);
            utl.bullet.transform.rotate(new Laya.Vector3(0,sx* Math.PI / 180,0),true);
            // shipcar.transform.rotate(new Laya.Vector3(0,-rx* Math.PI / 180,0),true);
            // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);


            // this.fucntkTemp = sx
            
            
            shipcar.transform.rotate(new Laya.Vector3(0, this.temprx* Math.PI / 180,0),true);
            shipcar.transform.rotate(new Laya.Vector3(this.tempry* Math.PI / 180,0,0),true);

            shipcar.transform.rotate(new Laya.Vector3(-y* Math.PI / 180,0,0),true);
            shipcar.transform.rotate(new Laya.Vector3(0,-x* Math.PI / 180,0),true);



            // bcube.transform.rotate(new Laya.Vector3(0, this.temprx* Math.PI / 180,0),true);
            // bcube.transform.rotate(new Laya.Vector3(this.tempry* Math.PI / 180,0,0),true);

            // bcube.transform.rotate(new Laya.Vector3(-y* Math.PI / 180,0,0),true);
            // bcube.transform.rotate(new Laya.Vector3(0,-x* Math.PI / 180,0),true);

            utl.box.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true)
            utl.bullet.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true)
            
            let max = 100

            // if(utl.box.transform.position.x>max||utl.box.transform.position.x<-max||utl.box.transform.position.y<-max||utl.box.transform.position.y>max){
            //         utl.box.transform.translate(new Laya.Vector3(-utl.speedMove,0,0),true)
            //     utl.bullet.transform.translate(new Laya.Vector3(-utl.speedMove,0,0),true)
            //     utl.isOutGropund = false
            // }else{
            //    utl.isOutGropund = true
            // }
            //-----------------------------------c超过编辑二
            // shipcar.transform.rotation =  (new Laya.Vector3(-90,90,0),true)
            // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);

            // ship.transform.rotate(new Laya.Vector3(0,0,-x* Math.PI / 180),true);

            
            // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)

            // camera.transform.rotate(new Laya.Vector3(0,0,-y* Math.PI / 180),true);

            // if(Math.abs(this.shipRx)<45){
            //      this.shipRx += x
            //      shipcar.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
            // }
            
            // shipcar.transform.rotate(new Laya.Vector3(-x* Math.PI / 180,0,0),true);
            // ship.transform.rotate(new Laya.Vector3(0,0,this.tempry* Math.PI / 180),true);
            if(utl.roteLeftFlag){
                utl.box.transform.rotate(new Laya.Vector3(1* Math.PI / 180,0,0),true);
                utl.bullet.transform.rotate(new Laya.Vector3(1* Math.PI / 180,0,0),true);
            }
            if(utl.roteRightFlag){
                utl.box.transform.rotate(new Laya.Vector3(-1* Math.PI / 180,0,0),true);
                utl.bullet.transform.rotate(new Laya.Vector3(-1* Math.PI / 180,0,0),true);
            }


            
            this.shipRy = 0


            // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)
            // utl.box.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),false);
            // utl.box.transform.rotate(new Laya.Vector3(y* Math.PI / 180,0,0),true);
            
            // camera.transform.translate(new Laya.Vector3(0,-ty,tz))
            this.temprx = x
            this.tempry = y
            // if(this.temprx>70){
            //     ship.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
            //     this.temprx -= x
            // }
             // this.onFire()
             this.gunMove()
             this.onFire()
             // this.checkFire()
        }
        
        
    }
   
    creabox(py){
        for(let i=0;i<2;i++){
            for(let l=0;l<2;l++){
                let box5 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1,1,1)));
                box5.transform.rotate(new Laya.Vector3(2 * Math.PI / 180,0, 10 * Math.PI / 180), true, true);
                let material1 = new Laya.BlinnPhongMaterial();
                 box5.transform.position = new Laya.Vector3(l,py+3, i);
               
                let bg = box5.addComponent(Laya.Rigidbody3D);
                //创建盒子形状碰撞器
                let boxShape1 = new Laya.BoxColliderShape(1, 1,1);
                //设置盒子的碰撞形状
                bg.colliderShape = boxShape1;
                //设置刚体的质量
                bg.friction = 2;
                //物理碰撞体设置弹力
                bg.restitution = 0.3;
                bg.mass = 10;

            }
        }
        
    }
    creab(){
        for(let f=0;f<2;f++){
            this.creabox(f)
        }
    }
    
}
class BoxMove extends Laya.Script3D { 
constructor() {
super();
}
onStart() {console.log("3333");}

onTriggerEnter()
{
    utl.entity.get('obx').removeSelf();
    temp.creab()
console.log("onTriggerEnter");
}
onTriggerStay()
{
console.log("onTriggerStay");
}
onTriggerExit()
{
console.log("onTriggerExit");
}
onEnable() {
} 
onDisable() {
}
}
class BoxMove3 extends Laya.Script3D { 
constructor() {
super();
}
onStart() {console.log("3333");}

onTriggerEnter()
{
console.log("onTriggerEnter3");
}
onTriggerStay()
{
console.log("onTriggerStay3");
}
onTriggerExit()
{
console.log("onTriggerExit3");
}
onEnable() {
} 
onDisable() {
}
}