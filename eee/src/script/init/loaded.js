export default class ImageRunTime extends Laya.Image{
    constructor(){
            super();
            this.width= Laya.stage.width*.7
            this.height = 50
            this.x = (Laya.stage.width - this.width)/2
            this.y = 300
        }
}