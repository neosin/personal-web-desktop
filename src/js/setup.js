/**
 * Module containing functions that import templates etc.
 *
 * @module src/js/setup
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

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
       removeParent.removeChild(document.querySelector('#controlls'))
     }
   }

   let windowContent = window.querySelector('#windowContent')
   let template = document.querySelector(id)
   windowContent.appendChild(document.importNode(template.content, true))
 }

 function windowFocus (currentWindow, previousWindow) {
   if (document.querySelectorAll('.window').length > 1) {
     if (currentWindow !== previousWindow) {
       console.log('öka zindex')
     } else {
       console.log('ta bort z index från förra')
     }
   }
 }

 // Exports
 module.exports.addTemplateBody = addTemplateBody
 module.exports.editAppContent = editAppContent
 module.exports.windowFocus = windowFocus
