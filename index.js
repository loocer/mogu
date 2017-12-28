var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var rooms=require('./rooms');

function roomSocket(socket){
  console.log('所有房间------------')
	console.log(rooms)
	for(let i in rooms){
      socket.on(rooms[i].roomNo, function(msgObj){
	    io.emit(rooms[i].roomNo, msgObj);
	  });
	}
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  roomSocket(socket)
});

var allreq=require('./req/allControl');
//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});
allreq.setAllreq(app);


http.listen(port, function(){
  console.log('listening on *:' + port);
});