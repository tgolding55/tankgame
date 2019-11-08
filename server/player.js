module.exports = Player
const Entity = require('./entity')
const Missile = require('./missile')
const MapObject = require('./mapobject')
const GameMaster = require('./gameMaster')
const spawnPoints = [{x:75,y:75}, {x:75, y:525},{x:1175,y:75}, {x:1175, y:525}]
let spawnCount = 0

function Player(socket, colour, gameid){
    spawn = spawnPoints[spawnCount]
    spawnCount >= 3 ? spawnCount = 0: spawnCount++
    Entity.call(this, spawn.x, spawn.y, 10, 270, gameid)
   
    this.socket = socket
    this.maxSpeed = 10
    this.reloaded = true
    this.colour = colour
    this.alive = true
    
    this.spawn = spawn
    this.respawning = false

    this.width = 100
    this.height = 100

    this.pressingLeft = false
    this.pressingUp = false
    this.pressingDown = false
    this.pressingRight = false

    //this.mouseAngle = 0
    this.pressingAttack = false

    this.turnSpeed = 10

    Player.list[socket.id] = this

    this.update = function(){
        if(this.checkAlive()){
        this.updateSpd()
        this.applySpd()
        this.fireShot()
        }
    }
    this.applySpd = function(){
        this.x += this.speed * Math.cos(Math.PI/180 * this.directionAngle);
        this.y += this.speed * Math.sin(Math.PI/180 * this.directionAngle);
    }

    this.updateSpd = function(){
        
        if(this.pressingDown){
            this.speed = -this.maxSpeed
        }else if(this.pressingUp){
            this.speed = +this.maxSpeed
        }else{
            this.speed = 0
        }

        if(this.pressingRight){
            this.directionAngle += this.turnSpeed
        } else if(this.pressingLeft){
            this.directionAngle -= this.turnSpeed
        }
    }

    this.fireShot = function(){
        if(this.pressingAttack && this.reloaded){
        new Missile(this.x, this.y, this.directionAngle, this.gameId)
        this.reloaded = false
        this.shotTimer()
        }
    }

    this.shotTimer = function(){
        setTimeout(() => {
            this.reloaded = true
        }, 500);
    }
    
    this.checkAlive = function(){
        
        if(!this.alive){
            if(!this.respawning) this.respawn(this.socket);
            return false
        }
        return true
    }

    this.reverseSpeed = function(){
        this.x += -this.speed * Math.cos(Math.PI/180 * this.directionAngle);
        this.y += -this.speed * Math.sin(Math.PI/180 * this.directionAngle);
    }

    this.respawn = function(socket){
        if(socket.connected){
            this.respawning = true
        setTimeout(() => {
                this.x = this.spawn.x
                this.y = this.spawn.y
                this.respawning = false
                this.alive = true
        }, 2500);
        }
}
this.loadMap = function(socket){

    let mapPacket = []
    for(let i in MapObject.list){
        if(MapObject.list[i].gameId === this.gameId)
      mapPacket.push({x: MapObject.list[i].x, y:MapObject.list[i].y ,width:MapObject.list[i].width ,height:MapObject.list[i].height})
    }
    socket.emit('loadMap', mapPacket)
  }

}
Player.list = {}


Player.onConnect = function(socket,gameid){
    const curGame = GameMaster.list[gameid]
    let player = new Player(socket,curGame.colours[0], gameid)
    player.loadMap(socket)
    curGame.colours.shift()
    socket.on('keyPress', function(packet){
        player = Player.list[socket.id]    
        if(player){
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
                /*
            case 'mouseAngle':
                player.mouseAngle = packet.state
                break
                */
        
        }
    }
    })
}


Player.update = function(gameid){
    let pack = []

    for(let i in Player.list){
        const player = Player.list[i]
        if(player && player.gameId === gameid){
        player.update()
        
        pack.push({
            x: player.x,
            y: player.y,
            directionAngle: player.directionAngle,
            colour: player.colour,
            alive: player.alive
        })
    }
    }
    return pack
}

