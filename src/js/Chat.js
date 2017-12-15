const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Chat extends DesktopWindow {
  constructor () {
    super()

    this.nickname = null
    this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
    this.response = null
    this.chatMessageWindow = null
  }

  createChatWindow (title, icon) {
    this.createWindow(title, icon)
    setup.editAppContent('#chat', this.currentWindow)
    this.currentWindow.classList.add('chat')

    this.chatMessageWindow = this.currentWindow.querySelector('#content')

    this.webSocket.addEventListener('open', event => {
      let p = document.createElement('p')
      p.textContent = 'You are connected!'
      this.chatMessageWindow.appendChild(p)

      this.currentWindow.querySelector('#send').addEventListener('click', event => {
        this.sendMessage()
      })
    })

    this.webSocket.addEventListener('message', event => {
      this.response = JSON.parse(event.data)
      this.addMessageToWindow()
    })
  }

  sendMessage () {
    let message = this.currentWindow.querySelector('textarea')

    let data = {
      type: 'message',
      data: message.value,
      username: 'rasmus',
      channel: 'chat',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    this.webSocket.send(JSON.stringify(data))
    message.value = ''
  }

  addMessageToWindow () {
    if (this.response.type === 'message') {
      let message = document.createElement('p')

      this.chatMessageWindow.appendChild(message)
      message.textContent = `${this.response.username}: ${this.response.data}`
    }
  }
}

// Exports
module.exports = Chat
