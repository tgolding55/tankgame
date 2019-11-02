const express = require('express')
const app = express();
const server = require('http').createServer(app);
let SOCKET_LIST = {}

//classes
function Player(socketId){
    
    this.id = socketId
    this.x = 250
    this.y = 250
    this.pressingLeft = false
    this.pressingUp = false
    this.pressingDown = false
    this.pressingRight = false
    this.spdX = 0
    this.spdY = 0
    this.maxSpd =10
    this.mouseAngle = 0 
    this.pressingAttack = false

    
    let self = {
        id: this.id,
        x: this.x,
        y: this.y,
        pressingLeft: this.pressingLeft,
        pressingUp: this.pressingUp,
        pressingDown: this.pressingDown,
        pressingRight: this.pressingRight,
        spdX: this.spdX,
        spdY: this.spdY,
        maxSpd: this.maxSpd,
        mouseAngle: this.mouseAngle,
        pressingAttack: this.pressingAttack
    }

    Player.list[socketId] = self

    self.update = function(){
        self.updateSpd()
        self.applySpd()
    }
    self.applySpd = function(){
        this.y += this.spdY
        this.x += this.spdX
    }

    self.updateSpd = function(){
        
        if(this.pressingDown){
            this.spdY = this.maxSpd
        }else if(this.pressingUp){
            this.spdY = -this.maxSpd
        }else{
            this.spdY = 0
        }

        if(this.pressingRight){
            this.spdX = this.maxSpd
        } else if(this.pressingLeft){
            this.spdX = -this.maxSpd
        } else{
            this.spdX = 0
        }
    }
    
}
Player.list = {}

Player.onConnect = function(socket){
    let player = new Player(socket.id)
    
    socket.on('keyPress', function(packet){
        player = Player.list[socket.id]    
        switch(packet.inputId){
            case 'right':
                    player.pressingRight = packet.state
                break
            case 'left':
                    player.pressingLeft = packet.state
                break
            case 'up':
                    player.pressingUp = packet.state
                break
            case 'down':
                    player.pressingDown = packet.state
                break
            case 'attack':
                player.pressingAttack = packet.state
                break
            case 'mouseAngle':
                player.mouseAngle = packet.state
                break
        
        }
    })
}

Player.update = function(){
    let pack = []

    for(let i in Player.list){
        const player = Player.list[i]
        player.update()
        pack.push({
            id: player.id,
            x: player.x,
            y: player.y
        })
    }
    return pack
}





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
          player:Player.update()
      }

      for(let i in SOCKET_LIST){
          const socket = SOCKET_LIST[i]
          socket.emit('newPosition',pack)
      }
  },1000/25)

  
  