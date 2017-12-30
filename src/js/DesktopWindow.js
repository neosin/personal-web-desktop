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
  /**
   * Creates an instance of DesktopWindow.
   *
   * @memberof DesktopWindow
   */
   constructor () {
     this.currentWindow = null
   }

   /**
    * Creates a new window and adds it to the DOM.
    */
   createWindow () {
     setup.addTemplateBody('#window')

     let allWindows = document.querySelectorAll('.window')
     this.currentWindow = allWindows[allWindows.length - 1]

     setup.windowStack(this.currentWindow)

     this.addInformation()

     this.currentWindow.addEventListener('focus', event => {
       setup.windowFocus(this.currentWindow)
     })
   }

   /**
    * Adds icon and title to the opened application.
    */
   addInformation () {
     let titleElement = this.currentWindow.querySelector('p')
     let iconElement = this.currentWindow.querySelector('img')

     titleElement.textContent = this.title
     iconElement.src = this.icon
   }
}

 // Exports
 module.exports = DesktopWindow
