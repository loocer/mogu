let address = 'http://172.16.25.101:3000'
import utl from "../utl.js"
import Bullet from "../entity/bullet.js"
let HttpRequest = Laya.HttpRequest
let Event = Laya.Event;
let result = {}
let temfe = {
	x: 1
}
let websocket = null
export const login = () => {
	let obj = {}
	let hr = new HttpRequest();
	let id = utl.userId
	// let id = 435
	function onHttpRequestProgress(e) {
		console.log(e)
	}

	function onHttpRequestComplete(e) {
		result.userInfo = JSON.parse(hr.data).data;
		console.log(66666, result)
		intoRoom()
	}

	function onHttpRequestError(e) {
		console.log(e)
	}

	hr.once(Event.PROGRESS, this, onHttpRequestProgress);
	hr.once(Event.COMPLETE, this, onHttpRequestComplete);
	hr.once(Event.ERROR, this, onHttpRequestError);
	hr.send(address + '/login', 'name=fef&id=' + id, 'post', 'text');

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
export const intoRoom = () => {
	let headers = [
		"Content-Type", "application/x-www-form-urlencoded",
		'token', result.userInfo.token,
		'user_id', result.userInfo.id
	];
	let hr = new HttpRequest();

	function onHttpRequestProgress(e) {
		console.log(123)
	}

	function onHttpRequestComplete(e) {
		socketMain()
		console.log(888888888, hr)
	}

	function onHttpRequestError(e) {
		console.log(534543, e)
	}
	hr.once(Event.PROGRESS, this, onHttpRequestProgress);
	hr.once(Event.COMPLETE, this, onHttpRequestComplete);
	hr.once(Event.ERROR, this, onHttpRequestError);
	hr.send(address + '/into-room?roomNo=123', null, 'get', 'text', headers);

}

function send() {
	// if(utl.messgeTime+1==utl.sendTime){
	let str = JSON.stringify(utl.sendMessage);
	websocket.send(str);
	// }
	// console.log(66666,utl)

}

function sendWe() {
	if (utl.messgeTime + 1 == utl.sendTime) {
		let str = JSON.stringify(utl.sendMessage);
		wx.sendSocketMessage({
			data: str
		});
	}
}

function df() {
	let player = playerMap.get(utl.id)
	player.twList.shift()
	player.flag = true
	// tweens.shift()
	// twnFlag = true
	main()
	// setTimeout(()=>{
	// 	console.log(2222222)
	// },2000)
	console.log(33333333)
	// utl.cube.transform.position = new Laya.Vector3(temp.tar.x,0,temp.tar.z)

}
// let tweens = []
let playerMap = new Map();

function main() {
	if (utl.fireOnOff) {
		return
	}
	for (var [key, value] of playerMap.entries()) {
		// if(!value.timeFlag){
		// 	continue
		// }
		if (value.flag && value.twList.length > 0) {
			value.flag = false
			drawPlayer(value)
		}
	}
}

function drawPlayer(value) {
	if (value.twList.length == 0) {
		return
	}


	let obj = value.twList[0]
	let tweenObj = {
		val: obj,
		value,
		x: 0,
	}

	let {
		id,
		type,
		position,
		shipEuler,
		speed,
		roteBody,
		rotationEuler
	} = obj
	let box = utl.boxs.get(id)

	if (!box) {
		box = utl.models.get('pler').clone();
		utl.newScene.addChild(box)
		let ship = box.getChildByName('shipmain')
		let camera = ship.getChildByName('c1')
		if (id == utl.id) {
			// utl.realBox = box
			// utl.bullet = box.getChildByName('shipmain').getChildByName('ship').getChildByName('ac')
			// camera.clearColor = new Laya.Vector4(0, 0, 0, 1);
			camera.active = true
		} else {
			box.getChildByName('camermain').active = false
			camera.active = false
		}

		utl.boxs.set(id, box)


		//创建新人物
	}
	let player = playerMap.get(id)
	let ship = box.getChildByName('shipmain')

	let shipcard = ship.getChildByName('ship')

	box.transform.position = new Laya.Vector3(position.x, position.y, position.z)
	box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x, rotationEuler.y, rotationEuler.z)


	shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x, shipEuler.y, shipEuler.z)

	if (type == 'FIRE') {
		let bullet = utl.models.get('bullet').clone();
		let sc = bullet.addComponent(Bullet);
		sc.startSpeed = speed
		utl.newScene.addChild(bullet)

		let shipcar = bullet.getChildByName('Cube')

		bullet.transform.position = new Laya.Vector3(position.x, position.y, position.z)
		bullet.transform.rotationEuler = new Laya.Vector3(rotationEuler.x, rotationEuler.y, rotationEuler.z)
		shipcar.transform.rotationEuler = new Laya.Vector3(shipEuler.x, shipEuler.y, shipEuler.z)

	}

	// box.transform.rotate(new Laya.Vector3(0,0,roteBody.sy* Math.PI / 180,),true);
	//    box.transform.rotate(new Laya.Vector3(0,roteBody.sx* Math.PI / 180,0),true);

	//    if(player.lastObj){
	//    	shipcard.transform.rotate(new Laya.Vector3(0, player.lastObj.x* Math.PI / 180,0),true);
	//    	shipcard.transform.rotate(new Laya.Vector3(player.lastObj.y* Math.PI / 180,0,0),true);
	//    }


	//    shipcard.transform.rotate(new Laya.Vector3(-roteBody.y* Math.PI / 180,0,0),true);
	//    shipcard.transform.rotate(new Laya.Vector3(0,-roteBody.x* Math.PI / 180,0),true);
	//    player.lastObj = roteBody
	// box.transform.position = new Laya.Vector3(position.x,position.y,position.z)
	// box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x,rotationEuler.y,rotationEuler.z)
	// let ship = box.getChildByName('shipmain')

	//    let shipcard = ship.getChildByName('ship')
	//    shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x,shipEuler.y,shipEuler.z)

	Laya.Tween.to(
		tweenObj, {
			x: 10,
			update: new Laya.Handler(this, updateMove, [tweenObj])
		},
		20,
		Laya.Ease.linearNone,
		Laya.Handler.create(this, tweend, [tweenObj]),
		0);
}

