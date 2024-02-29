'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let x = canvas.width / 2
let y = canvas.height - 30
const radius = 10
let dx = 2
let dy = -2
//if dy is positive, the ball move downwards and if dx is negative, the ball moves to the left

const controllerHeight = 15;
const controllerWidth = 100;

let controllerX = (canvas.width - controllerWidth) /2

let controllerY = (canvas.height - controllerHeight)

let leftPressed = false;
let rightPressed = false;


document.addEventListener('keydown', keyDownHandler, false)

document.addEventListener('keyup', KeyUpHandler, false)

function keyDownHandler(e) {
  console.log('hello')
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'left' || e.key === 'ArrowLeft') {
    leftPressed = true
  }
}

function KeyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'left' || e.key === 'ArrowLeft') {
    leftPressed = false
  }
}



const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#0ff';
  ctx.fill();
  ctx.closePath();
}

const playGameSound = ()=>{
  const gameSound = document.getElementById('gameSound');
  gameSound.play()
}

const gameController = () => {
  ctx.beginPath()
  ctx.rect(controllerX, controllerY, controllerWidth, controllerHeight),
    (ctx.fillStyle = '#0ff')
  ctx.fill()
  ctx.closePath()
} 


const bounceBall = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  gameController()

  if (x + dx > canvas.width - radius || x + dx < radius) {
    dx = - dx

  }
  if (y + dy > canvas.height - radius || y + dy < radius) {
    dy = - dy
  }


if (rightPressed) {
    controllerX = Math.min(controllerX + 7, canvas.width - controllerWidth)
  } else if (leftPressed) {
    controllerX = Math.max(controllerX - 7, 0)
  }

  x += dx
  y += dy
  
}


const gameTimer = () => {
   setInterval(bounceBall, 10)
}


document.getElementById('startButton').addEventListener('click', function () {
  gameTimer()
  playGameSound()
  this.disabled = true
})






