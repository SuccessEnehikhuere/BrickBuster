'use strict'
//CREATE CANVAS
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

//GAME SOUNDS
const wallHit = new Audio()
wallHit.src = 'audio/wall.mp3'

const lifeLost = new Audio()
lifeLost.src = 'audio/life_lost.mp3'

const controllerHit = new Audio()
controllerHit.src = 'audio/paddle_hit.mp3'

const win = new Audio()
win.src = 'audio/win.mp3'

const blockHit = new Audio()
blockHit.src = 'audio/brick_hit.mp3'

//DOM EEMENTS
const gameLevel = document.getElementById('gameLevel')
const easyButton = document.querySelector('#easyButton')
const mediumButton = document.querySelector('#mediumButton')
const hardButton = document.querySelector('#hardButton')
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const text = document.querySelector('.text')
const startButton = document.getElementById('startButton')

// VALUES
const radius = 10
let x = canvas.width / 2
let y = canvas.height - 30


//if dy is positive, the ball move downwards and if dx is negative, the ball moves to the left

const controllerHeight = 10
const controllerWidth = 120

let controllerX = (canvas.width - controllerWidth) / 2
let controllerY = canvas.height - controllerHeight - 10

let leftPressed = false
let rightPressed = false
let gameOver = false
let gameInterval

//VARIABLES FOR THE GAME BLOCKS
let blockHeight = 20
let blockWidth = 70
let blockPadding = 3
let blockTopOffset = 20
let blockLeftOffset = 20
const blockColumn = 5
const blockRow = 5

let score = 0
let lives = 3

const speeds = {
  easy: { dx: 4, dy: -4 },
  medium: { dx: 6, dy: -6 },
  hard: { dx: 8, dy: -8 },
}

// Set default level to easy
let currentSpeed = 'easy'
let currentLevel = 'easy'
let dx = speeds[currentLevel].dx
let dy = speeds[currentLevel].dy

//this variable stores the creation of the 2d blocks using the array.from method
const blocks = Array.from({ length: blockColumn }, () =>
  Array.from({ length: blockRow }, () => ({ x: 0, y: 0, status: 1 }))
)

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', KeyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

// document.addEventListener('touchstart', touchStartHandler, false)
// document.addEventListener('touchmove', touchMoveHandler, false)
// document.addEventListener('touchend', touchEndHandler, false)

let touchX = null

getSpeedFromStorage();

// function touchStartHandler(e) {
//   e.preventDefault()
//   const touch = e.touches[0]
//   touchX = touch.clientX
// }

// function touchMoveHandler(e) {
//   e.preventDefault()
//   if (!touchX) return
//   const touch = e.touches[0]
//   const relativeX = touch.clientX - touchX
//   touchX = touch.clientX
//   moveController(relativeX)
// }

// function touchEndHandler(e) {
//   e.preventDefault()
//   touchX = null
// }

// function moveController(relativeX) {
//   const newX = controllerX + relativeX
//   if (newX > 0 && newX < canvas.width - controllerWidth) {
//     controllerX = newX
//   }
// }

function keyDownHandler(e) {
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

function mouseMoveHandler(e) {
  //The offsetLeft property is a standard DOM property that is available on HTML elements
  //clientX represents the horizontal coordinate (X-coordinate) of the mouse pointer relative to the viewport at the moment when the event occurred.
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    controllerX = relativeX - controllerWidth / 2
  }
}

// SET SPEED BASED ON SELECTED LEVEL
function setSpeed(level) {
  const speed = speeds[level]
  if (speed) {
    dx = speed.dx
    dy = speed.dy
    currentLevel = level
    currentSpeed = level
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const gameLevelButton = document.getElementById('gameLevel')
  const displayLevelDiv = document.querySelector('.display-level')
  const closeButton = document.querySelector('#closeButton')

  if (gameLevelButton && displayLevelDiv) {
    gameLevelButton.addEventListener('click', function () {
      displayLevelDiv.classList.remove('hide-level')
    })
  }

  if (displayLevelDiv && closeButton) {
    closeButton.addEventListener('click', function () {
      displayLevelDiv.classList.add('hide-level')
    })
  }
})

