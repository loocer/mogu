var gameObj=require('./serverGameMain');
var RoomPlayers = require('./roomPlayers');
var rooms=require('./rooms');
const acType = {
	ON_READY : 'ON_READY',
	OK_READY : 'OK_READY',
	DEAL_PLAYING : 'DEAL_PLAYING',
	PK_PLAYERS: 'PK_PLAYERS'
}
function main(msg){
	for(let i in rooms){
		if(rooms[i].id == msg.roomId){
			if(msgObj.acType === acType.ON_START){
	 			if(this.peopleNum===this.players.length){
	 				rooms[i].setPokersValue()
	 				this.sendObj = {acType:acType.ON_START,allow:true}
	 			}else{
	 				this.sendObj = {acType:acType.ON_START,allow:false}
	 			}
		 	}
	 		if(msgObj.acType === acType.SHOW_VALUE){
	 			this.sendObj = {acType:acType.SHOW_VALUE}
	 		}
	 		if(msgObj.acType === acType.GAME_PASS){
	 			this.sendObj = {acType:acType.GAME_PASS}
	 		}
	 		if(msgObj.acType === acType.RAISE){
	 			this.sendObj = {acType:acType.RAISE,amount:msgObj.amount}
	 		}
	 		if(msgObj.acType === acType.RAISE){
	 			this.sendObj = {acType:acType.RAISE,amount:msgObj.amount}
	 		}
		}
	}
}
module.exports=main