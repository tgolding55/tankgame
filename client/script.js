
document.addEventListener("DOMContentLoaded", function(){
    const socket = io()

const blueTank = document.querySelector("#blueTank")
const canvas = document.querySelector("#game")
const ctx = canvas.getContext("2d");
ctx.font = "30px Arial"
socket.on('newPosition', function(pack){
    ctx.clearRect(0,0,500,500)

    for(let i = 0; i<pack.player.length; i++){        
        ctx.drawImage(blueTank, pack.player[i].x, pack.player[i].y, 100, 100)
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
    }
}

document.onmousedown = function(event){
    socket.emit('keyPress', {inputId:'attack', state: true})
}
document.onmouseup = function(event){
    socket.emit('keyPress', {inputId:'attack', state: false})
}

document.onmousemove = function(event){
    let x = -250 + event.clientX - 8;
    let y = -250 + event.clientY - 8;
    let angle = Math.atan2(y,x) / Math.PI * 180;
    socket.emit('keyPress', {inputId:'mouseAngle', state:angle})
}


})