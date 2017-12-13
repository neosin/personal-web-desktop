/**
 * Module containing functions that import templates etc.
 *
 * @module src/js/setup
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 /**
 * Adds a given template to the window content div.
 *
 * @param {string} id The ID of the template that will be added.
 * @param {object} currWindow The current window that the function is being used on.
 */
 function addTemplateWindow (id, currWindow) {
   if (currWindow.firstElementChild.firstElementChild.nodeName === 'DIV') {
     currWindow.document.querySelector('#windowContent').removeChild(currWindow.firstElementChild.firstElementChild)
   }

   let templateClone = document.querySelector(id)
   let template = document.importNode(templateClone.content, true)

   currWindow.querySelector('#windowContent').appendChild(template)
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

 // Exports
 module.exports.addTemplateWindow = addTemplateWindow
 module.exports.addTemplateBody = addTemplateBody
