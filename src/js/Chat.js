const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Chat extends DesktopWindow {
  constructor () {
    super()

    this.nickname = null
    this.webSocket = null
    this.response = null
    this.chatMessageWindow = null
  }

  createChatWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('chat')

    this.chooseNickname()
  }

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

  addMessageToWindow () {
    if (this.response.type === 'message') {
      let message = this.currentWindow.querySelector('#content p')

      message.textContent += `\n${this.response.username}: ${this.response.data}`
    }
  }

  chooseNickname () {
    if (!window.localStorage.getItem('chatName')) {
      setup.editAppContent('#chatName', this.currentWindow)

      let input = this.currentWindow.querySelector('#content input')

      this.currentWindow.querySelector('#set').addEventListener('click', event => {
        window.localStorage.setItem('chatName', input.value)
        this.loadChat()
      })
    } else {
      this.loadChat()
    }
  }

  loadChat () {
    this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'chat')
    this.nickname = window.localStorage.getItem('chatName')
    setup.editAppContent('#chat', this.currentWindow)

    this.chatMessageWindow = this.currentWindow.querySelector('#content')

    this.webSocket.addEventListener('open', event => {
      let p = document.createElement('p')
      p.textContent = 'You are connected!'
      this.chatMessageWindow.appendChild(p)

      this.currentWindow.querySelector('#send').addEventListener('click', event => {
        this.addEmojis()
        this.sendMessage()
      })
    })

    this.webSocket.addEventListener('message', event => {
      this.response = JSON.parse(event.data)
      this.addMessageToWindow()
    })

    this.currentWindow.querySelector('#emojiBtn').addEventListener('click', event => {
      this.currentWindow.querySelector('#emojis').classList.toggle('emojiToggle')
    })

    this.currentWindow.querySelector('#emojis').addEventListener('click', event => {
      this.currentWindow.querySelector('textarea').value += event.target.getAttribute('data-custom-value')
    })
  }

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
  }
}

// Exports
module.exports = Chat
