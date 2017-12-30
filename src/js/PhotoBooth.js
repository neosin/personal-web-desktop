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
    this.url = undefined
  }

  createPhotoBoothWindow () {
    this.createWindow()
    this.currentWindow.classList.add('photoBooth')

    this.getCameraStream()
  }

  getCameraStream () {
    let config = { audio: false, video: {width: 640, height: 480} }

    navigator.mediaDevices.getUserMedia(config)
      .then(stream => {
        this.stream = stream
        this.setupPhotoBooth()
      })
  }

  renderPhoto () {
    let canvas = this.currentWindow.querySelector('.canvasRender')
    let context = canvas.getContext('2d')

    canvas.width = 640
    canvas.height = 480

    context.filter = this.filter

    context.drawImage(this.videoElement, 0, 0, 640, 480)

    this.url = canvas.toDataURL()
  }

  takenPhoto () {
    let preview = this.currentWindow.querySelector('.preview')
    let taken = this.currentWindow.querySelector('.taken')

    taken.style.display = 'block'
    preview.style.display = 'none'

    this.currentWindow.querySelector('.newPhoto').addEventListener('click', event => {
      preview.style.display = 'block'
      taken.style.display = 'none'
    })

    this.currentWindow.querySelector('.savePhoto').addEventListener('click', event => {
      let link = event.target.closest('A')

      link.href = this.url
      link.download = 'photo'
    })

    this.renderPhoto()
  }

  setupPhotoBooth () {
    setup.editAppContent('#photoBooth', this.currentWindow)

    this.videoElement = this.currentWindow.querySelector('video')

    this.videoElement.srcObject = this.stream
    this.videoElement.play()

    this.currentWindow.querySelectorAll('.thumb img').forEach(current => {
      current.style.filter = current.getAttribute('data-filter')
    })

    this.currentWindow.querySelector('.content .snap').addEventListener('click', event => {
      this.takenPhoto()
    })

    this.currentWindow.querySelector('.thumb').addEventListener('click', event => {
      this.filter = event.target.getAttribute('data-filter')

      let video = this.currentWindow.querySelector('video')
      video.style.filter = this.filter
    })
  }
}

// Exports
module.exports = PhotoBooth
