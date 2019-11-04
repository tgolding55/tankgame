module.exports = Player
let Entity = require('./entity')


function Player(socketId){
    Entity.call(this, socketId)

    this.pressingLeft = false
    this.pressingUp = false
    this.pressingDown = false
    this.pressingRight = false

    //this.mouseAngle = 0
    this.pressingAttack = false

    this.turnSpeed = 10

    Player.list[socketId] = this

    this.update = function(){
        this.updateSpd()
        this.applySpd()
        this.fireShot()
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
                /*
            case 'mouseAngle':
                player.mouseAngle = packet.state
                break
                */
        
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
            y: player.y,
            directionAngle: player.directionAngle,
        })
    }
    return pack
}