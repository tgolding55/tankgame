module.exports = MapObject
const Entity = require('./entity')

function MapObject(x,y,width,height,gameid){

    Entity.call(this, x, y, 0, 0,gameid)
    this.width = width
    this.height = height


    MapObject.list[this.id] = this
}
MapObject.list = {}