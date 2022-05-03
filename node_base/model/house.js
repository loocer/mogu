// import Robot  from './robot/robot1'
let Robot = require('./robot/robot1')
let {findIntPition,initPointPostion,findfuckPition} = require('../tools/tools')
class House {
   constructor(player,position) {
      this.id = (new Date()).valueOf();
      this.player = player
      this.rotNum = 10
      this.robots = new Map()
      this.position = position
      this.target = null
   }
   addHero(){
      let id = this.id
      let {graph} = this.room
      let {x,y} = this.position
      let target = this.target
      let robot = new Robot(this,[x, y],target)
      // robot1.map.graph = this.room.graph
      this.robots.set(robot.id, robot)
   }
   getPushMsg() { 
      let rots = []
      let ryMoveGroup = null
      if(this.ryMoveGroup&&this.indexRyId != this.ryMoveGroup.id){
         // let {graph} = this.room
         ryMoveGroup=this.ryMoveGroup
         this.indexRyId = this.ryMoveGroup.id
      }
      
      for (let rot of this.robots.values()) {
         // let {start,end} = rot.map
         // this.room.graph.grid[start.x][start.y].weight = 0
         // this.room.graph.grid[end.x][end.y].weight = 1
         rots.push(rot.getPushMsg())
      }
      let houseList = {
         id:this.id,
         position:this.position,
         rotNum:this.rotNum,
      }
      return {
         playerId: this.player.id,
         ryMoveGroup,
         killNum:this.killNum,
         houseList,
         rots
      }
   }
   update() {
      for (let rot of this.robots.values()) {
         if(rot.bleed<0){
            rot.state = false
            this.robots.delete(rot.id)
            this.room.heroMap.delete(rot.id)
         }
         rot.update()
         this.changeAction(rot)
      }
   }
   findFuckRot(rot){
      let {x,y} = rot.map.move1
      for(let p of this.room.players.values()){
         if(p.id!=this.id){
            for(let elRot of p.robots.values()){
               let x1 = elRot.map.move1.x
               let y1 = elRot.map.move1.y
               if(Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y))<20){
                  return elRot
               }
            }
         }
      }
      return null
   }
   changeAction(rot){
      let elRot = this.findFuckRot(rot)
      if(elRot){
         elRot.bleed--
         rot.status.isOnFire = true
         if(elRot.bleed<0){
            this.killNum++
            rot.killNum++
         }
      }else{
         rot.status.isOnFire = false
      }
   }
}
module.exports = House