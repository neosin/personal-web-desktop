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
   * @param {string} icon String of the relative URL for the title of the application window.
   * @memberof Weather
   */
  constructor (title, icon) {
    super()

    this.response = null
    this.url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329324/data.json'
    this.title = title
    this.icon = icon
    this.currentDay = undefined
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
    this.createWindow()
    this.currentWindow.classList.add('weather')
    setup.editAppContent('#weather', this.currentWindow)

    this.getCurrentPosition()

    this.currentDay = this.dateObj.getDay()
    this.getData()

    this.currentWindow.querySelector('.controlls button').addEventListener('click', event => {
      this.changeLocation()
    })
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
    this.counter = 0
    this.currentDay = this.dateObj.getDay()
    this.hourCounter = 0
    this.dayCounter = 0
  }

  /**
   * Makes an request to the SMHI API.
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
   * Calculates the highest, lowest and the temperature for the vurrent time.
   */
  calculateWeather () {
    this.dateObj.setDate((this.dateObj.getDate() + this.dayCounter))
    this.hourCounter = 0

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
    this.displayWeather(this.temp.value, this.temp.status, lowest, highest)
  }

  /**
   * Writes out each day to the DOM.
   *
   * @param {number} temp The temperature closest to the current hour.
   * @param {number} weatherStatus A number representing the weather condition.
   * @param {number} lowest The coldest temperature of the day.
   * @param {number} highest The warmest temperature of the day.
   */
  displayWeather (temp, weatherStatus, lowest, highest) {
    let template = document.querySelector('#weatherDay')
    let content = this.currentWindow.querySelector('.content')
    let dayTemplate

    dayTemplate = document.importNode(template.content, true)
    content.appendChild(dayTemplate)

    let day = this.currentWindow.querySelectorAll('.content h2')[this.counter]
    let highLow = this.currentWindow.querySelectorAll('.content p')[this.counter]
    let temperature = this.currentWindow.querySelectorAll('.content h1')[this.counter]
    let statusText = this.currentWindow.querySelectorAll('.content h3')[this.counter]

    day.textContent = this.getDayName()
    highLow.textContent = `${highest}° / ${lowest}°`
    temperature.textContent = `${temp}°`
    statusText.textContent = this.getStatus(weatherStatus)

    this.counter++
    this.dayCounter = 1

    if (this.counter < 5) {
      this.calculateWeather()
    }
  }

  /**
   * Get's the correct name for each day.
   */
  getDayName () {
    let nameOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = this.dateObj.getDay()
    let dayText

    dayText = day === this.currentDay ? 'Today' : nameOfDays[day]

    return dayText
  }

  /**
   * Get's the correct weather status for each day.
   *
   * @param {number} weatherStatus A number representing the weather status of the current time.
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
    } else {
      this.temp = this.hourCounter === 10 ? temps[temps.length - 1] : value[0]
    }
  }

  getCurrentPosition () {
    navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude.toString(10).slice(0, 9)
      let lat = position.coords.latitude.toString(10).slice(0, 9)

      let option = this.currentWindow.querySelector('.controlls .currentLocation')
      option.selected = true
      option.disabled = false
      option.value = `${long},${lat}`

      console.log(option.value)

      this.changeLocation()
    })
  }
}

// Exports
module.exports = Weather
