/**
 * Module for the drag and drop function.
 *
 * @module src/js/dragDrop.js
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 /**
  * Is used to be able to move a window.
  */
 function dragDrop () {
   let offsetX, offsetY

   document.addEventListener('dragstart', event => {
     event.dataTransfer.effectAllowed = 'move'

     offsetX = event.clientX - event.target.offsetLeft
     offsetY = event.clientY - event.target.offsetTop

     event.target.classList.add('windowDrag')
   })

   document.addEventListener('dragenter', event => {
     event.dataTransfer.dropEffect = 'move'
   })

   document.addEventListener('drag', event => {
     if (event.target.nodeName === 'DIV') {
       event.target.style.left = `${event.clientX - offsetX}px`
       event.target.style.top = `${event.clientY - offsetY}px`
     }
   })

   document.addEventListener('dragover', event => {
     event.preventDefault()
   })

   document.addEventListener('dragend', event => {
     event.target.classList.remove('windowDrag')
   })
 }

 // Exports
 module.exports.dragDrop = dragDrop
