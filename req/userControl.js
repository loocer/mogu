var userControl={};
var rooms=require('../rooms');
userControl.getUserInfo=function(app){
  app.get('/create-room',function(req,res){
   	/*--------判断房卡是否有效--------*/
   	console.log(req)
    rooms.push({roomNo:req.query.roomNo})
   	res.status(200),
 	  res.json('创建成功！')
  })
}
userControl.tfreg=function(app){
  app.get('/come-room',function(req,res){
   	/*--------判断房卡是否有效--------*/
   	res.status(200),
 	  res.json('jinru fnagjian ！')
  })
}
// userControl.getTset=function(app){
//  app.get('/get-test',function(req,res){
//  	userDao.test().then(function(value){
//       res.status(200),
// 	  res.json(value)
//  	});
//   })
// }
// userControl.register = function (app) {
//   app.get('/add-user',function(req,res){
//   	let user = req.query
//   	userDao.register().then(function(value){
//       res.status(200),
//       res.json(userLang.REGISTSUCCESS)
//   	})
//   	console.log(req.query)
//     // userDao.addUser().then(function(value){
//     //   res.status(200),
//     //   res.json()
//     // })
//   })
// }
module.exports=userControl