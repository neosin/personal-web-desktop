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
  * @memberof PhotoBooth
  */
  constructor () {
    super()

    this.title = 'PhotoBooth'
    this.icon = '/image/appIcons/camera.png'
    this.stream = null
    this.videoElement = undefined
    this.filter = undefined
    this.url = undefined
  }

  /**
   * Creates a new photo booth window.
   */
  createPhotoBoothWindow () {
    this.createWindow()

    setup.toggleLoading(this.currentWindow)
    this.getCameraStream()
  }

  /**
   * Get's the webcam stream from the user.
   */
  getCameraStream () {
    let config = { audio: false, video: {width: 640, height: 480} }

    navigator.mediaDevices.getUserMedia(config)
      .then(stream => {
        this.stream = stream
        this.setupPhotoBooth()

        setup.toggleLoading(this.currentWindow)
      })
      .catch(() => {
        setup.toggleLoading(this.currentWindow)
        setup.editAppContent('#photoBoothError', this.currentWindow)
      })
  }

  /**
   * Displays the different filters, the stream etc.
   */
  setupPhotoBooth () {
    setup.editAppContent('#photoPreview', this.currentWindow)

    let content = this.currentWindow.querySelector('.content')

    this.videoElement = this.currentWindow.querySelector('video')
    this.videoElement.srcObject = this.stream
    this.videoElement.play()

    content.querySelectorAll('.thumb img').forEach(current => {
      current.style.filter = current.getAttribute('data-filter')
    })

    content.addEventListener('click', event => {
      if (event.target.closest('.snap')) { this.takenPhoto() }

      if (event.target.closest('.thumb')) {
        this.filter = event.target.getAttribute('data-filter')
        this.videoElement.style.filter = this.filter
      }
    })

    this.currentWindow.querySelector('.close').addEventListener('click', event => {
      this.stream.getTracks()[0].stop()
    })
  }

  /**
   * Renders the taken photo.
   */
  renderPhoto () {
    let canvas = this.currentWindow.querySelector('.canvasRender')
    let context = canvas.getContext('2d')

    canvas.width = 640
    canvas.height = 480

    context.filter = this.filter
    context.drawImage(this.videoElement, 0, 0, 640, 480)

    this.url = canvas.toDataURL()
  }

  /**
   * Displays the taken picture, save and new photo buttons.
   */
  takenPhoto () {
    setup.editAppContent('#photoTaken', this.currentWindow)
    this.renderPhoto()

    let content = this.currentWindow.querySelector('.content')

    content.addEventListener('click', event => {
      if (event.target.closest('.newPhoto')) { this.setupPhotoBooth() }

      if (event.target.closest('.savePhoto')) {
        let link = event.target.closest('A')

        link.href = this.url
        link.download = 'photo'
      }
    })
  }
}

// Exports
module.exports = PhotoBooth
