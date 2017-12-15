const DesktopWindow = require('./DesktopWindow')

class Chat extends DesktopWindow {
  constructor () {
    super()

    this.nickname = null
    this.message = null
  }

  createChatWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('chat')
  }
}

// Exports
module.exports = Chat
