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
     this.title = null
     this.icon = null
     this.currentWindow = null
     this.previouslyClickedWindow = null
     this.removeRef = this.removeWindow.bind(this)
     this.minimizeRef = this.minimizeWindow.bind(this)
   }

   /**
    * Creates a new window and adds it to the DOM.
    */
   createWindow (title, icon) {
     this.title = title
     this.icon = icon

     setup.addTemplateBody('#window')

     let allWindows = document.querySelectorAll('.window')
     this.currentWindow = allWindows[allWindows.length - 1]

     this.currentWindow.style.zIndex = 200

     this.addInformation()

     this.currentWindow.addEventListener('focus', event => {
       setup.windowFocus(this.currentWindow)
     })

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

   addInformation () {
     let titleElement = this.currentWindow.querySelector('p')
     let iconElement = this.currentWindow.querySelector('img')

     titleElement.textContent = this.title
     iconElement.src = this.icon
   }
}

 // Exports
 module.exports = DesktopWindow
