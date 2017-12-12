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
   constructor () {
     super()
   }

   createMemory () {
     this.createWindow()
   }
 }

 // Exports
 module.exports = MemoryGame
