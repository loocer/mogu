let address = 'http://172.16.25.101:3000'
import utl from "../utl.js"
import Bullet from "../entity/bullet.js"

let Event = Laya.Event;
let result = {}

let websocket = null
let timeFrame = new Map()
import {
	Astar
} from "./astar"

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

function resetGraph() {
	for (let obj of utl.graph.grid) {
		for (let indexObj of obj) {
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


let ryMoveGroup = null
let outPos = new Laya.Vector3();
let tempRotMap = new Map()
let time = 0
export const socketMain = () => {
	createGraph()
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
	// utl.socket = io('ws://192.168.11.37:3000');
	utl.socket = io('wss://xuxin.love:3000');
	utl.socket.on('123456', (s) => {
		
		time++
		resetGraph()
		tempRotMap.clear()
		utl.mapSp.graphics.clear()
		utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
		for (let player of s.list) {
			if (player.playerId == utl.playerId) {
				ryMoveGroup = player.ryMoveGroup
				utl.info.text = player.killNum
			}
			for (let rot of player.rots) {
				if (utl.entityMap.has(rot.id)) {
					let x = ~~(rot.end.x / 500 * 400)
					let y = ~~(rot.end.y / 500 * 400)
					utl.mapSp.graphics.drawCircle(x, 400 - y, 5, utl.pColor[rot.initPs]);
					utl.graph.grid[rot.start.x][rot.start.y].weight = 0
					if (
						rot.start.x == rot.end.x &&
						rot.start.y == rot.end.y) {

					} else {
						if (timeFrame.get(rot.id).list.length > 5) {
							timeFrame.get(rot.id).list = [{
								start: rot.start,
								end: rot.end
							}]
						} else {
							timeFrame.get(rot.id).list.push({
								start: rot.start,
								end: rot.end
							})
						}
					}
					utl.heroMap.get(rot.id).rot = rot

				} else {

					let map2 = utl.models.get('cube').clone()
					map2.getChildByName('on').active = false
					if (rot.initPs == 'p2') {
						let material = map2._children[1].meshRenderer.material
						material.albedoColorA = 1
						material.albedoColorB = 0.9
						material.albedoColorG = 0.1
						material.albedoColorR = 0.1
					}
					if (rot.initPs == 'p1') {
						let material = map2._children[1].meshRenderer.material
						material.albedoColorA = 1
						material.albedoColorB = 0.5
						material.albedoColorG = 0.5
						material.albedoColorR = 0.1
					}
					let materialmmm = map2._children[0].meshRenderer.material
					materialmmm.albedoColorA = 1
					materialmmm.albedoColorB = 0.9
					materialmmm.albedoColorG = 0.9
					materialmmm.albedoColorR = 0.9
					let sp = new Laya.Sprite();
					Laya.stage.addChild(sp);
					sp.visible = false
					sp.graphics.drawRect(0, 0, 80, 10, "#00ef6b");
					utl.heroMap.set(rot.id, {
						sp,
						rot
					})



					// albedoColor
					// w: 1
					// x: 0.8851529
					// y: 0.9
					// z: 0.9716981
					// material1.albedoColor.w=1
					// material1.albedoColor.x=.2
					// material1.albedoColor.y=0.2
					// material1.albedoColor.z=.2
					utl.newScene.addChild(map2);
					utl.entityMap.set(rot.id, map2)
					utl.graph.grid[rot.start.x][rot.start.y].weight = 0

					timeFrame.set(rot.id, {
						flag: true,
						// queryId:rot.start.queryId,
						list: [{
							start: rot.start,
							end: rot.end
						}]
					})
					let x = ~~(rot.end.x / 500 * 400)
					let y = ~~(rot.end.y / 500 * 400)
					utl.mapSp.graphics.drawCircle(x, 400 - y, 5, utl.pColor[rot.initPs]);

				}
				utl.entityMap.get(rot.id).time = time
				if (timeFrame.get(rot.id).list.length == 1) {
					engMain(rot.id)
				}
				let p = utl.entityMap.get(rot.id).transform.position
				let sp = utl.heroMap.get(rot.id).sp



				let bleed = utl.heroMap.get(rot.id).rot.bleed / utl.allBleed
				utl.camera.viewport.project(p, utl.camera.projectionViewMatrix, outPos);
				sp.pos((outPos.x - 40) / Laya.stage.clientScaleX, (outPos.y - 30) / Laya.stage.clientScaleY);
				sp.graphics.clear()
				sp.graphics.drawRect(30, 0, 30, 10, "#ffffff");
				sp.graphics.drawRect(30, 0, 30 * bleed, 10, utl.pColor[rot.initPs]);

				// utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3,rot.end.y)
			}
		}
		queryString()
		checkAndClear(time)
	});
	// utl.socket.on('123456-moveGroup', (s) => {

	// 	resetGraph()
	// 	utl.mapSp.graphics.clear()
	// 	utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
	// 	let result = []
	// 	let {x,y} = s.target
	// 	let queryId = (new Date()).valueOf();
	//        for(let r of s.heros){ 
	//        	timeFrame.get(r.id).flag = false
	// 		timeFrame.get(r.id).list = []
	//         	let start = utl.graph.grid[r.x][r.y]
	//         	let end = utl.graph.grid[~~-x][~~y]
	//         	result = Astar.astar.search(utl.graph, start, end);
	//        	let ps = []
	//        	ps.push({
	//        	 	x:start.x,
	//             	y:start.y,
	//            })
	//         	for(let objd of result){
	//           		ps.push({
	//            	 	x:objd.x,
	//             		y:objd.y,
	//           		})
	//         	}
	//          r.result = ps
	//          timeFrame.get(r.id).flag = true
	//       }
	//         let msg = {
	//        userId: 'zzw',
	//        actionName:'moveGroup',
	//        heros:s.heros
	//      }

	//      utl.socket.emit('123456', msg);
	// });
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}

function checkAndClear(time) {
	for (let id of utl.entityMap.keys()) {
		if (utl.entityMap.get(id).time < time - 3) {
			utl.entityMap.get(id).destroy()
			utl.heroMap.get(id).sp.destroy()
			utl.entityMap.delete(id)
			utl.heroMap.delete(id)
		}
	}
}

function queryString() {
	if (!ryMoveGroup) {
		return
	}
	let result = []
	let {
		x,
		y
	} = ryMoveGroup.target

	for (let r of ryMoveGroup.heros) {
		utl.graph.grid[r.x][r.y].weight = 1
	}
	for (let r of ryMoveGroup.heros) {
		timeFrame.get(r.id).flag = false
		timeFrame.get(r.id).list = []
		let start = utl.graph.grid[r.x][r.y]
		let end = utl.graph.grid[~~-x][~~y]
		result = Astar.astar.search(utl.graph, start, end);
		let ps = []
		ps.push({
			x: start.x,
			y: start.y,
		})
		for (let objd of result) {
			ps.push({
				x: objd.x,
				y: objd.y,
			})
		}
		r.result = ps
		timeFrame.get(r.id).flag = true
	}
	let msg = {
		playerId: utl.playerId,
		actionName: 'moveGroup',
		heros: ryMoveGroup.heros
	}
	utl.socket.emit('123456', msg);
}

function engMain(id) {
	let flag = timeFrame.get(id).flag
	if (!flag) {
		return
	}
	let list = timeFrame.get(id).list
	let obj = list[0]
	let frameObj = {
		id: id,
		x: obj.start.x,
		y: obj.start.y,
		list
	}
	// timeFrame.get(id).queryId = obj.start.queryId
	list.shift()
	Laya.Tween.to(frameObj, {
		x: obj.end.x,
		y: obj.end.y,
		update: new Laya.Handler(this, updateMove, [frameObj])
	}, 300, Laya.Ease.linearNone, Laya.Handler.create(this, tweend, [frameObj]), 0);
}

function updateMove(value) {
	if (!utl.entityMap.has(value.id)) {
		return
	}
	utl.entityMap.get(value.id).transform.position = new Laya.Vector3(-value.x, 3, value.y)

	let p = utl.entityMap.get(value.id).transform.position
	let sp = utl.heroMap.get(value.id).sp
	// utl.camera.viewport.project(p, utl.camera.projectionViewMatrix, outPos);
	//    sp.pos((outPos.x-40) / Laya.stage.clientScaleX, (outPos.y-50) / Laya.stage.clientScaleY);


	let bleed = utl.heroMap.get(value.id).rot.bleed / utl.allBleed
	utl.camera.viewport.project(p, utl.camera.projectionViewMatrix, outPos);
	sp.pos((outPos.x - 40) / Laya.stage.clientScaleX, (outPos.y - 30) / Laya.stage.clientScaleY);
	sp.graphics.clear()
	sp.graphics.drawRect(30, 0, 30, 10, "#ffffff");
	sp.graphics.drawRect(30, 0, 30 * bleed, 10, utl.pColor[utl.heroMap.get(value.id).rot.initPs]);
	// sp.scaleX = sp.scaleY =  0.125 * p.z + 0.75;

	// let obj = value.val
	// if(obj.speed>0)

	// 	let box = utl.boxs.get(obj.id)
	// 	box.transform.translate(new Laya.Vector3(0,-obj.speed/10,0),true)
	// }

}

function tweend(obj) {

	if (!timeFrame.get(obj.id).flag) {
		return
	}
	let list = timeFrame.get(obj.id).list
	// if(timeFrame.get(obj.id).queryId==list[0].start.queryId){

	if (list.length > 0) {
		engMain(obj.id)
	}
	// }


}