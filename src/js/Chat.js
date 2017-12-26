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
   * @param {string} icon String of the title for the application window.
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
    *
    */
   createChatWindow () {
     this.createWindow()
     setup.startLoading(this.currentWindow)
     this.currentWindow.classList.add('chat')

     this.chooseNickname()
   }

   /**
    * Set a nickname for the current user.
    */
   chooseNickname () {
     if (!window.localStorage.getItem('chatName')) {
       setup.stopLoading(this.currentWindow)
       setup.editAppContent('.chatName', this.currentWindow)

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
    * Loads the chat content.
    */
   loadChat () {
     this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
     this.nickname = window.localStorage.getItem('chatName')

     this.webSocket.addEventListener('open', event => {
       setup.stopLoading(this.currentWindow)
       setup.editAppContent('#chat', this.currentWindow)

       let input = this.currentWindow.querySelector('textarea')
       let button = this.currentWindow.querySelector('.send')
       let emojiBtn = this.currentWindow.querySelector('.emojiBtn')
       let emojis = this.currentWindow.querySelector('ul')
       let emojiSection = this.currentWindow.querySelector('.emojiSection')

       setup.enableButton(input, button)

       let chatMessageWindow = this.currentWindow.querySelector('.content')

       button.addEventListener('click', event => {
         this.addEmojis()
         this.sendMessage()
       })

       emojiBtn.addEventListener('click', event => {
         emojiSection.classList.toggle('emojiToggle')
       })

       emojis.addEventListener('click', event => {
         if (event.target.nodeName === 'A') {
           input.value += event.target.getAttribute('data-custom-value')
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
       key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
     }

     this.webSocket.send(JSON.stringify(data))
     message.value = ''
   }

   /**
    * Writes out the recived messages to the chat window.
    */
   addMessageToWindow () {
     let message = this.currentWindow.querySelector('.content p')

     if (this.response.type === 'notification') {
       message.textContent += `${this.response.data}`
     } else if (this.response.type === 'message') {
       message.textContent += `\n${this.response.username}: ${this.response.data}`
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
   }
 }

 // Exports
 module.exports = Chat
