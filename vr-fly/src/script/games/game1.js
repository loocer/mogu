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


export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        this.eventTemp = null
        this.mMap = new Map()
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
       

       
        Laya.timer.loop(10,this,this.onChange);
        Laya.timer.loop(1000,this,this.onUpdata);
        

        // let map2 = utl.models.get('cube')
        // map2.getChildByName('on').active = false
        // console.log(map2)
        // this.newScene.addChild(map2);
        // utl.entityMap.set('cube',map2)
       
        let camera = utl.models.get('camera')
        // // camera.active=false
        // camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

        utl.camera = camera
        this.newScene.addChild(camera);
       	window.po= camera

		let  plane= utl.models.get('plane')
        this.newScene.addChild(plane);

        let  terrain= utl.models.get('light')
        this.newScene.addChild(terrain);


        let box = utl.models.get('cube')
        this.newScene.addChild(box);

        this.main = utl.models.get('main')
        this.newScene.addChild(this.main);
        window.po1 = this.main

        let map = utl.models.get('map')
        this.newScene.addChild(map);
        utl.box = map
         
        map.active = false
       
        this.initCube()
    }
    initCube(){
    	let fClass = new Date().getTime()
    	this.main.transform.position = new Laya.Vector3(0,11,0)
    	this.main.fClass = fClass
    	let po = this.main.transform.position
    	let m1 = utl.box.clone()
    	this.newScene.addChild(m1);
    	m1.fClass = fClass
    	m1.transform.position = new Laya.Vector3(po.x,po.y,po.z)

    	let m2 = utl.box.clone()
    	this.newScene.addChild(m2);
    	m2.fClass = fClass
    	m2.transform.position = new Laya.Vector3(po.x-1,po.y,po.z)

    	let m3 = utl.box.clone()
    	this.newScene.addChild(m3);
    	m3.fClass = fClass
    	m3.transform.position = new Laya.Vector3(po.x+1,po.y,po.z)

    	let m4 = utl.box.clone()
    	this.newScene.addChild(m4);
    	m4.fClass = fClass
    	m4.transform.position = new Laya.Vector3(po.x,po.y+1,po.z)

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
    onChange(){
    	let po = this.main.transform.position
    	let ro = Math.round(this.main.transform.localRotationEulerZ)


    	let m1 =this.nowBoxs[0]
    	let m2 = this.nowBoxs[1]
    	let m3 =this.nowBoxs[2]
    	let m4 =this.nowBoxs[3]


    	if(ro==-90){
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
    	this.eventConpont()
    }
    onUpdata(){
    	
    	let temp = this.getHowMove()
    	if(temp){
    		if(this.main.transform.position.y>0){
	    		this.main.transform.position.y-=.5
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
    checkDistory(){
    	let array = []
    	for(let box1 of this.allBox.values()){

    		let {x,y,z} = box1.transform.position
    		let list1 = []
    		let list2 = []
    		for(let box2 of this.allBox.values()){
    			let {x:x2,y:y2,z:z2} = box2.transform.position
    			if(y==y2&&x==x2){
    				list1.push(box2)
    			}
    			if(y==y2&&z==z2){
    				list2.push(box2)
    			}
    		}
    		if(list1.length==5){
    			for(let b of list1){
    				array.push(b)
    				this.allBox.delete(b)
    			}
    		}
    		if(list2.length==5){
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
    				fuck.transform.position.y--
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
    	let yco = y1-.5
    	for(let box of this.allBox.values()){
    		let {x,y,z} = box.transform.position
    		if(box.fClass==obj.fClass){
    			continue
    		}else{
    			if(yco<y+1&&z==z1&&x==x1){
	    			return false
	    		}
    		}
    		
    	}
    	return true
    }
    eventConpont(){

    	let touchCount = this.newScene.input.touchCount();
        let {eventTemp} = this
        if(touchCount==0){

        	this.eventTemp = null
        }else{
        	let touch = this.newScene.input.getTouch(0);
        	let {x,y} = touch.position
        	if(!eventTemp){
        		this.eventTemp = {x,y}
        		return
        	}
	        let rote = ~~x- ~~eventTemp.x
	        utl.camera.transform.rotate({x:0,y:rote* Math.PI / 180,z:0},true)
	        let moveY = (~~y- ~~eventTemp.y)/100
	        let nowY = utl.camera.transform.position.y
	        if(nowY+moveY>4){
	        	utl.camera.transform.translate(new Laya.Vector3(0, moveY, 0),true);
	        }
	        
	        // utl.camera.transform.position.y += moveY
	        this.eventTemp = {x,y}
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
        // let adds = this.loadingElse.get('addsStop')
        // let addsImg = new  Laya.Image(adds);
        // addsImg.height = 150
        // addsImg.width =150
        // addsImg.pos(200, Laya.stage.height - 200);
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
