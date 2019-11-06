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
               
                if(Entity.list[index].x > this.x-this.width/2 && Entity.list[index].x < this.x+this.width/2 && Entity.list[index].y > this.y-this.height/2 && Entity.list[index].y < this.y+this.height/2){
                    this.collide(Entity.list[index])
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
            
        } else if (entity instanceof Missile){
            console.log('hit')
            entity.directionAngle = entity.angleReflect(entity.findSide(this))
        }
    }
    this.findSide = function(wall){
        console.log(Math.ceil((wall.x - wall.width/2)/10)*10 , Math.ceil((this.x - this.width/2)/10)*10,  Math.ceil((wall.x +wall.width/2)/10)*10 , Math.ceil((this.x + this.width/2)/10)*10)
        if(Math.ceil((wall.x - wall.width/2)/10)*10 === Math.ceil((this.x - this.width/2)/10)*10 || Math.ceil((wall.x +wall.width/2)/10)*10 === Math.ceil((this.x + this.width/2)/10)*10){
            return 90
        } else {
            return 0
        }
    }
}
Entity.list = {}

Entity.checkAllCollisions = function(){
    for(let index in Entity.list){
        Entity.list[index].checkCollision()
    }
}




