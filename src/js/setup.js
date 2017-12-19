/**
 * Module containing functions that import templates etc.
 *
 * @module src/js/setup
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const dragDrop = require('./dragDrop')

 function setupWindows () {
   dragDrop.dragDrop()

   document.addEventListener('click', event => {
     if (event.target.nodeName === 'BUTTON') {
       let currentWindow = event.target.parentNode.parentNode.parentNode

       if (event.target.id === 'minimize') {
         let content = currentWindow.querySelector('#windowContent')
         content.classList.toggle('windowMinimize')
       }

       if (event.target.id === 'close') {
         document.body.removeChild(currentWindow)
       }
     }
   })
 }

/**
 * Adds a given template to the DOM.
 *
 * @param {string} id The ID of the template that will be added.
 */
 function addTemplateBody (id) {
   let templateClone = document.querySelector(id)
   let template = document.importNode(templateClone.content, true)

   document.body.appendChild(template)
 }

 function editAppContent (id, window) {
   if (window.querySelector('#content')) {
     let remove = window.querySelector('#content')
     let removeParent = window.querySelector('#windowContent')

     removeParent.removeChild(remove)

     if (window.querySelector('#controlls')) {
       removeParent.removeChild(window.querySelector('#controlls'))
     }
   }

   let windowContent = window.querySelector('#windowContent')
   let template = document.querySelector(id)
   windowContent.appendChild(document.importNode(template.content, true))
 }

 function windowFocus (currentWindow) {
   let allWindows = document.querySelectorAll('.window')

   for (let i = 0; i < allWindows.length; i++) {
     allWindows[i].style.zIndex = 0
   }

   currentWindow.style.zIndex = 100
 }

 // Exports
 module.exports.addTemplateBody = addTemplateBody
 module.exports.editAppContent = editAppContent
 module.exports.windowFocus = windowFocus
 module.exports.setupWindows = setupWindows
