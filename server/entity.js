module.exports = Entity
let Player = require('./player')
let Missile = require('./missile')
let MapObject = require('./mapobject')

let count = 0
function Entity(x,y,speed,directionAngle){
    this.id = count
    
    this.collidable = true
    this.x = x
    this.y = y
 
    this.speed = speed

    this.directionAngle = directionAngle

    Entity.list[count] = this
    count +=1

    this.checkCollision = function(){
        for(let index in Entity.list){
            if(Entity.list[index] !== this && Entity.list[index].collidable === true && this.collidable === true){
                if(this instanceof Player){
                if((Entity.list[index].x > this.x-this.width/2 && Entity.list[index].x < this.x+this.width/2 && Entity.list[index].y > this.y-this.height/2 && Entity.list[index].y < this.y+this.height/2)){
                    this.collide(Entity.list[index])
                    
                }
            }else if(this instanceof MapObject){
                console.log( this.y-this.height,Entity.list[index].y,this.y+this.height)
                if((Entity.list[index].x >= this.x-this.width && Entity.list[index].x <= this.x+this.width && Entity.list[index].y >= this.y-this.height && Entity.list[index].y <= this.y+this.height)){
                    this.collide(Entity.list[index])
                }
            }
            } 
        }
    }

    this.collide = function(entity){
        if (this instanceof Player && entity instanceof Missile){
            
            delete Player.list[this.socket.id].die(this.socket)
            delete Entity.list[this.id]
        }else if (this instanceof Player && entity instanceof Player){
            delete Player.list[this.socket.id].die(this.socket)
            delete Entity.list[this.id]
            delete Player.list[entity.socket.id].die(this.socket)
            delete Entity.list[entity.id]  
        }else if (this instanceof MapObject && entity instanceof Player){ // temp
            console.log("collide")
        } else if (this instanceof MapObject && entity instanceof Missile){
            console.log('hit')
            entity.directionAngle = entity.angleReflect(this.directionAngle)
        }
    }
}
Entity.list = {}

Entity.checkAllCollisions = function(){
    for(let index in Entity.list){
        Entity.list[index].checkCollision()
    }
}




