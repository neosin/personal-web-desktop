'use strict'

const setup = require('./setup')
const DesktopWindow = require('./DesktopWindow')

class Settings extends DesktopWindow {
  constructor () {
    super()
  }

  createSettingsWindow () {
    this.createWindow()
    setup.editAppContent('#settings', this.currentWindow)
  }
}

// Exports
module.exports = Settings
