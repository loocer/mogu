 import utl from "../utl.js"
 import Bullet from "./bullet.js"
 let getAngle = (x, y)=> {
    var l = Math.sqrt(x*x + y*y);
    var a = Math.acos(x/l);
    var ret = a * 180 / Math.PI; //弧度转角度，方便调试
    if (y < 0) {
        return 360 - ret;
    }
    return ret;
}
let getRote = (pao,fly)=>{
	let paog = getAngle(pao.x,pao.y)
	let flyg = getAngle(fly.x,fly.y)
	return flyg - paog
}
export default class Enemy extends Laya.Script3D { 
	constructor() {
		super();
		this.isAttacked = true;
		this.tempy = 0
		this.box = null;
		this.life = 60;
		this.tempAng1 = 0
		this.tempAng2 = 0
		this.temp2Ang1 = 0
		this.temp2Ang2 = 0
		this.ang1 = 0
		this.ang2 = 0
		this.time = 0
		this.outPos = new Laya.Vector3();
		this.speed = new Laya.Vector3();
		this.loadingElse = new Map(utl.loadingElse)
		  let bleed = this.loadingElse.get('cotrll')
        this.bleedimg = new  Laya.Image(bleed);
            this.bleedimg.height = 10
            this.bleedimg.width =200
            Laya.stage.addChild(this.bleedimg);
		Laya.timer.loop(30,this,this.onUpdate);
		
	}
	onAwake() {
		this.box = this.owner;
		// Laya.timer.loop(800,this,this.onFire);
		
	}
	onFire(){
		let p1  = this.box.transform.position
		let p2  = utl.box.getChildByName('shipmain').transform.position
		let tempP1P2 = new Laya.Vector3();
		 Laya.Vector3.subtract(p1, p2, tempP1P2);
		let length =  Laya.Vector3.scalarLength(tempP1P2)
		if(length<10){
			let aum = utl.models.get('aum').clone() 
			this.box.getChildByName('c').getChildByName('c').addChild(aum)
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
			let pao1 = {x:this.box.transform.position.x,y:this.box.transform.position.y}
			let fly1 = {x:utl.box.transform.position.x,y:utl.box.transform.position.y}
			this.ang1 = getRote(pao1,fly1)
			let pao2 = {x:this.box.transform.position.x,y:this.box.transform.position.y}
			let fly2 = {x:utl.box.transform.position.x,y:utl.box.transform.position.y}
			this.ang2 = getRote(pao2,fly2)

			// let bV3 = new Laya.Vector3();
   //      	Laya.Vector3.subtract( utl.box.transform.position,this.box.transform.position, bV3);
			// Laya.Vector3.normalize(bV3,this.speed);
			// // let scale =  utl.speedMove/10 + 1
			// Laya.Vector3.scale(this.speed, .1, this.speed);
		}

	}
	onUpdate(){
		this.time++ 
		let position1 = utl.box.getChildByName('shipmain').transform.position
		let position2 = this.box.transform.position
		let x = position1.x - position2.x
		let z = position1.z - position2.z

		this.tempAng1 = -utl.getAngle(x,z)
		this.box.transform.rotate(new Laya.Vector3(0, -this.tempAng2* Math.PI / 180,0),true)
		this.box.transform.rotate(new Laya.Vector3(0, this.tempAng1* Math.PI / 180,0),true)

		

		this.tempAng2 = this.tempAng1
		let bV3 = new Laya.Vector3();
		Laya.Vector3.subtract( position1,position2, bV3);
		// let l = Laya.Vector3.scalarLength(bV3)
		let y = Math.abs(position1.y - position2.y)
		let l = Math.sqrt(x*x + z*z);
        this.temp2Ang1 = (Math.asin(y/l)* 180 / Math.PI)
        // this.temp2Ang1 = 30
		this.box.getChildByName('c').transform.rotate(new Laya.Vector3(0,0, -this.temp2Ang2* Math.PI / 180),true)
		this.box.getChildByName('c').transform.rotate(new Laya.Vector3(0,0, this.temp2Ang1* Math.PI / 180),true)
		this.temp2Ang2 = this.temp2Ang1
		position2.y = position2.y
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
		 	this.onFire()
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
            Laya.timer.frameOnce(1, this, function () { this.owner.destroy() });
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
		this.isAttacked = true
		this.time = 0
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
			let ship = utl.box.getChildByName('shipmain')
            let shipcar = ship.getChildByName('ship')
            let tag = shipcar.getChildByName('tag')
        	Laya.Vector3.subtract( tag.transform.position,this.box.transform.position, bV3);
			Laya.Vector3.normalize(bV3,this.speed);
			// let scale =  utl.speedMove/10 + 1
			Laya.Vector3.scale(this.speed, .3, this.speed);
		}

	}
	onUpdate(){
		this.time++ 
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
		 	this.isAttacked = false
		 	this.box.destroy();
		 }
		 if(this.isAttacked)
	        {
	            //根据击退方向和速度移动
	            // this.box.transform.translate(this.speed,true)
	            this.box.transform.translate(new Laya.Vector3(0,.5,0),true)
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