easyButton.addEventListener('click', () => setSpeed('easy'))
mediumButton.addEventListener('click', () => setSpeed('medium'))
hardButton.addEventListener('click', () => setSpeed('hard'))

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#e2e8f0'
  ctx.fill()
  ctx.closePath()
}

function gameController() {
  ctx.beginPath()
  ctx.roundRect(controllerX, controllerY, controllerWidth, controllerHeight, 5),
    (ctx.fillStyle = '#F09F61')
  ctx.fill()
  ctx.closePath()
}

function createBlocks() {
  //calculates the total width required for all columns of blocks, removing the padding after the last block
  const totalBlocksWidth =
    blockColumn * (blockWidth + blockPadding) - blockPadding

  //the offsetX is calculated by subtracting the canvas width from the totalblockswidth, and that gives the remaining space after the blocks have been placed. diving by 2 places the block in the center horizontally
  const offsetX = (canvas.width - totalBlocksWidth) / 2

  //this positions the blocks from the top to the bottom. if blockTopOffset is set to 0, the blocks starts directly from the top
  const offsetY = blockTopOffset

  blocks.forEach((column, c) => {
    column.forEach((block, r) => {
      if (block.status === 1) {
        const blockX = offsetX + c * (blockWidth + blockPadding)
        const blockY =
          offsetY + r * (blockHeight + blockPadding) + blockTopOffset
        ctx.beginPath()
        ctx.rect(blockX, blockY, blockWidth, blockHeight)
        ctx.fillStyle = '#3EB377'
        ctx.fill()
        ctx.closePath()
      }
    })
  })
}

