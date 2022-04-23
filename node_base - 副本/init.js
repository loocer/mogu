let contant = require('./tools/contant.js')
let boxs = require('./tools/rooms')
let Astar = require('./tools/astar.js');
module.exports = () => {
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
    contant.graph = new Astar.Graph(list);
    contant.positionBox = positionBox
}