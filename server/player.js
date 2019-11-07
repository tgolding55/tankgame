module.exports = Player
let Entity = require('./entity')
let Missile = require('./missile')
let spawnPoints = [{x:75,y:75}, {x:75, y:525},{x:1175,y:75}, {x:1175, y:525}]
let spawnCount = 0

function Player(socket, colour){
    spawn = spawnPoints[spawnCount]
    spawnCount >= 3 ? spawnCount = 0: spawnCount++
    Entity.call(this, spawn.x, spawn.y, 10, 270)
   
    this.socket = socket
    this.maxSpeed = 10
    this.reloaded = true
    this.colour = colour
    this.alive = true

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
        this.updateSpd()
        this.applySpd()
        this.fireShot()
        this.checkAlive()
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
        new Missile(this.x, this.y, this.directionAngle)
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
            this.die()
        }
    }

    this.die = function(){
        Player.respawn(this.socket)
        Player.colour.push(Player.list[socket.id].colour)
        delete Player.list[this.socket.id]
    }

    this.reverseSpeed = function(){
        this.x += -this.speed * Math.cos(Math.PI/180 * this.directionAngle);
        this.y += -this.speed * Math.sin(Math.PI/180 * this.directionAngle);
    }
}
Player.list = {}
Player.colour = [0,1,2,3]

Player.onConnect = function(socket){
    let player = new Player(socket,Player.colour[0])
    Player.colour.shift()
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

Player.update = function(){
    let pack = []

    for(let i in Player.list){
        const player = Player.list[i]
        if(player){
        player.update()
        
        pack.push({
            x: player.x,
            y: player.y,
            directionAngle: player.directionAngle,
            colour: player.colour
        })
    }
    }
    return pack
}

Player.respawn = function(socket){
    setTimeout(() => {
        if(socket.connected){
        Player.onConnect(socket)
        }
    }, 2500);
}