function bounceBall() {
  if (gameOver) {
    // clearInterval(gameInterval);
    enableStartButton()
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall();
  gameController();
  createBlocks();
  createScore();
  gameLives();
  ballBlocksDetection();

  if (x + dx > canvas.width - radius || x + dx < radius) {
    dx = -dx
    wallHit.play()
  }

  if (y + dy < radius) {
    dy = -dy
  } else if (y + dy > canvas.height - radius) {
    // Collision with bottom edge of canvas
    if (
      x > controllerX - radius &&
      x < controllerX + controllerWidth + radius
    ) {
      dy = -dy
      controllerHit.play()
    } else {
      lives--
      lifeLost.play()
      if (!lives) {
        // alert('Game Over');
        // document.location.reload();

        gameOver = true;
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        text.innerText = `you lose!😭😭 \nYour score: ${score}`
         text.style.color = '#cf4a3b'
       
      } else {
        // Reset the ball position
        x = canvas.width / 2
        y = canvas.height - 30
        // dx = 3
        // dy = -3
        dx = speeds[currentSpeed].dx
        dy = speeds[currentSpeed].dy
        controllerX = (canvas.width - controllerWidth) / 2
      }
    }
  }

  // Ball-controller collision detection
  if (
    x + radius > controllerX &&
    x - radius < controllerX + controllerWidth &&
    y + dy > canvas.height - controllerHeight - radius
  ) {
    dy = -dy
  }

  // Move gameController
  if (rightPressed && controllerX < canvas.width - controllerWidth) {
    controllerX += 7
  } else if (leftPressed && controllerX > 0) {
    controllerX -= 7
  }

  x += dx
  y += dy

  gameInterval = requestAnimationFrame(bounceBall)
}

function createScore() {
  ctx.font = '18px Germania one'
  ctx.fillStyle = '#F0F8FF'
  ctx.fillText(`Score: ${score}`, 8, 20)
}

function gameLives() {
  ctx.font = '18px Germania one'
  ctx.fillStyle = '#F0F8FF'
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

function ballBlocksDetection() {
  const totalBlocksWidth =
    blockColumn * (blockWidth + blockPadding) - blockPadding
  const offsetX = (canvas.width - totalBlocksWidth) / 2
  const offsetY = blockTopOffset

  blocks.forEach((column, c) => {
    column.forEach((block, r) => {
      const blockX = offsetX + c * (blockWidth + blockPadding)
      const blockY = offsetY + r * (blockHeight + blockPadding)

      // Checking for collision with each block
      if (
        block.status === 1 &&
        x + radius > blockX &&
        x - radius < blockX + blockWidth &&
        y + radius > blockY &&
        y - radius < blockY + blockHeight
      ) {
        block.status = 0
        dy = -dy // Changes ball's vertical direction on collision
        blockHit.play()
        // this adjusts score based on speed level
        let scoreIncrement = 2

        if (currentSpeed === 'medium') {
          scoreIncrement *= 1.5
        } else if (currentSpeed === 'hard') {
          scoreIncrement *= 2
        }

        score += scoreIncrement
        //save speed to localstorage
        localStorage.setItem('currentSpeed', currentSpeed)
        //save the score to local storage
        localStorage.setItem('score', score)

        let targetScore
        if (currentSpeed === 'medium') {
          targetScore = 3 * (blockColumn * blockRow)
        } else if (currentSpeed === 'hard') {
          targetScore = 4 * (blockColumn * blockRow)
        } else {
          targetScore = 2 * (blockColumn * blockRow)
        }

        if (score >= targetScore) {
          gameOver = true;
          win.play();
          modal.classList.remove('hidden')
          overlay.classList.remove('hidden')
          text.innerText = `you win!!🎉🏅 \nyour score: ${score}`
           text.style.color = '#3EB377';
        }
      }
    })
  })
}

function getSpeedFromStorage() {
  const savedSpeed = localStorage.getItem('currentSpeed')
  if (savedSpeed && speeds.hasOwnProperty(savedSpeed)) {
    currentSpeed = savedSpeed
  } else {
    currentSpeed = 'easy'
  }
  dx = speeds[currentSpeed].dx
  dy = speeds[currentSpeed].dy
}

function initializeGame() {
  gameOver = true
  score = 0
  lives = 3

  // Reset ball position and controller position
  x = canvas.width / 2
  y = canvas.height - 30
  controllerX = (canvas.width - controllerWidth) / 2

  // Reset block status
  blocks.forEach((column) => {
    column.forEach((block) => {
      block.status = 1
    })
  })

  // Draw initial game state (bricks, controller, score, lives)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  createBlocks()
  gameController()
  createScore()
  gameLives()
}

//ENABLE AND DISABLE START BUTTON
function disableStartButton() {
  startButton.disabled = true
}

function enableStartButton() {
  startButton.disabled = false
}

//CLOSE MODAL
const closeModal = document.querySelector('.close-modal')
closeModal.addEventListener('click', restartGame)

//START GAME
startButton.addEventListener('click', () => {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
  gameOver = false
  gameInterval = requestAnimationFrame(bounceBall)
  disableStartButton()
})

gameController()
createBlocks()
createScore()
gameLives()
initializeGame()

//GAME-SOUND
const gameSoundElement = document.querySelector('.sound-img')
gameSoundElement.addEventListener('click', gameSoundManager)

function gameSoundManager() {
  //Toggle gameSound Image
  const gameSoundSrc = gameSoundElement.getAttribute('src')
  const gameSoundImg =
    gameSoundSrc === 'images/SOUND_ON.png'
      ? 'images/SOUND_OFF.png'
      : 'images/SOUND_ON.png'
  gameSoundElement.setAttribute('src', gameSoundImg)

  //toggle all game sounds
  wallHit.muted = wallHit.muted ? false : true
  blockHit.muted = blockHit.muted ? false : true
  controllerHit.muted = controllerHit.muted ? false : true
  win.muted = win.muted ? false : true
  lifeLost.muted = lifeLost.muted ? false : true
}

//RESTARTING THE GAME
const restartGameElement = document.querySelector('.reset-btn')
restartGameElement.addEventListener('click', restartGame)

function restartGame() {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
  initializeGame();
  enableStartButton();
}
