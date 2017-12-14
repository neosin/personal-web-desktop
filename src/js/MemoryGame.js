/**
 * Module for the Memory Game.
 *
 * @module src/js/MemoryGame.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const currentWindow = require('./DesktopWindow')
 const setup = require('./setup')

 /**
  * Class representing a memory game.
  */
 class MemoryGame extends currentWindow {
  /**
   * Creates an instance of MemoryGame.
   *
   * @memberof MemoryGame
   */
   constructor (x = 4, y = 4) {
     super()

     this.currentWindow = null
     this.appContent = null
     this.x = x
     this.y = y
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
   createMemory () {
     this.createWindow()

     this.currentWindow = document.querySelectorAll('.window')
     this.currentWindow = this.currentWindow[this.windowId]
     this.currentWindow.classList.add('memory')

     this.startGame()
   }

   /**
    * Starts the memory game.
    */
   startGame () {
     setup.editAppContent('#memoryDefault', this.currentWindow)

     this.appContent = this.currentWindow.querySelector('#content')

     this.currentWindow.querySelector('#change').addEventListener('click', event => {
       let select = this.currentWindow.querySelector('select')
       let option = select.value

       this.x = option.slice(0, 1)
       this.y = option.slice(1)
       this.resetGame()
     })

     this.createBricks()
     this.shuffleBricks()
     this.printGameboard()
   }

   resetGame () {
     this.attempts = 0
     this.brickCounter = 0
     this.bricks.length = 0

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
     let element = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild

     if (element.nodeName === 'IMG' && element !== this.prevBrick) {
       element.src = `image/memory/${element.id.slice(1)}.png`
       this.clickedBricks.push(element)

       this.checkClickedBricks(element)
       this.prevBrick = element
     }
   }

   /**
    * Checks if two bricks are clicked and then if they are the same.
    *
    * @param {object} event The brick that was clicked.
    */
   checkClickedBricks (event) {
     let bricksClicked = this.clickedBricks.slice()

     if (this.clickedBricks.length === 2) {
       if (this.clickedBricks[0].src === this.clickedBricks[1].src) {
         let remove = this.appContent.querySelectorAll(`#${event.id}`)

         remove.forEach(current => { current.parentElement.style.visibility = 'hidden' })
         this.brickCounter += 2
       } else {
         setTimeout(() => {
           bricksClicked.forEach(current => { current.src = 'image/memory/0.png' })
           this.prevBrick = null
         }, 1000)
       }

       this.clickedBricks.length = 0
       this.attempts++

       if (this.brickCounter === this.bricks.length) {
         setup.editAppContent('#memoryCompleted', this.currentWindow)

         let attempts = this.currentWindow.querySelector('#attempts')
         attempts.textContent += this.attempts

         this.currentWindow.querySelector('#reset').addEventListener('click', event => {
           this.resetGame()
         })
       }
     }
   }
 }

 // Exports
 module.exports = MemoryGame
