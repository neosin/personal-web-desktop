'use strict'

const setup = require('./setup')
const DesktopWindow = require('./DesktopWindow')

class Settings extends DesktopWindow {
  constructor () {
    super()

    this.selectedImg = `/image/wallpapers/bg1.jpg'`
  }

  createSettingsWindow () {
    this.createWindow()
    setup.editAppContent('#settings', this.currentWindow)

    this.currentWindow.classList.add('settings')

    let content = this.currentWindow.querySelector('#content')

    content.addEventListener('click', event => {
      if (event.target.nodeName === 'IMG') {
        this.selectedImg = event.target.src
      }
    })

    this.currentWindow.querySelector('#changeWallpaper').addEventListener('click', event => {
      document.body.style.backgroundImage = `url(${this.selectedImg})`
    })
  }
}

// Exports
module.exports = Settings