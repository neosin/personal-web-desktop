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
    this.nrOfDays = 0
    this.dateObj = new Date()
    this.highestTemp = null
    this.lowestTemp = null
    this.hourCounter = 0
  }

  createWeatherWindow (title, icon) {
    this.createWindow(title, icon)
    this.currentWindow.classList.add('weather')
    setup.editAppContent('#weather', this.currentWindow)

    this.getData()
  }

  changeLocation () {
    let selected = this.currentWindow.querySelector('select').value

    let long = selected.slice(0, 9)
    let lat = selected.slice(10)

    this.url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${long}/lat/${lat}/data.json`

    setup.editAppContent('#weather', this.currentWindow)
    this.nrOfDays = 0
    this.hourCounter = 0
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

      this.currentWindow.querySelector('#controlls button').addEventListener('click', event => {
        this.changeLocation()
      })
    })
  }

  calculateWeather () {
    let currentDay = this.dateObj.getDate()
    let times = this.response.timeSeries
    let temps = []

    times = times.filter(current => {
      current = parseInt(current.validTime.slice(8, 10))

      return current === currentDay + this.nrOfDays
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

    this.highestTemp = temps[0].value
    this.lowestTemp = temps[temps.length - 1].value

    this.checkCurrentWeatherTime(temps)
  }

  displayWeather (temp, highestTemp, lowestTemp) {
    this.calculateDay()
    let template = document.querySelector('#weatherDay')
    let dayTemplate
    let content = this.currentWindow.querySelector('#content')

    dayTemplate = document.importNode(template.content, true)
    content.appendChild(dayTemplate)

    let day = this.currentWindow.querySelectorAll('#content h1')[this.nrOfDays]
    let date = this.currentWindow.querySelectorAll('#content h2')[this.nrOfDays]
    let highLow = this.currentWindow.querySelectorAll('#content p')[this.nrOfDays]
    let temperature = this.currentWindow.querySelectorAll('#content h3')[this.nrOfDays]

    day.textContent = this.day
    date.textContent = this.date
    highLow.textContent = `${highestTemp}° / ${lowestTemp}°`
    temperature.textContent = `${temp}°`

    this.nrOfDays++

    if (this.nrOfDays < 3) {
      this.calculateWeather()
    }
  }

  calculateDay () {
    let dateObj = this.dateObj
    let date = dateObj.getDate() + this.nrOfDays
    let year = dateObj.getFullYear()
    let day = dateObj.getDay() + this.nrOfDays
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

  checkCurrentWeatherTime (temps) {
    let value = temps.filter(current => {
      let hours = this.dateObj.getHours() + this.hourCounter
      let dataHours = parseInt(current.time.slice(11, 13))

      return dataHours === hours
    })

    if (value.length === 0) {
      this.hourCounter++
      this.checkCurrentWeatherTime(temps)
    } else {
      this.displayWeather(value[0].value, this.highestTemp, this.lowestTemp)
    }
  }
}

// Exports
module.exports = Weather
