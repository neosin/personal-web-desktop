/**
 * Module for the DesktopWindow type.
 *
 * @module src/js/DesktopWindow
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const setup = require('./setup')

 /**
  * Class representing a window.
  */
 class DesktopWindow {
   constructor (title, icon) {
     this.title = null
     this.icon = null
     this.currentWindow = null
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

     this.addInformation()

     this.currentWindow.addEventListener('focus', event => {
       setup.windowFocus(this.currentWindow)
     })
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
