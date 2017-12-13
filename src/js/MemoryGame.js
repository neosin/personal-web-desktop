/**
 * Module for the Memory Game.
 *
 * @module src/js/MemoryGame.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const DesktopWindow = require('./DesktopWindow')

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

     this.desktopWindow = null
     this.memoryContent = null
     this.windowContent = null
     this.memoryControlls = null
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

     this.desktopWindow = document.querySelectorAll('.window')
     this.desktopWindow = this.desktopWindow[this.windowId]
     this.desktopWindow.classList.add('memory')

     this.startGame()
   }

   /**
    * Starts the memory game.
    */
   startGame () {
     let template = document.querySelector('#memory')
     this.desktopWindow.querySelector('#windowContent').appendChild(document.importNode(template.content, true))

     this.memoryContent = this.desktopWindow.querySelector('#memoryContent')
     this.windowContent = this.desktopWindow.querySelector('#windowContent')
     this.memoryControlls = this.desktopWindow.querySelector('#memoryControlls')

     this.desktopWindow.querySelector('#start').addEventListener('click', event => {
       this.windowContent.removeChild(this.memoryContent)
       this.windowContent.removeChild(this.memoryControlls)

       this.bricks.length = 0
       this.brickCounter = 0
       this.attempts = 0

       this.startGame()
     })

     this.createBricks()
     this.shuffleBricks()
     this.printGameboard()
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
       this.memoryContent.appendChild(aTag)
       this.memoryContent.querySelectorAll('img')[i].id = `b${this.bricks[i] + 1}`
     }

     this.memoryContent.addEventListener('click', this.clickRef)
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
         let remove = this.memoryContent.querySelectorAll(`#${event.id}`)

         remove.forEach(current => { current.parentElement.style.visibility = 'hidden' })
         this.brickCounter += 2
       } else {
         setTimeout(() => {
           bricksClicked.forEach(current => { current.src = 'image/memory/0.png' })
           this.prevBrick = null
         }, 1000)
       }

       this.clickedBricks.length = 0

       if (this.brickCounter === this.bricks.length) {
       }
     }
   }
 }

 // Exports
 module.exports = MemoryGame
