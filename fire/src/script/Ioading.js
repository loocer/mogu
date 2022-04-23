/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
  import utl from "./utl.js"
  import {loadFile} from "./common"
  
  let fileLangth = 0

export default class InitUI extends Laya.Scene {
    constructor() {
        super();
        this.loadScene("test/load.scene");
        

        this.boxLangth = 3;
        this.boxedLangth = 0;

        let scene = new Laya.Scene3D();
        Laya.stage.addChild(scene);
        this.createText();
        this.doLoad();
        //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
        this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
        
        //相机设置清楚标记,使用固定颜色
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        //使用默认的颜色
        //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
        //设置摄像机视野范围（角度）
        this.camera.fieldOfView = 45;
        //为相机添加视角控制组件(脚本)
        scene.addChild(this.camera);
        
        // //添加平行光
        // let directionLight = new Laya.DirectionLight();
        // scene.addChild(directionLight);
        // //设置平行光颜色
        // directionLight.color = new Laya.Vector3(1, 1, 1);
        // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
        



        let sprited = new Laya.Sprite3D();
        scene.addChild(sprited);
        //正方体
        let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
        sprited.addChild(box1);
        
        box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
       




        let sprite = new Laya.Sprite3D();
        scene.addChild(sprite);
        //正方体
        let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31)
        this.box = new Laya.MeshSprite3D(tem);
        sprite.addChild(this.box);
        //  var material = new Laya.BlinnPhongMaterial();
        // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
        //         material.albedoTexture = tex;
        // }));
        // this.box.meshRenderer.material = material;

        let scale = new Laya.Vector3(0, 1, 1);
        this.box.transform.localScale = scale;
        let scale1 = new Laya.Vector3(1, 1, 1);
        this.box.transform.localScale = scale1;
        this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
       
    }
    downLoadSprite3D(load){
        return new Promise((resolve, reject)=>{
            Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                console.log(load[0])
                let index = utl.playStatusObj.doingIndex
                utl.models.set(load[0],sp)
                ++utl.loadIndex
                this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length)
                this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                this.box.transform.localScale = scale;
                let material = new Laya.BlinnPhongMaterial();
                material.albedoColor=new Laya.Vector3(1,5,1);
                material.diffuseColor=new Laya.Vector3(1,5,1);
                this.box.meshRenderer.material = material;
                this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                if(this.boxedLangth==1){
                    this.removeSelf();
                    // Laya.stage.addChild(GameUI);
                    Laya.Scene.open(`test/game${index}.scene`)
                }
                resolve();
            }));
        })
    }
    downLoad(load){
        return new Promise((resolve, reject)=>{
            Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                let index = utl.playStatusObj.doingIndex
                utl.models.set(load[0],texture)
                ++utl.loadIndex
                this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length)
                this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                this.box.transform.localScale = scale;
                let material = new Laya.BlinnPhongMaterial();
                material.albedoColor=new Laya.Vector3(1,5,1);
                material.diffuseColor=new Laya.Vector3(1,5,1);
                this.box.meshRenderer.material = material;
                this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                if(this.boxedLangth==1){
                    this.removeSelf();
                    // Laya.stage.addChild(GameUI);
                    // Laya.Scene.open('test/main.scene')
                    Laya.Scene.open(`test/game${index}.scene`)
                }
                resolve();
            }));
        })
    }
    doLoad(){
        utl.loadIndex = 0
        let index = utl.playStatusObj.doingIndex
        let load3D = loadFile[index-1]
        console.log(load3D,utl.loadingSprite3D)
        fileLangth = load3D.length

        for(let obj of load3D){
            this.downLoadSprite3D(obj)
        }
        for(let objElse of utl.loadingElse){
            this.downLoad(objElse)
        }
    }
    createText() {
        const 
            Text = Laya.Text;
        
        this.txt = new Text();
        Laya.stage.addChild(this.txt);
        //给文本的text属性赋值
        this.txt.text = "正在加载0";
        //设置宽度，高度自动匹配
        this.txt.width = 400;
        //自动换行
        this.txt.wordWrap = true;

        this.txt.align = "center";
        this.txt.fontSize = 40;
        this.txt.font = "Microsoft YaHei";
        this.txt.color = "#1aff00";
        this.txt.bold = true;
        this.txt.leading = 5;

        // //设置描边属性
        // txt.stroke = 10;
        // txt.strokeColor = "#00ffc6";

        // txt.borderColor = "#00ffc6";

        this.txt.x = (Laya.stage.width - this.txt.width) / 2;
        this.txt.y = (Laya.stage.height - this.txt.textHeight) / 2 + 100;
    }
    
}
