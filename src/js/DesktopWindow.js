/**
 * Module for the DesktopWindow type.
 *
 * @module src/js/DesktopWindow
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const dragDrop = require('./dragDrop')
 const setup = require('./setup')

 /**
  * Class representing a window.
  */
 class DesktopWindow {
   constructor () {
     this.windowId = undefined
   }

   /**
    * Creates a new window and adds it to the DOM.
    */
   createWindow () {
     setup.addTemplateBody('#window')

     dragDrop.dragDrop()

     let windows = document.querySelectorAll('.window')
     let window = windows[windows.length - 1]
     window.id = windows.length - 1

     this.windowId = window.id

     document.addEventListener('click', this.removeWindow)
   }

   /**
    *
    * @param {object} event The event from the object that fired it.
    */
   removeWindow (event) {
     if (event.target.id === 'close') {
       document.body.removeChild(event.target.parentNode.parentNode)
       document.removeEventListener('click', this.removeWindow)
     }
   }
}

 // Exports
 module.exports = DesktopWindow
