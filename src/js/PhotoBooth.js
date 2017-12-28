/**
 * Module for the photo booth application.
 *
 * @module src/js/PhotoBooth
 * @author Rasmus Falk
 * @version 1.0.0
 */

'use strict'

const setup = require('./setup')
const DesktopWindow = require('./DesktopWindow')

/**
 * Class representing a photo booth application.
 */
class PhotoBooth extends DesktopWindow {
 /**
  * Creates an instance of PhotoBooth.
  *
  * @param {string} title String of the relative URL for the application window icon.
  * @param {string} icon String of the relative URL for the title of the application window.
  * @memberof PhotoBooth
  */
  constructor (title, icon) {
    super()

    this.title = title
    this.icon = icon
  }

  createPhotoBoothWindow () {
    this.createWindow()
    this.currentWindow.classList.add('photoBooth')

    this.getCameraStream()
  }

  getCameraStream () {
    let config = { audio: false, video: {width: 450, height: 450} }

    navigator.mediaDevices.getUserMedia(config)
      .then(stream => {
        setup.editAppContent('#photoBooth', this.currentWindow)
        let videoElement = this.currentWindow.querySelector('video')

        videoElement.srcObject = stream
        videoElement.play()
      })
  }
}

// Exports
module.exports = PhotoBooth
