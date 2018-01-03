/**
 * Module containing setup functions for windows loading screens etc.
 *
 * @module src/js/setup
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const dragDrop = require('./dragDrop')

 /**
  * Adds the drag and drop, close and minimize event listeners to the document object.
  */
 function setupWindows () {
   dragDrop.dragDrop()

   document.addEventListener('click', event => {
     let currentWindow = event.target.closest('.window')

     if (event.target.className === 'minimize') {
       currentWindow.querySelector('.windowContent').classList.toggle('windowMinimize')
     }

     if (event.target.className === 'close') {
       if (currentWindow.closest('.photoBooth')) {
         let videoElement = currentWindow.closest('.photoBooth').querySelector('video')
         videoElement.srcObject.getTracks()[0].stop()
       }

       document.body.removeChild(currentWindow)
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

 /**
  * changes the content of an application window.
  *
  * @param {string} id The ID of the template that will be added.
  * @param {object} window The window containing the content.
  */
 function editAppContent (id, window) {
   let windowContent = window.querySelector('.windowContent')

   if (window.querySelector('.content')) {
     let remove = window.querySelector('.content')

     windowContent.removeChild(remove)
   }

   let template = document.querySelector(id)
   windowContent.appendChild(document.importNode(template.content, true))
 }

 /**
  * Keeps the scrollbar at the bottom of the content window.
  *
  * @param {object} scrollContent The content containing the scrollbar.
  */
 function dynamicScroll (scrollContent) {
   scrollContent.scrollTop = scrollContent.scrollHeight
 }

 /**
  * Stops the loading animation.
  *
  * @param {object} currentWindow The window that has a loading animation.
  */
 function toggleLoading (currentWindow) {
   if (currentWindow.querySelector('.loading')) {
     currentWindow.querySelector('.windowContent').removeChild(currentWindow.querySelector('.loading'))
   } else {
     let loader = document.createElement('div')
     loader.classList.add('loading')

     currentWindow.querySelector('.windowContent').appendChild(loader)
   }
 }

 /**
  * Enables the button if the text/input area is not empty.
  *
  * @param {object} input The input or textarea that will be sent using a button.
  * @param {object} button The button that will be enabled/disabled.
  */
 function enableButton (input, button) {
   setTimeout(() => {
     if (input.value.trim() !== '') {
       button.disabled = false
     } else {
       button.disabled = true
     }

     enableButton(input, button)
   }, 100)
 }

 // Exports
 module.exports.addTemplateBody = addTemplateBody
 module.exports.editAppContent = editAppContent
 module.exports.setupWindows = setupWindows
 module.exports.dynamicScroll = dynamicScroll
 module.exports.toggleLoading = toggleLoading
 module.exports.enableButton = enableButton
