/**
 * Module for the DesktopWindow type.
 *
 * @module src/js/DesktopWindow
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const dragDrop = require('./dragDrop')

 /**
  * Class representing a window.
  */
 class DesktopWindow {
   constructor () {
     this.prop = null
   }

   /**
    * Creates a new window and adds it to the DOM.
    */
   createWindow () {
     let template = document.querySelector('#window')
     let windowTemplate = document.importNode(template.content, true)
     let container = document.querySelector('#container')
     container.appendChild(windowTemplate)

     let windows = document.querySelectorAll('.window')
     windows[windows.length - 1].id = windows.length

     let windowCloseButtons = document.querySelectorAll('#close')
     windowCloseButtons[windows.length - 1].id = windows.length

     dragDrop.dragDrop()

     container.addEventListener('click', event => {
       console.log(event.target.id)
     })
   }
}

 // Exports
 module.exports = DesktopWindow
