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
   constructor (title, icon) {
     this.currentWindow = null
     this.removeRef = this.removeWindow.bind(this)
     this.minimizeRef = this.minimizeWindow.bind(this)
   }

   /**
    * Creates a new window and adds it to the DOM.
    */
   createWindow (title, icon) {
     setup.addTemplateBody('#window')

     this.currentWindow = document.querySelectorAll('.window')
     this.currentWindow = this.currentWindow[this.currentWindow.length - 1]

     let titleElement = this.currentWindow.querySelector('p')
     let iconElement = this.currentWindow.querySelector('img')

     titleElement.textContent = title
     iconElement.src = icon

     this.currentWindow.addEventListener('click', this.removeRef)
     this.currentWindow.addEventListener('click', this.minimizeRef)

     dragDrop.dragDrop()
   }

   /**
    * Removes the current window.
    *
    * @param {object} event The event from the object that fired it.
    */
   removeWindow (event) {
     if (event.target.id === 'close') {
       document.body.removeChild(this.currentWindow)
     }
   }

   /**
    * Closes the current window.
    *
    * @param {object} event The event from the object that fired it.
    */
   minimizeWindow (event) {
     if (event.target.id === 'minimize') {
       let content = this.currentWindow.querySelector('#windowContent')
       content.classList.toggle('windowMinimize')
     }
   }
}

 // Exports
 module.exports = DesktopWindow
