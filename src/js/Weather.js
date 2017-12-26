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
    this.currentDay = undefined
    this.dayText = undefined
    this.weatherStatus = undefined
    this.dateObj = new Date()
    this.hourCounter = 0
    this.dayCounter = 0
    this.counter = 0
    this.temp = undefined
  }

  /**
   * Creates a new weather window.
   */
  createWeatherWindow () {
    this.createWindow(this.title, this.icon)
    this.currentWindow.classList.add('weather')

    setup.editAppContent('#weather', this.currentWindow)

    this.currentWindow.querySelector('#controlls button').addEventListener('click', event => {
      this.changeLocation()
    })

    this.currentDay = this.dateObj.getDay()

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

    setup.editAppContent('#weatherReset', this.currentWindow)
    this.dateObj = new Date()
    this.counter = 0
    this.currentDay = undefined
    this.hourCounter = 0
    this.dayCounter = 0
    this.getData()
  }

  /**
   * Gets the data from the SMHI API.
   */
  getData () {
    setup.startLoading(this.currentWindow)

    window.fetch(this.url)
    .then(response => {
      return response.json()
    })
    .then(response => {
      this.response = response
      setup.stopLoading(this.currentWindow)

      this.calculateWeather()
    })
  }

  /**
   * Calculates the different temperatures etc.
   */
  calculateWeather () {
    this.dateObj.setDate((this.dateObj.getDate() + this.dayCounter))

    let temps = []
    let responseTimes = []

    responseTimes = this.response.timeSeries.filter(current => {
      return parseInt(current.validTime.slice(8, 10)) === this.dateObj.getDate()
    })

    for (let i = 0; i < responseTimes.length; i++) {
      let parameters = responseTimes[i].parameters

      for (let j = 0; j < parameters.length; j++) {
        if (parameters[j].name === 't') {
          temps.push({time: responseTimes[i].validTime, value: parameters[j].values[0]})
        }

        if (parameters[j].name === 'Wsymb2') {
          temps[i].status = parameters[j].values[0]
        }
      }
    }

    temps.sort((a, b) => { return b.value - a.value })

    let highest = temps[0].value
    let lowest = temps[temps.length - 1].value

    this.checkCurrentWeatherTime(temps)
    this.displayWeather(this.temp[0].value, this.temp[0].status, lowest, highest)
  }

  /**
   * Prints out the data to the screen.
   *
   * @param {number} temp The temperature closest to the current hour.
   */
  displayWeather (temp, weatherStatus, lowest, highest) {
    this.getDayName()
    this.getStatus(weatherStatus)

    let template = document.querySelector('#weatherDay')
    let content = this.currentWindow.querySelector('#content')
    let dayTemplate

    dayTemplate = document.importNode(template.content, true)
    content.appendChild(dayTemplate)

    let day = this.currentWindow.querySelectorAll('#content h2')[this.counter]
    let highLow = this.currentWindow.querySelectorAll('#content p')[this.counter]
    let temperature = this.currentWindow.querySelectorAll('#content h1')[this.counter]
    let statusText = this.currentWindow.querySelectorAll('#content h3')[this.counter]

    day.textContent = this.dayText
    highLow.textContent = `${highest}° / ${lowest}°`
    temperature.textContent = `${temp}°`
    statusText.textContent = this.weatherStatus

    this.counter++
    this.dayCounter = 1

    if (this.counter < 5) {
      this.calculateWeather()
    }
  }

  /**
   * Gets the correct text for the specific day.
   */
  getDayName () {
    let nameOfDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let day = this.dateObj.getDay()

    this.currentDay === day ? this.dayText = 'Today' : this.dayText = nameOfDays[day - 1]
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
      this.temp = temps[temps.length - 1]
    } else {
      this.temp = value
    }

    this.hourCounter = 0
  }
}

// Exports
module.exports = Weather
