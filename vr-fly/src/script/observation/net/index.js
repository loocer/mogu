let address = 'http://172.16.25.101:3000'
import utl from "../../utl.js"
import Bullet from "../../entity/bullet.js"

let Event = Laya.Event;
let result = {}

let websocket = null

import { Astar} from "./astar"
let allBoy = []
function createGraph() {
	let list = []
	for (let i = 0; i < 500; i++) {
	    let list1 = []
	    for (let o = 0; o < 500; o++) {
	        list1.push(1)
	    }
	    list.push(list1)
	}

	utl.graph = new Astar.Graph(list);
}
function resetGraph(){
	for(let obj of utl.graph.grid){
		for(let indexObj of obj){
			indexObj.weight = 1
		}
	}
}


export const getServiceAddress = () => {
	let hr = new HttpRequest();

	function onHttpRequestProgress(e) {
		console.log(123)
	}

	function onHttpRequestComplete(e) {
		result.serviceAddress = JSON.parse(hr.data).data;
		login()
		console.log(3458888, result)
	}

	function onHttpRequestError(e) {
		console.log(534543, e)
	}
	hr.once(Event.PROGRESS, this, onHttpRequestProgress);
	hr.once(Event.COMPLETE, this, onHttpRequestComplete);
	hr.once(Event.ERROR, this, onHttpRequestError);
	hr.send(address + '/get-socketAddress', '', 'get', 'text');

}




export const socketMain = () => {
	// createGraph()
	// return
	// const socket = new WebSocket('ws://xuxin.love:3000');
	// // wx.connectSocket({
	// //   url: 'ws://xuxin.love:3000'
	// // })
	// // wx.onSocketOpen(function(res) {
	// //  wx.onSocketMessage((e)=>{
	// //  	console.log(e)
	// //  })

	// // })
	// return
	// utl.socket = io('ws://192.168.0.105:3000');
	utl.socket = io('wss://xuxin.love:3000');
	utl.socket.on('123456-observer', (s) => {
		// resetGraph()
		utl.mapSp.graphics.clear()
		utl.mapSp.graphics.drawRect(0, 0, 1000, 1000, "#00000066");
		// utl.mapSp.graphics.drawCircle(12, 400, 5, "#00ffff");
		// return
		let i=0,t=0;
		utl.info.text=s.glist.length
		for (let g of s.glist) {
			utl.mapSp.graphics.drawCircle(g.x*4, 1000 - g.y*4, 5, "#00ffff");
				// if (utl.entityMap.has(rot.id)) {
				// 	if (rot.start) {
				// 		utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
				// 		let x = ~~(rot.start.x / 500 * 400)
				// 		let y = ~~(rot.start.y / 500 * 400)
				// 		utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
				// 		utl.graph.grid[rot.start.x][rot.start.y].weight = 0
				// 	}
				// 	else  {
				// 		utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
				// 		let x = ~~(rot.end.x / 500 * 400)
				// 		let y = ~~(rot.end.y / 500 * 400)
				// 		utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
				// 		utl.graph.grid[rot.end.x][rot.end.y].weight = 0
				// 	} 

				// } else {
				// 	let map2 = utl.models.get('cube').clone()
				// 	map2.getChildByName('on').active = false
				// 	utl.newScene.addChild(map2);
				// 	utl.entityMap.set(rot.id, map2)
				// 	if (rot.start) {
				// 		utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
				// 		let x = ~~(rot.start.x / 500 * 400)
				// 		let y = ~~(rot.start.y / 500 * 400)
				// 		utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
				// 		utl.graph.grid[rot.start.x][rot.start.y].weight = 0
				// 	}
				// 	else{
				// 		utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
				// 		let x = ~~(rot.end.x / 500 * 400)
				// 		let y = ~~(rot.end.y / 500 * 400)
				// 		utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
				// 		utl.graph.grid[rot.end.x][rot.end.y].weight = 0
				// 	} 
				// }
			
		}
	});
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}

