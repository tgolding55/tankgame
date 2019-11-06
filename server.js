
const express = require('express')
const app = express();
const server = require('http').createServer(app);
let SOCKET_LIST = {}

let Player = require('./server/player')
let Missile = require('./server/missile')
let Entity = require('./server/entity')
let MapObject = require('./server/mapobject')


//routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html')
});

app.use('/client', express.static('client'))


//server setup
server.listen(3000, function(){
  console.log('listening on *:3000');

  new MapObject(300,300,200, 100)
});


//sockets
const io = require('socket.io')(server)

io.on('connection', function(socket){
     SOCKET_LIST[socket.id] = socket

     Player.onConnect(socket)
     loadMap(socket)
     console.log('user connected')
     
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id]
        if(Player.list[socket.id]){
        delete Entity.list[Player.list[socket.id].id]
        delete Player.list[socket.id]
        }
        console.log('user disconnected');
    });
  });

  //packet management


  function loadMap(socket){

    let mapPacket = []
    for(let i in MapObject.list){
      mapPacket.push({x: MapObject.list[i].x, y:MapObject.list[i].y ,width:MapObject.list[i].width ,height:MapObject.list[i].height})
    }
    socket.emit('loadMap', mapPacket)
  }
  
  setInterval(function(){
      Entity.checkAllCollisions()
      let pack ={
          player:Player.update(),
          missile:Missile.update()
      }

      for(let i in SOCKET_LIST){
          const socket = SOCKET_LIST[i]
          socket.emit('newPosition',pack)
      }
  },1000/25)

  
  