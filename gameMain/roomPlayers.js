var ZhajinhuaPlayer=require('./player');
const stepType = {
	ON_START : 'ON_START',
	SHOW_VALUE : 'SHOW_VALUE',
	GAME_PASS : 'GAME_PASS',
	RAISE: 'RAISE'
}
const acType = {
	ON_READY : 'ON_READY',
	OK_READY : 'OK_READY',
	DEAL_PLAYING : 'DEAL_PLAYING',
	PK_PLAYERS: 'PK_PLAYERS'
}
var playerStatus = {
	SHOW : 'SHOW',
	PASS : 'PASS',
	RAISE: 'RAISE',
	SOHA : 'SOHA'
}
const AllPosations = {
	TYPE_TWO:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_THREE:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_FUOR:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_FIVE:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_SIX:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_SEVEN:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
	TYPE_EIGHT:[{x:0,y:0,z:0},{x:0,y:0,z:0}],
}
class roomPlayers{
	constructor({id,peopleNum}){
		this.id = id
		this.peopleNum = peopleNum
		this.stepType = stepType.ON_READY
		this.status = true
		this.raiseMoney = 1
		this.totalRaiseMoney = 0
		this.fireId = null
		this.sendObj = null
		this.readys = []
		this.players = []
	}
	receiveMsg(msgObj){
 		if(msgObj.acType === acType.ON_START){
 			if(this.peopleNum===this.players.length){
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

	setPokersValue(){
		function getRandomArrayElements(arr, count) {
		    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
		    while (i-- > min) {
		        index = Math.floor((i + 1) * Math.random());
		        temp = shuffled[index];
		        shuffled[index] = shuffled[i];
		        shuffled[i] = temp;
		    }
		    return shuffled.slice(min);
		}
		var items = [];
		for(let num = 1;num<53;num++){
			items.push(num)
		}
		for(let p in this.players){
			this.players[p].pokerValue = getRandomArrayElements(items, 3)
		}
	}
	showValue(playId){
		for(let p in this.players){
			if(this.players[p].id ==playId){
				this.players[p].status = playerStatus.RAISE
			}
		}
	}
	
	onRaise(msgObj){
		for(let p in this.players){
			if(this.players[p].id ==msgObj.playId){
				this.players[p].status = playerStatus.RAISE
				this.raiseMoney = msgObj.raiseMoney
				this.players[p].raiseMoney = msgObj.raiseMoney
				this.totalRaiseMoney += msgObj.raiseMoney
			}
		}
	}
	onPass(msgObj){
		for(let p in this.players){
			if(this.players[p].id ==msgObj.playId){
				this.players[p].status = playerStatus.PASS
			}
		}
	}
	_getAcPlayer(acObj){
		for(let p in this.player){
			if(this.player[p].id = acObj.id){
				return this.player[p]
			}
		}
	}
	_pkPlayers(o1,o2){

	}
	_checkStatus(){
		var count = 0
		for(let p in this.player){
			if(this.player[p].gameStatus = true){
				count++
			}
		}
		this.status = count > 1 ? true:false
	}
	addPlayer(id){
		var player = new ZhajinhuaPlayer(id)
		this.players.push(player)
	}
	initPlayerDate(){
		function setDatas(posations){
			for(let p in posations){
				this.player[p].setPosation(posations.p)
			}
		}
		switch (this.players.length) {
		  case 2:
		    setDatas(AllPosations.TYPE_TWO)
		   	break;
		  case 3:
		  	setDatas(AllPosations.TYPE_THREE)
		    break;
		  case 4:
		    setDatas(AllPosations.TYPE_FUOR)
		    break;
		  case 5:
		  	setDatas(AllPosations.TYPE_FIVE)
		    break;
		  case 6:
		  	setDatas(AllPosations.TYPE_SIX)
		    break;
		  case 7:
		    setDatas(AllPosations.TYPE_SEVEN)
		    break;
		  case 8:
		    setDatas(AllPosations.TYPE_EIGHT)
		    break;
		}
	}
	getDeal(){
		var values = getValues()
		for(let p in this.player){
			for(let v in values){
				this.player[p].setPokerValue(values[v])
			}
		}
	}
	playAnction(acObj){
		this.stepType = acObj.stepTypeValue
		this.fireId = acObj.fireId
		if(acObj.stepTypeValue === stepType.ON_READY){
			this.addPlayer(acObj.id)
		}
		if(acObj.stepTypeValue === stepType.OK_READY){
			this.initPlayerDate()
			this.getDeal()
		}
		if(acObj.stepTypeValue === stepType.DEAL_PLAYING){
			var acPlayer = this._getAcPlayer(acObj)
			acPlayer.raiseStatus = acObj.raiseStatus
			acPlayer.raiseMoney = acObj.raiseMoney
			acObj.raiseStatus && (this.totalRaiseMoney+= acObj.raiseMoney)
		}
		if(acObj.stepTypeValue === stepType.PK_PLAYERS){
			acObj.raiseStatus && (this.totalRaiseMoney+= acObj.raiseMoney)
			this._pkPlayers(acObj.o1,acObj.o2)
			this._checkStatus()
		}
	}
}
module.exports=roomPlayers