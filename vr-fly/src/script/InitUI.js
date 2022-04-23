/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
  import utl from "./utl.js"
export default class InitUI extends Laya.Scene {
    constructor() {
        super();
        this.loadScene("test/init.scene");
        this.info = new Laya.Text();
        this.info.fontSize = 50;
        this.info.color = "#FFFFFF";
        this.info.size(Laya.stage.width, Laya.stage.height);
        this.info.x = Laya.stage.width/2
        this.info.y = 380
       Laya.stage.addChild(this.info);
    }

    
}