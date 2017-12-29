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
    let config = { audio: false, video: {width: 450, height: 450} }

    navigator.mediaDevices.getUserMedia(config)
      .then(stream => {
        this.stream = stream
        this.setupPhotoBooth()
      })
  }

  drawPhoto () {
    let canvas = this.currentWindow.querySelector('.canvasRender')
    let context = canvas.getContext('2d')

    canvas.width = 450
    canvas.height = 450

    context.drawImage(this.videoElement, 0, 0, 450, 450)
    this.url = canvas.toDataURL()
  }

  takenPhoto () {
    let preview = this.currentWindow.querySelector('.preview')
    preview.style.display = 'none'

    let taken = this.currentWindow.querySelector('.taken')
    taken.style.display = 'block'

    this.drawPhoto()
    this.addFilter()

    this.currentWindow.querySelector('.newPhoto').addEventListener('click', event => {
      preview.style.display = 'block'
      taken.style.display = 'none'
    })
  }

  addFilter () {
    let render = this.currentWindow.querySelector('.renderImg')
    let filter = this.currentWindow.querySelector('.filterImg')
    let renderedImg = this.currentWindow.querySelector('.renderedImg')

    render.style.display = 'none'
    filter.style.display = 'block'
    renderedImg.src = this.url

    let canvas = this.currentWindow.querySelector('.canvasFilter')
    let context = canvas.getContext('2d')

    context.filter = this.filter

    canvas.width = 450
    canvas.height = 450

    context.drawImage(renderedImg, 0, 0, 450, 450)

    console.log(canvas)
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
