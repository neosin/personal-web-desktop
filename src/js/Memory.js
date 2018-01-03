/**
 * Module for the memory game.
 *
 * @module src/js/Memory.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const DesktopWindow = require('./DesktopWindow')
 const setup = require('./setup')

 /**
  * Class representing a memory game.
  */
 class MemoryGame extends DesktopWindow {
  /**
   * Creates an instance of MemoryGame.
   *
   * @memberof MemoryGame
   */
   constructor (x = 4, y = 4) {
     super()

     this.title = 'Memory'
     this.icon = '/image/appIcons/game.png'
     this.x = x
     this.y = y
     this.timer = undefined
     this.time = 0
     this.appContent = null
     this.bricks = []
     this.brickCounter = 0
     this.clickedBricks = []
     this.attempts = 0
     this.prevBrick = null
     this.clickRef = this.clickBrickEvent.bind(this)
   }

   /**
    * Creates a new memory game window.
    */
   createMemoryWindow () {
     this.createWindow()
     this.currentWindow.classList.add('memory')

     setup.editAppContent('#memoryDefault', this.currentWindow)

     this.startGame()
   }

   /**
    * Starts the memory game.
    */
   startGame () {
     this.appContent = this.currentWindow.querySelector('.content')

     this.currentWindow.querySelector('.change').addEventListener('click', event => {
       let option = this.currentWindow.querySelector('select').value

       this.x = option.slice(0, 1)
       this.y = option.slice(1)

       this.resetGame()
     })

     this.createBricks()
     this.shuffleBricks()
     this.printGameboard()
   }

   /**
    * Resets the game.
    */
   resetGame () {
     this.attempts = 0
     this.brickCounter = 0
     this.bricks.length = 0
     this.time = 0
     this.prevBrick = null

     clearTimeout(this.timer)
     this.timer = undefined

     setup.editAppContent('#memoryReset', this.currentWindow)

     this.startGame()
   }

   /**
    * Creates all the bricks needed for the game.
    */
   createBricks () {
     for (let i = 0; i < (this.x * this.y) / 2; i++) {
       this.bricks.push(i, i)
     }
   }

   /**
    * Shuffles the memory bricks.
    */
   shuffleBricks () {
     for (let i = 0; i < this.bricks.length; i++) {
       let random = Math.floor(Math.random() * this.bricks.length)
       let temp = this.bricks[i]
       this.bricks[i] = this.bricks[random]
       this.bricks[random] = temp
     }
   }

   /**
    * Prints out the game board.
    */
   printGameboard () {
     let template = document.querySelector('#memoryBricks')
     let aTag

     for (let i = 0; i < this.bricks.length; i++) {
       aTag = document.importNode(template.content, true)
       this.appContent.appendChild(aTag)
       this.appContent.querySelectorAll('img')[i].id = `b${this.bricks[i] + 1}`
     }

     this.appContent.addEventListener('click', this.clickRef)
   }

   /**
    * Turns the clicked bricks face-up.
    *
    * @param {object} event The brick that was clicked.
    */
   clickBrickEvent (event) {
     let element = event.target.closest('img')

     if (element !== this.prevBrick && element) {
       if (!this.timer) { this.timer = setInterval(() => { this.time += 0.1 }, 100) }

       element.src = `image/memory/${element.id.slice(1)}.png`

       this.clickedBricks.push(element)
       this.prevBrick = element

       if (this.clickedBricks.length === 2) {
         this.checkClickedBricks(element)
       }
     }
   }

   /**
    * Checks if two bricks are clicked and then if they are the same.
    *
    * @param {object} event The brick that was clicked.
    */
   checkClickedBricks (event) {
     let bricksClicked = this.clickedBricks.slice()

     if (bricksClicked[0].src === bricksClicked[1].src) {
       bricksClicked[0].closest('a').style.visibility = 'hidden'
       bricksClicked[1].closest('a').style.visibility = 'hidden'

       this.brickCounter += 2
     } else {
       setTimeout(() => {
         bricksClicked[0].src = '/image/memory/0.png'
         bricksClicked[1].src = '/image/memory/0.png'
       }, 1000)
     }

     this.attempts++
     this.clickedBricks.length = 0
     this.prevBrick = null

     this.checkIfCopleted()
   }

   /**
    * Checks if the game is completed or not.
    */
   checkIfCopleted () {
     if (this.brickCounter === this.bricks.length) {
       setup.editAppContent('#memoryCompleted', this.currentWindow)

       clearInterval(this.timer)

       this.currentWindow.querySelector('.attempts').textContent += this.attempts
       this.currentWindow.querySelector('.time').textContent += `${Math.round((this.time * 10) / 10)}s`

       this.currentWindow.querySelector('.reset').addEventListener('click', event => this.resetGame())
     }
   }
 }

 // Exports
 module.exports = MemoryGame
