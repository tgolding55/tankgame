module.exports = Player

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

    Player.list[socketId] = this

    this.update = function(){
        this.updateSpd()
        this.applySpd()
    }
    this.applySpd = function(){
        this.y += this.spdY
        this.x += this.spdX
    }

    this.updateSpd = function(){
        
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