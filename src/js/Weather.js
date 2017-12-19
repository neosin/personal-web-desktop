const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Weather extends DesktopWindow {
  constructor () {
    super()

    this.nameOfDay = undefined
    this.date = undefined
    this.day = undefined
    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
  }

  createWeatherWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('weather')
    setup.editAppContent('#weather', this.currentWindow)

    this.currentWindow.querySelector('#content button').addEventListener('click', event => {
      this.changeLocation()
    })

    this.getData()
  }

  changeLocation () {
    let selected = this.currentWindow.querySelector('select').value

    let long = selected.slice(0, 9)
    let lat = selected.slice(10)

    this.url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${long}/lat/${lat}/data.json`

    this.getData()
  }

  getData () {
    window.fetch(this.url)
    .then(response => {
      return response.json()
    })
    .then(response => {
      this.response = response
      this.calculateWeather()
    })
  }

  calculateWeather () {
    let currentDay = new Date().getDate()
    let times = this.response.timeSeries
    let temps = []
    let weatherImages = []
    let highestTemp
    let lowestTemp

    times = times.filter(current => {
      current = parseInt(current.validTime.slice(8, 10))

      return current === currentDay
    })

    for (let i = 0; i < times.length; i++) {
      let parameters = times[i].parameters

      for (let j = 0; j < parameters.length; j++) {
        if (parameters[j].name === 't') {
          temps.push({time: times[i].validTime, value: parameters[j].values[0]})
        }
      }
    }

    temps.sort((a, b) => { return b.value - a.value })
    weatherImages.sort((a, b) => { return a.value - b.value })

    highestTemp = temps[0].value
    lowestTemp = temps[temps.length - 1].value

    let value = temps.filter(current => {
      let hours = new Date().getHours()
      let dataHours = parseInt(current.time.slice(11, 13))

      return dataHours === hours
    })

    this.displayWeather(value[0].value, highestTemp, lowestTemp)
  }

  displayWeather (temp, highestTemp, lowestTemp) {
    this.calculateDay()

    let day = this.currentWindow.querySelector('#content h1')
    let date = this.currentWindow.querySelector('#content h2')
    let highLow = this.currentWindow.querySelector('#content p')
    let temperature = this.currentWindow.querySelector('#content h3')

    day.textContent = this.day
    date.textContent = this.date
    highLow.textContent = `${highestTemp}° / ${lowestTemp}°`
    temperature.textContent = `${temp}°`
  }

  calculateDay () {
    let dateObj = new Date()
    let date = dateObj.getDate()
    let year = dateObj.getFullYear()
    let day = dateObj.getDay()
    let month = dateObj.getMonth() + 1

    if (day === 1) {
      day = 'Monday'
    } else if (day === 2) {
      day = 'Tuesday'
    } else if (day === 3) {
      day = 'Wednesday'
    } else if (day === 4) {
      day = 'Thursday'
    } else if (day === 5) {
      day = 'Friday'
    } else if (day === 5) {
      day = 'Saturday'
    } else if (day === 5) {
      day = 'Sunday'
    }

    if (month === 1) {
      month = 'January'
    } else if (month === 2) {
      month = 'February'
    } else if (month === 3) {
      month = 'March'
    } else if (month === 4) {
      month = 'April'
    } else if (month === 5) {
      month = 'May'
    } else if (month === 6) {
      month = 'June'
    } else if (month === 7) {
      month = 'July'
    } else if (month === 8) {
      month = 'August'
    } else if (month === 9) {
      month = 'September'
    } else if (month === 10) {
      month = 'October'
    } else if (month === 11) {
      month = 'November'
    } else if (month === 12) {
      month = 'December'
    }

    this.date = `${date} ${month}, ${year}`
    this.day = day
  }
}

// Exports
module.exports = Weather
