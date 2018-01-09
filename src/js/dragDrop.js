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

   document.addEventListener('dragstart', event => {
     event.dataTransfer.effectAllowed = 'move'

     offsetX = event.clientX - event.target.offsetLeft
     offsetY = event.clientY - event.target.offsetTop

     event.target.classList.add('windowDrag')
   })

   document.addEventListener('drag', event => {
     if (event.target.nodeName === 'DIV') {
       event.target.style.left = `${event.clientX - offsetX}px`
       event.target.style.top = `${event.clientY - offsetY}px`

       let rect = event.target.getBoundingClientRect()

       if (rect.top < 0) { event.target.style.top = '0px' }
       if (rect.left < 0) { event.target.style.left = '0px' }
       if (rect.right > window.innerWidth) { event.target.style.left = `${window.innerWidth - rect.width}px` }
       if (rect.bottom > window.innerHeight) { event.target.style.top = `${window.innerHeight - rect.height}px` }
     }
   })

   document.addEventListener('dragover', event => event.preventDefault())
   document.addEventListener('dragend', event => event.target.classList.remove('windowDrag'))
 }

 // Exports
 module.exports.dragDrop = dragDrop
