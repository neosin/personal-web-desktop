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
    this.stream = null
    this.videoElement = undefined
    this.filter = undefined
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
        this.stream = stream
        this.setupPhotoBooth()
      })
  }

  drawPhoto (element) {
    let canvas = this.currentWindow.querySelector('canvas')
    let context = canvas.getContext('2d')
    context.filter = this.filter

    canvas.width = 450
    canvas.height = 450

    context.drawImage(element, 0, 0, 450, 450)
  }

  takenPhoto () {
    let preview = this.currentWindow.querySelector('.preview')
    preview.style.display = 'none'

    let taken = this.currentWindow.querySelector('.taken')
    taken.style.display = 'block'

    this.drawPhoto(this.videoElement)

    this.currentWindow.querySelector('.newPhoto').addEventListener('click', event => {
      preview.style.display = 'block'
      taken.style.display = 'none'
    })
  }

  setupPhotoBooth () {
    setup.editAppContent('#photoBooth', this.currentWindow)

    this.videoElement = this.currentWindow.querySelector('video')

    this.videoElement.srcObject = this.stream
    this.videoElement.play()

    this.currentWindow.querySelector('.content .snap').addEventListener('click', event => {
      this.takenPhoto()
    })
  }
}

// Exports
module.exports = PhotoBooth
