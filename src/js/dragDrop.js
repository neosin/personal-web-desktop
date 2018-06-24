/**
 * Module for the drag and drop function.
 *
 * @module src/js/dragDrop
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 /**
  * Function used to drag and drop a window.
  */
 function dragDrop () {
   let offsetX, offsetY
   let currentWindow

   document.addEventListener('dragstart', event => {
     event.dataTransfer.setData('x', 'x')

     event.dataTransfer.effectAllowed = 'move'

     offsetX = event.clientX - event.target.offsetLeft
     offsetY = event.clientY - event.target.offsetTop

     event.target.classList.add('windowDrag')

     currentWindow = event.target
   })

   document.addEventListener('dragover', event => {
     currentWindow.style.left = `${event.clientX - offsetX}px`
     currentWindow.style.top = `${event.clientY - offsetY}px`

     let rect = currentWindow.getBoundingClientRect()

     if (rect.top < 0) { currentWindow.style.top = '0px' }
     if (rect.left < 0) { currentWindow.style.left = '0px' }
     if (rect.right > window.innerWidth) { currentWindow.style.left = `${window.innerWidth - rect.width}px` }
     if (rect.bottom > window.innerHeight) { currentWindow.style.top = `${window.innerHeight - rect.height}px` }

     event.preventDefault()
   })

   document.addEventListener('dragend', event => event.target.classList.remove('windowDrag'))
 }

 // Exports
 module.exports.dragDrop = dragDrop
