/**
 * Module containing setup functions for windows etc.
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

     if (event.target.id === 'minimize') {
       currentWindow.querySelector('#windowContent').classList.toggle('windowMinimize')
     }

     if (event.target.id === 'close') {
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

 function editAppContent (id, window) {
   if (window.querySelector('#content')) {
     let remove = window.querySelector('#content')
     let removeParent = window.querySelector('#windowContent')

     removeParent.removeChild(remove)
   }

   let windowContent = window.querySelector('#windowContent')
   let template = document.querySelector(id)
   windowContent.appendChild(document.importNode(template.content, true))
 }

 /**
  * Controlls which window that's focused.
  *
  * @param {object} currentWindow The window that is being clicked.
  */
 function windowFocus (currentWindow) {
   let allWindows = document.querySelectorAll('.window')

   for (let i = 0; i < allWindows.length; i++) {
     allWindows[i].style.zIndex = 0
   }

   currentWindow.style.zIndex = 100
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
  * Starts a loading animation.
  *
  * @param {object} currentWindow The window that will get the loading animation.
  */
 function startLoading (currentWindow) {
   let loader = document.createElement('div')
   loader.classList.add('loading')

   currentWindow.querySelector('#windowContent').appendChild(loader)
 }

 /**
  * Stops the loading animation.
  *
  * @param {object} currentWindow The window that has a loading animation.
  */
 function stopLoading (currentWindow) {
   if (currentWindow.querySelector('.loading')) {
     currentWindow.querySelector('#windowContent').removeChild(currentWindow.querySelector('.loading'))
   }
 }

 /**
  * Closes every window on the desktop.
  */
 function clearDesktop () {
   let windows = document.querySelectorAll('.window')

   for (let i = 0; i < windows.length; i++) {
     document.body.removeChild(windows[i])
   }
 }

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
 module.exports.windowFocus = windowFocus
 module.exports.setupWindows = setupWindows
 module.exports.dynamicScroll = dynamicScroll
 module.exports.startLoading = startLoading
 module.exports.stopLoading = stopLoading
 module.exports.clearDesktop = clearDesktop
 module.exports.enableButton = enableButton
