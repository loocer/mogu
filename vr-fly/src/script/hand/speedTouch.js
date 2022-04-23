 import utl from "../utl.js"
 import { Astar} from "../net/astar.js"
 let rots = []
let outPos = new Laya.Vector3();
 export default class newtach {
   constructor() {
     this.status = 0
     this.x = 0
     this.y = 0
     this.move = null
     this.startPoint = null
     this.endPoint = null
     this.sp = new Laya.Sprite();
     this.point = new Laya.Vector2();
     this.startP = null
     this.evList = this.eventInt()
     this.isChangeCam = true//第一次是否是在迷你地图
     Laya.stage.addChild(this.sp);
   }
   eventInt(){
     let that = this
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
      ]
      return eventList
   }
   addMsg(){

    let msg = {
       playerId: utl.playerId,
       actionName:'addHero',
     }
     console.log(msg)
     utl.socket.emit('123456', msg);
     if(utl.buttonStatus.addHero){
      setTimeout(()=>{
        this.addMsg()
      },1000)
     }
     
   }
   addpBack(){
    // buttonStatus
    utl.buttonStatus.addHero=!utl.buttonStatus.addHero
    if(utl.buttonStatus.addHero){
      utl.addsImg.skin = 'https://xuxin.love/img/redcode/icon/add-start.png' 
      this.addMsg()
    }else{
      utl.addsImg.skin = 'https://xuxin.love/img/redcode/icon/add-stop.png'
    }
    
     

   }
   eventCheck(){
     let {evList} = this
     for(let item of evList){
       let checkPotion = item.checkPotion
       if (this.startPoint.x - this.endPoint.x < 10 &&
       this.startPoint.y - this.endPoint.y < 10 &&
       this.endPoint.x < checkPotion.x+checkPotion.width &&
       this.endPoint.x > checkPotion.x &&
       this.endPoint.y < checkPotion.y+checkPotion.height&&
       this.endPoint.y > checkPotion.y
       ){
         item.callBack()
         return
       }
     }
     this.changePointBack()
   }

   changeCamerBack(df){
       let p = df||this.startPoint
       let x = p.x / 400 * 500
       let y = p.y / 400 * 500
       utl.camera.transform.position = new Laya.Vector3(-x, 30, 500 - y)
       this.updateView()
   }
   changePointBack(){
       let p = this.startPoint
       let p2 = this.trsV2ToV3(p)
       if (
         p2.x < 0 &&
         p2.z > 0 &&
         p2.x > -500 &&
         p2.z < 500) {
         if (
           Math.abs(this.startPoint.x - this.endPoint.x) < 10 &&
           Math.abs(this.startPoint.y - this.endPoint.y) < 10
         ) {
           let x = ~~p2.x
           let y = ~~p2.z
           this.sendMsg(rots,{x,y})
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



           //----------------------foo1
           // let result = []
           // for(let r of rots){ 
           //   let rp = utl.entityMap.get(r.id)
           //   let potion = rp.transform.position
           //   let start = utl.graph.grid[-potion.x][potion.z]
           //   let end = utl.graph.grid[-x][y]
           //   result = Astar.astar.search(utl.graph, start, end);
           //   let ps = []
           //   for(let objd of result){
           //     ps.push({
           //       x:objd.x,
           //       y:objd.y
           //     })
           //   }
           //    r.result = ps
           // }
           // this.sendMsg(rots)




           // let listoo = []
           // for(let fuck of result){
           //    let pobj = utl.showbox.clone()
           //    pobj.transform.position = new Laya.Vector3(-fuck.x, 3, fuck.y)
           //    utl.newScene.addChild(pobj)
           //    listoo.push(pobj)
           // }
           // setTimeout(()=>{
           //   for(let ogh of listoo){
           //     ogh.removeSelf();
           //   }
           // },3000)
           
           // let msg = {
           //   userId: 'zzw',
           //   actionName:'moveGroup',
           //   heros:rots
           // }
           // utl.socket.emit('123456', msg);
         }
       }
   }
   sendMsg(rots,target){
     
     let msg = {
       playerId: utl.playerId,
       actionName:'ry-moveGroup',
       heros:rots,
       target
     }
     console.log(msg)
     utl.socket.emit('123456', msg);
   }
   // sendMsg(rots){
     
   //   let msg = {
   //     userId: 'zzw',
   //     actionName:'moveGroup',
   //     heros:rots
   //   }
   //   utl.socket.emit('123456', msg);
   // }
   reset() {
      if (!this.startPoint) {
        return
      }
      if (!this.endPoint) {
        return
      }
      if (
           Math.abs(this.startPoint.x - this.endPoint.x) < 20 &&
           Math.abs(this.startPoint.y - this.endPoint.y) < 20
      ){
        this.eventCheck()
    
     }
     this.startPoint = null
     this.endPoint = null
   }
   drawSelect(p) {
     if (this.status == 0) {
       this.startPoint = p
       this.status = 1
       this.startP = this.trsV2ToV3(p)
       return
     }
     if (this.status == 1) {
       this.endPoint = p
       let p1 = this.startPoint


       if (
         0 < p.x &&
         p.x< 400 &&
         p.y < 400&&
         p.y > 0
         ){
           this.changeCamerBack(p)
         }
       if (
         Math.abs(this.startPoint.x - this.endPoint.x) < 20 &&
         Math.abs(this.startPoint.y - this.endPoint.y) <20
       ) {

       } else {
           if (
         0 < p.x &&
         p.x< 400 &&
         p.y < 400&&
         p.y > 0
         ){
           
         }else{
           this.sp.graphics.clear()
           this.sp.graphics.drawLines(p1.x, p1.y, [0, 0, p.x - p1.x, 0, p.x - p1.x, p.y - p1.y, 0, p.y - p1.y, 0, 0], "#ff0000", 5);
           this.selectAll(p)
         }
           
         


         
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
         if (outs[i].collider.owner.name == "Plane") {
           return new Laya.Vector3(outs[0].point.x, outs[0].point.y, outs[0].point.z)
         }
       }
       //在射线击中的位置添加一个立方体

     }
   }
   selectAll(p22) {

     let p1 = this.startP
     let p2 = this.trsV2ToV3(p22)
     if (!p1) {
       return
     }
     let absx1x = p1.x
     let absx2x = p2.x
     let absx1z = p1.z
     let absx2z = p2.z
     let msx = absx1x > absx2x ? absx1x : absx2x
     let msz = absx1z > absx2z ? absx1z : absx2z
     let mix = absx1x < absx2x ? absx1x : absx2x
     let miz = absx1z < absx2z ? absx1z : absx2z
     rots = []
     for (let key of utl.entityMap.keys()) {
      let en = utl.entityMap.get(key)
       let pos = en.transform.position
       let sp = utl.heroMap.get(key).sp
       let fx = pos.x
       let fz = pos.z
       if (fx < msx &&
         fx > mix &&
         fz < msz &&
         fz > miz) {
         rots.push({id: key})
         if(utl.heroMap.get(key).rot.playerId==utl.playerId){
           en.getChildByName('on').active = true
           en.getChildByName('off').active = false
          
         }
          sp.visible = true
            // utl.camera.viewport.project(pos, utl.camera.projectionViewMatrix, outPos);
            // sp.pos((outPos.x-40) / Laya.stage.clientScaleX, (outPos.y-50) / Laya.stage.clientScaleY);
       } else {
         en.getChildByName('on').active = false
         en.getChildByName('off').active = true
         sp.visible = false
       }

     }
     this.updateView()
   }
   leftFormatMovePosition(out, tnum) {
     let xx = 0
     let zz = 0
     if (out) {
       xx = out.x.toFixed(1);
       zz = out.y.toFixed(1);
     } else {
       xx = 0
       zz = 0
     }
     if (tnum == 0) {
       this.sp.graphics.clear()
       this.status = 0
       this.reset()


       return
     }
     if (this.status == tnum) {
       let x = (this.x - xx).toFixed(1) / 10
       let z = -(this.z - zz).toFixed(1) / 10
       this.move = [x, z]
     } else {
       this.x = xx
       this.z = zz
       this.move = [0, 0]
     }
     if (tnum == 2) {
       this.sp.graphics.clear()
       
       utl.camera.transform.translate(new Laya.Vector3(this.move[0], this.move[1], 0), true);
       if (utl.camera.transform.position.x > 0 ||
         utl.camera.transform.position.x < -500 ||
         utl.camera.transform.position.z < 0 ||
         utl.camera.transform.position.z > 500
       ) {
         utl.camera.transform.translate(new Laya.Vector3(-this.move[0], -this.move[1], 0), true);
       }
     }
     this.updateView()
     this.status = tnum
     this.x = xx
     this.z = zz
   }
    updateView(){
        for (let key of utl.entityMap.keys()) {
          let en = utl.entityMap.get(key)
            let sp = utl.heroMap.get(key).sp
            let netRot = utl.heroMap.get(key).rot
            let p = en.transform.position
            let bleed = netRot.bleed/utl.allBleed
            utl.camera.viewport.project(p, utl.camera.projectionViewMatrix, outPos);
            sp.pos((outPos.x-40) / Laya.stage.clientScaleX, (outPos.y-30) / Laya.stage.clientScaleY);
            sp.graphics.clear()
            sp.graphics.drawRect(30, 0, 30, 10, "#ffffff");
            sp.graphics.drawRect(30, 0, 30*bleed, 10, utl.pColor[netRot.initPs]);
         }
     }
 }