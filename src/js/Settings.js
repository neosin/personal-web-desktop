/**
 * Module for the settings application.
 *
 * @module src/js/Settings
 * @author Rasmus Falk
 * @version 1.0.0
 */

'use strict'

const setup = require('./setup')
const DesktopWindow = require('./DesktopWindow')

/**
 * Class representing a settings application.
 */
class Settings extends DesktopWindow {
 /**
  * Creates an instance of Settings.
  *
  * @param {string} title String of the relative URL for the application window icon.
  * @param {string} icon String of the relative URL for the title of the application window.
  * @memberof Settings
  */
  constructor (title, icon) {
    super()

    this.title = title
    this.icon = icon
  }

  /**
   * Creates a new settings window.
   */
  createSettingsWindow () {
    this.createWindow()
    this.currentWindow.classList.add('settings')

    setup.editAppContent('#settings', this.currentWindow)

    let settingsContent = this.currentWindow.querySelector('.content')

    settingsContent.addEventListener('click', event => {
      if (event.target.nodeName === 'IMG') {
        document.body.style.backgroundImage = `url(${event.target.src.slice(0, 42)}.jpg)`
      }
    })
  }
}

// Exports
module.exports = Settings
