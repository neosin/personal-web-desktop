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
     offsetX = event.clientX - event.target.offsetLeft
     offsetY = event.clientY - event.target.offsetTop

     event.target.style.opacity = 0.3
   })

   document.addEventListener('drag', event => {
     event.target.style.left = `${event.clientX - offsetX}px`
     event.target.style.top = `${event.clientY - offsetY}px`
   })

   document.addEventListener('dragover', event => {
     event.preventDefault()
   })

   document.addEventListener('dragend', event => {
     event.target.style.opacity = 1
   })
 }

 // Exports
 module.exports.dragDrop = dragDrop
