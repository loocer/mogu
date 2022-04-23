export loadResouse = ()=>{
	Laya.Sprite3D.load("https://xuxin.love/img/fly/LayaScene/Conventional/Directional Light.lh", Laya.Handler.create(null, (sp)=> {
            let layaMonkey1 = this.newScene.addChild(sp);
            
        }));
}