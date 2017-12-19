const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Weather extends DesktopWindow {
  constructor () {
    super()

    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
  }

  createWeatherWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('weather')
    setup.editAppContent('#weather', this.currentWindow)

    this.getData()
  }

  getData () {
    window.fetch(this.url)
    .then(response => {
      return response.json()
    })
    .then(response => {
      this.response = response
      this.printData()
    })
  }

  printData () {
    let currentDay = new Date().getDate()
    let times = this.response.timeSeries

    console.log(this.response)

    times = times.filter(current => {
      current = parseInt(current.validTime.slice(8, 10))

      return current === currentDay
    })

    console.log(times)
  }
}

// Exports
module.exports = Weather
