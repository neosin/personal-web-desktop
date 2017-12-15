const DesktopWindow = require('./DesktopWindow')

class Chat extends DesktopWindow {
  constructor () {
    super()

    this.nickname = null
    this.message = null
    this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
    this.response = null
  }

  createChatWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('chat')

    this.getMessages()
  }

  getMessages () {
    this.webSocket.addEventListener('message', event => {
      this.response = JSON.parse(event.data)
      console.log(this.response.data)
    })
  }
}

// Exports
module.exports = Chat
