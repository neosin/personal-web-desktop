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
     this.currentWindow = null
     this.removeRef = this.removeWindow.bind(this)
     this.minimizeRef = this.minimizeWindow.bind(this)
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

     this.currentWindow = document.querySelectorAll('.window')
     this.currentWindow = this.currentWindow[this.windowId]

     document.addEventListener('click', this.removeRef)
     document.addEventListener('click', this.minimizeRef)
   }

   /**
    *
    * @param {object} event The event from the object that fired it.
    */
   removeWindow (event) {
     if (event.target.id === 'close') {
       document.body.removeChild(this.currentWindow)
       document.removeEventListener('click', this.removeWindow)
     }
   }

   minimizeWindow (event) {
     if (event.target.id === 'minimize') {
       let content = this.currentWindow.querySelector('#windowContent')
       content.style.display = 'none'
     }
   }
}

 // Exports
 module.exports = DesktopWindow
