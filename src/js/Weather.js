const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

class Weather extends DesktopWindow {
  constructor () {
    super()

    this.day = undefined
    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
    this.nrOfDays = 0
    this.dateObj = new Date()
    this.highestTemp = null
    this.lowestTemp = null
    this.hourCounter = 0
    this.currentDay = this.dateObj.getDay()
    this.counter = 0
    this.filteredTimes = undefined
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
    this.counter = 0
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
    let temps = []

    this.checkCurrentWeatherDay()

    for (let i = 0; i < this.filteredTimes.length; i++) {
      let parameters = this.filteredTimes[i].parameters

      for (let j = 0; j < parameters.length; j++) {
        if (parameters[j].name === 't') {
          temps.push({time: this.filteredTimes[i].validTime, value: parameters[j].values[0]})
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

    let day = this.currentWindow.querySelectorAll('#content h2')[this.nrOfDays]
    let highLow = this.currentWindow.querySelectorAll('#content p')[this.nrOfDays]
    let temperature = this.currentWindow.querySelectorAll('#content h1')[this.nrOfDays]

    day.textContent = this.day
    highLow.textContent = `${highestTemp}° / ${lowestTemp}°`
    temperature.textContent = `${temp}°`

    this.nrOfDays++
    this.counter++

    if (this.counter < 5) {
      this.calculateWeather()
    }
  }

  calculateDay () {
    let dateObj = this.dateObj
    let day = dateObj.getDay() + this.nrOfDays

    if (day > 7) {
      day = day - 7
    }

    if (day === this.currentDay) {
      day = 'Today'
    } else if (day === 1) {
      day = 'Monday'
    } else if (day === 2) {
      day = 'Tuesday'
    } else if (day === 3) {
      day = 'Wednesday'
    } else if (day === 4) {
      day = 'Thursday'
    } else if (day === 5) {
      day = 'Friday'
    } else if (day === 6) {
      day = 'Saturday'
    } else if (day === 7) {
      day = 'Sunday'
    }

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

  checkCurrentWeatherDay (start) {
    this.filteredTimes = this.response.timeSeries.filter(current => {
      current = parseInt(current.validTime.slice(8, 10))

      let compare

      if (start) {
        compare = start
      } else {
        compare = this.dateObj.getDate() + this.nrOfDays
      }

      return current === compare
    })

    if (this.filteredTimes.length === 0) {
      this.nrOfDays = 1
      this.checkCurrentWeatherDay(this.nrOfDays)
      this.nrOfDays++
    }
  }
}

// Exports
module.exports = Weather
