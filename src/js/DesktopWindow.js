/**
 * Module for the DesktopWindow type.
 *
 * @module src/js/DesktopWindow
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 /**
  * Class representing a window.
  */
 class DesktopWindow {
   constructor () {
   }

   createWindow () {
     let template = document.querySelector('#window')
     let windowTemplate = document.importNode(template.content, true)
     document.body.appendChild(windowTemplate)
   }
}

 // Exports
 module.exports = DesktopWindow
