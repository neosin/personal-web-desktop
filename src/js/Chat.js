/**
 * Module for the chat application.
 *
 * @module src/js/Chat
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const DesktopWindow = require('./DesktopWindow')
 const setup = require('./setup')

 /**
  * Class representing a chat application.
  */
 class Chat extends DesktopWindow {
  /**
   * Creates an instance of Chat
   *
   * @memberof Chat
   */
   constructor () {
     super()

     this.title = 'Chat'
     this.icon = '/image/appIcons/chat.png'
     this.nickname = null
     this.webSocket = null
     this.response = null
   }

   /**
    * Creates a new chat window.
    */
   createChatWindow () {
     this.createWindow()
     window.Notification.requestPermission()
     this.checkNickname()
   }

   /**
    * Checks if the user already has a nickname, if not they get to choose one.
    */
   checkNickname () {
     if (!setup.checkLocalStorage('chatName')) {
       setup.enterName('chatName', '#chatName', this.currentWindow, this.loadChat.bind(this))
     } else { this.loadChat() }
   }

   /**
    * Loads the chat.
    */
   loadChat () {
     setup.toggleLoading(this.currentWindow)

     this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
     this.nickname = window.localStorage.getItem('chatName')

     this.webSocket.addEventListener('open', event => {
       setup.toggleLoading(this.currentWindow)
       setup.editAppContent('#chat', this.currentWindow)

       let input = this.currentWindow.querySelector('textarea')
       let button = this.currentWindow.querySelector('.send')
       let emojiSection = this.currentWindow.querySelector('.emojiSection')

       setup.enableButton(input, button)

       this.currentWindow.addEventListener('click', event => {
         if (event.target.className === 'emojiBtn') { emojiSection.classList.toggle('emojiToggle') }
         if (event.target.nodeName === 'A') { input.value += event.target.getAttribute('data-emoji') }
         if (event.target.className === 'send') { this.sendMessage() }
       })

       this.currentWindow.querySelector('.close').addEventListener('click', event => this.webSocket.close())

       this.webSocket.addEventListener('message', event => {
         this.response = JSON.parse(event.data)

         this.addMessageToWindow()

         setup.dynamicScroll(this.currentWindow.querySelector('.content'))
       })
     })
   }

   /**
    * Sends a a chat message.
    */
   sendMessage () {
     this.addEmojis()

     let message = this.currentWindow.querySelector('textarea')

     let data = {
       type: 'message',
       data: message.value,
       username: this.nickname,
       channel: 'chat',
       key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
       user: true
     }

     this.webSocket.send(JSON.stringify(data))

     message.value = ''
   }

   /**
    * Writes out the recived messages to the chat window.
    */
   addMessageToWindow () {
     let messages = this.currentWindow.querySelector('.content p')

     if (this.response.type === 'notification') { messages.textContent += `${this.response.data}` }

     if (this.response.type === 'message') {
       if (!document.hasFocus()) { this.newNotification() }

       if (this.response.user) { messages.innerHTML += `\n<b class="user">${this.response.username}:</b> ${this.response.data}` }
       if (!this.response.user) { messages.innerHTML += `\n<b  class="other">${this.response.username}:</b> ${this.response.data}` }
     }
   }

   /**
    * Adds the emojis when sending the message.
    */
   addEmojis () {
     let message = this.currentWindow.querySelector('textarea')

     if (message.value.search('/:happy:/')) { message.value = message.value.replace(/:happy:/g, '\uD83D\uDE00') }
     if (message.value.search('/:smile:/')) { message.value = message.value.replace(/:smile:/g, '\uD83D\uDE42') }
     if (message.value.search('/:cool:/')) { message.value = message.value.replace(/:cool:/g, '\uD83D\uDE0E') }
     if (message.value.search('/:surprised:/')) { message.value = message.value.replace(/:surprised:/g, '\uD83D\uDE2E') }
     if (message.value.search('/:cheeky:/')) { message.value = message.value.replace(/:cheeky:/g, '\uD83D\uDE1B') }
     if (message.value.search('/:horns:/')) { message.value = message.value.replace(/:horns:/g, '\uD83E\uDD18') }
     if (message.value.search('/:thinking:/')) { message.value = message.value.replace(/:thinking:/g, '\uD83E\uDD14') }
     if (message.value.search('/:blush:/')) { message.value = message.value.replace(/:blush:/g, '\uD83D\uDE0A') }
     if (message.value.search('/:joy:/')) { message.value = message.value.replace(/:joy:/g, '\uD83D\uDE02') }
     if (message.value.search('/:neutral:/')) { message.value = message.value.replace(/:neutral:/g, '\uD83D\uDE10') }
     if (message.value.search('/:scream:/')) { message.value = message.value.replace(/:scream:/g, '\uD83D\uDE31') }
     if (message.value.search('/:rage:/')) { message.value = message.value.replace(/:rage:/g, '\uD83D\uDE21') }
   }

   /**
    * Creates a new notification for a chat message.
    */
   newNotification () {
     let message = `${this.response.username}, ${this.response.data}`
     let config = { body: message, icon: '/image/appIcons/chat.png' }
     let notification = new window.Notification('New Message!', config)

     setTimeout(notification.close.bind(notification), 5000)
   }
 }

 // Exports
 module.exports = Chat
