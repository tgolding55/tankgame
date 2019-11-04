const express = require('express')
const app = express();
const server = require('http').createServer(app);
let SOCKET_LIST = {}
let Player = require('./server/player')
let Missile = require('./server/missile')

//routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html')
});

app.use('/client', express.static('client'))


//server setup
server.listen(3000, function(){
  console.log('listening on *:3000');
});


//sockets
const io = require('socket.io')(server)

io.on('connection', function(socket){
     SOCKET_LIST[socket.id] = socket

     Player.onConnect(socket)
     console.log('user connected')
     
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id]
        delete Player.list[socket.id]
        console.log('user disconnected');
    });
  });



  //packet management
  
  setInterval(function(){
      let pack ={
          player:Player.update(),
          missile:Missile.update()
      }

      for(let i in SOCKET_LIST){
          const socket = SOCKET_LIST[i]
          socket.emit('newPosition',pack)
      }
  },1000/25)

  
  