function updateMove(value) {
	let obj = value.val
	if (obj.speed > 0) {

		let box = utl.boxs.get(obj.id)
		box.transform.translate(new Laya.Vector3(0, -obj.speed / 10, 0), true)
	}

}

function tweend(obj) {
	let {
		id,
		position,
		shipEuler,
		roteBody,
		rotationEuler
	} = obj.val
	let player = playerMap.get(id)

	// let box = utl.boxs.get(id)
	// box.transform.position = new Laya.Vector3(position.x,position.y,position.z)
	// box.transform.rotationEuler = new Laya.Vector3(rotationEuler.x,rotationEuler.y,rotationEuler.z)
	// let ship = box.getChildByName('shipmain')

	//    let shipcard = ship.getChildByName('ship')
	//    shipcard.transform.rotationEuler = new Laya.Vector3(shipEuler.x,shipEuler.y,shipEuler.z)

	player.twList.shift()
	if (player.twList.length != 0) {
		drawPlayer(player)
	}

	// tweens.shift()
	// twnFlag = true
	// main()
}

function changeMove(obj) {

	utl.cube.transform.position = new Laya.Vector3(obj.tar.x, 0, obj.tar.z)
	// temp = obj.rote
}

function addInitTween(obj) {
	// obj.sendTime = obj.sendTime
	let id = obj.id
	let tweens = [obj]
	let flag = true
	let messgeTime = 0
	let mapObj = {
		twList: tweens,
		pObj: obj,
		flag,
		timeFlag: true,
		messgeTime,
		lastObj: null
	}
	playerMap.set(id, mapObj)
	return mapObj
}
var temp = null

function fixMessge(list) {
	if (list.length == 0) {
		return
	}
	for (let player of list) {
		// if(player.id==utl.id){
		// 	continue;
		// }
		if (!playerMap.get(player.id)) {
			let obj = addInitTween(player)
			drawPlayer(obj)
		} else {
			let pm = playerMap.get(player.id)
			if (pm.pObj.sendTime < player.sendTime) {
				pm.pObj = player
				pm.pObj.sendTime = player.sendTime
				pm.twList.push(player)
				if (pm.twList.length == 1) {
					drawPlayer(pm)
				}
				// if(!pm.timeFlag){
				// 	if(pm.twList.length>5){
				// 		pm.timeFlag = true
				// 	}
				// }
				// if(pm.twList.length==0){
				// 	pm.timeFlag = false
				// }
			}
		}


	}

}

