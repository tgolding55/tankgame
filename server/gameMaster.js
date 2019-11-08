module.exports = GameMaster

const Player = require('./player')
const Missile = require('./missile')
const Entity = require('./entity')
const MapObject = require('./mapobject')
let count = 0
let gameTickId

function GameMaster(socketid){
    this.id = count
    this.playerids = [socketid]
    this.colours = [0,1,2,3]
    new MapObject(300,75,50, 150,this.id)
    new MapObject(200,300,400, 50,this.id)
  
    new MapObject(300,525,50, 150,this.id)
  
    new MapObject(625,300,50, 250,this.id)
  
    new MapObject(950,75,50, 150,this.id)
    new MapObject(1050,300,400, 50,this.id)
  
    new MapObject(950, 525,50, 150,this.id)

    GameMaster.list[this.id] = this
    count++

    this.players = function(){
        return this.playerids.map(playerid => Player.list[playerid])
    }

    this.startGame = function(){
        gameTickId = setInterval(gameTick.bind(this),1000/25)
    }

    this.removePlayer = function(playerId){
        let newPlayers = this.playerids.filter((playerid) => playerid !== playerId )
        this.playerids = newPlayers
    }


}


//packet management


function gameTick(){
    Entity.checkAllCollisions()
    let pack ={
        player:Player.update(this.id),
        missile:Missile.update(this.id)
    }

    let players 
    if(this.playerids.length !== 0){
        players = this.players()
        for(let i in players){
            player = players[i]
            if(player.gameId === this.id){
            player.socket.emit('newPosition',pack) 
            }    
        }
    }else{
        delete GameMaster.list[this.id]
        delete this
        clearInterval(gameTickId)
    }
}

GameMaster.list = {}
