
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const SOCKET_LIST = {}

const GameMaster = require('./server/gameMaster')
const Player = require('./server/player')
const Entity = require('./server/entity')

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
     let curGame
     if(Object.keys(GameMaster.list).length === 0){
      console.log("New game")
      curGame = new GameMaster(socket.id)
      curGame.startGame()
     }else{
       for(let game in GameMaster.list){
         if(GameMaster.list[game].playerids.length < 4){
           curGame = GameMaster.list[game]
           GameMaster.list[game].playerids.push(socket.id)
         }
       }
       if(!curGame){
        console.log("Game full")
        curGame = new GameMaster(socket.id)
        curGame.startGame()
       }
     }
    

     

     Player.onConnect(socket, curGame.id)
     console.log('user connected')
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id]
        if(Player.list[socket.id]){
        const curGame = GameMaster.list[Player.list[socket.id].gameId]
        curGame.colour.push(Player.list[socket.id].colour)
        curGame.removePlayer(Player.list[socket.id].socket.id)
        delete Entity.list[Player.list[socket.id].id]
        delete Player.list[socket.id]
        }
        socket.connected = false
        
        console.log('user disconnected');
    });
  });

