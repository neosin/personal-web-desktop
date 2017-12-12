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
     this.x = x
     this.y = y
     this.bricks = []
     this.brickCounter = 0
     this.clickedBricks = []
     this.attempts = 0
     this.prevBrick = null
     this.clickRef = this.clickBrickEvent.bind(this)
   }

   createMemory () {
     this.createWindow()
     let allWindows = document.querySelectorAll('.window')
     this.desktopWindow = allWindows[allWindows.length - 1]
     this.desktopWindow.classList.add('memory')
     this.startGame()
   }

   /**
    * Starts the memory game.
    */
   startGame () {
     this._addTemplate('#memory')

     this.createBricks()
     this.shuffleBricks()
     this.printGameboard()
   }

  /**
   * Resets the game.
   */
   resetGame () {
     this.bricks.length = 0
     this.brickCounter = 0
     this.attempts = 0

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

     let div = this.desktopWindow.children[1]

     for (let i = 0; i < this.bricks.length; i++) {
       aTag = document.importNode(template.content, true)
       div.appendChild(aTag)
       div.querySelectorAll('img')[i].id = `b${this.bricks[i] + 1}`
     }

     div.addEventListener('click', this.clickRef)
   }

   /**
    * Turns the clicked bricks face-up.
    *
    * @param {object} event The brick that was clicked.
    */
   clickBrickEvent (event) {
     let element = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild

     if (element.nodeName === 'IMG' && element !== this.prevBrick) {
       element.src = `image/${element.id.slice(1)}.png`
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
     let div = this.desktopWindow.children[1]
     let bricksClicked = this.clickedBricks.slice()

     if (this.clickedBricks.length === 2) {
       if (this.clickedBricks[0].src === this.clickedBricks[1].src) {
         let remove = div.querySelectorAll(`#${event.id}`)

         remove.forEach(current => { current.parentElement.style.visibility = 'hidden' })
         this.brickCounter += 2
       } else {
         setTimeout(() => {
           bricksClicked.forEach(current => { current.src = 'image/0.png' })
           this.prevBrick = null
         }, 1000)
       }

       this.attempts++
       this.clickedBricks.length = 0
     }

     if (this.brickCounter === this.bricks.length) {
       this._addTemplate('#completed')
       div.querySelector('h2').textContent = `Attempts: ${this.attempts}`

       div.querySelector('button').addEventListener('click', event => {
         this.resetGame()
       })
     }
   }

   /**
    * Adds a given template to the DOM.
    *
    * @param {string} id The ID of the template that will be added.
    */
   _addTemplate (id) {
     if (this.desktopWindow.firstElementChild.firstElementChild.nodeName === 'DIV') {
       this.desktopWindow.document.querySelector('#windowContent').removeChild(this.desktopWindow.firstElementChild.firstElementChild)
     }

     let templateClone = document.querySelector(id)
     let template = document.importNode(templateClone.content, true)

     this.desktopWindow.querySelector('#windowContent').appendChild(template)
   }
 }

 // Exports
 module.exports = MemoryGame
