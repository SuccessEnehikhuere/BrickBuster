'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const radius = 10
let x = canvas.width / 2
let y = canvas.height - 30
let dx = 2
let dy = -2
//if dy is positive, the ball move downwards and if dx is negative, the ball moves to the left

const controllerHeight = 15
const controllerWidth = 100

let controllerX = (canvas.width - controllerWidth) / 2
let controllerY = canvas.height - controllerHeight

let leftPressed = false
let rightPressed = false

let gameInterval

//variables for the blocks
let blockHeight = 22
let blockWidth = 72
let blockPadding = 10
let blockTopOffset = 5
let blockLeftOffset = 20
const blockColumn = 5
const blockRow = 3

//this variable stores the creation of the 2d blocks using the array.from method
const blocks = Array.from({ length: blockColumn }, () =>
  Array.from({ length: blockRow }, () => ({ x: 0, y: 0 }))
)

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', KeyUpHandler, false)

// canvas.addEventListener('mousemove', mouseMoveHandler, false)

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

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#0ff'
  ctx.fill()
  ctx.closePath()
}

function gameController() {
  ctx.beginPath()
  ctx.rect(controllerX, controllerY, controllerWidth, controllerHeight),
    (ctx.fillStyle = '#0ff')
  ctx.fill()
  ctx.closePath()
}

function createBlocks() {
  const totalBlocksWidth =
    blockColumn * (blockWidth + blockPadding) - blockPadding
 

    const offsetX = (canvas.width - totalBlocksWidth) / 2
    const offsetY = blockTopOffset

  blocks.forEach((column, c) => {
    column.forEach((block, r) => {
      const blockX = offsetX + c * (blockWidth + blockPadding) 
      const blockY = offsetY + r * (blockHeight + blockPadding) + blockTopOffset
      ctx.beginPath()
      ctx.rect(blockX, blockY, blockWidth, blockHeight)
      ctx.fillStyle = '#0ff'
      ctx.fill()
      ctx.closePath()
    })
  })
}

function bounceBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  gameController()
  createBlocks()

  if (x + dx > canvas.width - radius || x + dx < radius) {
    dx = -dx
  }

  if (y + dy < radius) {
    dy = -dy
  } else if (y + dy > canvas.height - radius) {
    if (x > controllerX && x < controllerX + controllerWidth) {
      dy = -dy
    } else {
      clearInterval(gameInterval)
      alert('game over')
      document.location.reload()
      return
    }
  }

  if (rightPressed) {
    controllerX = Math.min(controllerX + 7, canvas.width - controllerWidth)
  } else if (leftPressed) {
    controllerX = Math.max(controllerX - 7, 0)
  }

  x += dx
  y += dy
}

function playGameSound() {
  const gameSound = document.getElementById('gameSound')
  if (gameSound) {
    gameSound.play()
  }
}

function gameTimer() {
  gameInterval = setInterval(bounceBall, 10)
}

const startButton = document.getElementById('startButton')
if (startButton) {
  startButton.addEventListener('click', () => {
    gameTimer()
    playGameSound()
    startButton.disabled = true
  })
}

gameController()
createBlocks()
