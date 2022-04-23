let Astar = require('../tools/astar.js');
let Player = require('./player')
let boxs = require('../tools/rooms')
class Room {
   constructor() {
      this.players = new Map()
      this.id = '123456';
      this.heros = []
      this.heroMap = new Map()
      this.graph = null
      this.moveGroups = []
      this.createGraph()
      boxs.set(this.id, this)
   }
   createGraph() {
      let list = []
      let positionBox = []
      for (let i = 0; i < 500; i++) {
         let list1 = []
         for (let o = 0; o < 500; o++) {
            list1.push(1)
            positionBox.push({
               x: o,
               y: i
            })
         }
         list.push(list1)
      }

      this.graph = new Astar.Graph(list);
      this.positionBox = positionBox
   }
   addPlayer() {
      let player = new Player(this,{initPs:'p1'})
      player.id = 'player-1'
      this.players.set(player.id, player)
      let player2 =new Player(this,{initPs:'p2'})
      player2.id = 'player-2'
      this.players.set(player2.id, player2)
   }
   update() {
      for(let graid of this.graph.grid){
         for(let objd of graid){
            objd.weight=1
         }
      }
      let players = this.players
      for (let value of players.values()) {
         for (let rot of value.robots.values()) {
            let {move2} = rot.map
            this.graph.grid[move2.x][move2.y].weight=0
         }
      }
      for (let value of players.values()) {
         value.update()
      }
   }
   receive(msg) { //{userId:0,heros:[],coordinate:{x,y,z}}

      if(msg.actionName=='ry-moveGroup'){
         this.ryMoveGroup(msg)
      }
      if(msg.actionName=='addHero'){
         this.addHero(msg)
      }
      if(msg.actionName=='moveGroup'){
         this.moveGroup(msg)
      }
   }
   addHero(msg){

      let player = this.players.get(msg.playerId)
      player.addHero()
   }
   ryMoveGroup(msg){
      let player = this.players.get(msg.playerId)
      let heres = []
      for (let hero of msg.heros) {
         if(player.robots.has(hero.id)){
            let h = player.robots.get(hero.id)
            h.ryMoveGroup(hero)
            // console.log(h.map.move2,h.map.move1)
            heres.push({
               id:hero.id,
               x:h.map.move2.x,
               y:h.map.move2.y
            })
         }
      }
      let id = (new Date()).valueOf();
      player.ryMoveGroup = {
         id,
         heros:heres,
         target:msg.target
      }
      // this.moveGroups.push({
      //    id:'123456-moveGroup',
      //    heros:heres,
      //    target:msg.target
      // })
   }
   moveGroup(msg){
      // let player = this.players.get(msg.userId)
      // for (let hero of msg.heros) {
      //    if(player.robots.has(hero.id)){
      //       player.robots.get(hero.id).changeMove([hero.coordinate.x, hero.coordinate.y])
      //    }
      // }
      let player = this.players.get(msg.playerId)
      for (let hero of msg.heros) {
         if(player.robots.has(hero.id)){
            player.robots.get(hero.id).changeResult(hero)
         }
      }
   }
   pushMsg(io) {
      let glist =[]
      for(let graid of this.graph.grid){
         for(let objd of graid){
            if(objd.weight==0){
               glist.push({
                  x:objd.x,
                  y:objd.y,
               })
            }
            // objd.weight=1
         }
      }
      let list = []
      for (let obj of this.players.values()) {
         list.push(obj.getPushMsg())
      }
     
      
      io.emit(this.id, {
         list
      });
     
      io.emit('123456-observer', {
         glist
      });
      for(let obj of this.moveGroups){
         io.emit(obj.id, {
            heros:obj.heros,
            target:obj.target
         });
      }
      this.moveGroups = []
   }
}
module.exports = Room