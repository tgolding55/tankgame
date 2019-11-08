

document.addEventListener("DOMContentLoaded", function(){
const socket = io()

const blueTank = document.querySelector("#blueTank")
const blueTurret = document.querySelector("#blueTurret")

const greenTank = document.querySelector("#greenTank")
const greenTurret = document.querySelector("#greenTurret")

const yellowTank = document.querySelector("#yellowTank")
const yellowTurret = document.querySelector("#yellowTurret")

const pinkTank = document.querySelector("#pinkTank")
const pinkTurret = document.querySelector("#pinkTurret")

const missile = document.querySelector("#missile")
const canvas = document.querySelector("#game")
const ctx = canvas.getContext("2d");
let curMap

socket.on('loadMap', function(pack){    
    curMap = pack
    drawMap()
})

function drawMap(){
    
    curMap.forEach(mapObject =>{
        ctx.fillRect(mapObject.x-mapObject.width/2, mapObject.y-mapObject.height/2 , mapObject.width, mapObject.height)

    })
}


socket.on('newPosition', function(pack){
    ctx.clearRect(0,0,1250,600)
    drawMap()
    for(let i = 0; i<pack.player.length; i++){
        let tankBase 
        let tankTurret
        if(pack.player[i].alive){
        switch(pack.player[i].colour) {
            case 0:
                tankBase =blueTank
                tankTurret = blueTurret
                break
            case 1:
                tankBase =greenTank
                tankTurret = greenTurret
                break
            case 2:
                tankBase =yellowTank
                tankTurret = yellowTurret
                break
            case 3:
                tankBase =pinkTank
                tankTurret = pinkTurret
                break
            default:
                tankBase = blueTank
                tankTurret = blueTurret
                break
        }
    }else{
        tankBase = missile
        tankTurret= missile
    }
        drawTank(tankBase, pack.player[i].x, pack.player[i].y, 100, 100, pack.player[i].directionAngle +90, tankTurret)
    }

    for(let i = 0; i<pack.missile.length; i++){
        drawMissile(missile, pack.missile[i].x , pack.missile[i].y, 25, 25)
    }

    function drawTank(img,x,y,width,height,deg, tankTurret){
        ctx.save()      
        const rad = deg * Math.PI / 180;
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.drawImage(img,(width / 2 * (-1))+25,(height / 2 * (-1))+25,width,height);
        drawTurret(tankTurret, (width / 2 * (-1))+31.25, (height / 2 * (-1))+11.25, width/2, height)
        ctx.restore();
    }


    function drawTurret(img,x,y,width,height){
        ctx.save()
        ctx.translate(x + width / 2, y + height / 2);
        ctx.drawImage(img,(width / 2 * (-1)),(height / 2 * (-1)),width,height);
        ctx.restore();
    }

    function drawMissile(img,x,y,width,height){
        ctx.save()
        ctx.translate(x , y);
        ctx.drawImage(img,(width / 2 * (-1))+6.25,(height / 2 * (-1))+6.25,width,height);
        ctx.restore();    
    }
})

document.onkeydown = function(e){
    switch(e.keyCode){
        case 68:
            socket.emit('keyPress', {inputId:'right', state:true})
            break
        case 83:
            socket.emit('keyPress', {inputId:'down', state:true})
            break
        case 65:
            socket.emit('keyPress', {inputId:'left', state:true})
            break
        case 87:
            socket.emit('keyPress', {inputId:'up', state:true})
            break
        case 32:
            socket.emit('keyPress', {inputId:'attack', state:true})
            break
    }
}

document.onkeyup = function(e){
    switch(e.keyCode){
        case 68:
            socket.emit('keyPress', {inputId:'right', state:false})
            break
        case 83:
            socket.emit('keyPress', {inputId:'down', state:false})
            break
        case 65:
            socket.emit('keyPress', {inputId:'left', state:false})
            break
        case 87:
            socket.emit('keyPress', {inputId:'up', state:false})
            break
        case 32:
            socket.emit('keyPress', {inputId:'attack', state:false})
            break
    }
}


/*
document.onmousemove = function(event){
    let x = -250 + event.clientX - 8;
    let y = -250 + event.clientY - 8;
    let angle = Math.atan2(y,x) / Math.PI * 180;
    socket.emit('keyPress', {inputId:'mouseAngle', state:angle})
}*/


})