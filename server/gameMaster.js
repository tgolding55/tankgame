module.exports = GameMaster
let Player = require('./player')
let Missile = require('./missile')
let Entity = require('./entity')
let MapObject = require('./mapobject')


function GameMaster(){
    new MapObject(300,75,50, 150)
    new MapObject(200,300,400, 50)
  
    new MapObject(300,525,50, 150)
  
    new MapObject(625,300,50, 250)
  
    new MapObject(950,75,50, 150)
    new MapObject(1050,300,400, 50)
  
    new MapObject(950, 525,50, 150)


    
}