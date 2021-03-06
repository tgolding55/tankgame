module.exports = Missile
const Entity = require('./entity')

function Missile(x,y,directionAngle,gameid){
    Entity.call(this,x,y, 20,directionAngle,gameid)
    this.lifeTime = 5
    this.collidable = false
    this.height = 25
    this.width = 25
    this.gameId = gameid
    setTimeout(() => {
        this.collidable = true
    }, 225);



    this.update = function(){
        this.applySpd()
    }

    this.applySpd = function(){
        this.x += this.speed * Math.cos(Math.PI/180 * this.directionAngle);
        this.y += this.speed * Math.sin(Math.PI/180 * this.directionAngle);
    }

     this.angleReflect = function(surfaceAngle){
        const a = surfaceAngle * 2 - this.directionAngle;
        return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
      }

   
    
    Missile.list[this.id] = this
    setTimeout(() => {
        delete Missile.list[this.id] 
        delete Entity.list[this.id]
    }, this.lifeTime * 1000);
}

Missile.list = {}

Missile.update = function(gameid){
    let pack = []

    for(let i in Missile.list){
        const missile = Missile.list[i]
        if(missile.gameId ===gameid){
        missile.update()
        pack.push({
            x: missile.x,
            y: missile.y,
        })
    }
    }
    return pack
}
