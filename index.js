var app = require('express')();
var http = require('http').Server(app);
var session  = require('express-session')
var parseurl = require('parseurl')
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var rooms=require('./rooms');

function roomSocket(socket){
  console.log('所有房间------------')
	console.log(rooms)
	for(let i in rooms){
      socket.on(rooms[i].id, function(msgObj){
	    io.emit(rooms[i].id, msgObj);
	  });
	}
}
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60 // default session expiration is set to 1 hour
  },
}))
 
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  var hour = 3600000
  req.session.cookie.expires = new Date(Date.now() + hour)
  req.session.cookie.maxAge = hour
  // get the url pathname
  var pathname = parseurl(req).pathname
 
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
 
  next()
})
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
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