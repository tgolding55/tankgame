module.exports = Missile
let Entity = require('./entity')

function Missile(id,x,y,directionAngle){
    Entity.call(this, id,x,y, 12.5,directionAngle)
    console.log(x,y,directionAngle)
    this.lifeTime = 5



    this.update = function(){
        this.applySpd()
    }

    this.applySpd = function(){
        this.x += this.speed * Math.cos(Math.PI/180 * this.directionAngle);
        this.y += this.speed * Math.sin(Math.PI/180 * this.directionAngle);
    }

   

    Missile.list[this.id] = this

    setTimeout(() => {
        delete Missile.list[this.id] 
    }, this.lifeTime * 1000);
}

Missile.list = {}

Missile.update = function(){
    let pack = []

    for(let i in Missile.list){
        const missile = Missile.list[i]
        missile.update()
        pack.push({
            id: missile.id,
            x: missile.x,
            y: missile.y,
            directionAngle: missile.directionAngle,
        })
    }
    return pack
}
