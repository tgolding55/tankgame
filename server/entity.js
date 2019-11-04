module.exports = Entity
let Player = require('./player')
let Missile = require('./missile')

let count = 0
function Entity(x,y,speed,directionAngle){
    this.id = count
    
    this.collidable = false
    this.x = x
    this.y = y
    this.width 
    this.height 

    this.speed = speed
    

    this.directionAngle = directionAngle

    Entity.list[count] = this
    count +=1

    this.checkCollision = function(){
        for(let index in Entity.list){
            if(Entity.list[index] !== this && Entity.list[index].collidable === true && this.collidable === true){
                if((Entity.list[index].x > this.x-this.width/2 && Entity.list[index].x < this.x+this.width/2 && Entity.list[index].y > this.y-this.width/2 && Entity.list[index].y < this.y+this.width/2)){
                    this.collide(Entity.list[index])
                }
            }
        }
    }

    this.collide = function(entity){
        if (this instanceof Player && entity instanceof Missile){
            Player.list[this.socket.id].die(this.socket)
            delete Entity.list[this.id]
        }else if (this instanceof Player && entity instanceof Player){
            delete Player.list[this.socket.id].die(this.socket)
            delete Entity.list[this.id]
            delete Player.list[entity.socket.id].die(this.socket)
            delete Entity.list[entity.id]
            
        }
    }
}
Entity.list = {}

Entity.checkAllCollisions = function(){
    for(let index in Entity.list){
        Entity.list[index].checkCollision()
    }
}




