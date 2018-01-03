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
   * @memberof Weather
   */
  constructor () {
    super()

    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
    this.title = 'Weather'
    this.icon = '/image/appIcons/weather.png'
    this.dateObj = new Date()
    this.currentDay = this.dateObj.getDay()
  }

  /**
   * Creates a new weather window.
   */
  createWeatherWindow () {
    this.createWindow()
    this.currentWindow.classList.add('weather')

    setup.editAppContent('#weather', this.currentWindow)

    this.getCurrentPosition()
    this.getData()

    this.currentWindow.querySelector('.controlls button').addEventListener('click', event => this.changeLocation())
  }

  /**
   * Updates the location for the weather.
   */
  changeLocation () {
    let selected = this.currentWindow.querySelector('select').value

    let split = selected.indexOf(',')
    let long = selected.slice(0, split)
    let lat = selected.slice(split + 1)

    this.url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${long}/lat/${lat}/data.json`

    this.resetWeatherValues()
    this.getData()
  }

  /**
   * Resets the values that's used in the weather app.
   */
  resetWeatherValues () {
    setup.editAppContent('#weatherReset', this.currentWindow)

    this.dateObj = new Date()
    this.currentDay = this.dateObj.getDay()
    this.temp = undefined
  }

  /**
   * Makes an request to the SMHI API.
   */
  getData () {
    setup.toggleLoading(this.currentWindow)

    window.fetch(this.url)
    .then(response => { return response.json() })
    .then(response => {
      this.response = response
      setup.toggleLoading(this.currentWindow)

      this.calculateWeather(0)
    })
  }

  /**
   * Calculates the highest, lowest and current temperature for the current time.
   */
  calculateWeather (dayCounter = 1) {
    this.dateObj.setDate((this.dateObj.getDate() + dayCounter))

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

    this.checkCurrentWeatherTime(temps, 0)
    this.displayWeather(lowest, highest)
  }

  /**
   * Writes out each day to the DOM.
   *
   * @param {number} lowest The coldest temperature of the day.
   * @param {number} highest The warmest temperature of the day.
   */
  displayWeather (lowest, highest) {
    let template = document.querySelector('#weatherDay')
    let content = this.currentWindow.querySelector('.content')
    let dayTemplate

    dayTemplate = document.importNode(template.content, true)
    content.appendChild(dayTemplate)

    let counter = this.currentWindow.querySelectorAll('.day').length - 1
    this.currentWindow.querySelectorAll('.content h2')[counter].textContent = this.getDayName()
    this.currentWindow.querySelectorAll('.content p')[counter].textContent = `${highest}° / ${lowest}°`
    this.currentWindow.querySelectorAll('.content h1')[counter].textContent = `${this.temp.value}°`
    this.currentWindow.querySelectorAll('.content h3')[counter].textContent = this.getStatus(this.temp.status)

    if (this.currentWindow.querySelectorAll('.day').length < 5) {
      this.calculateWeather()
    }
  }

  /**
   * Get's the correct name for each day.
   *
   * @returns {string} A string representing the name of the current day.
   */
  getDayName () {
    let nameOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = this.dateObj.getDay()

    return day === this.currentDay ? 'Today' : nameOfDays[day]
  }

  /**
   * Get's the correct weather status for each day.
   *
   * @param {number} weatherStatus A number representing the weather status of the current time.
   * @returns {string} A string representing the weather condition for the current time.
   */
  getStatus (weatherStatus) {
    let weatherStatusList = ['Clear sky', 'Nearly clear sky', 'Variable cloudiness', 'Halfclear sky',
      'Cloudy sky', 'Overcast', 'Fog', 'Light rain showers', 'Moderate rain showers',
      'Heavy rain showers', 'Thunderstorm', 'Light sleet showers', 'Moderate sleet showers',
      'Heavy sleet showers', 'Light snow showers', 'Moderate snow showers', 'Heavy snow showers',
      'Light rain', 'Moderate rain', 'Heavy rain', 'Thunder', 'Light sleet', 'Moderate sleet',
      'Heavy sleet', 'Light snowfall', 'Moderate snowfall', 'Heavy snowfall']

    return weatherStatusList[weatherStatus - 1]
  }

  /**
   * Check's if there is a time that matches the current hour, else use the last time in the list.
   *
   * @param {object[]} temps The temperatures for each day.
   * @param {number} start Keeps track of the tested hour values.
   * @returns {object} The temperature closest to the current time.
   */
  checkCurrentWeatherTime (temps, start) {
    let value = temps.filter(current => {
      let hours = this.dateObj.getHours() + start
      let dataHours = parseInt(current.time.slice(11, 13))

      return dataHours === hours
    })

    if (value.length === 0 && start !== 10) {
      this.checkCurrentWeatherTime(temps, ++start)
    } else {
      this.temp = start === 10 ? temps[temps.length - 1] : value[0]
    }
  }

  /**
   * Get's the users long and lat cordinates.
   */
  getCurrentPosition () {
    navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude.toString(10).slice(0, 9)
      let lat = position.coords.latitude.toString(10).slice(0, 9)

      let option = this.currentWindow.querySelector('.controlls .currentLocation')

      option.selected = true
      option.disabled = false
      option.value = `${long},${lat}`

      this.changeLocation()
    })
  }
}

// Exports
module.exports = Weather
