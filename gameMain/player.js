var acType = {
	SHOW : 'SHOW',
	PASS : 'PASS',
	RAISE: 'RAISE',
	SOHA : 'SOHA'
}
class player{
	constructor(id){
		this.id = id
		this.isMain = false
		this.isEnable = false
		this.status = acType.RAISE
		this.posation = {x:0,y:0,z:0}
		this.isAction = true,//it is protagonist
		this.gameStatus = true,//is disabled
		this.raiseStatus = true,//true is going,false is not going
		this.pokerValue = [],
		this.raiseMoney = 200
	}
	setPosation(P){
		this.posation = P
	}
	getPosation(){
		return this.posation
	}
	setPokerValue(val){
		this.pokerValue = val
	}
}
module.exports=player