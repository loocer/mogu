(function () {
    'use strict';

    var utl = {
        id:Date.parse(new  Date())+'',
        entityMap:new Map(),
        playerId:'zzw',



        boxs:new Map(),
        sendMessage:[],
        sendTime:0,
        messgeTime:0,
        websocket:null,

        playStatusObj:{
            doingIndex:1
        },
    	tachLeftFlag:false,//左边点击
    	tachRightFlag:false,//左边点击
    	box:null,
        userId:Date.parse(new  Date())+'',
        models:new Map(),
        realBox:null,
        box4:null,
        camera:null,
        bestGround:250,
        speedMove:.1,
        speed:{
        	z:0,
        	x:0,
        	y:0
        },
        c1:null,
        c2:null,
        walkingDirection:1,//1：up,2:down,3:left,4:right
        netPlayers:null,
        isOutGropund:true,
        hitResult:new Laya.HitResult(),
        target:{
            x:0,
            y:0
        },
        roteGun:{
            x:0,
            y:0
        },
        roteGunback:{
            x:0,
            y:0
        },
        roteGunTemp:{
            x:0,
            y:0
        },
        takeSpeed:{
        	z:0,
        	x:0,
        	y:0
        },
        roteLeftFlag:false,
        roteRightFlag:false,
        entity:new Map(),
        operationYype:1,//1:虚拟手柄 2:屏幕方向
        loadIndex:0,
        fireOnOff:false,
        msType:'move',
        updates:[],
        firs:[],
        loadingElse:[
             ['adds','https://xuxin.love/img/redcode/icon/adds.png'],
            // ['tdf','https://xuxin.love/img/fly/u=3199317496,3290195022&fm=26&gp=0.jpg'],
            // ['fire','https://xuxin.love/img/fly/fires.png'],
            // ['left','https://xuxin.love/img/fly/left.png'],
            // ['right','https://xuxin.love/img/fly/right.png'],
            // ['speed','https://xuxin.love/img/fly/speed.png'],
            // ['lessSpeed','https://xuxin.love/img/fly/lessSpeed.png'],
            // ['addSpeed','https://xuxin.love/img/fly/addSpeed.png']
        ],
        loadingSprite3D:[
            ['light','res/LayaScene_SampleScene/Directional Light.lh'],
            ['cube','res/LayaScene_SampleScene/Cube.lh'],
            ['camera','res/LayaScene_SampleScene/Main Camera.lh'],
            ['terrain','res/LayaScene_SampleScene/Terrain.lh'],

            // ['light','https://xuxin.love/img/fly/LayaScene/Conventional/light.lh'],
            // ['pler','https://xuxin.love/img/fly/LayaScene/Conventional/pler.lh'],
            // ['cube','https://xuxin.love/img/fly/LayaScene/Conventional/Sphere.lh'],
            // ['aum','https://xuxin.love/img/fly/LayaScene/Conventional/aum.lh'],
            // ['sun','https://xuxin.love/img/fly/LayaScene/Conventional/sun.lh'],
            // ['bullet','https://xuxin.love/img/fly/LayaScene/Conventional/b.lh'],

        ],
        getAngle:(x, y)=> {
            var l = Math.sqrt(x*x + y*y);
            var a = Math.acos(x/l);
            var ret = a * 180 / Math.PI; //弧度转角度，方便调试
            if (y < 0) {
                return 360 - ret;
            }
            return ret;
        }
    };

    let rots = [];

     class newtach {
       constructor() {
         this.status = 0;
         this.x = 0;
         this.y = 0;
         this.move = null;
         this.startPoint = null;
         this.endPoint = null;
         this.sp = new Laya.Sprite();
         this.point = new Laya.Vector2();
         this.startP = null;
         this.evList = this.eventInt();
         Laya.stage.addChild(this.sp);
       }
       eventInt(){
         let that = this;
          let eventList = [{
             checkPotion:{
               x:200,
               y:Laya.stage.height - 200,
               width:150,
               height:150
             },
             callBack:()=>{
               return that.addpBack()
             }
          },
          {
             checkPotion:{
               x:0,
               y:0,
               width:400,
               height:400
             },
             callBack:()=>{
               return that.changeCamerBack()
             }
          }
          ];
          return eventList
       }
       addpBack(){
         console.log(454545);
         let msg = {
           userId: 'zzw',
           actionName:'addHero',
         };
         utl.socket.emit('123456', msg);

       }
       eventCheck(){
         let {evList} = this;
         for(let item of evList){
           let checkPotion = item.checkPotion;
           if (this.startPoint.x - this.endPoint.x < 10 &&
           this.startPoint.y - this.endPoint.y < 10 &&
           this.endPoint.x < checkPotion.x+checkPotion.width &&
           this.endPoint.x > checkPotion.x &&
           this.endPoint.y < checkPotion.y+checkPotion.height&&
           this.endPoint.y > checkPotion.y
           ){
             item.callBack();
             return
           }
         }
         this.changePointBack();
       }

       changeCamerBack(){
           let p = this.startPoint;
           let x = p.x / 400 * 500;
           let y = p.y / 400 * 500;
           utl.camera.transform.position = new Laya.Vector3(-x, 30, 500 - y);
       }
       changePointBack(){
           let p = this.startPoint;
           let p2 = this.trsV2ToV3(p);
           if (
             p2.x < 0 &&
             p2.z > 0 &&
             p2.x > -500 &&
             p2.z < 500) {
             if (
               Math.abs(this.startPoint.x - this.endPoint.x) < 10 &&
               Math.abs(this.startPoint.y - this.endPoint.y) < 10
             ) {
               let x = ~~p2.x;
               let y = ~~p2.z;

               // let heros = []
               // for (let hero of utl.entityMap.keys()) {
               //   heros.push({
               //     id: hero,
               //     coordinate: {
               //       x: -x,
               //       y
               //     }
               //   })
               // }
               for(let r of rots){
                  r.coordinate = {
                     x: -x,
                     y
                   };
               }
               let msg = {
                 userId: 'zzw',
                 actionName:'moveGroup',
                 heros:rots
               };
               utl.socket.emit('123456', msg);
             }
           }
       }
       reset() {
          if (!this.startPoint) {
            return
          }
          if (!this.endPoint) {
            return
          }
          if (
               Math.abs(this.startPoint.x - this.endPoint.x) < 10 &&
               Math.abs(this.startPoint.y - this.endPoint.y) < 10
          ){
            this.eventCheck();
          // }

         // if (this.startPoint.x - this.endPoint.x < 10 &&
         //   this.startPoint.y - this.endPoint.y < 10 &&
         //   this.endPoint.x < 400 &&
         //   this.endPoint.y < 400
         // ) {
         //   let p = this.startPoint
         //   let x = p.x / 400 * 500
         //   let y = p.y / 400 * 500
         //   utl.camera.transform.position = new Laya.Vector3(-x, 30, 500 - y)
         // } else {
         //   let p = this.startPoint
         //   let p2 = this.trsV2ToV3(p)
         //   if (
         //     p2.x < 0 &&
         //     p2.z > 0 &&
         //     p2.x > -500 &&
         //     p2.z < 500) {
         //     if (
         //       Math.abs(this.startPoint.x - this.endPoint.x) < 10 &&
         //       Math.abs(this.startPoint.y - this.endPoint.y) < 10
         //     ) {
         //       let x = ~~p2.x
         //       let y = ~~p2.z

         //       // let heros = []
         //       // for (let hero of utl.entityMap.keys()) {
         //       //   heros.push({
         //       //     id: hero,
         //       //     coordinate: {
         //       //       x: -x,
         //       //       y
         //       //     }
         //       //   })
         //       // }
         //       for(let r of rots){
         //          r.coordinate = {
         //             x: -x,
         //             y
         //           }
         //       }
         //       let msg = {
         //         userId: 'zzw',
         //         heros:rots
         //       }
         //       utl.socket.emit('123456', msg);
         //     }
         //   }

         }
         this.startPoint = null;
         this.endPoint = null;
       }
       drawSelect(p) {
         if (this.status == 0) {
           this.startPoint = p;
           this.status = 1;
           this.startP = this.trsV2ToV3(p);
           return
         }
         if (this.status == 1) {
           this.endPoint = p;
           let p1 = this.startPoint;
           if (
             Math.abs(this.startPoint.x - this.endPoint.x) < 10 &&
             Math.abs(this.startPoint.y - this.endPoint.y) < 10
           ) {

           } else {
             this.sp.graphics.clear();
             this.sp.graphics.drawLines(p1.x, p1.y, [0, 0, p.x - p1.x, 0, p.x - p1.x, p.y - p1.y, 0, p.y - p1.y, 0, 0], "#ff0000", 5);
             this.selectAll(p);
           }

         }

       }
       trsV2ToV3(p) {

         // let point =  touch.position
         this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
         let outs = [];
         //产生射线
         utl.camera.viewportPointToRay(p, this._ray);
         //拿到射线碰撞的物体
         utl.newScene.physicsSimulation.rayCastAll(this._ray, outs);
         //如果碰撞到物体
         if (outs.length !== 0) {

           for (let i = 0; i < outs.length; i++) {
             if (outs[i].collider.owner.name == "plane") {
               return new Laya.Vector3(outs[0].point.x, outs[0].point.y, outs[0].point.z)
             }
           }
           //在射线击中的位置添加一个立方体

         }
       }
       selectAll(p22) {

         let p1 = this.startP;
         let p2 = this.trsV2ToV3(p22);
         if (!p1) {
           return
         }
         let absx1x = p1.x;
         let absx2x = p2.x;
         let absx1z = p1.z;
         let absx2z = p2.z;
         let msx = absx1x > absx2x ? absx1x : absx2x;
         let msz = absx1z > absx2z ? absx1z : absx2z;
         let mix = absx1x < absx2x ? absx1x : absx2x;
         let miz = absx1z < absx2z ? absx1z : absx2z;
         rots = [];
         for (let key of utl.entityMap.keys()) {
          let en = utl.entityMap.get(key);
           let pos = en.transform.position;
           let fx = pos.x;
           let fz = pos.z;
           if (fx < msx &&
             fx > mix &&
             fz < msz &&
             fz > miz) {
             rots.push({id: key});
             en.getChildByName('on').active = true;
             en.getChildByName('off').active = false;
           } else {
             en.getChildByName('on').active = false;
             en.getChildByName('off').active = true;
           }

         }
       }
       leftFormatMovePosition(out, tnum) {
         let xx = 0;
         let zz = 0;
         if (out) {
           xx = out.x.toFixed(1);
           zz = out.y.toFixed(1);
         } else {
           xx = 0;
           zz = 0;
         }
         if (tnum == 0) {
           this.sp.graphics.clear();
           this.status = 0;
           this.reset();


           return
         }
         if (this.status == tnum) {
           let x = (this.x - xx).toFixed(1) / 10;
           let z = -(this.z - zz).toFixed(1) / 10;
           this.move = [x, z];
         } else {
           this.x = xx;
           this.z = zz;
           this.move = [0, 0];
         }
         if (tnum == 2) {
           this.sp.graphics.clear();
           utl.camera.transform.translate(new Laya.Vector3(this.move[0], this.move[1], 0), true);
           if (utl.camera.transform.position.x > 0 ||
             utl.camera.transform.position.x < -500 ||
             utl.camera.transform.position.z < 0 ||
             utl.camera.transform.position.z > 500
           ) {
             utl.camera.transform.translate(new Laya.Vector3(-this.move[0], -this.move[1], 0), true);
           }
         }
         this.status = tnum;
         this.x = xx;
         this.z = zz;
       }
     }

    class newTwo{
        constructor(){
                this.scaleTime = 100;
                this.width = Laya.stage.width/2; 
                this.height = Laya.stage.height;
                this.x = 0;
                this.y = 0;
                this.moveX = 0;
                this.moveY = 0;

                this.tx= 300;
                this.twidth = 450;
                this.theight = 450;
                this.ty = Laya.stage.height-600;
            }
           scaleBig(e)
            {        
                utl.takeSpeed.z = 0;
                console.log('MOUSE_UP');
                utl.tachRightFlag = false;
                // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
            }
            outEvent(){
              utl.tachRightFlag = false;
            }
          
           scaleSmall(x,y)
            {    
              if(0<x&&x<this.tx+this.twidth+200&&y>this.ty-80&&y<this.ty+this.theight+80
                ){
                return true
              }else{
                return false
              }
                //缩小至0.8的缓动效果
                // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
            }
            getRoteImg(pobj) {
              let rotate = 0;
              if (pobj.x1 == pobj.x2){
                rotate=0;
              }
              if (pobj.x1 > pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
              } else if (pobj.x1 < pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
              }
              return rotate
            }
            leftFormatMovePosition(px,py) {
             
              // utl.ani.play("hello");
              let pobj = {};
              let tempx = 0;
              let tempy = 0;
              pobj.x1 = px; //点击
              pobj.x2 =this.tx + this.twidth/2;
              pobj.y1 = py;
              pobj.y2 = this.ty + this.theight/2;
              if((px - this.tx - this.twidth/2) / (this.twidth/2) >1){
                tempx = 1;
              }else{
                 tempx = (px - this.tx - this.twidth/2) / (this.twidth/2); 
              }
              if((px - this.tx - this.twidth/2) / (this.twidth/2) <-1){
                tempx = -1;
              }else{
                 tempx = (px - this.tx - this.twidth/2) / (this.twidth/2); 
              }
              if((py - this.ty - this.theight/2) / (this.theight/2) >1){
                 tempy = 1;
              }else{
                tempy = (py - this.ty - this.theight/2) / (this.theight/2); 
              }
              if((py - this.ty - this.theight/2) / (this.theight/2) <-1){
                 tempy = -1;
              }else{
                tempy = (py - this.ty - this.theight/2) / (this.theight/2); 
              }
              utl.takeSpeed.x = -tempy*90;
              utl.takeSpeed.y = -tempx*90;



              // let pobj = {}
              // pobj.x1 = px //点击
              // pobj.x2 =this.tx + this.twidth/2
              // pobj.y1 = py
              // pobj.y2 = this.ty + this.theight/2
              // let inv = new Laya.Vector3(pobj.x1 - pobj.x2,0,pobj.y1 - pobj.y2)
              // let out = new Laya.Vector3()
              // Laya.Vector3.normalize(inv, out)
              // console.log(inv,out)
              // if(utl.sendTime==utl.messgeTime){
              //    console.log('-------6666666-----',utl.cube.transform.rotationEuler)
              //   utl.sendTime++
              //   utl.rote = this.getRoteImg(pobj) 
              //   let x = utl.netBox.x+out.z
              //   let z = utl.netBox.z-out.x
              //   utl.sendMessage = [{
              //     id:utl.id,
              //     position:{x:utl.netBox.x,
              //       z:utl.netBox.z},
              //     tar:{x,z},
              //     sendTime:utl.sendTime,
              //     type:'move',
              //     move:out,
              //     rotationEuler:utl.cube.transform.rotationEuler,
              //     rote:this.getRoteImg(pobj) 
              //   }]
                
              // }
            }

    }

    class fire{
        constructor(){
                this.scaleTime = 100;
                this.width = 150;
                this.height = 150;
                this.x = Laya.stage.width-250;
                this.y = Laya.stage.height - 250;
                this.moveX = 0;
                this.moveY = 0;

                this.tx=Laya.stage.width/4;
                this.twidth = 400;
                this.theight = 400;
                this.ty = Laya.stage.height - 500;
            }
           scaleBig(e)
            {        
                utl.takeSpeed.z = 0;
                console.log('MOUSE_UP');
                utl.tachRightFlag = false;
                // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
            }
            outEvent(){
              utl.tachRightFlag = false;
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
              let rotate = 0;
              if (pobj.x1 == pobj.x2){
                rotate=0;
              }
              if (pobj.x1 > pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
              } else if (pobj.x1 < pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
              }
              return rotate
            }
            leftFormatMovePosition(px,py) {
              utl.fireOnOff = true;
            }

    }

    class Bullet extends Laya.Script3D { 
    	constructor() {
    		super();
    		this.tempy = 0;
    		this.box = null;
    		this.time = 0;
    		this.speed = new Laya.Vector3();
    		
    	}
    	onAwake() {
    		
    		//得到3D对象
    		this.box = this.owner;
    		utl.firs.push(this);
    		// this.findIt()
    	}
    	findIt(){
    		let bV3 = new Laya.Vector3();
            	Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
    			let speed = new Laya.Vector3();
    			Laya.Vector3.normalize(bV3,speed);
    			// Laya.Vector3.scale(speed, .1, this.speed);

    			let speedLanth = Laya.Vector3.scalarLength(this.speed); 
    			// // let temp = new Laya.Vector3(0,0,utl.speedMove
    			let lspeed = (utl.speedMove + .1).toFixed(2);
    			// // let scale = (utl.speedMove + lspeed)/lspeed
    			// // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
    			Laya.Vector3.scale(speed, .1, this.speed);
    			utl.info.text = Laya.Vector3.scalarLength(this.speed) - utl.speedMove+","+utl.speedMove+','+Laya.Vector3.scalarLength(this.speed);
    			utl.firs.push(this);
    	}
    	_load(){
    		this.box = this.owner;
    		let bV3 = new Laya.Vector3();
            	Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
    			let speed = new Laya.Vector3();
    			Laya.Vector3.normalize(bV3,speed);
    			Laya.Vector3.scale(speed, .01, this.speed);
    			// let speedLanth = Laya.Vector3.scalarLength(this.speed) 
    			// // // let temp = new Laya.Vector3(0,0,utl.speedMove
    			// let lspeed = (utl.speedMove + speedLanth)/speedLanth
    			// // // let scale = (utl.speedMove + lspeed)/lspeed
    			// // // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
    			// Laya.Vector3.scale(this.speed, lspeed, this.speed);
    			
    			// console.log(Laya.Vector3.scalarLength(this.speed))
    			// Laya.timer.loop(30,this,this.onUpdatef);
    	}
    	// onAwake() {
    	// 	this.box = this.owner;
    	// 	if(utl.c1&&utl.c2){
    	// 		let bV3 = new Laya.Vector3();
     //        	Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
    	// 		let speed = new Laya.Vector3();
    	// 		Laya.Vector3.normalize(bV3,speed);
    	// 		Laya.Vector3.scale(speed, .15, this.speed);
    	// 		// let speedLanth = Laya.Vector3.scalarLength(this.speed) 
    	// 		// // // let temp = new Laya.Vector3(0,0,utl.speedMove
    	// 		// let lspeed = (utl.speedMove + speedLanth)/speedLanth
    	// 		// // // let scale = (utl.speedMove + lspeed)/lspeed
    	// 		// // // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
    	// 		// Laya.Vector3.scale(this.speed, lspeed, this.speed);
    			
    	// 		// console.log(Laya.Vector3.scalarLength(this.speed))
    	// 		Laya.timer.loop(30,this,this.onUpdatef);
    	// 	}
            
    	// }
    	toTiome(){
    		this.time++; 
    		if(!this.box.destroyed){
    			// let vx = utl.box.transform.position.x - this.box.transform.position.x 
    			// let vy = utl.box.transform.position.y - this.box.transform.position.y 
    			// let vz = utl.box.transform.position.z - this.box.transform.position.z
    			// let ry = utl.getAngle(vx,vz)
    			// this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
    			// this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
    			// this.tempy = ry
    			 // this.box.transform.translate(this.speed,false)
    			 let bmain =this.box.getChildByName('Cube');
    			 if(this.box){
                	
                	this.box.transform.translate(new Laya.Vector3(0,-this.startSpeed,0),true);
    			 	bmain.transform.translate(new Laya.Vector3(0,-1,0),true);
    			 }
    			 
    			 if(this.time>200 ){
    			 	this.box.destroy();
    			 }
    		}
    	}
    	onStart() {}

    	onTriggerEnter()
    	{
    	    this.box.removeSelf();
    		console.log("bu--onTriggerEnter");
    	}
    	onTriggerStay()
    	{
    		console.log("bu--onTriggerStay");
    	}
    	onTriggerExit()
    	{
    		console.log("bu--onTriggerExit");
    	}
    	onEnable() {
    	} 
    	onDisable() {
    	}
    }

    class newTwo$1{
        constructor(){
                this.x = 0;
                this.y = 0;

                this.tx= Laya.stage.width - 600;
                
                this.twidth = 200;
                this.theight = 200;
                this.ty =Laya.stage.height - 400;
                this.tempX = 0;
                this.tempY = 0;
            }
           scaleBig(e)
            {        
                utl.takeSpeed.z = 0;
                console.log('MOUSE_UP');
                utl.tachRightFlag = false;
                // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
            }
            outEvent(){
              utl.tachRightFlag = false;
            }
           onFire(){
                  let aum =utl.bullet.clone();
                  let script = aum.addComponent(Bullet);
                  utl.newScene.addChild(aum);
            }
           scaleSmall(x,y)
            {    
              if(this.tx-0<x&&x<this.tx+this.twidth+0&&y>this.ty-0&&y<this.ty+this.theight+0
                ){
                 utl.fireOnOff = true;
                return true
              }else{
                return false
              }
                //缩小至0.8的缓动效果
                // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
            }
            getRoteImg(pobj) {
              let rotate = 0;
              if (pobj.x1 == pobj.x2){
                rotate=0;
              }
              if (pobj.x1 > pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
              } else if (pobj.x1 < pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
              }
              return rotate
            }
            leftFormatMovePosition(px,py) {
              let pobj = {};
              let tempx = 0;
              let tempy = 0;
              pobj.x1 = px; //点击
              pobj.x2 =this.tx + this.twidth/2;
              pobj.y1 = py;
              pobj.y2 = this.ty + this.theight/2;
              if((px - this.tx - this.twidth/2) / (this.twidth/2) >1){
                tempx = 1;
              }else{
                 tempx = (px - this.tx - this.twidth/2) / (this.twidth/2); 
              }
              if((px - this.tx - this.twidth/2) / (this.twidth/2) <-1){
                tempx = -1;
              }else{
                 tempx = (px - this.tx - this.twidth/2) / (this.twidth/2); 
              }
              if((py - this.ty - this.theight/2) / (this.theight/2) >1){
                 tempy = 1;
              }else{
                tempy = (py - this.ty - this.theight/2) / (this.theight/2); 
              }
              if((py - this.ty - this.theight/2) / (this.theight/2) <-1){
                 tempy = -1;
              }else{
                tempy = (py - this.ty - this.theight/2) / (this.theight/2); 
              }
              let rx = tempy*5;
              let ry = tempx*5;
              utl.roteGun.x  = rx;
              utl.roteGun.y = -ry;
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

    class leftRote{
        constructor(){
                this.scaleTime = 100;
                this.width = Laya.stage.width/2; 
                this.height = Laya.stage.height;
                this.x = 0;
                this.y = 0;
                this.moveX = 0;
                this.moveY = 0;

                this.tx= Laya.stage.width  -700;
                this.twidth = 150;
                this.theight = 150;
                this.ty = Laya.stage.height - 200;
            }
           scaleBig(e)
            {        
                utl.takeSpeed.z = 0;
                console.log('MOUSE_UP');
                utl.tachRightFlag = false;
                // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
            }
            outEvent(){
              utl.tachRightFlag = false;
            }
          
           scaleSmall(x,y)
            {    
              if(this.tx<x&&x<this.tx+this.twidth&&this.ty<y&&y<this.ty+this.theight
                ){
                console.log(y,this.ty,this.ty+this.theight);
                return true
              }else{
                return false
              }
                //缩小至0.8的缓动效果
                // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
            }
            getRoteImg(pobj) {
              let rotate = 0;
              if (pobj.x1 == pobj.x2){
                rotate=0;
              }
              if (pobj.x1 > pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
              } else if (pobj.x1 < pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
              }
              return rotate
            }
            leftFormatMovePosition(px,py) {
             
              // utl.ani.play("hello");
              // let pobj = {}
              // let tempx = 0
              // let tempy = 0
              // pobj.x1 = px //点击
              // pobj.x2 =this.tx + this.twidth/2
              // pobj.y1 = py
              // pobj.y2 = this.ty + this.theight/2
              // if((px - this.tx - this.twidth/2) / (this.twidth/2) >1){
              //   tempx = 1
              // }else{
              //    tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
              // }
              // if((px - this.tx - this.twidth/2) / (this.twidth/2) <-1){
              //   tempx = -1
              // }else{
              //    tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
              // }
              // if((py - this.ty - this.theight/2) / (this.theight/2) >1){
              //    tempy = 1
              // }else{
              //   tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
              // }
              // if((py - this.ty - this.theight/2) / (this.theight/2) <-1){
              //    tempy = -1
              // }else{
              //   tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
              // }
              // utl.takeSpeed.x = -tempy*20
              // utl.takeSpeed.y = -tempx*20
            }

    }

    class rightRote{
        constructor(){
                this.scaleTime = 100;
                this.width = Laya.stage.width/2; 
                this.height = Laya.stage.height;
                this.x = 0;
                this.y = 0;
                this.moveX = 0;
                this.moveY = 0;

                this.tx= Laya.stage.width  -400;
                this.twidth = 150;
                this.theight = 150;
                this.ty = Laya.stage.height - 200;
            }
           scaleBig(e)
            {        
                utl.takeSpeed.z = 0;
                console.log('MOUSE_UP');
                utl.tachRightFlag = false;
                // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
            }
            outEvent(){
              utl.tachRightFlag = false;
            }
          
           scaleSmall(x,y)
            {    
              if(this.tx<x&&x<this.tx+this.twidth&&this.ty<y&&y<this.ty+this.theight
                ){
                return true
              }else{
                return false
              }
                //缩小至0.8的缓动效果
                // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
            }
            getRoteImg(pobj) {
              let rotate = 0;
              if (pobj.x1 == pobj.x2){
                rotate=0;
              }
              if (pobj.x1 > pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
              } else if (pobj.x1 < pobj.x2) {
                let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
                rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
              }
              return rotate
            }
            leftFormatMovePosition(px,py) {
             
              // utl.ani.play("hello");
              // let pobj = {}
              // let tempx = 0
              // let tempy = 0
              // pobj.x1 = px //点击
              // pobj.x2 =this.tx + this.twidth/2
              // pobj.y1 = py
              // pobj.y2 = this.ty + this.theight/2
              // if((px - this.tx - this.twidth/2) / (this.twidth/2) >1){
              //   tempx = 1
              // }else{
              //    tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
              // }
              // if((px - this.tx - this.twidth/2) / (this.twidth/2) <-1){
              //   tempx = -1
              // }else{
              //    tempx = (px - this.tx - this.twidth/2) / (this.twidth/2) 
              // }
              // if((py - this.ty - this.theight/2) / (this.theight/2) >1){
              //    tempy = 1
              // }else{
              //   tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
              // }
              // if((py - this.ty - this.theight/2) / (this.theight/2) <-1){
              //    tempy = -1
              // }else{
              //   tempy = (py - this.ty - this.theight/2) / (this.theight/2) 
              // }
              // utl.takeSpeed.x = -tempy*20
              // utl.takeSpeed.y = -tempx*20
            }

    }

    let getAngle = (x, y)=> {
        var l = Math.sqrt(x*x + y*y);
        var a = Math.acos(x/l);
        var ret = a * 180 / Math.PI; //弧度转角度，方便调试
        if (y < 0) {
            return 360 - ret;
        }
        return ret;
    };
    let getRote = (pao,fly)=>{
    	let paog = getAngle(pao.x,pao.y);
    	let flyg = getAngle(fly.x,fly.y);
    	return flyg - paog
    };
    class Enemy extends Laya.Script3D { 
    	constructor() {
    		super();
    		this.isAttacked = true;
    		this.tempy = 0;
    		this.box = null;
    		this.life = 60;
    		this.tempAng1 = 0;
    		this.tempAng2 = 0;
    		this.temp2Ang1 = 0;
    		this.temp2Ang2 = 0;
    		this.ang1 = 0;
    		this.ang2 = 0;
    		this.time = 0;
    		this.outPos = new Laya.Vector3();
    		this.speed = new Laya.Vector3();
    		this.loadingElse = new Map(utl.loadingElse);
    		  let bleed = this.loadingElse.get('cotrll');
            this.bleedimg = new  Laya.Image(bleed);
                this.bleedimg.height = 10;
                this.bleedimg.width =200;
                Laya.stage.addChild(this.bleedimg);
    		Laya.timer.loop(30,this,this.onUpdate);
    		
    	}
    	onAwake() {
    		this.box = this.owner;
    		// Laya.timer.loop(800,this,this.onFire);
    		
    	}
    	onFire(){
    		let p1  = this.box.transform.position;
    		let p2  = utl.box.getChildByName('shipmain').transform.position;
    		let tempP1P2 = new Laya.Vector3();
    		 Laya.Vector3.subtract(p1, p2, tempP1P2);
    		let length =  Laya.Vector3.scalarLength(tempP1P2);
    		if(length<10){
    			let aum = utl.models.get('aum').clone(); 
    			this.box.getChildByName('c').getChildByName('c').addChild(aum);
    	        aum.addComponent(Bt);
    		}
    		// // console.log( '++++++++----+++++',this.box.transform.position.x,this.box.transform.position.y,this.box.transform.position.z)
    		// let aum = utl.models.get('aum').clone() 
    		// // let cube = this.box.getChildByName('c').getChildByName('c').getChildByName('c').clone()
    		// // this.box.getChildByName('c').getChildByName('c').addChild(cube)
    		// utl.newScene.addChild(aum)
    		// let pos = this.box.transform.position
    		// aum.transform.position =new  Laya.Vector3(pos.x,pos.y,pos.z)
      //       aum.addComponent(Bt);


            // console.log( '++++++++----+++++',this.box.transform.position.x,this.box.transform.position.y,this.box.transform.position.z)
    		
    		// let cube = this.box.getChildByName('c').getChildByName('c').clone()
    		// cube.name = 'fuck'

    		// utl.newScene.addChild(aum)
    		// let pos = this.box.transform.position
    		// aum.transform.position =new  Laya.Vector3(pos.x,pos.y,pos.z)
      //       let aum = utl.models.get('aum').clone() 
    		// this.box.getChildByName('c').getChildByName('c').addChild(aum)
    		// aum.addComponent(Bt);
           
    	}
    	onFind(){
    		if(utl.box){
    			let pao1 = {x:this.box.transform.position.x,y:this.box.transform.position.y};
    			let fly1 = {x:utl.box.transform.position.x,y:utl.box.transform.position.y};
    			this.ang1 = getRote(pao1,fly1);
    			let pao2 = {x:this.box.transform.position.x,y:this.box.transform.position.y};
    			let fly2 = {x:utl.box.transform.position.x,y:utl.box.transform.position.y};
    			this.ang2 = getRote(pao2,fly2);

    			// let bV3 = new Laya.Vector3();
       //      	Laya.Vector3.subtract( utl.box.transform.position,this.box.transform.position, bV3);
    			// Laya.Vector3.normalize(bV3,this.speed);
    			// // let scale =  utl.speedMove/10 + 1
    			// Laya.Vector3.scale(this.speed, .1, this.speed);
    		}

    	}
    	onUpdate(){
    		this.time++; 
    		let position1 = utl.box.getChildByName('shipmain').transform.position;
    		let position2 = this.box.transform.position;
    		let x = position1.x - position2.x;
    		let z = position1.z - position2.z;

    		this.tempAng1 = -utl.getAngle(x,z);
    		this.box.transform.rotate(new Laya.Vector3(0, -this.tempAng2* Math.PI / 180,0),true);
    		this.box.transform.rotate(new Laya.Vector3(0, this.tempAng1* Math.PI / 180,0),true);

    		

    		this.tempAng2 = this.tempAng1;
    		let bV3 = new Laya.Vector3();
    		Laya.Vector3.subtract( position1,position2, bV3);
    		// let l = Laya.Vector3.scalarLength(bV3)
    		let y = Math.abs(position1.y - position2.y);
    		let l = Math.sqrt(x*x + z*z);
            this.temp2Ang1 = (Math.asin(y/l)* 180 / Math.PI);
            // this.temp2Ang1 = 30
    		this.box.getChildByName('c').transform.rotate(new Laya.Vector3(0,0, -this.temp2Ang2* Math.PI / 180),true);
    		this.box.getChildByName('c').transform.rotate(new Laya.Vector3(0,0, this.temp2Ang1* Math.PI / 180),true);
    		this.temp2Ang2 = this.temp2Ang1;
    		position2.y = position2.y;
    		utl.camera.viewport.project(position2, utl.camera.projectionViewMatrix, this.outPos);
    		this.bleedimg.pos(this.outPos.x / Laya.stage.clientScaleX, this.outPos.y / Laya.stage.clientScaleY);
    		this.bleedimg.scaleX = this.bleedimg.scaleY =  0.125 * position2.z + 0.75;
    		// this.onFind()
    		// let vx = utl.box.transform.position.x - this.box.transform.position.x 
    		// let vy = utl.box.transform.position.y - this.box.transform.position.y 
    		// let vz = utl.box.transform.position.z - this.box.transform.position.z
    		// let ry = utl.getAngle(vx,vz)
    		// console.log(ry)
    		// this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
    		// this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
    		// this.tempy = ry



    		 // this.box.transform.translate(this.speed,false)




    		 if(this.time%10==0){
    		 	this.onFire();
    		 }
    		 // if(this.isAttacked)
    	  //       {
    	  //           //根据击退方向和速度移动
    	  //           this.box.transform.rotate(new Laya.Vector3(0, 0, -this.tempAng), true, false);
    	  //           this.box.transform.rotate(new Laya.Vector3(0, 0, this.ang), true, false);
    	  //           // console.log("击退位置变化：",(this.cube.transform.position.clone()).elements);
    	  //           //击退速度逐步减小
    	  //           // Laya.Vector3.scale(this.repelledV3,0.3,this.repelledV3);
    	  //           // //当后退各方向速度小于0.01时，击退状态停止
    	  //           // if(Laya.Vector3.scalarLength(this.repelledV3)<0.01)
    	  //           // {
    	  //           //     this.isAttacked=false;
    	  //           // }
    	  //       }
    	}
    	onStart() {}

    	onTriggerEnter(other)
    	{
    	    this.box.removeSelf();
    	    // let sp3D = other.owner;
         //    //获取子弹对象模型脚本
         //    let script = sp3D.getComponents(Bullet);
         //    //获取子弹速度为
         //    this.repelledV3 = script[0].speed.clone();
         //    //被攻击速度归一化成单位一向量
         //    Laya.Vector3.normalize(this.repelledV3, this.repelledV3);
            //设置为被攻击状态
            this.isAttacked = true;
            // console.log("\n1 子弹碰撞时位置(方向):", sp3D.transform.position.elements);
    		console.log("en--nTriggerEnter");
    	}
    	onTriggerStay()
    	{
    		console.log("en--onTriggerStay");
    	}
    	onTriggerExit()
    	{
    		this.life -= 20;
            if (this.life <= 0) {
                this.enable = false;
                Laya.timer.frameOnce(1, this, function () { this.owner.destroy(); });
            }
    		console.log("en--onTriggerExit");
    	}
    	onEnable() {
    	} 
    	onDisable() {
    	}
    }
    class Bt extends Laya.Script3D { 
    	constructor() {
    		super();
    		// this.box = this.parent;
    		this.life = 60;
    		this.isAttacked = true;
    		this.time = 0;
    		this.speed = new Laya.Vector3();
    	}
    	onAwake() {
    		this.box = this.owner;
    		
    		// this.onFind()
    		Laya.timer.loop(30,this,this.onUpdate);
    	}
    	onFind(){
    		if(utl.box){
    			let bV3 = new Laya.Vector3();
    			let ship = utl.box.getChildByName('shipmain');
                let shipcar = ship.getChildByName('ship');
                let tag = shipcar.getChildByName('tag');
            	Laya.Vector3.subtract( tag.transform.position,this.box.transform.position, bV3);
    			Laya.Vector3.normalize(bV3,this.speed);
    			// let scale =  utl.speedMove/10 + 1
    			Laya.Vector3.scale(this.speed, .3, this.speed);
    		}

    	}
    	onUpdate(){
    		this.time++; 
    		// let vx = utl.box.transform.position.x - this.box.transform.position.x 
    		// let vy = utl.box.transform.position.y - this.box.transform.position.y 
    		// let vz = utl.box.transform.position.z - this.box.transform.position.z
    		// let ry = utl.getAngle(vx,vz)
    		// console.log(ry)
    		// this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
    		// this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
    		// this.tempy = ry



    		 // this.box.transform.translate(this.speed,false)




    		 if(this.time==500){
    		 	this.isAttacked = false;
    		 	this.box.destroy();
    		 }
    		 if(this.isAttacked)
    	        {
    	            //根据击退方向和速度移动
    	            // this.box.transform.translate(this.speed,true)
    	            this.box.transform.translate(new Laya.Vector3(0,.5,0),true);
    	            // console.log("击退位置变化：",(this.cube.transform.position.clone()).elements);
    	            //击退速度逐步减小
    	            // Laya.Vector3.scale(this.repelledV3,0.3,this.repelledV3);
    	            // //当后退各方向速度小于0.01时，击退状态停止
    	            // if(Laya.Vector3.scalarLength(this.repelledV3)<0.01)
    	            // {
    	            //     this.isAttacked=false;
    	            // }
    	        }
    	}
    }

    let address = 'http://172.16.25.101:3000';
    let HttpRequest = Laya.HttpRequest;
    let Event = Laya.Event;
    let result = {};
    let temfe = {
    	x: 1
    };
    let websocket = null;
    const login = () => {
    	let obj = {};
    	let hr = new HttpRequest();
    	let id = utl.userId;
    	// let id = 435
    	function onHttpRequestProgress(e) {
    		console.log(e);
    	}

    	function onHttpRequestComplete(e) {
    		result.userInfo = JSON.parse(hr.data).data;
    		console.log(66666, result);
    		intoRoom();
    	}

    	function onHttpRequestError(e) {
    		console.log(e);
    	}

    	hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    	hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    	hr.once(Event.ERROR, undefined, onHttpRequestError);
    	hr.send(address + '/login', 'name=fef&id=' + id, 'post', 'text');

    };
    const getServiceAddress = () => {
    	let hr = new HttpRequest();

    	function onHttpRequestProgress(e) {
    		console.log(123);
    	}

    	function onHttpRequestComplete(e) {
    		result.serviceAddress = JSON.parse(hr.data).data;
    		login();
    		console.log(3458888, result);
    	}

    	function onHttpRequestError(e) {
    		console.log(534543, e);
    	}
    	hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    	hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    	hr.once(Event.ERROR, undefined, onHttpRequestError);
    	hr.send(address + '/get-socketAddress', '', 'get', 'text');

    };
    const intoRoom = () => {
    	let headers = [
    		"Content-Type", "application/x-www-form-urlencoded",
    		'token', result.userInfo.token,
    		'user_id', result.userInfo.id
    	];
    	let hr = new HttpRequest();

    	function onHttpRequestProgress(e) {
    		console.log(123);
    	}

    	function onHttpRequestComplete(e) {
    		socketMain();
    		console.log(888888888, hr);
    	}

    	function onHttpRequestError(e) {
    		console.log(534543, e);
    	}
    	hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    	hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    	hr.once(Event.ERROR, undefined, onHttpRequestError);
    	hr.send(address + '/into-room?roomNo=123', null, 'get', 'text', headers);

    };

    function send() {
    	// if(utl.messgeTime+1==utl.sendTime){
    	let str = JSON.stringify(utl.sendMessage);
    	websocket.send(str);
    	// }
    	// console.log(66666,utl)

    }

    function sendWe() {
    	if (utl.messgeTime + 1 == utl.sendTime) {
    		let str = JSON.stringify(utl.sendMessage);
    		wx.sendSocketMessage({
    			data: str
    		});
    	}
    }

    function df() {
    	let player = playerMap.get(utl.id);
    	player.twList.shift();
    	player.flag = true;
    	// tweens.shift()
    	// twnFlag = true
    	main();
    	// setTimeout(()=>{
    	// 	console.log(2222222)
    	// },2000)
    	console.log(33333333);
    	// utl.cube.transform.position = new Laya.Vector3(temp.tar.x,0,temp.tar.z)

    }
    // let tweens = []
    let playerMap = new Map();

    function main() {
    	if (utl.fireOnOff) {
    		return
    	}
    	for (var [key, value] of playerMap.entries()) {
    		// if(!value.timeFlag){
    		// 	continue
    		// }
    		if (value.flag && value.twList.length > 0) {
    			value.flag = false;
    			drawPlayer(value);
    		}
    	}
    }

    function drawPlayer(value) {
    	if (value.twList.length == 0) {
    		return
    	}


    	let obj = value.twList[0];
    	let tweenObj = {
    		val: obj,
    		value,
    		x: 0,
    	};

    	let {
    		id,
    		type,
    		position,
    		shipEuler,
    		speed,
    		roteBody,
    		rotationEuler
    	} = obj;
    	let box = utl.boxs.get(id);

    	if (!box) {
    		box = utl.models.get('pler').clone();
    		utl.newScene.addChild(box);
    		let ship = box.getChildByName('shipmain');
    		let camera = ship.getChildByName('c1');
    		if (id == utl.id) {
    			// utl.realBox = box
    			// utl.bullet = box.getChildByName('shipmain').getChildByName('ship').getChildByName('ac')
    			// camera.clearColor = new Laya.Vector4(0, 0, 0, 1);
    			camera.active = true;
    		} else {
    			box.getChildByName('camermain').active = false;
    			camera.active = false;
    		}

    		utl.boxs.set(id, box);


    		//创建新人物
    	}
    	let player = playerMap.get(id);
    	let ship = box.getChildByName('shipmain');

    	let shipcard = ship.getChildByName('ship');

    	box.transform.position = new Laya.Vector3(position.x, position.y, position.z);
    	box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x, rotationEuler.y, rotationEuler.z);


    	shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x, shipEuler.y, shipEuler.z);

    	if (type == 'FIRE') {
    		let bullet = utl.models.get('bullet').clone();
    		let sc = bullet.addComponent(Bullet);
    		sc.startSpeed = speed;
    		utl.newScene.addChild(bullet);

    		let shipcar = bullet.getChildByName('Cube');

    		bullet.transform.position = new Laya.Vector3(position.x, position.y, position.z);
    		bullet.transform.rotationEuler = new Laya.Vector3(rotationEuler.x, rotationEuler.y, rotationEuler.z);
    		shipcar.transform.rotationEuler = new Laya.Vector3(shipEuler.x, shipEuler.y, shipEuler.z);

    	}

    	// box.transform.rotate(new Laya.Vector3(0,0,roteBody.sy* Math.PI / 180,),true);
    	//    box.transform.rotate(new Laya.Vector3(0,roteBody.sx* Math.PI / 180,0),true);

    	//    if(player.lastObj){
    	//    	shipcard.transform.rotate(new Laya.Vector3(0, player.lastObj.x* Math.PI / 180,0),true);
    	//    	shipcard.transform.rotate(new Laya.Vector3(player.lastObj.y* Math.PI / 180,0,0),true);
    	//    }


    	//    shipcard.transform.rotate(new Laya.Vector3(-roteBody.y* Math.PI / 180,0,0),true);
    	//    shipcard.transform.rotate(new Laya.Vector3(0,-roteBody.x* Math.PI / 180,0),true);
    	//    player.lastObj = roteBody
    	// box.transform.position = new Laya.Vector3(position.x,position.y,position.z)
    	// box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x,rotationEuler.y,rotationEuler.z)
    	// let ship = box.getChildByName('shipmain')

    	//    let shipcard = ship.getChildByName('ship')
    	//    shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x,shipEuler.y,shipEuler.z)

    	Laya.Tween.to(
    		tweenObj, {
    			x: 10,
    			update: new Laya.Handler(this, updateMove, [tweenObj])
    		},
    		20,
    		Laya.Ease.linearNone,
    		Laya.Handler.create(this, tweend, [tweenObj]),
    		0);
    }

    function updateMove(value) {
    	let obj = value.val;
    	if (obj.speed > 0) {

    		let box = utl.boxs.get(obj.id);
    		box.transform.translate(new Laya.Vector3(0, -obj.speed / 10, 0), true);
    	}

    }

    function tweend(obj) {
    	let {
    		id,
    		position,
    		shipEuler,
    		roteBody,
    		rotationEuler
    	} = obj.val;
    	let player = playerMap.get(id);

    	// let box = utl.boxs.get(id)
    	// box.transform.position = new Laya.Vector3(position.x,position.y,position.z)
    	// box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x,rotationEuler.y,rotationEuler.z)
    	// let ship = box.getChildByName('shipmain')

    	//    let shipcard = ship.getChildByName('ship')
    	//    shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x,shipEuler.y,shipEuler.z)

    	player.twList.shift();
    	if (player.twList.length != 0) {
    		drawPlayer(player);
    	}

    	// tweens.shift()
    	// twnFlag = true
    	// main()
    }

    function changeMove(obj) {

    	utl.cube.transform.position = new Laya.Vector3(obj.tar.x, 0, obj.tar.z);
    	// temp = obj.rote
    }

    function addInitTween(obj) {
    	// obj.sendTime = obj.sendTime
    	let id = obj.id;
    	let tweens = [obj];
    	let flag = true;
    	let messgeTime = 0;
    	let mapObj = {
    		twList: tweens,
    		pObj: obj,
    		flag,
    		timeFlag: true,
    		messgeTime,
    		lastObj: null
    	};
    	playerMap.set(id, mapObj);
    	return mapObj
    }
    var temp = null;

    function fixMessge(list) {
    	if (list.length == 0) {
    		return
    	}
    	for (let player of list) {
    		// if(player.id==utl.id){
    		// 	continue;
    		// }
    		if (!playerMap.get(player.id)) {
    			let obj = addInitTween(player);
    			drawPlayer(obj);
    		} else {
    			let pm = playerMap.get(player.id);
    			if (pm.pObj.sendTime < player.sendTime) {
    				pm.pObj = player;
    				pm.pObj.sendTime = player.sendTime;
    				pm.twList.push(player);
    				if (pm.twList.length == 1) {
    					drawPlayer(pm);
    				}
    				// if(!pm.timeFlag){
    				// 	if(pm.twList.length>5){
    				// 		pm.timeFlag = true
    				// 	}
    				// }
    				// if(pm.twList.length==0){
    				// 	pm.timeFlag = false
    				// }
    			}
    		}


    	}

    }

    function onDo() {
    	if (utl.fireOnOff) {
    		let shipcar = utl.boxs.get('123');
    		shipcar.transform.translate(new Laya.Vector3(.1, 0, 0), true);
    		// if(utl.sendTime==utl.messgeTime){
    		// let ship = utl.box.getChildByName('shipmain')
    		// let shipcar = utl.box.getChildByName('shipmain').getChildByName('ship')
    		// let shipcar = utl.box
    		let sPosition = shipcar.transform.position;
    		let rotationEuler = shipcar.transform.rotationEuler;
    		utl.sendTime++;
    			utl.messgeTime = utl.sendTime;
    		utl.sendMessage = [{
    			id: utl.id,
    			position: sPosition,
    			sendTime: utl.sendTime,
    			type: 'move',
    			rotationEuler
    		}];

    	}
    }
    const socketMain = () => {
    	wx.connectSocket({
    	  url: 'ws://192.168.0.101:3000'
    	});
    	wx.onSocketOpen(function(res) {
    	 wx.onSocketMessage((e)=>{
    	 	console.log(e);
    	 });

    	});
    	return
    	// utl.socket = io('ws://192.168.11.37:3000');
    	// utl.socket = io('ws://192.168.0.101:3000');
    	// utl.socket.on('123456', (s) => {
    	// 	utl.mapSp.graphics.clear()
    	// 	utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
    	// 	for (let player of s.list) {
    	// 		for (let rot of player.rots) {

    	// 			if (utl.entityMap.has(rot.id)) {
    	// 				if (rot.start) {
    	// 					utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
    	// 					let x = ~~(rot.start.x / 500 * 400)
    	// 					let y = ~~(rot.start.y / 500 * 400)
    	// 					utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
    	// 				}
    	// 				else  {
    	// 					utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
    	// 					let x = ~~(rot.end.x / 500 * 400)
    	// 					let y = ~~(rot.end.y / 500 * 400)
    	// 					utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
    	// 				} 

    	// 			} else {
    	// 				let map2 = utl.models.get('cube').clone()
    	// 				map2.getChildByName('on').active = false
    	// 				utl.newScene.addChild(map2);
    	// 				utl.entityMap.set(rot.id, map2)
    	// 				if (rot.start) {
    	// 					utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
    	// 					let x = ~~(rot.start.x / 500 * 400)
    	// 					let y = ~~(rot.start.y / 500 * 400)
    	// 					utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
    	// 				}
    	// 				else{
    	// 					utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
    	// 					let x = ~~(rot.end.x / 500 * 400)
    	// 					let y = ~~(rot.end.y / 500 * 400)
    	// 					utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
    	// 				} 
    	// 			}
    	// 		}
    	// 	}
    		// let cube = s.list[0].rots[0]
    		// utl.entityMap.get(cube.id).transform.position.x = -cube.end.x
    		// utl.entityMap.get(cube.id).transform.position.z = cube.end.y
    		// if (cube.end) {
    		// 	utl.entityMap.get(cube.id).transform.position = new Laya.Vector3(-cube.end.x, 3, cube.end.y)
    		// } else {
    		// 	utl.entityMap.get(cube.id).transform.position = new Laya.Vector3(-cube.start.x, 3, cube.start.y)
    		// }

    	// });
    	utl.socket.on('event', function(data) {});
    	utl.socket.on('disconnect', function() {});
    	//------------------------------web-------------------
    };
    const creteBox = (sp, erd) => {
    	let box = utl.newScene.addChild(sp);
    	box.takeSpeed = erd.takeSpeed;
    	box.speed = {
    		z: 0,
    		x: 0,
    		y: 0
    	};
    	if (erd.rotation) {
    		box.transform.rotation = new Laya.Vector3(erd.rotation.x, erd.rotation.y, erd.rotation.z);
    	}
    	if (erd.position) {
    		box.transform.position = new Laya.Vector3(erd.position.x, erd.position.y, erd.position.z);
    	}

    	// utl.newScene.addChild(box)
    	utl.players.set(erd.id, box);
    };
    const setBox = (players) => {
    	let ps = new Map(players);
    	utl.netPlayers = ps;
    	let bs = utl.players;
    	if (utl.newScene) {
    		for (let k of ps.keys()) {
    			let now = bs.get(k);
    			let erd = ps.get(k);

    			if (now) {
    				now.takeSpeed = erd.takeSpeed;
    				return
    				if (erd.position && now.tempPosition) {
    					let erdx = {
    						x: ~~(erd.position.x * 100),
    						y: ~~(erd.position.y * 100),
    						z: ~~(erd.position.z * 100)
    					};
    					now.tempPositions.push(erdx);

    				}
    				if (erd.rotation && now.tempRotation) {
    					let erdx = {
    						x: ~~(erd.rotation.x * 100),
    						y: ~~(erd.rotation.y * 100),
    						z: ~~(erd.rotation.z * 100)
    					};
    					now.tempRotations.push(erdx);
    				}

    			} else {
    				if (erd.id == utl.userId) {
    					Laya.Sprite3D.load("res/t2/LayaScene_fff/Conventional/f.lh", Laya.Handler.create(null, (sp) => {
    						creteBox(sp, erd);
    					}));
    				} else {
    					let box4 = utl.box4.clone();
    					creteBox(box4, erd);
    				}

    			}
    		}
    	}

    };

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
      // import {getServiceAddress} from "../net/index"
      let temp$1 =0,spled = {x:0,y:0,z:0},dfew=0;
      let flagod = false;
      let fireFlag = false;
      let touchs = [
        ['newTouch',{flag:false,Tclass:newtach}],
        // ['newTor',{flag:false,Tclass:newTor}],
        // ['fire',{flag:false,Tclass:fire}],
        // ['rightTouch',{flag:false,Tclass:rightTouch}],
        // ['leftRote',{flag:false,Tclass:leftRote}],
        // ['rightRote',{flag:false,Tclass:rightRote}]
      ];

    let flag = true;  

    function updateMove$1(obj){
        utl.box.transform.translate(new Laya.Vector3(utl.speedMove/5,0,0),true);
    }
    function tweend$1(){

        let tweenObj= {
            x:0
        }; 
        Laya.Tween.to(
                    tweenObj,
                    {x:10,
                    update:new Laya.Handler(this,updateMove$1,[tweenObj])},
                    50,
                    Laya.Ease.linearNone,
                    Laya.Handler.create(this,tweend$1,[tweenObj]),
                0);
        // flag = true
    }

    class GameUI extends Laya.Scene {
        constructor() {
            super();
            this.isTwoTouch = false;
            this.twoFirst = true;
            this.fucntkTemp =0;
            this.temprx=0;
            this.tempry=0;
            this.temprz=0;
            this.spled = 0;
            this.spledy=0;
            this.loadScene("test/TestScene.scene");
            this.newScene = Laya.stage.addChild(new Laya.Scene3D());
            this.loadingElse = new Map(utl.loadingElse);


            utl.newScene = this.newScene;
            this.initTouch();
             // this.addMouseEvent();
            this.info = new Laya.Text();
            this.info.text = 'userId:'+utl.id;
            this.info.fontSize = 50;
            this.info.color = "#FFFFFF";
            this.info.size(Laya.stage.width, Laya.stage.height);
            this.info.pos(50,50);
            Laya.stage.addChild(this.info);  
            utl.info =  this.info;
            this.drawUi();
            temp$1 = this;

            // this.newScene.addChild(utl.models.get('light'));  
            var directionLight = this.newScene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));

            socketMain();
           

           
            Laya.timer.loop(5,this,this.onUpdate);
            

            // let map2 = utl.models.get('cube')
            // map2.getChildByName('on').active = false
            // console.log(map2)
            // this.newScene.addChild(map2);
            // utl.entityMap.set('cube',map2)
           
            let camera = utl.models.get('camera');
            // // camera.active=false
            // camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

            utl.camera = camera;
            this.newScene.addChild(camera);



            let  terrain= utl.models.get('plane');
            this.newScene.addChild(terrain);


            let box = utl.models.get('box');
            utl.box = box;
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
           console.log(6666666666);

        }
        drawUi(){
            this.sp = new Laya.Sprite();
            Laya.stage.addChild(this.sp);
            this.sp.graphics.drawRect(0, 0, 400, 400, "#00000066");
            utl.mapSp = this.sp;
            this.addMouseEvent();
            let adds = this.loadingElse.get('adds');
            let addsImg = new  Laya.Image(adds);
            addsImg.height = 150;
            addsImg.width =150;
            addsImg.pos(200, Laya.stage.height - 200);
            Laya.stage.addChild(addsImg);


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
                touch[1].event = new touch[1].Tclass();
            }
        }
        onFire(){
            if(utl.fireOnOff){
                utl.msType = 'FIRE';
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
                obj[1].flag = false;
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
                        obj[1].flag = true;
                        obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
                    }else{
                        obj[1].flag = false;
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
                        obj[1].flag = true;
                        obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
                    }
                    if(obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                        obj[1].flag = true;
                        obj[1].event.leftFormatMovePosition(touch2.position.x,touch2.position.y);
                    }
                    if(!obj[1].event.scaleSmall(touch.position.x,touch.position.y)&&!obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                        obj[1].flag = false;
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
             let ship = utl.box.getChildByName('camermain');
             let acObj = ship.getChildByName('ac');

            

             if(utl.roteGun.x!=utl.roteGunTemp.x){
                     if(Math.abs(utl.roteGun.x-utl.roteGunTemp.x)>.1){
                        utl.roteGunTemp.x = utl.roteGun.x>utl.roteGunTemp.x?utl.roteGunTemp.x+.1:utl.roteGunTemp.x-.1;
                    }else{
                        if(utl.roteGun.x==0){
                            utl.roteGunTemp.x = 0;
                        }
                        
                    }
                }
                if(utl.roteGun.y!=utl.roteGunTemp.y){
                    if(Math.abs(utl.roteGun.y-utl.roteGunTemp.y)>.1){
                        utl.roteGunTemp.y = utl.roteGun.y>utl.roteGunTemp.y?utl.roteGunTemp.y+.1:utl.roteGunTemp.y-.1;
                    }else{
                        if(utl.roteGun.y==0){
                            utl.roteGunTemp.y = 0;
                        }
                       
                    }
                }
                let x = utl.roteGunTemp.x;       
                let y = utl.roteGunTemp.y;

             


            acObj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
            acObj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
          
            acObj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
            acObj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

           

            utl.roteGunback.x = x;
            utl.roteGunback.y = y;
        }
        checkFire(){
             let bmain =utl.bullet.getChildByName('ship');
            let bcube = bmain.getChildByName('Cube');
            let from = bcube.getChildByName('e1').transform.position;
            let to = bcube.getChildByName('e2').transform.position;
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
             let p = utl.box.transform.position;
             let x = p.x;
             let z = p.z;
             let y = p.y;
             if(p.x>utl.bestGround){
                 x = utl.bestGround;
             }
             if(p.x<-utl.bestGround){
                 x = -utl.bestGround;
             }
             if(p.z>utl.bestGround){
                 z = utl.bestGround;
             }
             if(p.z<-utl.bestGround){
                 z = -utl.bestGround;
             }
             if(p.y>utl.bestGround){
                 y = utl.bestGround;
             }
             utl.box.transform.position = new Laya.Vector3(x,y,z);
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
             
                touchs[0][1].event.leftFormatMovePosition(null,0); 

            }
            if(touchCount==1){
                let point =  touch.position;
                touchs[0][1].event.drawSelect({x:point.x,y:point.y},touchCount); 

            }
            if(touchCount>1){
                 let point =  touch.position;
                touchs[0][1].event.leftFormatMovePosition(point,touchCount); 
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

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
    class InitUI extends Laya.Scene {
        constructor() {
            super();
            this.loadScene("test/init.scene");
            this.info = new Laya.Text();
            this.info.fontSize = 50;
            this.info.color = "#FFFFFF";
            this.info.size(Laya.stage.width, Laya.stage.height);
            this.info.x = Laya.stage.width/2;
            this.info.y = 380;
           Laya.stage.addChild(this.info);
        }

        
    }

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
    let ls = [
        {index:2,title:'start game'},
    ];
    class Level extends Laya.Scene {
        constructor() {
            super();
            this.loadScene("test/level.scene");
            
            this.isTouchFlag = false;
            this.touchPosition = {
                position:{
                    x:0
                }
            };
            this.touchDown = {};
            this.touchUp = {};
            this.boxLangth = 3;
            this.boxedLangth = 0;

            this.newScene = new Laya.Scene3D();
            Laya.stage.addChild(this.newScene);
            this.createText();
            // this.doLoad();
            //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
            this.camera = new Laya.Camera(0, 0.1, 1000);
            this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
            
            //相机设置清楚标记,使用固定颜色
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
            //使用默认的颜色
            //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
            //设置摄像机视野范围（角度）
            this.camera.fieldOfView = 45;
            //为相机添加视角控制组件(脚本)
            this.newScene.addChild(this.camera);
            
            // //添加平行光
            // let directionLight = new Laya.DirectionLight();
            // scene.addChild(directionLight);
            // //设置平行光颜色
            // directionLight.color = new Laya.Vector3(1, 1, 1);
            // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
            



            // let sprited = new Laya.Sprite3D();
            // scene.addChild(sprited);
            // //正方体
            // let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
            // sprited.addChild(box1);
            
            // box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
           




            // let sprite = new Laya.Sprite3D();
            // scene.addChild(sprite);
            // //正方体
            // let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31)
            // this.box = new Laya.MeshSprite3D(tem);
            // sprite.addChild(this.box);
            //  var material = new Laya.BlinnPhongMaterial();
            // // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
            // //         material.albedoTexture = tex;
            // // }));
            // material.albedoColor=new Laya.Vector3(.5,.5,2);
            // material.diffuseColor=new Laya.Vector3(.5,.5,2);
            // this.box.meshRenderer.material = material;

            // let scale = new Laya.Vector3(0, 1, 1);
            // this.box.transform.localScale = scale;
            // let scale1 = new Laya.Vector3(1, 1, 1);
            // this.box.transform.localScale = scale1;
            // this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
            this.createLevel();
            Laya.timer.loop(30,this,this.onUpdate);
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP,this, this.onMouseUp);
           
        }
        onMouseUp(){
            let point = {};
            let outHitResult = new Laya.HitResult(); 
            let _outHitAllInfo = new Array();
            point.x = Laya.MouseManager.instance.mouseX;
            point.y = Laya.MouseManager.instance.mouseY;
            if(
                Math.abs(point.x - this.touchDown.x)<5&&
                Math.abs(point.y - this.touchDown.y)<5){
                let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                //产生射线
                this.camera.viewportPointToRay(point,ray);
                //拿到射线碰撞的物体
                this.newScene.physicsSimulation.rayCast(ray,outHitResult);
                //如果碰撞到物体
                // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
                 if (outHitResult.succeeded){
                     let index = outHitResult.collider.owner.parent.name.charAt(0);
                     utl.playStatusObj = {
                        doingIndex:1
                     };
                     this.removeSelf();
                     Laya.stage.offAll();
                     Laya.Scene.open('test/load.scene');
                 }
                
            }
        }
        onMouseDown() {
            //记录点击到舞台上的点
            let point = {};
            let outHitResult = new Laya.HitResult(); 
            let _outHitAllInfo = new Array();
            point.x = Laya.MouseManager.instance.mouseX;
            point.y = Laya.MouseManager.instance.mouseY;
            this.touchDown = point;
            let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            //产生射线
            this.camera.viewportPointToRay(point,ray);
            //拿到射线碰撞的物体
            this.newScene.physicsSimulation.rayCast(ray,outHitResult);
            //如果碰撞到物体
            // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
            if (outHitResult.succeeded){
                console.log(outHitResult.collider.owner.parent.name);
            }
            
            // if (outHitResult.succeeded)
            // {
            //     //删除碰撞到的物体
            //     // this.text.text = "碰撞到了" + this.outHitResult.collider.owner.name ;
            //     console.log("碰撞到物体！！",this.outHitResult.collider.owner.name)
            // }
        }
        onUpdate() {
            let touchCount = this.newScene.input.touchCount();

            if(touchCount!=0){
                 let touchPosition  = this.newScene.input.getTouch(0);

                if(this.touchPosition){
                    this.isTouchFlag = true;
                    let movePositionx = this.touchPosition - touchPosition.position.x;
                    this.camera.transform.translate(new Laya.Vector3(movePositionx/80,0, 0));
                    this.updatatxt();
                    this.touchPosition = touchPosition.position.x;
                }else{
                    this.touchPosition = touchPosition.position.x;
                }
                // console.log(3333333,this.touchPosition.position.x - touchPosition.position.x)
                
            }else{
                this.touchPosition = null;
                this.isTouchFlag = false;
            }

         }  
         updatatxt(){
             for(let i in ls){
                 let box = this.newScene.getChildByName(i+'flckbox');
                 let info = Laya.stage.getChildByName(i+'flcktxt');
                 let outPos =  new Laya.Vector3();
                 this.camera.viewport.project(box.transform.position, this.camera.projectionViewMatrix, outPos);
                 info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
             }
              
         } 
        createLevel(){
            
            let initx = 0;
            let color = new Laya.Vector3(1,5,1);
            let textColor = '#1aff00';
            for(let i in ls){
                if(utl.playStatusObj.doingIndex==i){
                    color = new Laya.Vector3(5,5,5);
                    textColor = '#000000';
                }else if(i>utl.playStatusObj.doingIndex){
                    color = new Laya.Vector3(0,0,0);
                    textColor = '#ffffff';
                }else{
                    color = new Laya.Vector3(1,5,1);
                    textColor = '#FF1B16'; 
                }
                let sprite = new Laya.Sprite3D();
                this.newScene.addChild(sprite);
                //正方体
                let tem = Laya.PrimitiveMesh.createBox(1, 1, 1);
                let box = new Laya.MeshSprite3D(tem);
                sprite.name = i + 'flckbox';
                sprite.addChild(box);
                let material = new Laya.BlinnPhongMaterial();
                material.albedoColor=color;
                // material.albedoColorA=new Laya.Vector3(130,288,242);
                // material.albedoColorB=242
                // material.albedoColorG=288
                // material.albedoColorR=130


                // material.diffuseColorB=242
                // material.diffuseColorG=288
                // material.diffuseColorR=130


                material.diffuseColor=color;
                box.meshRenderer.material = material;
                sprite.transform.position = new Laya.Vector3(initx - 2*i, -1, 0);

                let rigidBody = box.addComponent(Laya.Rigidbody3D);
                let boxShape = new Laya.BoxColliderShape(1, 1, 1);
                rigidBody.colliderShape = boxShape;
                rigidBody.linearFactor=new Laya.Vector3(0, 0, 0);
                // rigidBody.mass = 0;







                let info = new Laya.Text();
                let outPos =  new Laya.Vector3();
                info.text = ls[i].title;
                info.fontSize = 40;
                info.name = i+ 'flcktxt';
                info.color = textColor;
                info.width = 50;
                info.font = "Microsoft YaHei";
                info.bold = true;
                info.size(Laya.stage.width, Laya.stage.height);
                Laya.stage.addChild(info);  
                this.camera.viewport.project(sprite.transform.position, this.camera.projectionViewMatrix, outPos);
                info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
            }

        }
        downLoadSprite3D(load){
            return new Promise((resolve, reject)=>{
                Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                    utl.models.set(load[0],sp);
                    ++utl.loadIndex;
                    this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                    this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                    let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                    this.box.transform.localScale = scale;
                    this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                    if(this.boxedLangth==1){
                        this.removeSelf();
                        Laya.Scene.open('test/main.scene');
                    }
                    resolve();
                }));
            })
        }
        downLoad(load){
            return new Promise((resolve, reject)=>{
                Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                    utl.models.set(load[0],texture);
                    ++utl.loadIndex;
                    this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                    this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                    let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                    this.box.transform.localScale = scale;
                    this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                    if(this.boxedLangth==1){
                        this.removeSelf();
                        Laya.Scene.open('test/main.scene');
                    }
                    resolve();
                }));
            })
        }
        doLoad(){
            utl.loadIndex = 0;
            for(let obj of utl.loadingSprite3D){
                this.downLoadSprite3D(obj);
            }
            for(let objElse of utl.loadingElse){
                this.downLoad(objElse);
            }
        }
        createText() {
            const 
                Text = Laya.Text;
            
            this.txt = new Text();
            Laya.stage.addChild(this.txt);
            //给文本的text属性赋值
            this.txt.text = '左右滑动屏幕选择进入关卡';
            //设置宽度，高度自动匹配
            this.txt.width = 500;
            //自动换行
            this.txt.wordWrap = true;

            this.txt.align = "center";
            this.txt.fontSize = 40;
            this.txt.font = "Microsoft YaHei";
            this.txt.color = "#1aff00";
            this.txt.bold = true;
            this.txt.leading = 5;

            // //设置描边属性
            // txt.stroke = 10;
            // txt.strokeColor = "#00ffc6";

            // txt.borderColor = "#00ffc6";

            this.txt.x = (Laya.stage.width - this.txt.width) / 2;
            this.txt.y = Laya.stage.height -100;
        }
        
    }

    const loadFile =  [
    	[
    		['light','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/Light.lh'],
            ['cube','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/Cube.lh'],
            ['camera','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/Camera.lh'],
            // ['terrain','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/Terrain.lh'],
            ['plane','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/Plane.lh'],
            ['box','https://xuxin.love/img/redcode/LayaScene_SampleScene/Conventional/box.lh'],
    	],
    ];

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
      
      let fileLangth = 0;

    class InitUI$1 extends Laya.Scene {
        constructor() {
            super();
            this.loadScene("test/load.scene");
            

            this.boxLangth = 3;
            this.boxedLangth = 0;

            let scene = new Laya.Scene3D();
            Laya.stage.addChild(scene);
            this.createText();
            this.doLoad();
            //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
            
            //相机设置清楚标记,使用固定颜色
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
            //使用默认的颜色
            //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
            //设置摄像机视野范围（角度）
            this.camera.fieldOfView = 45;
            //为相机添加视角控制组件(脚本)
            scene.addChild(this.camera);
            
            // //添加平行光
            // let directionLight = new Laya.DirectionLight();
            // scene.addChild(directionLight);
            // //设置平行光颜色
            // directionLight.color = new Laya.Vector3(1, 1, 1);
            // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
            



            let sprited = new Laya.Sprite3D();
            scene.addChild(sprited);
            //正方体
            let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
            sprited.addChild(box1);
            
            box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
           




            let sprite = new Laya.Sprite3D();
            scene.addChild(sprite);
            //正方体
            let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31);
            this.box = new Laya.MeshSprite3D(tem);
            sprite.addChild(this.box);
            //  var material = new Laya.BlinnPhongMaterial();
            // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
            //         material.albedoTexture = tex;
            // }));
            // this.box.meshRenderer.material = material;

            let scale = new Laya.Vector3(0, 1, 1);
            this.box.transform.localScale = scale;
            let scale1 = new Laya.Vector3(1, 1, 1);
            this.box.transform.localScale = scale1;
            this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
           
        }
        downLoadSprite3D(load){
            return new Promise((resolve, reject)=>{
                Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                    console.log(load[0]);
                    let index = utl.playStatusObj.doingIndex;
                    utl.models.set(load[0],sp);
                    ++utl.loadIndex;
                    this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length);
                    this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                    let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                    this.box.transform.localScale = scale;
                    let material = new Laya.BlinnPhongMaterial();
                    material.albedoColor=new Laya.Vector3(1,5,1);
                    material.diffuseColor=new Laya.Vector3(1,5,1);
                    this.box.meshRenderer.material = material;
                    this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                    if(this.boxedLangth==1){
                        this.removeSelf();
                        // Laya.stage.addChild(GameUI);
                        Laya.Scene.open(`test/game${index}.scene`);
                    }
                    resolve();
                }));
            })
        }
        downLoad(load){
            return new Promise((resolve, reject)=>{
                Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                    let index = utl.playStatusObj.doingIndex;
                    utl.models.set(load[0],texture);
                    ++utl.loadIndex;
                    this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length);
                    this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                    let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                    this.box.transform.localScale = scale;
                    let material = new Laya.BlinnPhongMaterial();
                    material.albedoColor=new Laya.Vector3(1,5,1);
                    material.diffuseColor=new Laya.Vector3(1,5,1);
                    this.box.meshRenderer.material = material;
                    this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                    if(this.boxedLangth==1){
                        this.removeSelf();
                        // Laya.stage.addChild(GameUI);
                        // Laya.Scene.open('test/main.scene')
                        Laya.Scene.open(`test/game${index}.scene`);
                    }
                    resolve();
                }));
            })
        }
        doLoad(){
            utl.loadIndex = 0;
            let index = utl.playStatusObj.doingIndex;
            let load3D = loadFile[index-1];
            console.log(load3D,utl.loadingSprite3D);
            fileLangth = load3D.length;

            for(let obj of load3D){
                this.downLoadSprite3D(obj);
            }
            for(let objElse of utl.loadingElse){
                this.downLoad(objElse);
            }
        }
        createText() {
            const 
                Text = Laya.Text;
            
            this.txt = new Text();
            Laya.stage.addChild(this.txt);
            //给文本的text属性赋值
            this.txt.text = "正在加载0";
            //设置宽度，高度自动匹配
            this.txt.width = 400;
            //自动换行
            this.txt.wordWrap = true;

            this.txt.align = "center";
            this.txt.fontSize = 40;
            this.txt.font = "Microsoft YaHei";
            this.txt.color = "#1aff00";
            this.txt.bold = true;
            this.txt.leading = 5;

            // //设置描边属性
            // txt.stroke = 10;
            // txt.strokeColor = "#00ffc6";

            // txt.borderColor = "#00ffc6";

            this.txt.x = (Laya.stage.width - this.txt.width) / 2;
            this.txt.y = (Laya.stage.height - this.txt.textHeight) / 2 + 100;
        }
        
    }

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
      let temp$2 =0,spled$1 = {x:0,y:0,z:0},dfew$1=0;
      let flagod$1 = false;
      let fireFlag$1 = false;
      let touchs$1 = [
        ['newTouch',{flag:false,Tclass:newtach}],
        ['newTor',{flag:false,Tclass:newTwo}],
        ['fire',{flag:false,Tclass:fire}],
        ['rightTouch',{flag:false,Tclass:newTwo$1}],
        ['leftRote',{flag:false,Tclass:leftRote}],
        ['rightRote',{flag:false,Tclass:rightRote}]
      ];

    class GameUI$1 extends Laya.Scene {
        constructor() {
            super();
            this.isTwoTouch = false;
            this.twoFirst = true;
            this.fucntkTemp =0;
            this.temprx=0;
            this.tempry=0;
            this.temprz=0;
            this.shipRx = 0;
            this.shipRy = 0;
            this.spled = 0;
            this.spledy=0;
            this.loadScene("test/TestScene.scene");
            this.newScene = Laya.stage.addChild(new Laya.Scene3D());
            this.loadingElse = new Map(utl.loadingElse);


            utl.newScene = this.newScene;
            this.initTouch();
            this.info = new Laya.Text();
            this.info.text = '555777777775';
            this.info.fontSize = 50;
            this.info.color = "#FFFFFF";
            this.info.size(Laya.stage.width, Laya.stage.height);
            this.info.pos(0,100);
            Laya.stage.addChild(this.info);  
            utl.info =  this.info;
            this.drawUi();
            Laya.Gyroscope.instance.on(Laya.Event.CHANGE, this, onDeviceorientation);
            function onDeviceorientation(absolute, rotationInfo) {
                // this.info.text =
                //     "alpha:" + Math.floor(rotationInfo.alpha) + '\n' +
                //     "beta :" + Math.floor(rotationInfo.beta) + '\n' +
                //     "gamma:" + Math.floor(rotationInfo.gamma);
                if(utl.operationYype==2){
                    utl.takeSpeed.x =  Math.floor(rotationInfo.gamma);
                    utl.takeSpeed.y =  Math.floor(rotationInfo.beta);
                }
            }
            temp$2 = this;
            this.newScene.addChild(utl.models.get('light'));  
           


            Laya.timer.loop(30,this,this.onUpdate);

           

            var sfe = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
            var material = new Laya.BlinnPhongMaterial();
            sfe.transform.position = new Laya.Vector3(1,20, 3);
            Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                    material.albedoTexture = tex;
            }));
            sfe.meshRenderer.material = material;

            let fuckdd = utl.models.get('fuckdd');
            this.newScene.addChild(fuckdd);


            let maton = utl.models.get('maton');
            this.newScene.addChild(maton);

            utl.box = utl.models.get('pler');
            this.newScene.addChild(utl.box);

            utl.bullet = utl.models.get('bullet');
            this.newScene.addChild(utl.bullet);
            
            let ship = utl.box.getChildByName('shipmain');
            let shipcar = ship.getChildByName('ship');
            utl.c1 = shipcar.getChildByName('c1');
            utl.c2 = shipcar.getChildByName('c2');
           
            // Laya.timer.loop(1,this,this.onFire);
            let camera = ship.getChildByName('c1');
            camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

            utl.camera = camera;



            let nimabi = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 11,42)));
            var materialr = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                    materialr.albedoTexture = tex;
            }));
            nimabi.meshRenderer.material = materialr;
            nimabi.transform.position = new Laya.Vector3(1,20, 6);
            nimabi.addComponent(Bullet);




            
           
            this.createBall();


            let  sum= utl.models.get('sun');
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


            // let fudf = utl.models.get('cotrll')
            // let ape2 = new Laya.Sprite();
            // Laya.stage.addChild(ape2);
            // ape2.graphics.drawTexture(fudf, 100, 100);
            // // ape2.width = 400
            // // ape2.height = 400
            // // ape2.x = 0;
            // // ape2.y = Laya.stage.height - 500;
            // ape2.pos(0,Laya.stage.height - 500)
            let leftHandself = this.loadingElse.get('cotrll');
            let leftHandselfImg = new  Laya.Image(leftHandself);
            leftHandselfImg.height = 200;
            leftHandselfImg.width =200;
            leftHandselfImg.pos(Laya.stage.width  -700, Laya.stage.height - 200);
            Laya.stage.addChild(leftHandselfImg);


            let rightHandself = this.loadingElse.get('cotrll');
            let rightHandselfImg = new  Laya.Image(rightHandself);
            rightHandselfImg.height = 200;
            rightHandselfImg.width =200;
            rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
            Laya.stage.addChild(rightHandselfImg);




            let leftHand = this.loadingElse.get('cotrll');
            let leftHandImg = new  Laya.Image(leftHand);
            leftHandImg.height = 450;
            leftHandImg.width =450;
            leftHandImg.pos(300, Laya.stage.height - 600);
            Laya.stage.addChild(leftHandImg);


            let rightHand = this.loadingElse.get('cotrll');
            let rightHandImg = new  Laya.Image(rightHand);
            rightHandImg.height = 300;
            rightHandImg.width =300;
            rightHandImg.pos(Laya.stage.width - 600, Laya.stage.height - 500);
            Laya.stage.addChild(rightHandImg);


            let col = this.loadingElse.get('fire');
            let dialog = new  Laya.Image(col);
            dialog.height = 600;
            dialog.width =100;
            dialog.pos(Laya.stage.width - 100, Laya.stage.height - 650);
            Laya.stage.addChild(dialog);
            // let ape3 = new Laya.Sprite();
            // Laya.stage.addChild(ape3);
            // ape3.graphics.drawTexture(col, 100, 100);
            // ape3.width = 100
            // ape3.height = 100
            // ape3.x = Laya.stage.width/2+200;
            // ape3.y = Laya.stage.height - 500;
            
        }
        initTouch(){
            for(let touch of touchs$1){
                touch[1].event = new touch[1].Tclass();
            }
        }
        onFire(){
            if(utl.fireOnOff){
                // let ship = utl.box.getChildByName('shipmain')
                // let shipcar = ship.getChildByName('ship')
                let aum =utl.bullet.clone();
                
                // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
                let script = aum.addComponent(Bullet);
                this.newScene.addChild(aum);
            }
            
        }
        createBall(){
            let cube = utl.models.get('cube').clone();
                            // cube.active=true  
                            // let scale = new Laya.Vector3(3, 3, 3);
                            // cube.transform.localScale = scale;
                           
                            cube.addComponent(Enemy);
                            console.log('--------------------',cube);
                            this.newScene.addChild(cube);
                             // cube.transform.position =new Laya.Vector3(0,0,0)
            let ems = utl.models.get('ems');                  
            this.newScene.addChild(cube);
            for(let i =1;i<5;i++){
                let cubeq = utl.models.get('cube').clone();
                cubeq.addComponent(Enemy);
                console.log(ems.getChildByName(i+''));
                let pos = ems.getChildByName(i+'').transform;
                this.newScene.addChild(cubeq);
                cubeq.transform.position = new Laya.Vector3(pos.position.x,pos.position.y,pos.position.z);

              
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
            flagod$1=false;
            fireFlag$1 = false;
            for(let obj of touchs$1){
                obj[1].flag = false;
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
                for(let obj of touchs$1){
                    if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                        obj[1].flag = true;
                        obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
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
                    for(let obj of touchs$1){
                        if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                            obj[1].flag = true;
                            obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
                        }
                        if(obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                            obj[1].flag = true;
                            obj[1].event.leftFormatMovePosition(touch2.position.x,touch2.position.y);
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
            let touchsMap = new Map(touchs$1);
            if(!touchsMap.get('newTor').flag){
                utl.takeSpeed.x = 0;
                utl.takeSpeed.y = 0;
            }
            if(!touchsMap.get('rightTouch').flag){
                utl.roteGun.x = 0;
                utl.roteGun.y = 0;
            }
            // if(!fireFlag){
                utl.fireOnOff = touchsMap.get('rightTouch').flag;
                utl.roteLeftFlag = touchsMap.get('leftRote').flag;
                utl.roteRightFlag = touchsMap.get('rightRote').flag;
            // }
            // this.info.text = flagod+','+touchCount

        }
        gunMove(){
            let shipcar = utl.bullet.getChildByName('ship');
            let obj = shipcar.getChildByName('Cube');

             let ship = utl.box.getChildByName('camermain');
             let acObj = ship.getChildByName('ac');

            

             if(utl.roteGun.x!=utl.roteGunTemp.x){
                     if(Math.abs(utl.roteGun.x-utl.roteGunTemp.x)>.1){
                        utl.roteGunTemp.x = utl.roteGun.x>utl.roteGunTemp.x?utl.roteGunTemp.x+.1:utl.roteGunTemp.x-.1;
                    }else{
                        if(utl.roteGun.x==0){
                            utl.roteGunTemp.x = 0;
                        }
                        
                    }
                }
                if(utl.roteGun.y!=utl.roteGunTemp.y){
                    if(Math.abs(utl.roteGun.y-utl.roteGunTemp.y)>.1){
                        utl.roteGunTemp.y = utl.roteGun.y>utl.roteGunTemp.y?utl.roteGunTemp.y+.1:utl.roteGunTemp.y-.1;
                    }else{
                        if(utl.roteGun.y==0){
                            utl.roteGunTemp.y = 0;
                        }
                       
                    }
                }
                let x = utl.roteGunTemp.x;       
                let y = utl.roteGunTemp.y;

             


            acObj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
            acObj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
          
            acObj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
            acObj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

            obj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
            obj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
          
            obj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
            obj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

            utl.roteGunback.x = x;
            utl.roteGunback.y = y;
        }
        checkFire(){
             let bmain =utl.bullet.getChildByName('ship');
            let bcube = bmain.getChildByName('Cube');
            let from = bcube.getChildByName('e1').transform.position;
            let to = bcube.getChildByName('e2').transform.position;
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
            
            this.flying(touchCount);
            // return
            for(let obj of utl.firs){
                obj.toTiome();
            }
            if(utl.box){
               
                let ship = utl.box.getChildByName('shipmain');
                let camera = ship.getChildByName('Main Camera');
                let shipcar = ship.getChildByName('ship');

                // shipc.getChildByName('Cube')
                let shipc = utl.bullet.getChildByName('ship');

                let bcube = shipc; 
                if(utl.takeSpeed.x!=utl.speed.x){
                     if(Math.abs(utl.takeSpeed.x-utl.speed.x)>1){
                        utl.speed.x = utl.takeSpeed.x>utl.speed.x?utl.speed.x+.4:utl.speed.x-.4;
                    }else{
                        if(utl.takeSpeed.x==0){
                            utl.speed.x = 0;
                        }
                        
                    }
                }
                if(utl.takeSpeed.y!=utl.speed.y){
                    if(Math.abs(utl.takeSpeed.y-utl.speed.y)>1){
                        utl.speed.y = utl.takeSpeed.y>utl.speed.y?utl.speed.y+1:utl.speed.y-1;
                    }else{
                        if(utl.takeSpeed.y==0){
                            utl.speed.y = 0;
                        }
                       
                    }
                }
                let x = utl.speed.x;       
                let y = utl.speed.y;
               
                    // let x = Math.floor(utl.speed.x)        
                    // let y = Math.floor(utl.speed.y)

                    // let z = utl.speed.z*90/100
               
                // console.log(utl.box.transform.rotation.x)
                    
                let tz = Math.cos(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove;
                let tx = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.y)*utl.speedMove;
                let ty = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove;

                // this.info.text = x+','+y
               
               
                // ship.transform.rotate(new Laya.Vector3(this.temprx* Math.PI / 180,0,0),true);
                let ry = (y - this.tempry);
                let rx = (x - this.temprx);
                let sy = y/30;
                let sx = -x/30;

                
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

                utl.box.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true);
                utl.bullet.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true);
                
                let max = 100;

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


                
                this.shipRy = 0;


                // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)
                // utl.box.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),false);
                // utl.box.transform.rotate(new Laya.Vector3(y* Math.PI / 180,0,0),true);
                
                // camera.transform.translate(new Laya.Vector3(0,-ty,tz))
                this.temprx = x;
                this.tempry = y;
                // if(this.temprx>70){
                //     ship.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
                //     this.temprx -= x
                // }
                 // this.onFire()
                 this.gunMove();
                 this.onFire();
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
                this.creabox(f);
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
        temp$2.creab();
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/level.js",Level);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode ="full";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/level.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
