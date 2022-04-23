let Room = require('./model/room.js')
let boxs =require('./tools/rooms')
class Main{
   constructor(io){
     this.rooms = []
     this.io = io
     this.work()
   }
   createRoom(){
      let room = new Room(this.io)
      room.addPlayer()
      this.rooms.push(room)
   }
   work(){
      setInterval(()=>{
         this.update()
         this.pushMsg()
        
      },200)
   //    setInterval(()=>{
        
   //   },300)
   }
   pushMsg(){
       for(let room of this.rooms){
            room.pushMsg(this.io)
       }
   }
   update(){
    for (let en of  boxs.values()) {
         en.update()
      }
   }
}
// module.exports=main


// const gameGo = {
//     createRoom:(io)=>{
//         let main = new Main(io);
//         main.createRoom()
//     },
//     receive:()=>{

//     }
// }
module.exports=Main