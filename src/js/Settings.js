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
   * @param {string} icon String of the title for the application window.
   */
  constructor (title, icon) {
    super()

    this.title = title
    this.icon = icon
    this.selectedImg = `/image/wallpapers/bg1.jpg'`
  }

  /**
   * Creates a new settings window.
   */
  createSettingsWindow () {
    this.createWindow(this.title, this.icon)

    setup.editAppContent('#settings', this.currentWindow)

    this.currentWindow.classList.add('settings')

    this.currentWindow.querySelector('#content').addEventListener('click', event => {
      if (event.target.nodeName === 'IMG') {
        this.selectedImg = event.target.src
      }
    })

    this.currentWindow.addEventListener('click', event => {
      if (event.target.id === 'changeWallpaper') {
        document.body.style.backgroundImage = `url(${this.selectedImg})`
      }
    })
  }
}

// Exports
module.exports = Settings
