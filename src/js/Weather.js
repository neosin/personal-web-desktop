/**
 * Module for the weather application.
 *
 * @module src/js/Weather
 * @author Rasmus Falk
 * @version 1.0.0
 */

'use strict'

const DesktopWindow = require('./DesktopWindow')
const setup = require('./setup')

/**
 * Class representing a weather application.
 */
class Weather extends DesktopWindow {
  /**
   * Creates an instance of Weather.
   *
   * @param {string} title String of the relative URL for the application window icon.
   * @param {string} icon String of the title for the application window.
   * @memberof Weather
   */
  constructor (title, icon) {
    super()

    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
    this.title = title
    this.icon = icon
    this.day = undefined
    this.weatherStatus = undefined
    this.dayToDisplay = 0
    this.dateObj = new Date()
    this.highestTemp = null
    this.lowestTemp = null
    this.hourCounter = 0
    this.counter = 0
    this.filteredTimes = undefined
  }

  /**
   * Creates a new weather window.
   */
  createWeatherWindow () {
    this.createWindow(this.title, this.icon)
    setup.startLoading(this.currentWindow)
    this.currentWindow.classList.add('weather')

    setup.editAppContent('#weather', this.currentWindow)

    this.getData()
  }

  /**
   * Updates the choosen location.
   */
  changeLocation () {
    let selected = this.currentWindow.querySelector('select').value

    let long = selected.slice(0, 9)
    let lat = selected.slice(10)

    this.url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${long}/lat/${lat}/data.json`

    setup.editAppContent('#weather', this.currentWindow)
    this.counter = 0
    this.dayToDisplay = 0
    this.hourCounter = 0
    this.getData()
  }

  /**
   * Gets the data from the SMHI API.
   */
  getData () {
    window.fetch(this.url)
    .then(response => {
      return response.json()
    })
    .then(response => {
      this.response = response
      setup.stopLoading(this.currentWindow)

      this.calculateWeather()

      this.currentWindow.querySelector('#controlls button').addEventListener('click', event => {
        this.changeLocation()
      })
    })
  }

  /**
   * Calculates the different temperatures etc.
   */
  calculateWeather () {
    let temps = []

    this.checkCurrentWeatherDay()

    for (let i = 0; i < this.filteredTimes.length; i++) {
      let parameters = this.filteredTimes[i].parameters

      for (let j = 0; j < parameters.length; j++) {
        if (parameters[j].name === 't') {
          temps.push({time: this.filteredTimes[i].validTime, value: parameters[j].values[0]})
        }

        if (parameters[j].name === 'Wsymb2') {
          temps[i].status = parameters[j].values[0]
        }
      }
    }

    temps.sort((a, b) => { return b.value - a.value })

    this.highestTemp = temps[0].value
    this.lowestTemp = temps[temps.length - 1].value

    this.checkCurrentWeatherTime(temps)
  }

  /**
   * Prints out the data to the screen.
   *
   * @param {number} temp The temperature closest to the current hour.
   */
  displayWeather (temp, weatherStatus) {
    this.getDayName()
    this.getStatus(weatherStatus)

    let template = document.querySelector('#weatherDay')
    let dayTemplate
    let content = this.currentWindow.querySelector('#content')

    dayTemplate = document.importNode(template.content, true)
    content.appendChild(dayTemplate)

    let day = this.currentWindow.querySelectorAll('#content h2')[this.counter]
    let highLow = this.currentWindow.querySelectorAll('#content p')[this.counter]
    let temperature = this.currentWindow.querySelectorAll('#content h1')[this.counter]
    let statusText = this.currentWindow.querySelectorAll('#content h3')[this.counter]

    day.textContent = this.day
    highLow.textContent = `${this.highestTemp}° / ${this.lowestTemp}°`
    temperature.textContent = `${temp}°`
    statusText.textContent = this.weatherStatus

    this.dayToDisplay++
    this.counter++

    if (this.counter < 5) {
      this.calculateWeather()
    }
  }

  /**
   * Gets the correct text for the specific day.
   */
  getDayName () {
    let dateObj = this.dateObj
    let day = dateObj.getDay() + this.dayToDisplay
    let nameOfDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    if (day > 7) { day -= 7 }

    day === this.dateObj.getDay() ? this.day = 'Today' : this.day = nameOfDays[day - 1]
  }

  /**
   * Calculates the weather status text.
   *
   * @param {number} statusCode The number recived from the request.
   */
  getStatus (statusCode) {
    let weatherStatusList = ['Clear sky', 'Nearly clear sky', 'Variable cloudiness', 'Halfclear sky',
      'Cloudy sky', 'Overcast', 'Fog', 'Light rain showers', 'Moderate rain showers',
      'Heavy rain showers', 'Thunderstorm', 'Light sleet showers', 'Moderate sleet showers',
      'Heavy sleet showers', 'Light snow showers', 'Moderate snow showers', 'Heavy snow showers',
      'Light rain', 'Moderate rain', 'Heavy rain', 'Thunder', 'Light sleet', 'Moderate sleet',
      'Heavy sleet', 'Light snowfall', 'Moderate snowfall', 'Heavy snowfall']

    this.weatherStatus = weatherStatusList[statusCode - 1]
  }

  /**
   * Checks if the data has weather info that matches the closest hour.
   *
   * @param {object[]} temps Array of objects with temperatures and their closest time.
   */
  checkCurrentWeatherTime (temps) {
    let value = temps.filter(current => {
      let hours = this.dateObj.getHours() + this.hourCounter
      let dataHours = parseInt(current.time.slice(11, 13))

      return dataHours === hours
    })

    if (value.length === 0 && this.hourCounter !== 10) {
      this.hourCounter++
      this.checkCurrentWeatherTime(temps)
    } else if (this.hourCounter === 10) {
      this.hourCounter = 0
      let tempInfo = temps[temps.length - 1]
      this.displayWeather(tempInfo.value, tempInfo.status)
    } else {
      this.hourCounter = 0
      this.displayWeather(value[0].value, value[0].status)
    }
  }

  /**
   * Checks if it becomes anew month.
   *
   * @param {number} start The new starting point if there is a new month.
   */
  checkCurrentWeatherDay (start) {
    this.filteredTimes = this.response.timeSeries.filter(current => {
      current = parseInt(current.validTime.slice(8, 10))

      let compare
      start ? compare = start : compare = this.dateObj.getDate() + this.dayToDisplay

      return current === compare
    })

    if (this.filteredTimes.length === 0) {
      this.dayToDisplay = 1

      this.checkCurrentWeatherDay(this.dayToDisplay)
      this.dayToDisplay++
    }
  }
}

// Exports
module.exports = Weather
