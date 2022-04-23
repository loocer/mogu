 import utl from "../utl.js"
export default class Bullet extends Laya.Script3D { 
	constructor() {
		super();
		this.tempy = 0
		this.box = null;
		this.time = 0
		this.speed = new Laya.Vector3();
		
	}
	onAwake() {
		
		//得到3D对象
		this.box = this.owner;
		utl.firs.push(this)
		// this.findIt()
	}
	findIt(){
		let bV3 = new Laya.Vector3();
        	Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
			let speed = new Laya.Vector3();
			Laya.Vector3.normalize(bV3,speed);
			// Laya.Vector3.scale(speed, .1, this.speed);

			let speedLanth = Laya.Vector3.scalarLength(this.speed) 
			// // let temp = new Laya.Vector3(0,0,utl.speedMove
			let lspeed = (utl.speedMove + .1).toFixed(2);
			// // let scale = (utl.speedMove + lspeed)/lspeed
			// // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
			Laya.Vector3.scale(speed, .1, this.speed);
			utl.info.text = Laya.Vector3.scalarLength(this.speed) - utl.speedMove+","+utl.speedMove+','+Laya.Vector3.scalarLength(this.speed)
			utl.firs.push(this)
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
		this.time++ 
		if(!this.box.destroyed){
			// let vx = utl.box.transform.position.x - this.box.transform.position.x 
			// let vy = utl.box.transform.position.y - this.box.transform.position.y 
			// let vz = utl.box.transform.position.z - this.box.transform.position.z
			// let ry = utl.getAngle(vx,vz)
			// this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
			// this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
			// this.tempy = ry
			 // this.box.transform.translate(this.speed,false)
			 let bmain =this.box.getChildByName('Cube')
			 if(this.box){
            	
            	this.box.transform.translate(new Laya.Vector3(0,-this.startSpeed,0),true)
			 	bmain.transform.translate(new Laya.Vector3(0,-1,0),true)
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