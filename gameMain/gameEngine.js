// var gameObj=require('./serverGameMain');
var RoomPlayers = require('./roomPlayers');
var rooms=require('./rooms');
var frontRoomPlayers = {}
const acType = {
	ON_READY : 'ON_READY',
	ON_START : 'ON_START',
	SHOW_VALUE : 'SHOW_VALUE',
	GAME_PASS : 'GAME_PASS',
	GAME_PK : 'GAME_PK',
	RAISE: 'RAISE'
}
function main(msg){
	console.log(msg)
	for(let i in rooms){
		if(rooms[i].id == msg.roomId){
			let sendObj = null
			if(msg.acType === acType.ON_READY){
 				for(let p in rooms[i].players){
 					rooms[i].players[p].isEnable = true
 				}
 				frontRoomPlayers.acType = acType.ON_READY
	 			frontRoomPlayers.playerId = msg.playerId
 				sendObj = {acType:acType.ON_READY,roomPlayers:rooms[i],backObj:frontRoomPlayers}
		 	}
			if(msg.acType === acType.ON_START){
	 			if(rooms[i].peopleNum===rooms[i].players.length){
	 				rooms[i].setPokersValue()
	 				sendObj = {acType:acType.ON_START,allow:true,roomPlayers:rooms[i]}
	 			}else{
	 				sendObj = {acType:acType.ON_START,allow:false}
	 			}
		 	}
	 		if(msg.acType === acType.SHOW_VALUE){
	 			rooms[i].showValue(msg.playerId)
	 			frontRoomPlayers.acType = acType.SHOW_VALUE
	 			frontRoomPlayers.playerId = msg.playerId
	 			sendObj = {acType:acType.SHOW_VALUE,roomPlayers:rooms[i],backObj:frontRoomPlayers}
	 		}
	 		if(msg.acType === acType.GAME_PK){
	 			frontRoomPlayers.acType = acType.GAME_PK
	 			frontRoomPlayers.playerId = msg.playerId
	 			frontRoomPlayers.raiseMoney = msg.raiseMoney
	 			rooms[i].onRaise(msg)
	 			sendObj = {acType:acType.RAISE,roomPlayers:rooms[i],backObj:frontRoomPlayers}
	 		}
	 		if(msg.acType === acType.RAISE){
	 			frontRoomPlayers.acType = acType.RAISE
	 			frontRoomPlayers.playerId = msg.playerId
	 			frontRoomPlayers.raiseMoney = msg.raiseMoney
	 			rooms[i].onRaise(msg)
	 			sendObj = {acType:acType.RAISE,roomPlayers:rooms[i],backObj:frontRoomPlayers}
	 		}
	 		if(msg.acType === acType.GAME_PASS){
	 			frontRoomPlayers.acType = acType.GAME_PASS
	 			frontRoomPlayers.playerId = msg.playerId
	 			rooms[i].onPass(msg)
	 			sendObj = {acType:acType.GAME_PASS,roomPlayers:rooms[i],backObj:frontRoomPlayers}
	 		}
	 		return sendObj
		}
	}
}
module.exports=main