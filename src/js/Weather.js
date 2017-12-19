const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Weather extends DesktopWindow {
  constructor () {
    super()
  }

  createWeatherWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('weather')
  }
}

// Exports
module.exports = Weather
