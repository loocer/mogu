// // import Astar from '../tools/astar.js'
// let Astar = require('../tools/astar.js');
// let graph = null
// // var graph = new Graph([
// //   [1,1,1,1],
// //   [0,1,1,0],
// //   [0,0,1,1]
// // ]);
// // var  graphMove = [
// //   [0,0,0,0],
// //   [0,1,1,0],
// //   [0,0,1,1]
// // ]
// // const positionBox = [
// //   [{x:0,y:0},{x:1,y:0}]
// // ]
// class Box{
//   constructor(graph,start){
//     this.position = {x:0,y:0}
//     this.start = graph.grid[start[0]][start[1]]
//     this.end = graph.grid[start[0]][start[1]]
//     this.result = []
//     this.graph = graph
//     this.move1 = graph.grid[start[0]][start[1]]
//     this.move2 = graph.grid[start[0]][start[1]]
//     graph.grid[start[0]][start[1]].weight = 0
//     this.drawPositions = []
//     this.standingTime = 0
//     this.isMove=false
//   }
//   init(){

//   }
//   setEndPoint(p){
//     this.end = p
//   }
//   query(){
//     let { start, end} = this
//     this.stop()
//     this.result = Astar.astar.search(this.graph, start, end);
//   }
//   check(){
//     let nextPoint = this.result[1]
//     return nextPoint.weight
//   }
//   stop(){
//     if(this.result.length>0){
//       let p1 = this.result[0]
//       this.graph.grid[p1.x][p1.y].weight = 1
//     }
    
//     this.result = []
//   }
//   changeState(){
//     let p0 = this.result.shift()
//     let p1 = this.result[0]
//     this.start = p0
//     this.move1 = {x:p0.x,y:p0.y}
//     this.move2 = {x:p1.x,y:p1.y}
    
//     // this.drawPositions = {
//     //   // start:positionBox[p0[0],p0[1]],
//     //   // end:positionBox[p1[0],p1[1]]
//     //   start:p0,
//     //   end:p1
//     // }
//     // let g1 = this.graph[p0[0],p0[1]]
//     // let g2 = this.graph[p1[0],p1[1]]
//     // this.graph[p0[0],p0[1]] = 0
//     // this.graph[p1[0],p1[1]] = 1
//   }
//   update(){
//     if(this.result.length==0){
//       return
//       }
//     if(this.result.length>1){
//       if(this.check()){
//         this.standingTime = 0
//         this.changeState()
//       }else{
//         if(this.standingTime==10){
//           this.query()
//         } 
//         this.standingTime++
//       }
//     }
//     if(this.result.length==1){
//       let p = this.result[0]
//       this.move1 = {x:p.x,y:p.y}
//       this.move2 = {x:p.x,y:p.y}
//       this.graph.grid[p.x][p.y].weight = 0
//     }else{
//       let  {move1,move2} = this
//       this.graph.grid[move1.x][move1.y].weight = 1
//       this.graph.grid[move2.x][move2.y].weight = 0
//     }
    
//   }
//   update(){
//     if(this.result.length==0){
//       return
//       }
//     if(this.result.length>1){
//       if(this.check()){
//         this.standingTime = 0
//         this.changeState()
//       }else{
//         if(this.standingTime==10){
//           this.query()
//         } 
//         this.standingTime++
//       }
//     }
//     if(this.result.length==1){
//       let p = this.result[0]
//       this.move1 = {x:p.x,y:p.y}
//       this.move2 = {x:p.x,y:p.y}
//       this.graph.grid[p.x][p.y].weight = 0
//     }else{
//       let  {move1,move2} = this
//       this.graph.grid[move1.x][move1.y].weight = 1
//       this.graph.grid[move2.x][move2.y].weight = 0
//     }
    
//   }
// }

// // let game = new Game();
// // game.box.start = game.box.graph.grid[0][0]
// // game.box.end = game.box.graph.grid[80][90]
// // game.box.query()
// // console.log(game.box.graph.grid[0][0].weight)
// module.exports=Box 

//-----------------------------------------------------------//
// import Astar from '../tools/astar.js'
let Astar = require('../tools/astar.js');
let graph = null
// var graph = new Graph([
//   [1,1,1,1],
//   [0,1,1,0],
//   [0,0,1,1]
// ]);
// var  graphMove = [
//   [0,0,0,0],
//   [0,1,1,0],
//   [0,0,1,1]
// ]
// const positionBox = [
//   [{x:0,y:0},{x:1,y:0}]
// ]
class Box{
  constructor(graph,start){
    this.position = {x:0,y:0}
    this.start = graph.grid[start[0]][start[1]]
    this.end = graph.grid[start[0]][start[1]]
    this.result = []
    this.graph = graph
    this.move1 = graph.grid[start[0]][start[1]]
    this.move2 = graph.grid[start[0]][start[1]]
    graph.grid[start[0]][start[1]].weight = 0
    this.drawPositions = []
    this.standingTime = 0
    this.isMove=false
  }
  init(){

  }
  setEndPoint(p){
    this.end = p
  }
  query(){
    let { start, end} = this
    this.stop()
    this.result = Astar.astar.search(this.graph, start, end);
  }
  check(){
    let p = this.result[1]
    return this.graph.grid[p.x][p.y].weight
  }
  stop(){
    if(this.result.length>0){
      let p1 = this.result[0]
      this.graph.grid[p1.x][p1.y].weight = 1
    }
    
    this.result = []
  }
  changeState(){
    let p0 = this.result.shift()
    let p1 = this.result[0]
    this.move1 = {x:p0.x,y:p0.y}
    this.move2 = {x:p1.x,y:p1.y}
    this.graph.grid[p0.x][p0.y].weight = 1
    this.graph.grid[p1.x][p1.y].weight = 0
    // this.drawPositions = {
    //   // start:positionBox[p0[0],p0[1]],
    //   // end:positionBox[p1[0],p1[1]]
    //   start:p0,
    //   end:p1
    // }
    // let g1 = this.graph[p0[0],p0[1]]
    // let g2 = this.graph[p1[0],p1[1]]
    // this.graph[p0[0],p0[1]] = 0
    // this.graph[p1[0],p1[1]] = 1
  }
  update(){
    if(this.result.length==0){
      return
    }
    if(this.result.length>1){
      if(this.check()){
        this.standingTime = 0
        this.changeState()
        // let p = this.result[0]
        // let p1 = this.result[1]
        // this.move1 = {x:p.x,y:p.y}
        // this.move2 = {x:p1.x,y:p1.y}
      }else{
        let p = this.result[0]
        let p1 = this.result[0]
        this.move1 = {x:p.x,y:p.y}
        this.move2 = {x:p1.x,y:p1.y}
      }
    }
    if(this.result.length==1){
      let p = this.result[0]
      this.move1 = {x:p.x,y:p.y}
      this.move2 = {x:p.x,y:p.y}
    }else{
      // let p = this.result[0]
      // let p1 = this.result[1]
      // let queryId1 = (new Date()).valueOf();
      // this.move1 = {x:p.x,y:p.y,queryId:queryId1}
      // let queryId2 = (new Date()).valueOf()+'22';
      // this.move2 = {x:p1.x,y:p1.y,queryId:queryId2}
    }
    
  }
  
}

// let game = new Game();
// game.box.start = game.box.graph.grid[0][0]
// game.box.end = game.box.graph.grid[80][90]
// game.box.query()
// console.log(game.box.graph.grid[0][0].weight)
module.exports=Box 




