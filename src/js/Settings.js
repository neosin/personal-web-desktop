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
  * @memberof Settings
  */
  constructor () {
    super()

    this.title = 'Settings'
    this.icon = '/image/appIcons/settings.png'
  }

  /**
   * Creates a new settings window.
   */
  createSettingsWindow () {
    this.createWindow()

    setup.editAppContent('#settings', this.currentWindow)

    this.currentWindow.querySelector('.content').addEventListener('click', event => {
      let url = `url(${event.target.src.slice(0, 42)}.jpg)`

      if (event.target.closest('img')) { document.body.style.backgroundImage = url }
    })
  }
}

// Exports
module.exports = Settings
