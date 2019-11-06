module.exports = MapObject
let Entity = require('./entity')

function MapObject(x,y,width,height){

    Entity.call(this, x, y, 0, 0)
    this.width = width
    this.height = height


    MapObject.list[this.id] = this
}
MapObject.list = {}