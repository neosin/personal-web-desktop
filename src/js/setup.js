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
     let current = event.target.closest('.window')

     if (event.target.className === 'minimize') { current.querySelector('.windowContent').classList.toggle('windowMinimize') }
     if (event.target.className === 'close') { document.body.removeChild(current) }
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
  * changes the content of an application.
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
  * Keeps the scrollbar at the bottom of the given element.
  *
  * @param {object} scrollContent The element containing the scrollbar.
  */
 function dynamicScroll (scrollContent) {
   scrollContent.scrollTop = scrollContent.scrollHeight
 }

 /**
  * Toggles the loading animation.
  *
  * @param {object} currentWindow The window that has/will get a loading animation.
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
  * Toggles the button depending on the content in the input/textarea.
  *
  * @param {object} input A textarea or input field.
  * @param {object} button The button that will be enabled/disabled.
  */
 function enableButton (input, button) {
   setTimeout(() => {
     input.value.trim() ? button.disabled = false : button.disabled = true
     enableButton(input, button)
   }, 0)
 }

 /**
  * Checks if the item with the given name is located in local storage.
  *
  * @param {string} id The name of the item.
  * @returns {boolean} A boolean value that tells you if the item is located in local storage or not.
  */
 function checkLocalStorage (id) {
   return window.localStorage.getItem(id)
 }

 /**
  * Loads a "screen" where you can enter a nickname then execute callback functions.
  *
  * @param {string} storageId The ID for the item that will be added in local storage.
  * @param {string} nameTemplate The name of the template with the input and button.
  * @param {object} currentWindow The window to where the screen will be added.
  * @param {function} callback1 The first callback function.
  * @param {string} callbackTemplate A callback template ID.
  */
 function enterName (storageId, nameTemplate, currentWindow, callback1, callbackTemplate) {
   editAppContent(nameTemplate, currentWindow)

   let input = currentWindow.querySelector('.content input')
   let button = currentWindow.querySelector('.content button')

   enableButton(input, button)

   button.addEventListener('click', event => {
     window.localStorage.setItem(storageId, input.value)

     if (callbackTemplate) { editAppContent(callbackTemplate, currentWindow) }
     callback1()
   })
 }

 /**
  * Creates a new notification.
  *
  * @param {string} title The title of the notification.
  * @param {string} text The text that will be displayed on the notification.
  * @param {string} icon Relative URL to the icon used for the notification.
  */
 function newNotification (title, text, icon) {
   if (!document.hasFocus()) {
     let config = { body: text, icon: '/image/appIcons/chat.png' }
     let notification = new window.Notification(title, config)

     setTimeout(notification.close.bind(notification), 5000)
   }
 }

 // Exports
 module.exports.addTemplateBody = addTemplateBody
 module.exports.editAppContent = editAppContent
 module.exports.setupWindows = setupWindows
 module.exports.dynamicScroll = dynamicScroll
 module.exports.toggleLoading = toggleLoading
 module.exports.enableButton = enableButton
 module.exports.checkLocalStorage = checkLocalStorage
 module.exports.enterName = enterName
 module.exports.newNotification = newNotification
