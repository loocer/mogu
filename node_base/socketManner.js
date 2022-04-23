let rooms =require('./tools/rooms')
module.exports=(io)=>{
    io.on('connection', (socket) => {
        for (let key of  rooms.keys()) {
            socket.on(key, msg => {
                rooms.get(key).receive(msg)
            });
        }
        
    });
}