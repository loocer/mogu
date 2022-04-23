let Astar = require('./astar.js');
let graphe = null
function createGraph() {
    let list = []
    let positionBox = []
    for (let i = 0; i < 200; i++) {
        let list1 = []
        for (let o = 0; o < 350; o++) {
            list1.push(1)
            positionBox.push({
                x: o,
                y: i
            })
        }
        list.push(list1)
    }

    graphe = new Astar.Graph(list);
    // graphe.grid[2][3].weight = 0
    // graphe.grid[2][1].weight = 0
    // graphe.grid[3][2].weight = 0
    // graphe.grid[3][1].weight = 0
    // graphe.grid[1][2].weight = 0
    // graphe.grid[2][1].weight = 0
    // graphe.grid[3][3].weight = 0
    // graphe.grid[1][1].weight = 0
    // graphe.grid[1][3].weight = 0
    // graphe.grid[2][4].weight = 0
}
const findIntPition = (graph, center, pindex) => {// center = {x:3,y:3}
    let index = pindex || 1
    let list = findBy(index, center)
    for (let item of list) {
        if (item[0] > 0 && item[1] > 0 && item[0] < 500 && item[1] < 500) {
            if (graph.grid[item[0]][item[1]].weight == 1) {
                return item
            }
        }
    }
    return findIntPition(graph, center, ++index)
}
function findBy(index, center) {
    let list = []
    for (let i = 0; i < index; i++) {
        if (i == 0) {
            list.push([0 + center.x, index + center.y])
            list.push([0 + center.x, -index + center.y])
            list.push([index + center.x, 0 + center.y])
            list.push([-index + center.x, 0 + center.y])
            list.push([index + center.x, index + center.y])
            list.push([-index + center.x, -index + center.y])
            list.push([index + center.x, -index + center.y])
            list.push([-index + center.x, index + center.y])
        } else {
            list.push([index + center.x, i + center.y])
            list.push([index + center.x, -i + center.y])
            list.push([-index + center.x, i + center.y])
            list.push([-index + center.x, -i + center.y])
            list.push([i + center.x, index + center.y])
            list.push([i + center.x, -index + center.y])
            list.push([-i + center.x, index + center.y])
            list.push([-i + center.x, -index + center.y])
        }
    }
    return list
}
// const findfuckPition=(center,rotMap,pindex)=>{// center = {x:3,y:3}
//     if(pindex>10){
//         return null
//     }
//     let index = pindex||1
//     let list  = findBy(index,center)
//     for(let item of list){
//         if(item[0]>0&&item[1]>0&&item[0]<500&&item[1]<500){
//             if(rotMap.has(item[0]+'-'+item[1])){
//                 if(rotMap.get(item[0]+'-'+item[1]).rot.player.id!=rotMap.get(center.x+'-'+center.y).rot.player.id){
//                     return rotMap.get(item[0]+'-'+item[1])
//                 }
//             }
//         }
//     }
//     return  findfuckPition(center,rotMap,++index)
// }
const findfuckPition = (rot, rotMap,allRotMap) => {// center = {x:3,y:3}
    let x1 = rot.map.move1.x
    let y1 = rot.map.move1.y

    for (playId of rotMap.keys()) {
        if (playId != rot.player.id) {
            for (let rot1 of rotMap.get(playId).values()) {
                let x2 = rot1.map.move1.x
                let y2 = rot1.map.move1.y
                if (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) < 50) {
                    return rot1
                }
            }
        }
    }

    let center = rot.heroMapKey.split("-");
    let x = +center[0]
    let y = +center[1]
    
    let list = findBy(1, {x,y})
    for (let item of list) {
        if(!allRotMap.has(item[0]+'-'+item[1])){
            continue
        }
        let elMap = allRotMap.get(item[0]+'-'+item[1])
        for (playId of elMap.keys()) {
            if (playId != rot.player.id) {
                for (let rot2 of elMap.get(playId).values()) {
                    let x3 = rot2.map.move1.x
                    let y3 = rot2.map.move1.y
                    if (Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)) < 50) {
                        return rot2
                    }
                }
            }
        }
    }
    return null
}
const initPointPostion = {
    'p1': { x: 0, y: 0 },
    'p2': { x: 499, y: 0 },
}
module.exports = {
    findIntPition,
    findfuckPition,
    initPointPostion
}
createGraph()
let item = findIntPition(graphe, { x: -1, y: 0 })
console.log(item)