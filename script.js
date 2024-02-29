'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let x = canvas.width / 2
let y = canvas.height - 30
const radius = 10
let dx = 2
let dy = -2
//if dy is positive, the ball move downwards and if dx is negative, the ball moves to the left

const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

const playGameSound = ()=>{
  const gameSound = document.getElementById('gameSound');
  gameSound.play()
}
const bounceBall = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  if (x + dx > canvas.width - radius || x + dx < radius) {
    dx = -dx
  }
  if (y + dy > canvas.height - radius || y + dy < radius) {
    dy = -dy
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
