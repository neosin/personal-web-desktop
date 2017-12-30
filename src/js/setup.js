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
   if (window.querySelector('.content')) {
     let remove = window.querySelector('.content')
     let removeParent = window.querySelector('.windowContent')

     removeParent.removeChild(remove)
   }

   let windowContent = window.querySelector('.windowContent')
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

 function windowStack (currentWindow) {
   let allWindows = document.querySelectorAll('.window')
   let focusedWindow

   allWindows.forEach(current => {
     if (current.style.zIndex > 0) {
       focusedWindow = current
       focusedWindow.style.zIndex = 0
     }
   })

   if (focusedWindow) {
     currentWindow.style.top = `${focusedWindow.offsetTop + 30}px`
     currentWindow.style.left = `${focusedWindow.offsetLeft + 30}px`
   } else if (allWindows.length > 1) {
     currentWindow.style.top = `${allWindows[allWindows.length - 2].offsetTop + 30}px`
     currentWindow.style.left = `${allWindows[allWindows.length - 2].offsetLeft + 30}px`
   }
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

   currentWindow.querySelector('.windowContent').appendChild(loader)
 }

 /**
  * Stops the loading animation.
  *
  * @param {object} currentWindow The window that has a loading animation.
  */
 function stopLoading (currentWindow) {
   if (currentWindow.querySelector('.loading')) {
     currentWindow.querySelector('.windowContent').removeChild(currentWindow.querySelector('.loading'))
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
 module.exports.windowFocus = windowFocus
 module.exports.setupWindows = setupWindows
 module.exports.dynamicScroll = dynamicScroll
 module.exports.startLoading = startLoading
 module.exports.stopLoading = stopLoading
 module.exports.clearDesktop = clearDesktop
 module.exports.enableButton = enableButton
 module.exports.windowStack = windowStack
