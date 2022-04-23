 import utl from "../utl.js"
 import Bullet from "./bullet.js"
export default class Enemy extends Laya.Script3D { 
	constructor() {
		super();
		this.isAttacked = false;
		this.tempy = 0
		this.box = null;
		this.life = 60;
		this.time = 0
		this.speed = new Laya.Vector3();
		// Laya.timer.loop(30,this,this.onUpdate);
		// Laya.timer.loop(10,this,this.onFind);
	}
	onAwake() {
		this.box = this.owner;
		this.onFind()
	}
	onFind(){
		if(utl.box){
			let bV3 = new Laya.Vector3();
        	Laya.Vector3.subtract( utl.box.transform.position,this.box.transform.position, bV3);
			Laya.Vector3.normalize(bV3,this.speed);
			console.log(Laya.Vector3.scalarLength(this.speed))
			// let scale =  utl.speedMove/10 + 1
			// Laya.Vector3.scale(this.speed, scale, this.speed);
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




		 // if(this.time==1000 ){
		 // 	this.box.removeSelf();
		 // }
		 if(this.isAttacked)
	        {
	            //根据击退方向和速度移动
	            this.box.transform.translate(this.repelledV3,false);
	            // console.log("击退位置变化：",(this.cube.transform.position.clone()).elements);
	            //击退速度逐步减小
	            Laya.Vector3.scale(this.repelledV3,0.3,this.repelledV3);
	            //当后退各方向速度小于0.01时，击退状态停止
	            if(Laya.Vector3.scalarLength(this.repelledV3)<0.01)
	            {
	                this.isAttacked=false;
	            }
	        }
	}
	onStart() {}

	onTriggerEnter(other)
	{
	    this.box.removeSelf();
	    let sp3D = other.owner;
        //获取子弹对象模型脚本
        let script = sp3D.getComponents(Bullet);
        //获取子弹速度为
        this.repelledV3 = script[0].speed.clone();
        //被攻击速度归一化成单位一向量
        Laya.Vector3.normalize(this.repelledV3, this.repelledV3);
        //设置为被攻击状态
        this.isAttacked = true;
        console.log("\n1 子弹碰撞时位置(方向):", sp3D.transform.position.elements);
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