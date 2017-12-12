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

     let drag = document.querySelector('.window')

     let offsetX, offsetY

     drag.addEventListener('dragstart', event => {
       offsetX = event.clientX - drag.offsetLeft
       offsetY = event.clientY - drag.offsetTop
     })

     drag.addEventListener('drag', event => {
       drag.style.left = `${event.clientX - offsetX}px`
       drag.style.top = `${event.clientY - offsetY}px`
     })

     document.addEventListener('dragover', event => {
       event.preventDefault()
     })
   }
}

 // Exports
 module.exports = DesktopWindow
