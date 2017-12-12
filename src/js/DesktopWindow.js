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
     document.body.appendChild(windowTemplate)

     dragDrop.dragDrop()

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
