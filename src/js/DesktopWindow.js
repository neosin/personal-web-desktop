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

     this.windowPlacement()
     this.addInformation()

     this.currentWindow.addEventListener('focus', event => {
       let allWindows = document.querySelectorAll('.window')
       for (let i = 0; i < allWindows.length; i++) {
         allWindows[i].style.zIndex = 0
       }

       this.currentWindow.style.zIndex = 100
     })
   }

   /**
    * Adds icon and title to the opened application.
    */
   addInformation () {
     this.currentWindow.querySelector('p').textContent = this.title
     this.currentWindow.querySelector('img').src = this.icon
   }

   /**
    * Controlls the stacking and bouncing of the windows.
    */
   windowPlacement () {
     let allWindows = document.querySelectorAll('.window')
     let focusedWindow

     allWindows.forEach(current => {
       if (current.style.zIndex > 50) {
         focusedWindow = current
         focusedWindow.style.zIndex = 49
       }
     })

     if (focusedWindow) {
       this.currentWindow.style.top = `${focusedWindow.offsetTop + 30}px`
       this.currentWindow.style.left = `${focusedWindow.offsetLeft + 30}px`
     } else if (allWindows.length > 1) {
       this.currentWindow.style.top = `${allWindows[allWindows.length - 2].offsetTop + 30}px`
       this.currentWindow.style.left = `${allWindows[allWindows.length - 2].offsetLeft + 30}px`
     }

     if (this.currentWindow.offsetTop > window.innerHeight - 30) {
       this.currentWindow.style.top = '8px'
     }
   }
}

 // Exports
 module.exports = DesktopWindow
