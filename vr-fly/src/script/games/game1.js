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
  let temp =0;

  let touchs = [
    ['newTouch',{flag:false,Tclass:newTouch}],
    // ['newTor',{flag:false,Tclass:newTor}],
    // ['fire',{flag:false,Tclass:fire}],
    // ['rightTouch',{flag:false,Tclass:rightTouch}],
    // ['leftRote',{flag:false,Tclass:leftRote}],
    // ['rightRote',{flag:false,Tclass:rightRote}]
  ]
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 
let flag = true  

let ayncsyTime = false//控制点击频率
let gameGroundXZLength = 11
let rgb = [
        [.2,.3,.1],
        [.6,.7,.2],
        [.1,.1,.1],
        [.7,.3,.1],
        [.2,.1,.9],
    ]
export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        this.eventTemp = null
        this.roteValue = 0
        this.mMap = new Map()
        this.go = false//游戏速度
        this.gameFalg = true//游戏开关
        this.nowBoxs = {}
        this.allBox = new Set()
        this.loadScene("test/TestScene.scene");
        this.newScene = Laya.stage.addChild(new Laya.Scene3D());
        this.loadingElse = new Map(utl.loadingElse)


        utl.newScene = this.newScene
        this.initTouch()
         // this.addMouseEvent();
        // this.info = new Laya.Text();
        // this.info.text = 'kill num:'
        // this.info.fontSize = 50;
        // this.info.color = "#FFFFFF";
        // this.info.size(Laya.stage.width, Laya.stage.height);
        // this.info.pos(50,50)
        // Laya.stage.addChild(this.info);  
        // utl.info =  this.info
        this.drawUi()
        temp = this

        // this.newScene.addChild(utl.models.get('light'));  
        // var directionLight = this.newScene.addChild(new Laya.DirectionLight());
        // directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
        // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));

        // socketMain()
       

       
        Laya.timer.loop(10,this,this.onChangeMain);
        Laya.timer.loop(10,this,this.onUpdata);
        Laya.timer.loop(10,this,this.onUpdataComeOn);
        

        // let map2 = utl.models.get('cube')
        // map2.getChildByName('on').active = false
        // console.log(map2)
        // this.newScene.addChild(map2);
        // utl.entityMap.set('cube',map2)
       
        let camera = utl.models.get('camera')
        // // camera.active=false
        camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

        utl.camera = camera
        this.newScene.addChild(camera);
       	window.po= camera

		// let  plane= utl.models.get('plane')
  //       this.newScene.addChild(plane);

        let  terrain= utl.models.get('light')
        this.newScene.addChild(terrain);


        let box = utl.models.get('cube')
        this.newScene.addChild(box);

        this.main = utl.models.get('main')
        this.newScene.addChild(this.main);
        window.po1 = this.main
        window.wuru = this
        let map = utl.models.get('map')
        this.newScene.addChild(map);
        utl.box = map
         
        map.active = false
       
        this.initCube()
    }
    initCube(){
        let colors = rgb[randomNum(0,4)]
        this.main.transform.localRotationEulerY = 90
        let y = this.findHegist()
        if(y>20){
            this.gameFalg = false
            this.reStart.visible = true
            return
        }


         this.main.transform.position = new Laya.Vector3(0,y+10,0)
        let type = randomNum(1,2)
        let rond = type
        
    	let fClass = new Date().getTime()
    	
    	this.main.fClass = fClass
        this.main.typeFuck = type
    	let po = this.main.transform.position
    	let m1 = utl.box.clone()
    	this.newScene.addChild(m1);
    	m1.fClass = fClass
    	let material1 = m1.meshRenderer.material
            material1.albedoColorA = 1
            material1.albedoColorB = colors[0]
            material1.albedoColorG = colors[1]
            material1.albedoColorR = colors[2]


    	let m2 = utl.box.clone()
    	this.newScene.addChild(m2);
    	m2.fClass = fClass
    	let material2 = m2.meshRenderer.material
            material2.albedoColorA = 1
            material2.albedoColorB = colors[0]
            material2.albedoColorG = colors[1]
            material2.albedoColorR = colors[2]

    	let m3 = utl.box.clone()
    	this.newScene.addChild(m3);
    	m3.fClass = fClass
    	let material3 = m3.meshRenderer.material
            material3.albedoColorA = 1
            material3.albedoColorB = colors[0]
            material3.albedoColorG = colors[1]
            material3.albedoColorR = colors[2]

    	let m4 = utl.box.clone()
    	this.newScene.addChild(m4);
    	m4.fClass = fClass
    	let material4 = m4.meshRenderer.material
            material4.albedoColorA = 1
            material4.albedoColorB = colors[0]
            material4.albedoColorG = colors[1]
            material4.albedoColorR = colors[2]


        if(rond==1){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
            m2.transform.position = new Laya.Vector3(po.x-1,po.y,po.z)
            m3.transform.position = new Laya.Vector3(po.x+1,po.y,po.z)
            m4.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)
        }
        if(rond==2){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
            m2.transform.position = new Laya.Vector3(po.x,po.y,po.z-1)
            m3.transform.position = new Laya.Vector3(po.x,po.y,po.z+1)
            m4.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)
        }
    	// this.m1 = m1
    	// this.m2 = m2
    	// this.m3 = m3
    	// this.m4 = m4
    	m1.active = true
    	m2.active = true
    	m3.active = true
    	m4.active = true
    	this.allBox.add(m1)
    	this.allBox.add(m2)
    	this.allBox.add(m3)
    	this.allBox.add(m4)

    	this.nowBoxs = [m1,m2,m3,m4]
    	this.mMap.set(fClass,{flag : true})

    }
    findHegist(){
        let y = 0
        for(let box of this.allBox.values()){
            let po = box.transform.position
            if(po.y>y){
               y=po.y
            }
        }
        return y
    }
    onChange(){
        if(this.nowBoxs.length==0){
            return
        }
    	let po = this.main.transform.position
    	let ro = Math.round(this.main.transform.localRotationEulerZ)
        


    	let m1 =this.nowBoxs[0]
    	let m2 =this.nowBoxs[1]
    	let m3 =this.nowBoxs[2]
    	let m4 =this.nowBoxs[3]


    	if(ro==270){
    		m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
    	
	    	m2.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)

	    	m3.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)

	    	m4.transform.position = new Laya.Vector3(po.x-1,po.y,po.z)
    	}

    	if(ro==180){
    		m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
    	
	    	m2.transform.position = new Laya.Vector3(po.x+1,po.y,po.z)
	    	
	    	m3.transform.position = new Laya.Vector3(po.x-1,po.y,po.z)

	    	m4.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)
    	}

    	if(ro==90){
    		m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
    	
	    	m2.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)

	    	m3.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)

	    	m4.transform.position = new Laya.Vector3(po.x+1,po.y,po.z)
    	}
    	if(ro==0){
    		m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
    	
	    	m2.transform.position = new Laya.Vector3(po.x-1,po.y,po.z)

	    	m3.transform.position = new Laya.Vector3(po.x+1,po.y,po.z)

	    	m4.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)
    	}
    	// this.eventConpont()
    }
    onUpdataComeOn(){
         if(!this.gameFalg){
            return 
        }
        if(!this.go){
            return
        }
        let temp = this.getHowMove()
        if(temp){
            if(this.checkisUp()){
                this.main.transform.position.y-=.1
                let temp = this.getHowMove()
                if(!temp){
                    this.main.transform.position.y+=.1
                    this.initCube()
                    this.checkDistory()
                }
            }else{
                this.main.transform.position.y =0
                this.initCube()
                this.checkDistory()
            }
        }else{
            this.initCube()
            this.checkDistory()
        }


        for(let box of this.allBox.values()){

        }
    }
    checkisUp(){
        for(let mainBox of this.nowBoxs){
            let {x,y,z} = mainBox.transform.position
            if(y<=0){
                this.fixYValue()
                   // mainBox.transform.position = new Laya.Vector3(x,0,z)
                   return false
            }
        }
        return true
    }
    onUpdata(){
         if(!this.gameFalg){
            return 
        }
    	if(this.go){
            return
        }
        let temp = this.getHowMove()
        if(temp){
            if(this.checkisUp()){
                this.main.transform.position.y-=.005
                let temp = this.getHowMove()
                if(!temp){
                    this.main.transform.position.y+=.005
                    this.initCube()
                    this.checkDistory()
                }
            }else{
                this.main.transform.position.y =0
                this.initCube()
                this.checkDistory()
            }
        }else{
            this.initCube()
            this.checkDistory()
        }
    }
    checkDistory(){
    	let array = []
    	for(let box1 of this.allBox.values()){

    		let {x,y,z} = box1.transform.position
    		let list1 = []
    		let list2 = []
    		for(let box2 of this.allBox.values()){
    			let {x:x2,y:y2,z:z2} = box2.transform.position
    			if(y.toFixed(0)==y2.toFixed(0)&&x==x2){
    				list1.push(box2)
    			}
    			if(y.toFixed(0)==y2.toFixed(0)&&z==z2){
    				list2.push(box2)
    			}
    		}
    		if(list1.length==gameGroundXZLength){
    			for(let b of list1){
    				array.push(b)
    				this.allBox.delete(b)
    			}
    		}
    		if(list2.length==gameGroundXZLength){
    			for(let b2 of list2){
    				array.push(b2)
    				this.allBox.delete(b2)
    			}
    		}
    	}
    	for(let a of array){
    		let {x:x5,y:y5,z:z5} = a.transform.position
    		a.destroy()
    		for(let fuck of this.allBox.values()){
    			let {x:x3,y:y3,z:z3} = fuck.transform.position
    			if(x5==x3&&z3==z5&&y5<y3){
    				console.log(3333)
    				// fuck.transform.position.y--
                    fuck.transform.translate(new Laya.Vector3(0, -1, 0),true);
    			}
    		}	
    	}
    }
    getHowMove(){
    	for(let mainBox of this.nowBoxs){
    		if(!this.checkBox(mainBox)){
    			return false
    		}
    	}
    	return true
    }
    checkBox(obj){
    	let {x:x1,y:y1,z:z1} = obj.transform.position
    	let yco = y1
    	for(let box of this.allBox.values()){
    		let {x,y,z} = box.transform.position
    		if(box.fClass==obj.fClass){
    			continue
    		}else{
    			if(yco<y+1&&z==z1&&x==x1){
                    this.fixYValue()
	    			return false
	    		}
    		}
    		
    	}
    	return true
    }
    fixYValue(){
        for(let mainBox of this.nowBoxs){
            let {x,y,z} = mainBox.transform.position
            let temp = y<0?0:~~(y.toFixed(0))
            mainBox.transform.position = new Laya.Vector3(x,temp,z)
        }
    }
    checkOut(){//true校验通过
        let length = ~~(gameGroundXZLength/2)
        for(let mainBox of this.nowBoxs){
            let {x,y,z} = mainBox.transform.position
            if(length<x||x<-length||
               length<z||z<-length
            ){
               return false
            }
            if(!this.checkBoxfalg(mainBox)){
                return false
            }
        }
        return true
    }
     getacFlag(){
        return this.checkOut()
    }
    constfuck(){
        for(let box of this.allBox.values()){
           let {x,y,z} = box.transform.position
           console.log(x,y,z)
            
        }
    }
    checkBoxfalg(obj){
        let {x:x1,y:y1,z:z1} = obj.transform.position
        for(let box of this.allBox.values()){
            let {x,y,z} = box.transform.position
            if(box.fClass==obj.fClass){
                continue
            }else{
                if(z==z1&&x==x1){
                    if(y1==y||y1==y+.5){
                        return false
                    }
                }
            }
            
        }
        return true
    }
    eventConpont(){

    	let touchCount = this.newScene.input.touchCount();
        let {eventTemp} = this
        if(touchCount==0){
            ayncsyTime= true
        	this.eventTemp = null
        }else{
        	let touch = this.newScene.input.getTouch(0);
        	let {x,y} = touch.position
            this.lisnerButton(x,y)
        	if(!eventTemp){
        		this.eventTemp = {x,y}
        		return
        	}
	        let rote = (~~x- ~~eventTemp.x)/10
	        utl.camera.transform.rotate({x:0,y:rote* Math.PI / 180,z:0},true)
	        let moveY = (~~y- ~~eventTemp.y)/100
	        let nowY = utl.camera.transform.position.y
	        // if(nowY+moveY>4){
                
                utl.camera.getChildByName('GameObject').transform.localRotationEulerX += moveY
	        	// utl.camera.transform.translate(new Laya.Vector3(0, moveY, 0),true);
                if(utl.camera.getChildByName('GameObject').transform.localRotationEulerX<0||utl.camera.getChildByName('GameObject').transform.localRotationEulerX>90){
                    utl.camera.getChildByName('GameObject').transform.localRotationEulerX -= moveY
                }

                
	        // }
	        
	        // utl.camera.transform.position.y += moveY
	        this.eventTemp = {x,y}
        }

        

    }
    lisnerButton(x,y){
        if(!ayncsyTime){
           
            return
        }
        ayncsyTime = false
        let {x:x1,y:y1} = this.sprite
        let {x:x2,y:y2} = this.roteSprite
        let {x:x3,y:y3} = this.upSprite
        let {x:x4,y:y4} = this.reStart
        if(this.main.typeFuck==1){
            if(
                200+x1<x&&x<x1+400
                &&y1<y&&y<y1+200
            ){
                this.main.transform.translate(new Laya.Vector3(-1, 0, 0),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(1, 0, 0),false)
                    console.log(22222222)
                }
                
            }
             if(
                x1-200<x&&x<x1
                &&y1<y&&y<y1+200
            ){
                this.main.transform.translate(new Laya.Vector3(1, 0, 0),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(-1, 0, 0),false)
                    console.log(22222222)
                }
                console.log(3333333)
            }
            if(
                x1<x&&x<x1+200
                &&y1>y&&y>y1-200
            ){
                this.main.transform.translate(new Laya.Vector3(0, 0, 1),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(0, 0, -1),false)
                    console.log(22222222)
                }
                console.log('top')
            }
             if(
                x1<x&&x<x1+200
                &&y1+200<y&&y<y1+400
            ){
                this.main.transform.translate(new Laya.Vector3(0, 0, -1),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(0, 0, 1),false)
                    console.log(22222222)
                }
                console.log('bottom')
            }

        }

        if(this.main.typeFuck==2){
            if(
                200+x1<x&&x<x1+400
                &&y1<y&&y<y1+200
            ){
                this.main.transform.translate(new Laya.Vector3(0, 0, -1),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(0, 0, 1),false)
                    console.log(22222222)
                }
                
            }
             if(
                x1-200<x&&x<x1
                &&y1<y&&y<y1+200
            ){
                this.main.transform.translate(new Laya.Vector3(0, 0, 1),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(0, 0, -1),false)
                    console.log(22222222)
                }
                console.log(3333333)
            }
            if(
                x1<x&&x<x1+200
                &&y1>y&&y>y1-200
            ){
                this.main.transform.translate(new Laya.Vector3(1, 0, 0),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(-1, 0, 0),false)
                    console.log(22222222)
                }
                console.log('top')
            }
             if(
                x1<x&&x<x1+200
                &&y1+200<y&&y<y1+400
            ){
                this.main.transform.translate(new Laya.Vector3(-1, 0, 0),false)
                this.onChangeMain()
                let flag = this.getacFlag()
                if(!flag){
                    this.main.transform.translate(new Laya.Vector3(1, 0, 0),false)
                    console.log(22222222)
                }
                console.log('bottom')
            }

        }

        
        //--------------------roteLft
         if(x2<x&&x<x2+200
          &&y1<y&&y<y1+200
        ){

            this.roteValue +=90 

            this.main.transform.localRotationEulerZ = this.roteValue%360

            this.onChangeMain()
            let flag = this.getacFlag()
            if(!flag){
                this.roteValue -=90 
                this.main.transform.localRotationEulerZ = this.roteValue%360
                console.log(this.roteValue%360)
            }
            console.log(this.roteValue%360)
            console.log('bottom')
        }

         if(x3<x&&x<x3+200
          &&y3<y&&y<y3+200
        ){
             this.go =!this.go 
            
        }
        if(x4<x&&x<x4+500
          &&y4<y&&y<y4+500
        ){
            if(this.reStart.visible){
                for(let box of this.allBox.values()){
                    box.destroy()
                }
                this.allBox.clear()
                this.nowBoxs = []
                 this.gameFalg = true
                this.reStart.visible = false
                this.initCube()
            }
            
        }


        

    }
    checkPo(){

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
        
        // this.addMouseEvent()
        this.sprite = new Laya.Sprite();
        Laya.stage.addChild(this.sprite);
        let bottom = this.loadingElse.get('ff')
        let bottomImg = new  Laya.Image(bottom);
        bottomImg.height = 200
        bottomImg.width =200
         bottomImg.pos(0, 200);
         this.sprite.addChild(bottomImg)

         let left = this.loadingElse.get('ff')
        let leftImg = new  Laya.Image(left);
        leftImg.height = 200
        leftImg.width =200
         leftImg.pos(-200, 0);
         this.sprite.addChild(leftImg)

           let right = this.loadingElse.get('ff')
        let rightImg = new  Laya.Image(right);
        rightImg.height = 200
        rightImg.width =200
         rightImg.pos(200, 0);
         this.sprite.addChild(rightImg)


           let top = this.loadingElse.get('ff')
        let topImg = new  Laya.Image(top);
        topImg.height = 200
        topImg.width =200
         topImg.pos(0, -200);
         this.sprite.addChild(topImg)

         this.sprite.pos(200, Laya.stage.height - 600);




         this.roteSprite = new Laya.Sprite();
          let roteLeft = this.loadingElse.get('ff')
        let roteLeftImg = new  Laya.Image(roteLeft);
        roteLeftImg.height = 200
        roteLeftImg.width =200
         roteLeftImg.pos(0, 0);
         this.roteSprite.addChild(roteLeftImg)
        Laya.stage.addChild(this.roteSprite);
        this.roteSprite.pos(Laya.stage.width-200, Laya.stage.height - 600);


        this.upSprite = new Laya.Sprite();
          let upLeft = this.loadingElse.get('ff')
        let upImg = new  Laya.Image(upLeft);
        upImg.height = 200
        upImg.width =200
         upImg.pos(0, 0);
         this.upSprite.addChild(upImg)
        Laya.stage.addChild(this.upSprite);
        this.upSprite.pos(Laya.stage.width-200, Laya.stage.height - 350);



        this.reStart = new Laya.Sprite();
        let reStartImg = new  Laya.Image(this.loadingElse.get('ff'));
        reStartImg.height = 500
        reStartImg.width =500
         reStartImg.pos(0, 0);
         this.reStart.addChild(reStartImg)
        Laya.stage.addChild(this.reStart);
        this.reStart.pos(Laya.stage.width/2-250, Laya.stage.height/2 - 250);
        this.reStart.visible = false
        // utl.addsImg = addsImg
        // Laya.stage.addChild(addsImg);
        //  utl.showbox = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        // var material = new Laya.BlinnPhongMaterial();
        // material.albedoColor=new Laya.Vector3(5,5,5);
        // material.diffuseColor=new Laya.Vector3(5,5,5);
        // utl.showbox.meshRenderer.material = material;

      
        
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
    onChangeMain(){
        this.eventConpont()
        if(!this.gameFalg){
            return 
        }
        if(this.main.typeFuck==2){
            this.onChangeLeft()
        }
        if(this.main.typeFuck==1){
            this.onChange()
        }
    }
    onChangeLeft(){
        if(this.nowBoxs.length==0){
            return
        }
        let po = this.main.transform.position
        let ro = Math.round(this.main.transform.localRotationEulerZ)
        


        let m1 =this.nowBoxs[0]
        let m2 =this.nowBoxs[1]
        let m3 =this.nowBoxs[2]
        let m4 =this.nowBoxs[3]


        if(ro==270){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
        
            m2.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)

            m3.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)

            m4.transform.position = new Laya.Vector3(po.x,po.y,po.z-1)
        }

        if(ro==180){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
        
            m2.transform.position = new Laya.Vector3(po.x,po.y,po.z+1)
            
            m3.transform.position = new Laya.Vector3(po.x,po.y,po.z-1)

            m4.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)
        }

        if(ro==90){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
        
            m2.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)

            m3.transform.position = new Laya.Vector3(po.x,po.y-1,po.z)

            m4.transform.position = new Laya.Vector3(po.x,po.y,po.z+1)
        }
        if(ro==0){
            m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)
        
            m2.transform.position = new Laya.Vector3(po.x,po.y,po.z-1)

            m3.transform.position = new Laya.Vector3(po.x,po.y,po.z+1)

            m4.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)
        }
        this.eventConpont()
    }
}