function onDo() {
	if (utl.fireOnOff) {
		let shipcar = utl.boxs.get('123')
		shipcar.transform.translate(new Laya.Vector3(.1, 0, 0), true)
		// if(utl.sendTime==utl.messgeTime){
		// let ship = utl.box.getChildByName('shipmain')
		// let shipcar = utl.box.getChildByName('shipmain').getChildByName('ship')
		// let shipcar = utl.box
		let sPosition = shipcar.transform.position
		let rotationEuler = shipcar.transform.rotationEuler
		utl.sendTime++
			utl.messgeTime = utl.sendTime
		utl.sendMessage = [{
			id: utl.id,
			position: sPosition,
			sendTime: utl.sendTime,
			type: 'move',
			rotationEuler
		}]

	}
}
export const socketMain = () => {
	// wx.connectSocket({
	//   url: 'ws://192.168.0.101:3000'
	// })
	// wx.onSocketOpen(function(res) {
	//  wx.onSocketMessage((e)=>{
	//  	console.log(e)
	//  })

	// })
	// return
	// utl.socket = io('ws://192.168.11.37:3000');
	utl.socket = io('ws://192.168.0.101:3000');
	utl.socket.on('123456', (s) => {
		utl.mapSp.graphics.clear()
		utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
		for (let player of s.list) {
			for (let rot of player.rots) {

				if (utl.entityMap.has(rot.id)) {
					if (rot.start) {
						utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
						let x = ~~(rot.start.x / 500 * 400)
						let y = ~~(rot.start.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
					}
					else  {
						utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
						let x = ~~(rot.end.x / 500 * 400)
						let y = ~~(rot.end.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
					} 

				} else {
					let map2 = utl.models.get('cube').clone()
					map2.getChildByName('on').active = false
					utl.newScene.addChild(map2);
					utl.entityMap.set(rot.id, map2)
					if (rot.start) {
						utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
						let x = ~~(rot.start.x / 500 * 400)
						let y = ~~(rot.start.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
					}
					else{
						utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
						let x = ~~(rot.end.x / 500 * 400)
						let y = ~~(rot.end.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
					} 
				}
			}
		}
		// let cube = s.list[0].rots[0]
		// utl.entityMap.get(cube.id).transform.position.x = -cube.end.x
		// utl.entityMap.get(cube.id).transform.position.z = cube.end.y
		// if (cube.end) {
		// 	utl.entityMap.get(cube.id).transform.position = new Laya.Vector3(-cube.end.x, 3, cube.end.y)
		// } else {
		// 	utl.entityMap.get(cube.id).transform.position = new Laya.Vector3(-cube.start.x, 3, cube.start.y)
		// }

	});
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}
const creteBox = (sp, erd) => {
	let box = utl.newScene.addChild(sp);
	box.takeSpeed = erd.takeSpeed
	box.speed = {
		z: 0,
		x: 0,
		y: 0
	}
	if (erd.rotation) {
		box.transform.rotation = new Laya.Vector3(erd.rotation.x, erd.rotation.y, erd.rotation.z)
	}
	if (erd.position) {
		box.transform.position = new Laya.Vector3(erd.position.x, erd.position.y, erd.position.z)
	}

	// utl.newScene.addChild(box)
	utl.players.set(erd.id, box)
}
const setBox = (players) => {
	let ps = new Map(players)
	utl.netPlayers = ps
	let bs = utl.players
	if (utl.newScene) {
		for (let k of ps.keys()) {
			let now = bs.get(k)
			let erd = ps.get(k)

			if (now) {
				now.takeSpeed = erd.takeSpeed
				return
				if (erd.position && now.tempPosition) {
					let erdx = {
						x: ~~(erd.position.x * 100),
						y: ~~(erd.position.y * 100),
						z: ~~(erd.position.z * 100)
					}
					now.tempPositions.push(erdx)

				}
				if (erd.rotation && now.tempRotation) {
					let erdx = {
						x: ~~(erd.rotation.x * 100),
						y: ~~(erd.rotation.y * 100),
						z: ~~(erd.rotation.z * 100)
					}
					now.tempRotations.push(erdx)
				}

			} else {
				if (erd.id == utl.userId) {
					Laya.Sprite3D.load("res/t2/LayaScene_fff/Conventional/f.lh", Laya.Handler.create(null, (sp) => {
						creteBox(sp, erd)
					}));
				} else {
					let box4 = utl.box4.clone();
					creteBox(box4, erd)
				}

			}
		}
	}

}