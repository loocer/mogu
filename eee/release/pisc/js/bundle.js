(function () {
  'use strict';

  var utl = {
    tachLeftFlag: false,
    //左边点击
    tachRightFlag: false,
    //左边点击
    box: null,
    userId: Date.parse(new Date()) + '',
    models: new Map(),
    box4: null,
    speedMove: 0.1,
    speed: {
      z: 0,
      x: 0,
      y: 0
    },
    c1: null,
    c2: null,
    walkingDirection: 1,
    //1：up,2:down,3:left,4:right
    netPlayers: null,
    takeSpeed: {
      z: 0,
      x: 0,
      y: 0
    },
    entity: new Map(),
    operationYype: 1,
    //1:虚拟手柄 2:屏幕方向
    loadIndex: 0,
    fireOnOff: false,
    firs: [],
    loadingElse: [['cotrll', 'https://xuxin.love/img/fly/controll.png'], ['tdf', 'https://xuxin.love/img/fly/u=3199317496,3290195022&fm=26&gp=0.jpg'], ['fire', 'https://xuxin.love/img/fly/fire.png']],
    loadingSprite3D: [// ['light','res/LayaScene/Conventional/light.lh'],
    // ['pler','res/LayaScene/Conventional/pler.lh'],
    // ['cube','res/LayaScene/Conventional/Sphere.lh'],
    // ['aum','res/LayaScene/Conventional/aum.lh'],
    // ['sun','res/LayaScene/Conventional/sun.lh'],
    // ['bullet','res/LayaScene/Conventional/b.lh'],
    ['light', 'https://xuxin.love/img/fly/LayaScene/Conventional/light.lh'], ['pler', 'https://xuxin.love/img/fly/LayaScene/Conventional/pler.lh'], ['cube', 'https://xuxin.love/img/fly/LayaScene/Conventional/Sphere.lh'], ['aum', 'https://xuxin.love/img/fly/LayaScene/Conventional/aum.lh'], ['sun', 'https://xuxin.love/img/fly/LayaScene/Conventional/sun.lh'], ['bullet', 'https://xuxin.love/img/fly/LayaScene/Conventional/b.lh']],
    getAngle: (x, y) => {
      var l = Math.sqrt(x * x + y * y);
      var a = Math.acos(x / l);
      var ret = a * 180 / Math.PI; //弧度转角度，方便调试

      if (y < 0) {
        return 360 - ret;
      }

      return ret;
    }
  };
  /**
   * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
   * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
   * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
   */

  class InitUI extends Laya.Scene {
    constructor() {
      super();
      this.loadScene("test/init.scene");
      this.info = new Laya.Text();
      this.info.fontSize = 50;
      this.info.color = "#FFFFFF";
      this.info.size(Laya.stage.width, Laya.stage.height);
      this.info.x = Laya.stage.width / 2;
      this.info.y = 380;
      Laya.stage.addChild(this.info);
    }

  }
  /**
   * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
   * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
   * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
   */


  class InitUI$1 extends Laya.Scene {
    constructor() {
      super();
      this.loadScene("test/load.scene");
      this.boxLangth = 3;
      this.boxedLangth = 0;
      let scene = new Laya.Scene3D();
      Laya.stage.addChild(scene);
      this.createText();
      this.doLoad(); //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪

      this.camera = new Laya.Camera(0, 0.1, 100);
      this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
      this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false); //相机设置清楚标记,使用固定颜色

      this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR; //使用默认的颜色
      //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
      //设置摄像机视野范围（角度）

      this.camera.fieldOfView = 45; //为相机添加视角控制组件(脚本)

      scene.addChild(this.camera); // //添加平行光
      // let directionLight = new Laya.DirectionLight();
      // scene.addChild(directionLight);
      // //设置平行光颜色
      // directionLight.color = new Laya.Vector3(1, 1, 1);
      // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

      let sprited = new Laya.Sprite3D();
      scene.addChild(sprited); //正方体

      let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
      sprited.addChild(box1);
      box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
      let sprite = new Laya.Sprite3D();
      scene.addChild(sprite); //正方体

      let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31);
      this.box = new Laya.MeshSprite3D(tem);
      sprite.addChild(this.box);
      var material = new Laya.BlinnPhongMaterial();
      Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function (tex) {
        material.albedoTexture = tex;
      }));
      this.box.meshRenderer.material = material;
      let scale = new Laya.Vector3(0, 1, 1);
      this.box.transform.localScale = scale;
      let scale1 = new Laya.Vector3(1, 1, 1);
      this.box.transform.localScale = scale1;
      this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
    }

    downLoadSprite3D(load) {
      return new Promise((resolve, reject) => {
        Laya.Sprite3D.load(load[1], Laya.Handler.create(null, sp => {
          utl.models.set(load[0], sp);
          ++utl.loadIndex;
          this.boxedLangth = utl.loadIndex / (utl.loadingSprite3D.length + utl.loadingElse.length);
          this.txt.text = "正在加载" + ~~(utl.loadIndex / (utl.loadingSprite3D.length + utl.loadingElse.length) * 100) + '%';
          let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
          this.box.transform.localScale = scale;
          this.box.transform.position = new Laya.Vector3(-this.boxLangth / 2 + this.boxedLangth * 3 / 2, 0.0, 2);

          if (this.boxedLangth == 1) {
            this.removeSelf();
            Laya.Scene.open('test/main.scene');
          }

          resolve();
        }));
      });
    }

    downLoad(load) {
      return new Promise((resolve, reject) => {
        Laya.loader.load(load[1], Laya.Handler.create(this, function (texture) {
          utl.models.set(load[0], texture);
          ++utl.loadIndex;
          this.boxedLangth = utl.loadIndex / (utl.loadingSprite3D.length + utl.loadingElse.length);
          this.txt.text = "正在加载" + ~~(utl.loadIndex / (utl.loadingSprite3D.length + utl.loadingElse.length) * 100) + '%';
          let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
          this.box.transform.localScale = scale;
          this.box.transform.position = new Laya.Vector3(-this.boxLangth / 2 + this.boxedLangth * 3 / 2, 0.0, 2);

          if (this.boxedLangth == 1) {
            this.removeSelf();
            Laya.Scene.open('test/main.scene');
          }

          resolve();
        }));
      });
    }

    doLoad() {
      utl.loadIndex = 0;

      for (let obj of utl.loadingSprite3D) {
        this.downLoadSprite3D(obj);
      }

      for (let objElse of utl.loadingElse) {
        this.downLoad(objElse);
      }
    }

    createText() {
      const Text = Laya.Text;
      this.txt = new Text();
      Laya.stage.addChild(this.txt); //给文本的text属性赋值

      this.txt.text = "正在加载0"; //设置宽度，高度自动匹配

      this.txt.width = 400; //自动换行

      this.txt.wordWrap = true;
      this.txt.align = "center";
      this.txt.fontSize = 40;
      this.txt.font = "Microsoft YaHei";
      this.txt.color = "#1aff00";
      this.txt.bold = true;
      this.txt.leading = 5; // //设置描边属性
      // txt.stroke = 10;
      // txt.strokeColor = "#00ffc6";
      // txt.borderColor = "#00ffc6";

      this.txt.x = (Laya.stage.width - this.txt.width) / 2;
      this.txt.y = (Laya.stage.height - this.txt.textHeight) / 2 + 100;
    }

  }

  class newtach {
    constructor() {
      this.scaleTime = 100;
      this.width = Laya.stage.width / 2;
      this.height = Laya.stage.height;
      this.x = Laya.stage.width / 2;
      this.y = 0;
      this.moveX = 0;
      this.moveY = 0;
      this.tx = Laya.stage.width - 150;
      this.twidth = 100;
      this.theight = 600;
      this.ty = Laya.stage.height - 650;
      this.flag = false;
      console.log(this.maind);
    }

    outEvent() {
      utl.tachLeftFlag = false;
    }

    scaleBig(e) {
      console.log('MOUSE_UP');
      utl.tachLeftFlag = false; //变大还原的缓动效果

      utl.moveX = 0;
      utl.moveY = 0;
      utl.takeSpeed.x = 0;
      utl.takeSpeed.y = 0; // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
    }

    scaleSmall(x, y) {
      if (this.tx < x && x < this.tx + this.twidth && this.ty < y && y < this.ty + this.theight) {
        return true;
      } else {
        return false;
      } //缩小至0.8的缓动效果
      // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);

    }

    getRoteImg(pobj) {
      let rotate = 0;

      if (pobj.x1 == pobj.x2) {
        rotate = 0;
      }

      if (pobj.x1 > pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
      } else if (pobj.x1 < pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
      }

      return rotate;
    }

    leftFormatMovePosition(px, py) {
      // utl.ani.play("hello");
      // let pobj = {}
      // pobj.y = (py - this.ty) / this.theight
      utl.speedMove = (py - this.ty) / this.theight; // utl.takeSpeed.y = py - this.ty - this.theight/2
      // utl.box.transform.rotate(new Laya.Vector3(0,utl.rote* Math.PI / 180, 0), true);
      // utl.rote = this.getRoteImg(pobj) 
      // // tools.getRoteImg(pobj, databus.leftPositions)
      // let r = 1 / Math.sqrt((pobj.x1 - pobj.x2) * (pobj.x1 - pobj.x2) + (pobj.y1 - pobj.y2) * (pobj.y1 - pobj.y2))
      // utl.moveX = (pobj.x1 - pobj.x2) * r /10
      // utl.moveY = (pobj.y1 - pobj.y2) * r/10
      // utl.box.transform.rotate(new Laya.Vector3(0,-utl.rote* Math.PI / 180,0), true);
      // console.log(this.moveX,this.moveY,utl.box.transform.position)
    }

  }

  class newTwo {
    constructor() {
      this.scaleTime = 100;
      this.width = Laya.stage.width / 2;
      this.height = Laya.stage.height;
      this.x = 0;
      this.y = 0;
      this.moveX = 0;
      this.moveY = 0;
      this.tx = 200;
      this.twidth = 300;
      this.theight = 300;
      this.ty = Laya.stage.height - 500;
    }

    scaleBig(e) {
      utl.takeSpeed.z = 0;
      console.log('MOUSE_UP');
      utl.tachRightFlag = false; // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
    }

    outEvent() {
      utl.tachRightFlag = false;
    }

    scaleSmall(x, y) {
      if (x < this.width) {
        return true;
      } else {
        return false;
      } //缩小至0.8的缓动效果
      // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);

    }

    getRoteImg(pobj) {
      let rotate = 0;

      if (pobj.x1 == pobj.x2) {
        rotate = 0;
      }

      if (pobj.x1 > pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
      } else if (pobj.x1 < pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
      }

      return rotate;
    }

    leftFormatMovePosition(px, py) {
      // utl.ani.play("hello");
      let pobj = {};
      let tempx = 0;
      let tempy = 0;
      pobj.x1 = px; //点击

      pobj.x2 = this.tx + this.twidth / 2;
      pobj.y1 = py;
      pobj.y2 = this.ty + this.theight / 2;

      if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) > 1) {
        tempx = 1;
      } else {
        tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
      }

      if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) < -1) {
        tempx = -1;
      } else {
        tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
      }

      if ((py - this.ty - this.theight / 2) / (this.theight / 2) > 1) {
        tempy = 1;
      } else {
        tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
      }

      if ((py - this.ty - this.theight / 2) / (this.theight / 2) < -1) {
        tempy = -1;
      } else {
        tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
      }

      utl.takeSpeed.x = tempy * 20;
      utl.takeSpeed.y = -tempx * 45;
    }

  }

  class fire {
    constructor() {
      this.scaleTime = 100;
      this.width = 150;
      this.height = 150;
      this.x = Laya.stage.width - 250;
      this.y = Laya.stage.height - 250;
      this.moveX = 0;
      this.moveY = 0;
      this.tx = Laya.stage.width / 4;
      this.twidth = 400;
      this.theight = 400;
      this.ty = Laya.stage.height - 500;
    }

    scaleBig(e) {
      utl.takeSpeed.z = 0;
      console.log('MOUSE_UP');
      utl.tachRightFlag = false; // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
    }

    outEvent() {
      utl.tachRightFlag = false;
    }

    scaleSmall(x, y) {
      if (x < this.width + this.x && x > this.x && y > this.y && y < this.y + this.height) {
        return true;
      } else {
        return false;
      } //缩小至0.8的缓动效果
      // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);

    }

    getRoteImg(pobj) {
      let rotate = 0;

      if (pobj.x1 == pobj.x2) {
        rotate = 0;
      }

      if (pobj.x1 > pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
      } else if (pobj.x1 < pobj.x2) {
        let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
        rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
      }

      return rotate;
    }

    leftFormatMovePosition(px, py) {
      utl.fireOnOff = true;
    }

  }

  class Bullet extends Laya.Script3D {
    constructor() {
      super();
      this.tempy = 0;
      this.box = null;
      this.time = 0;
      this.speed = new Laya.Vector3();
    }

    onAwake() {
      //得到3D对象
      this.box = this.owner;
      utl.firs.push(this); // this.findIt()
    }

    findIt() {
      let bV3 = new Laya.Vector3();
      Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
      let speed = new Laya.Vector3();
      Laya.Vector3.normalize(bV3, speed); // Laya.Vector3.scale(speed, .1, this.speed);

      let speedLanth = Laya.Vector3.scalarLength(this.speed); // // let temp = new Laya.Vector3(0,0,utl.speedMove

      let lspeed = (utl.speedMove + .1).toFixed(2); // // let scale = (utl.speedMove + lspeed)/lspeed
      // // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);

      Laya.Vector3.scale(speed, .1, this.speed);
      utl.info.text = Laya.Vector3.scalarLength(this.speed) - utl.speedMove + "," + utl.speedMove + ',' + Laya.Vector3.scalarLength(this.speed);
      utl.firs.push(this);
    }

    _load() {
      this.box = this.owner;
      let bV3 = new Laya.Vector3();
      Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
      let speed = new Laya.Vector3();
      Laya.Vector3.normalize(bV3, speed);
      Laya.Vector3.scale(speed, .01, this.speed); // let speedLanth = Laya.Vector3.scalarLength(this.speed) 
      // // // let temp = new Laya.Vector3(0,0,utl.speedMove
      // let lspeed = (utl.speedMove + speedLanth)/speedLanth
      // // // let scale = (utl.speedMove + lspeed)/lspeed
      // // // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
      // Laya.Vector3.scale(this.speed, lspeed, this.speed);
      // console.log(Laya.Vector3.scalarLength(this.speed))
      // Laya.timer.loop(30,this,this.onUpdatef);
    } // onAwake() {
    // 	this.box = this.owner;
    // 	if(utl.c1&&utl.c2){
    // 		let bV3 = new Laya.Vector3();
    //        	Laya.Vector3.subtract(utl.c2.transform.position, utl.c1.transform.position, bV3);
    // 		let speed = new Laya.Vector3();
    // 		Laya.Vector3.normalize(bV3,speed);
    // 		Laya.Vector3.scale(speed, .15, this.speed);
    // 		// let speedLanth = Laya.Vector3.scalarLength(this.speed) 
    // 		// // // let temp = new Laya.Vector3(0,0,utl.speedMove
    // 		// let lspeed = (utl.speedMove + speedLanth)/speedLanth
    // 		// // // let scale = (utl.speedMove + lspeed)/lspeed
    // 		// // // this.speed =   new Laya.Vector3(speed.x,speed.y,speed.z+utl.speedMove);
    // 		// Laya.Vector3.scale(this.speed, lspeed, this.speed);
    // 		// console.log(Laya.Vector3.scalarLength(this.speed))
    // 		Laya.timer.loop(30,this,this.onUpdatef);
    // 	}
    // }


    toTiome() {
      this.time++;

      if (!this.box.destroyed) {
        // let vx = utl.box.transform.position.x - this.box.transform.position.x 
        // let vy = utl.box.transform.position.y - this.box.transform.position.y 
        // let vz = utl.box.transform.position.z - this.box.transform.position.z
        // let ry = utl.getAngle(vx,vz)
        // this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
        // this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
        // this.tempy = ry
        // this.box.transform.translate(this.speed,false)
        this.box.transform.translate(new Laya.Vector3(0, 0, utl.speedMove + .5), true);

        if (this.time > 200) {
          this.box.destroy();
        }
      }
    }

    onStart() {}

    onTriggerEnter() {
      this.box.removeSelf();
      console.log("bu--onTriggerEnter");
    }

    onTriggerStay() {
      console.log("bu--onTriggerStay");
    }

    onTriggerExit() {
      console.log("bu--onTriggerExit");
    }

    onEnable() {}

    onDisable() {}

  }

  class Enemy extends Laya.Script3D {
    constructor() {
      super();
      this.isAttacked = false;
      this.tempy = 0;
      this.box = null;
      this.life = 60;
      this.time = 0;
      this.speed = new Laya.Vector3(); // Laya.timer.loop(30,this,this.onUpdate);
      // Laya.timer.loop(10,this,this.onFind);
    }

    onAwake() {
      this.box = this.owner;
      this.onFind();
    }

    onFind() {
      if (utl.box) {
        let bV3 = new Laya.Vector3();
        Laya.Vector3.subtract(utl.box.transform.position, this.box.transform.position, bV3);
        Laya.Vector3.normalize(bV3, this.speed); // let scale =  utl.speedMove/10 + 1
        // Laya.Vector3.scale(this.speed, scale, this.speed);
      }
    }

    onUpdate() {
      this.time++; // let vx = utl.box.transform.position.x - this.box.transform.position.x 
      // let vy = utl.box.transform.position.y - this.box.transform.position.y 
      // let vz = utl.box.transform.position.z - this.box.transform.position.z
      // let ry = utl.getAngle(vx,vz)
      // console.log(ry)
      // this.box.transform.rotate(new Laya.Vector3(0,-this.tempy* Math.PI / 180,0), true);
      // this.box.transform.rotate(new Laya.Vector3(0,ry* Math.PI / 180,0), true);
      // this.tempy = ry
      // this.box.transform.translate(this.speed,false)
      // if(this.time==1000 ){
      // 	this.box.removeSelf();
      // }

      if (this.isAttacked) {
        //根据击退方向和速度移动
        this.box.transform.translate(this.repelledV3, false); // console.log("击退位置变化：",(this.cube.transform.position.clone()).elements);
        //击退速度逐步减小

        Laya.Vector3.scale(this.repelledV3, 0.3, this.repelledV3); //当后退各方向速度小于0.01时，击退状态停止

        if (Laya.Vector3.scalarLength(this.repelledV3) < 0.01) {
          this.isAttacked = false;
        }
      }
    }

    onStart() {}

    onTriggerEnter(other) {
      this.box.removeSelf();
      let sp3D = other.owner; //获取子弹对象模型脚本

      let script = sp3D.getComponents(Bullet); //获取子弹速度为

      this.repelledV3 = script[0].speed.clone(); //被攻击速度归一化成单位一向量

      Laya.Vector3.normalize(this.repelledV3, this.repelledV3); //设置为被攻击状态

      this.isAttacked = true;
      console.log("\n1 子弹碰撞时位置(方向):", sp3D.transform.position.elements);
      console.log("en--nTriggerEnter");
    }

    onTriggerStay() {
      console.log("en--onTriggerStay");
    }

    onTriggerExit() {
      this.life -= 20;

      if (this.life <= 0) {
        this.enable = false;
        Laya.timer.frameOnce(1, this, function () {
          this.owner.destroy();
        });
      }

      console.log("en--onTriggerExit");
    }

    onEnable() {}

    onDisable() {}

  }

  let address = 'http://172.16.25.101:3000';
  let HttpRequest = Laya.HttpRequest;
  let Event = Laya.Event;
  let result = {};
  let temfe = {
    x: 1
  };

  const login = () => {
    let obj = {};
    let hr = new HttpRequest();
    let id = utl.userId; // let id = 435

    function onHttpRequestProgress(e) {
      console.log(e);
    }

    function onHttpRequestComplete(e) {
      result.userInfo = JSON.parse(hr.data).data;
      console.log(66666, result);
      intoRoom();
    }

    function onHttpRequestError(e) {
      console.log(e);
    }

    hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    hr.once(Event.ERROR, undefined, onHttpRequestError);
    hr.send(address + '/login', 'name=fef&id=' + id, 'post', 'text');
  };

  const getServiceAddress = () => {
    let hr = new HttpRequest();

    function onHttpRequestProgress(e) {
      console.log(123);
    }

    function onHttpRequestComplete(e) {
      result.serviceAddress = JSON.parse(hr.data).data;
      login();
      console.log(3458888, result);
    }

    function onHttpRequestError(e) {
      console.log(534543, e);
    }

    hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    hr.once(Event.ERROR, undefined, onHttpRequestError);
    hr.send(address + '/get-socketAddress', '', 'get', 'text');
  };

  const intoRoom = () => {
    // Laya.Sprite3D.load("res/t2/LayaScene_fff/Conventional/f.lh", Laya.Handler.create(null, (sp)=> {
    //            let layaMonkey1 = utl.newScene.addChild(sp);
    //            layaMonkey1.transform.position =new Laya.Vector3(0,3,0)
    //            // layaMonkey1.transform.rotate(new Laya.Vector3(90* Math.PI / 180,0, 0), true);
    //            utl.box = layaMonkey1
    //            utl.players.set(utl.userId,layaMonkey1)
    //    }));
    let headers = ["Content-Type", "application/x-www-form-urlencoded", 'token', result.userInfo.token, 'user_id', result.userInfo.id];
    let hr = new HttpRequest();

    function onHttpRequestProgress(e) {
      console.log(123);
    }

    function onHttpRequestComplete(e) {
      socketMain();
      console.log(888888888, hr);
    }

    function onHttpRequestError(e) {
      console.log(534543, e);
    }

    hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
    hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
    hr.once(Event.ERROR, undefined, onHttpRequestError);
    hr.send(address + '/into-room?roomNo=123', null, 'get', 'text', headers);
  };

  const socketMain = () => {
    // 	let byte = new Laya.Byte();
    // 	let socket = new Laya.Socket();
    // 	function openHandler(e){
    // 	console.log(123)
    // }
    // function receiveHandler(e){
    // 	console.log(888888888,hr)
    // }
    // function closeHandler(e){
    // 	console.log(534543,e)
    // }
    // function errorHandler(e){
    // 	console.log(534543,e)
    // }
    //    //这里我们采用小端
    //   	socket.endian = Laya.Byte.LITTLE_ENDIAN;
    //        //建立连接
    //    socket.connectByUrl(result.serviceAddress);
    //    socket.on(Laya.Event.OPEN, this, openHandler);
    //    socket.on(Laya.Event.MESSAGE, this, receiveHandler);
    //    socket.on(Laya.Event.CLOSE, this, closeHandler);
    //    socket.on(Laya.Event.ERROR, this, errorHandler);
    utl.socket = io(result.serviceAddress);
    utl.socket.on('main_update', s => {
      setBox(s.players);
    });
    utl.socket.on('event', function (data) {});
    utl.socket.on('disconnect', function () {});
  };

  const creteBox = (sp, erd) => {
    let box = utl.newScene.addChild(sp);
    box.takeSpeed = erd.takeSpeed;
    box.speed = {
      z: 0,
      x: 0,
      y: 0
    };

    if (erd.rotation) {
      box.transform.rotation = new Laya.Vector3(erd.rotation.x, erd.rotation.y, erd.rotation.z);
    }

    if (erd.position) {
      box.transform.position = new Laya.Vector3(erd.position.x, erd.position.y, erd.position.z);
    } // utl.newScene.addChild(box)


    utl.players.set(erd.id, box);
  };

  const setBox = players => {
    let ps = new Map(players);
    utl.netPlayers = ps;
    let bs = utl.players;

    if (utl.newScene) {
      for (let k of ps.keys()) {
        let now = bs.get(k);
        let erd = ps.get(k);

        if (now) {
          now.takeSpeed = erd.takeSpeed;
          return;

          if (erd.position && now.tempPosition) {
            let erdx = {
              x: ~~(erd.position.x * 100),
              y: ~~(erd.position.y * 100),
              z: ~~(erd.position.z * 100)
            };
            now.tempPositions.push(erdx); // Laya.Tween.to( now.tempPosition,erdx, 500,null,Laya.Handler.create(this,()=>{
            //         	console.log(now.tempPosition.x,'+++9999+')
            //         	}));
          }

          if (erd.rotation && now.tempRotation) {
            let erdx = {
              x: ~~(erd.rotation.x * 100),
              y: ~~(erd.rotation.y * 100),
              z: ~~(erd.rotation.z * 100)
            };
            now.tempRotations.push(erdx); // Laya.Tween.to( now.tempRotation,erdx, 500,null,Laya.Handler.create(this,()=>{
            //        		}));
          }
        } else {
          if (erd.id == utl.userId) {
            Laya.Sprite3D.load("res/t2/LayaScene_fff/Conventional/f.lh", Laya.Handler.create(null, sp => {
              creteBox(sp, erd);
            }));
          } else {
            let box4 = utl.box4.clone();
            creteBox(box4, erd);
          }
        }
      } // utl.box.transform.rotate(new Laya.Vector3(0,0,-obj.rotation.z* Math.PI / 180),true);
      //       utl.box.transform.rotate(new Laya.Vector3(0,-obj.rotation.x* Math.PI / 180,0),true);
      // //       utl.box.transform.rotate(new Laya.Vector3(obj.rotation.y* Math.PI / 180,0,0),true);
      //       utl.box.transform.rotation = new Laya.Vector3(obj.rotation.x,obj.rotation.y,obj.rotation.z)
      // utl.box.transform.position = new Laya.Vector3(obj.position.x,obj.position.y,obj.position.z)
      // Laya.Tween.to( utl.doposition,{x:obj.position.x,y:obj.position.y,z:obj.position.z}, 200,null,Laya.Handler.create(this,()=>{
      //           }));

    }
  };
  /**
   * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
   * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
   * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
   */


  let temp = 0,
      spled = {
    x: 0,
    y: 0,
    z: 0
  },
      dfew = 0;
  let flagod = false;
  let fireFlag = false;
  let touchs = [['newTouch', {
    flag: false,
    Tclass: newtach
  }], ['newTor', {
    flag: false,
    Tclass: newTwo
  }], ['fire', {
    flag: false,
    Tclass: fire
  }]];

  class GameUI extends Laya.Scene {
    constructor() {
      super();
      this.isTwoTouch = false;
      this.twoFirst = true;
      this.temprx = 0;
      this.tempry = 0;
      this.temprz = 0;
      this.shipRx = 0;
      this.shipRy = 0;
      this.spled = 0;
      this.spledy = 0;
      this.loadScene("test/TestScene.scene");
      this.newScene = Laya.stage.addChild(new Laya.Scene3D());
      this.loadingElse = new Map(utl.loadingElse);
      utl.newScene = this.newScene;
      this.initTouch();
      this.info = new Laya.Text();
      this.info.text = '555777777775';
      this.info.fontSize = 50;
      this.info.color = "#FFFFFF";
      this.info.size(Laya.stage.width, Laya.stage.height);
      this.info.pos(0, 100);
      Laya.stage.addChild(this.info);
      utl.info = this.info;
      this.drawUi();
      Laya.Gyroscope.instance.on(Laya.Event.CHANGE, this, onDeviceorientation);

      function onDeviceorientation(absolute, rotationInfo) {
        // this.info.text =
        //     "alpha:" + Math.floor(rotationInfo.alpha) + '\n' +
        //     "beta :" + Math.floor(rotationInfo.beta) + '\n' +
        //     "gamma:" + Math.floor(rotationInfo.gamma);
        if (utl.operationYype == 2) {
          utl.takeSpeed.x = Math.floor(rotationInfo.gamma);
          utl.takeSpeed.y = Math.floor(rotationInfo.beta);
        }
      }

      temp = this; //初始化照相机
      // var camera = this.newScene.addChild(new Laya.Camera(0, 0.1, 100));
      // camera.transform.translate(new Laya.Vector3(0, 100, 0));
      // camera.transform.rotate(new Laya.Vector3(-90, 0, 0), true, false);
      // // camera.orthographic = true;
      //       //正交垂直矩阵距离,控制3D物体远近与显示大小
      //       // camera.orthographicVerticalSize = 60;
      //       // camera.enableHDR = true; //关闭HDR
      //       utl.camera = camera
      //方向光
      // this.newScene.addChild(utl.models.get('light'));  
      // var directionLight = new Laya.DirectionLight();
      // this.newScene.addChild(directionLight);
      // directionLight.color = new Laya.Vector3(1, 1, 1);
      // //设置平行光的方向
      // var mat = directionLight.transform.worldMatrix;
      // mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
      // directionLight.transform.worldMatrix=mat;
      // // //平面
      // var plane = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(-1000, -1000, 1000, 1000)));
      // var planeMat = new Laya.BlinnPhongMaterial();
      // Laya.Texture2D.load("res/grass.png", Laya.Handler.create(this, function(tex) {
      // 	planeMat.albedoTexture = tex;
      // }));
      // //设置纹理平铺和偏移
      // // var tilingOffset = planeMat.tilingOffset;
      // // tilingOffset.setValue(5, 5, 0, 0);
      // // planeMat.tilingOffset = tilingOffset;
      // //设置材质
      // plane.meshRenderer.material = planeMat;
      // //平面添加物理碰撞体组件
      // var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
      // //创建盒子形状碰撞器
      // var planeShape = new Laya.BoxColliderShape(10, 0, 10);
      // //物理碰撞体设置形状
      // planeStaticCollider.colliderShape = planeShape;
      // //物理碰撞体设置摩擦力
      // planeStaticCollider.friction = 2;
      // //物理碰撞体设置弹力
      // planeStaticCollider.restitution = 0.3;

      Laya.timer.loop(30, this, this.onUpdate);
      var sfe = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
      var material = new Laya.BlinnPhongMaterial();
      sfe.transform.position = new Laya.Vector3(1, 20, 3);
      Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function (tex) {
        material.albedoTexture = tex;
      }));
      sfe.meshRenderer.material = material; // Laya.Sprite3D.load("https://xuxin.love/img/fly/LayaScene/Conventional/Directional Light.lh", Laya.Handler.create(null, (sp)=> {
      //     let layaMonkey1 = this.newScene.addChild(sp);
      // }));
      // Laya.Sprite3D.load("res/LayaScene/Conventional/pler.lh", Laya.Handler.create(null, (sp)=> {
      //     utl.box = this.newScene.addChild(sp);
      //     this.newScene.addChild(utl.box);
      //     Laya.timer.loop(1000,this,this.onFire);
      //     let ship = utl.box.getChildByName('shipmain')
      //     let shipcar = ship.getChildByName('ship')
      //     console.log(ship)
      //     utl.c1 = shipcar.getChildByName('c1')
      //     utl.c2 = shipcar.getChildByName('c2')
      // }));

      utl.box = utl.models.get('pler');
      this.newScene.addChild(utl.box);
      utl.bullet = utl.models.get('bullet');
      this.newScene.addChild(utl.bullet);
      let ship = utl.box.getChildByName('shipmain');
      let shipcar = ship.getChildByName('ship');
      utl.c1 = shipcar.getChildByName('c1');
      utl.c2 = shipcar.getChildByName('c2');
      Laya.timer.loop(1, this, this.onFire);
      let camera = ship.getChildByName('Camera');
      camera.clearColor = new Laya.Vector4(0, 0, 0, 1);
      let nimabi = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 11, 42)));
      var materialr = new Laya.BlinnPhongMaterial();
      Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function (tex) {
        materialr.albedoTexture = tex;
      }));
      nimabi.meshRenderer.material = materialr;
      nimabi.transform.position = new Laya.Vector3(1, 20, 6);
      nimabi.addComponent(Bullet);
      this.createBall();
      let sum = utl.models.get('sun');
      this.newScene.addChild(sum); // Laya.loader.load('https://xuxin.love/img/fly/controll.png', Laya.Handler.create(this, function() {
      //     let monkey2 = Laya.loader.getRes('https://xuxin.love/img/fly/controll.png');
      //     let ape2 = new Laya.Sprite();
      //     Laya.stage.addChild(ape2);
      //     ape2.graphics.drawTexture(monkey2, 100, 100);
      //     ape2.width = 400
      //     ape2.height = 400
      //     ape2.x = 250;
      //     ape2.y = Laya.stage.height - 500;
      // }));

      utl.models.get('cube').active = false;
    }

    drawUi() {
      // let fudf = utl.models.get('cotrll')
      // let ape2 = new Laya.Sprite();
      // Laya.stage.addChild(ape2);
      // ape2.graphics.drawTexture(fudf, 100, 100);
      // // ape2.width = 400
      // // ape2.height = 400
      // // ape2.x = 0;
      // // ape2.y = Laya.stage.height - 500;
      // ape2.pos(0,Laya.stage.height - 500)
      let leftHand = this.loadingElse.get('cotrll');
      let leftHandImg = new Laya.Image(leftHand);
      leftHandImg.height = 300;
      leftHandImg.width = 300;
      leftHandImg.pos(300, Laya.stage.height - 500);
      Laya.stage.addChild(leftHandImg);
      let col = this.loadingElse.get('fire');
      let dialog = new Laya.Image(col);
      dialog.height = 150;
      dialog.width = 150;
      dialog.pos(Laya.stage.width - 250, Laya.stage.height - 250);
      Laya.stage.addChild(dialog); // let ape3 = new Laya.Sprite();
      // Laya.stage.addChild(ape3);
      // ape3.graphics.drawTexture(col, 100, 100);
      // ape3.width = 100
      // ape3.height = 100
      // ape3.x = Laya.stage.width/2+200;
      // ape3.y = Laya.stage.height - 500;
    }

    initTouch() {
      for (let touch of touchs) {
        touch[1].event = new touch[1].Tclass();
      }
    }

    onFire() {
      if (utl.fireOnOff) {
        // let ship = utl.box.getChildByName('shipmain')
        // let shipcar = ship.getChildByName('ship')
        let aum = utl.bullet.clone(); // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));

        let script = aum.addComponent(Bullet);
        this.newScene.addChild(aum);
      }
    }

    createBall() {
      for (let z = -1; z < 2; z++) {
        for (let i = -1; i < 3; i++) {
          for (let l = -1; l < 4; l++) {
            // let box4 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 3,6)));
            // let material1 = new Laya.BlinnPhongMaterial();
            // box4.meshRenderer.material = material1;
            // box4.transform.position =new Laya.Vector3(i*40,l*40,z*40)
            // box4.addComponent(Enemy);
            // this.newScene.addChild(box4)
            let cube = utl.models.get('cube').clone();
            cube.active = true; // let scale = new Laya.Vector3(3, 3, 3);
            // cube.transform.localScale = scale;

            cube.transform.position = new Laya.Vector3(i * 60, l * 80, z * 40);
            cube.addComponent(Enemy);
            this.newScene.addChild(cube);
          }
        }
      }
    }

    flying(touchCount) {
      // this.info.text = touchCount
      flagod = false;
      fireFlag = false;

      for (let obj of touchs) {
        obj[1].flag = false;
      } // let touchCount = this.scene.input.touchCount();


      if (1 === touchCount) {
        //判断是否为两指触控，撤去一根手指后引发的touchCount===1
        // if(this.isTwoTouch){
        //     return;
        // }
        let touch = this.newScene.input.getTouch(0); // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
        //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
        //     flagod=true
        //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
        //     fireFlag = true
        //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }

        for (let obj of touchs) {
          if (obj[1].event.scaleSmall(touch.position.x, touch.position.y)) {
            obj[1].flag = true;
            obj[1].event.leftFormatMovePosition(touch.position.x, touch.position.y);
          }
        }
      } else if (2 === touchCount) {
        // this.isTwoTouch = true;
        //获取两个触碰点
        let touch = this.newScene.input.getTouch(0);
        let touch2 = this.newScene.input.getTouch(1); //是否为新一次触碰，并未发生移动
        // if (this.twoFirst){
        //     //获取触碰点的位置
        //     // this.disVector1.x = touch.position.x - touch2.position.x;
        //     // this.disVector1.y = touch.position.y - touch2.position.y;
        //     // this.distance = Laya.Vector2.scalarLength(this.disVector1);
        //     // this.sprite3DSacle = this.owner.transform.scale;
        //     this.twoFirst = false;
        // }
        // else{
        //--------------------------------
        // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
        //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.newTouch.scaleSmall(touch2.position.x,touch2.position.y)){
        //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
        //     flagod=true
        //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.newTor.scaleSmall(touch2.position.x,touch2.position.y)){
        //     flagod=true
        //     this.newTor.leftFormatMovePosition(touch2.position.x,touch2.position.y)
        // }
        // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
        //     fireFlag=true
        //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
        // }
        // if(this.fireTouch.scaleSmall(touch2.position.x,touch2.position.y)){
        //     fireFlag=true
        //     this.fireTouch.leftFormatMovePosition(touch2.position.x,touch2.position.y)
        // }
        //---------------------------------------

        for (let obj of touchs) {
          if (obj[1].event.scaleSmall(touch.position.x, touch.position.y)) {
            obj[1].flag = true;
            obj[1].event.leftFormatMovePosition(touch.position.x, touch.position.y);
          }

          if (obj[1].event.scaleSmall(touch2.position.x, touch2.position.y)) {
            obj[1].flag = true;
            obj[1].event.leftFormatMovePosition(touch2.position.x, touch2.position.y);
          }
        } // this.disVector2.x = touch.position.x - touch2.position.x;
        // this.disVector2.y = touch.position.y - touch2.position.y;
        // let distance2 = Laya.Vector2.scalarLength(this.disVector2);
        // //根据移动的距离进行缩放
        // let factor =  0.001 * (distance2 - this.distance);
        // this.sprite3DSacle.x += factor;
        // this.sprite3DSacle.y += factor;
        // this.sprite3DSacle.z += factor;
        // this.owner.transform.scale = this.sprite3DSacle;
        // this.distance = distance2;
        // }   

      } else if (0 === touchCount) {
        // this.text.text = "触控点归零";
        this.first = true;
        this.twoFirst = true; // this.lastPosition.x = 0;
        // this.lastPosition.y = 0;

        this.isTwoTouch = false; // utl.takeSpeed.x = 0
        // utl.takeSpeed.y = 0
      }

      let touchsMap = new Map(touchs);

      if (!touchsMap.get('newTor').flag) {
        utl.takeSpeed.x = 0;
        utl.takeSpeed.y = 0;
      } // if(!fireFlag){


      utl.fireOnOff = touchsMap.get('fire').flag; // }
      // this.info.text = flagod+','+touchCount
    }

    onUpdate() {
      let touchCount = this.newScene.input.touchCount();
      this.flying(touchCount); // return

      for (let obj of utl.firs) {
        obj.toTiome();
      }

      if (utl.box) {
        let ship = utl.box.getChildByName('shipmain');
        let camera = ship.getChildByName('Main Camera');
        let shipcar = ship.getChildByName('ship');
        let bmain = utl.bullet.getChildByName('Cube');
        let bcube = bmain;

        if (utl.takeSpeed.x != utl.speed.x) {
          if (Math.abs(utl.takeSpeed.x - utl.speed.x) > 1) {
            utl.speed.x = utl.takeSpeed.x > utl.speed.x ? utl.speed.x + 1 : utl.speed.x - 1;
          } else {
            if (utl.takeSpeed.x == 0) {
              utl.speed.x = 0;
            }
          }
        }

        if (utl.takeSpeed.y != utl.speed.y) {
          if (Math.abs(utl.takeSpeed.y - utl.speed.y) > 1) {
            utl.speed.y = utl.takeSpeed.y > utl.speed.y ? utl.speed.y + 1 : utl.speed.y - 1;
          } else {
            if (utl.takeSpeed.y == 0) {
              utl.speed.y = 0;
            }
          }
        }

        let x = utl.speed.x;
        let y = utl.speed.y; // let x = Math.floor(utl.speed.x)        
        // let y = Math.floor(utl.speed.y)
        // let z = utl.speed.z*90/100
        // console.log(utl.box.transform.rotation.x)

        let tz = Math.cos(Math.PI / 180 * utl.box.transform.rotationEuler.x) * utl.speedMove;
        let tx = Math.sin(Math.PI / 180 * utl.box.transform.rotationEuler.y) * utl.speedMove;
        let ty = Math.sin(Math.PI / 180 * utl.box.transform.rotationEuler.x) * utl.speedMove; // this.info.text = x+','+y
        // ship.transform.rotate(new Laya.Vector3(this.temprx* Math.PI / 180,0,0),true);

        let ry = y - this.tempry;
        let rx = x - this.temprx;
        let sy = y / 60;
        let sx = -x / 60;
        utl.box.transform.rotate(new Laya.Vector3(0, sy * Math.PI / 180, 0), true);
        utl.box.transform.rotate(new Laya.Vector3(sx * Math.PI / 180, 0, 0), true);
        utl.bullet.transform.rotate(new Laya.Vector3(0, sy * Math.PI / 180, 0), true);
        utl.bullet.transform.rotate(new Laya.Vector3(sx * Math.PI / 180, 0, 0), true); // shipcar.transform.rotate(new Laya.Vector3(0,-rx* Math.PI / 180,0),true);
        // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);

        shipcar.transform.rotate(new Laya.Vector3(0, this.temprx * Math.PI / 180, 0), true);
        shipcar.transform.rotate(new Laya.Vector3(this.tempry * Math.PI / 180, 0, 0), true);
        shipcar.transform.rotate(new Laya.Vector3(-y * Math.PI / 180, 0, 0), true);
        shipcar.transform.rotate(new Laya.Vector3(0, -x * Math.PI / 180, 0), true);
        bcube.transform.rotate(new Laya.Vector3(0, this.temprx * Math.PI / 180, 0), true);
        bcube.transform.rotate(new Laya.Vector3(this.tempry * Math.PI / 180, 0, 0), true);
        bcube.transform.rotate(new Laya.Vector3(-y * Math.PI / 180, 0, 0), true);
        bcube.transform.rotate(new Laya.Vector3(0, -x * Math.PI / 180, 0), true);
        utl.box.transform.translate(new Laya.Vector3(0, 0, utl.speedMove), true);
        utl.bullet.transform.translate(new Laya.Vector3(0, 0, utl.speedMove), true); // shipcar.transform.rotation =  (new Laya.Vector3(-90,90,0),true)
        // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);
        // ship.transform.rotate(new Laya.Vector3(0,0,-x* Math.PI / 180),true);
        // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)
        // camera.transform.rotate(new Laya.Vector3(0,0,-y* Math.PI / 180),true);
        // if(Math.abs(this.shipRx)<45){
        //      this.shipRx += x
        //      shipcar.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
        // }
        // shipcar.transform.rotate(new Laya.Vector3(-x* Math.PI / 180,0,0),true);
        // ship.transform.rotate(new Laya.Vector3(0,0,this.tempry* Math.PI / 180),true);

        this.shipRy = 0; // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)
        // utl.box.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),false);
        // utl.box.transform.rotate(new Laya.Vector3(y* Math.PI / 180,0,0),true);
        // camera.transform.translate(new Laya.Vector3(0,-ty,tz))

        this.temprx = x;
        this.tempry = y; // if(this.temprx>70){
        //     ship.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
        //     this.temprx -= x
        // }
        // this.onFire()
      }
    }

    creabox(py) {
      for (let i = 0; i < 2; i++) {
        for (let l = 0; l < 2; l++) {
          let box5 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
          box5.transform.rotate(new Laya.Vector3(2 * Math.PI / 180, 0, 10 * Math.PI / 180), true, true);
          let material1 = new Laya.BlinnPhongMaterial();
          box5.transform.position = new Laya.Vector3(l, py + 3, i);
          let bg = box5.addComponent(Laya.Rigidbody3D); //创建盒子形状碰撞器

          let boxShape1 = new Laya.BoxColliderShape(1, 1, 1); //设置盒子的碰撞形状

          bg.colliderShape = boxShape1; //设置刚体的质量

          bg.friction = 2; //物理碰撞体设置弹力

          bg.restitution = 0.3;
          bg.mass = 10;
        }
      }
    }

    creab() {
      for (let f = 0; f < 2; f++) {
        this.creabox(f);
      }
    }

  }

  class BoxMove extends Laya.Script3D {
    constructor() {
      super();
    }

    onStart() {
      console.log("3333");
    }

    onTriggerEnter() {
      utl.entity.get('obx').removeSelf();
      temp.creab();
      console.log("onTriggerEnter");
    }

    onTriggerStay() {
      console.log("onTriggerStay");
    }

    onTriggerExit() {
      console.log("onTriggerExit");
    }

    onEnable() {}

    onDisable() {}

  }

  class BoxMove3 extends Laya.Script3D {
    constructor() {
      super();
    }

    onStart() {
      console.log("3333");
    }

    onTriggerEnter() {
      console.log("onTriggerEnter3");
    }

    onTriggerStay() {
      console.log("onTriggerStay3");
    }

    onTriggerExit() {
      console.log("onTriggerExit3");
    }

    onEnable() {}

    onDisable() {}

  }
  /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */


  class GameConfig {
    static init() {
      //注册Script或者Runtime引用
      let reg = Laya.ClassUtils.regClass;
      reg("script/InitUI.js", InitUI);
      reg("script/Ioading.js", InitUI$1);
      reg("script/GameUI.js", GameUI);
      reg("script/hand/fire.js", fire);
    }

  }

  GameConfig.width = 640;
  GameConfig.height = 1136;
  GameConfig.scaleMode = "full";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "test/load.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
    constructor() {
      //根据IDE设置初始化引擎		
      if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
      Laya["Physics"] && Laya["Physics"].enable();
      Laya["DebugPanel"] && Laya["DebugPanel"].enable();
      Laya.stage.scaleMode = GameConfig.scaleMode;
      Laya.stage.screenMode = GameConfig.screenMode;
      Laya.stage.alignV = GameConfig.alignV;
      Laya.stage.alignH = GameConfig.alignH; //兼容微信不支持加载scene后缀场景

      Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson; //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）

      if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
      if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
      if (GameConfig.stat) Laya.Stat.show();
      Laya.alertGlobalError(true); //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程

      Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }

    onVersionLoaded() {
      //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
      Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    }

    onConfigLoaded() {
      //加载IDE指定的场景
      GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    }

  } //激活启动类


  new Main();
})();