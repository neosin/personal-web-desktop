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
   * @param {string} title String of the relative URL for the application window icon.
   * @param {string} icon String of the relative URL for the title of the application window.
   * @memberof Chat
   */
   constructor (title, icon) {
     super()

     this.title = title
     this.icon = icon
     this.nickname = null
     this.webSocket = null
     this.response = null
   }

   /**
    * Creates a new chat window.
    */
   createChatWindow () {
     this.createWindow()
     this.currentWindow.classList.add('chat')

     setup.toggleLoading(this.currentWindow)
     window.Notification.requestPermission()

     this.checkNickname()
   }

   /**
    * Checks if the user already has a nickname, if not they get to choose one.
    */
   checkNickname () {
     if (!window.localStorage.getItem('chatName')) {
       setup.toggleLoading(this.currentWindow)
       setup.editAppContent('#chatName', this.currentWindow)

       let input = this.currentWindow.querySelector('.content input')
       let button = this.currentWindow.querySelector('.set')

       setup.enableButton(input, button)

       button.addEventListener('click', event => {
         window.localStorage.setItem('chatName', input.value)

         setup.startLoading(this.currentWindow)

         this.loadChat()
       })
     } else {
       this.loadChat()
     }
   }

   /**
    * Loads the chat.
    */
   loadChat () {
     this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
     this.nickname = window.localStorage.getItem('chatName')

     this.webSocket.addEventListener('open', event => {
       setup.toggleLoading(this.currentWindow)
       setup.editAppContent('#chat', this.currentWindow)

       let input = this.currentWindow.querySelector('textarea')
       let button = this.currentWindow.querySelector('.send')

       setup.enableButton(input, button)

       let chatMessageWindow = this.currentWindow.querySelector('.content')

       this.currentWindow.addEventListener('click', event => {
         if (event.target.closest('.emojiBtn')) {
           this.currentWindow.querySelector('.emojiSection').classList.toggle('emojiToggle')
         }

         if (event.target.closest('ul a')) {
           input.value += event.target.getAttribute('data-emoji')
         }

         if (event.target.closest('.send')) {
           this.addEmojis()
           this.sendMessage()
         }
       })

       this.webSocket.addEventListener('message', event => {
         this.response = JSON.parse(event.data)

         this.addMessageToWindow()

         setup.dynamicScroll(chatMessageWindow)
       })
     })
   }

   /**
    * Sends a a chat message.
    */
   sendMessage () {
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

     if (this.response.type === 'notification') {
       messages.textContent += `${this.response.data}`
     } else if (this.response.type === 'message') {
       if (!document.hasFocus() && document.querySelector('.chat')) {
         this.newNotification()
       }

       if (this.response.user) {
         messages.innerHTML += `\n<b class="user">${this.response.username}:</b> ${this.response.data}`
       } else {
         messages.innerHTML += `\n<b  class="other">${this.response.username}:</b> ${this.response.data}`
       }
     }
   }

   /**
    * Adds the emojis when sending the message.
    */
   addEmojis () {
     let message = this.currentWindow.querySelector('textarea')

     if (message.value.search('/:happy:/')) {
       message.value = message.value.replace(/:happy:/g, '\uD83D\uDE00')
     }

     if (message.value.search('/:smile:/')) {
       message.value = message.value.replace(/:smile:/g, '\uD83D\uDE42')
     }

     if (message.value.search('/:cool:/')) {
       message.value = message.value.replace(/:cool:/g, '\uD83D\uDE0E')
     }

     if (message.value.search('/:surprised:/')) {
       message.value = message.value.replace(/:surprised:/g, '\uD83D\uDE2E')
     }

     if (message.value.search('/:cheeky:/')) {
       message.value = message.value.replace(/:cheeky:/g, '\uD83D\uDE1B')
     }

     if (message.value.search('/:horns:/')) {
       message.value = message.value.replace(/:horns:/g, '\uD83E\uDD18')
     }

     if (message.value.search('/:thinking:/')) {
       message.value = message.value.replace(/:thinking:/g, '\uD83E\uDD14')
     }

     if (message.value.search('/:blush:/')) {
       message.value = message.value.replace(/:blush:/g, '\uD83D\uDE0A')
     }
   }

   /**
    * Creates a new notification for a chat message.
    */
   newNotification () {
     let config = {
       body: `${this.response.username}, ${this.response.data}`,
       icon: '/image/appIcons/chat.png'
     }

     let notification = new window.Notification('New Message!', config)

     setTimeout(notification.close.bind(notification), 5000)
   }
 }

 // Exports
 module.exports = Chat
