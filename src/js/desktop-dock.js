/**
 * Module for the desktop dock WebComponent.
 *
 * @module src/js/desktop-dock
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const template = document.createElement('template')
 const Memory = require('./Memory')
 const Settings = require('./Settings')
 const Chat = require('./Chat')
 const Weather = require('./Weather')
 const setup = require('./setup')

 template.innerHTML = `
 <style>
   :host {
       position: fixed;
       bottom: 0px;
       width: 100%;
    }

   :host ul {
       margin: 0px;
       padding: 0px;
       text-align: center;
   }

   :host li {
       display: inline-block;
       padding: 10px;
   }
 </style>

 <ul id="dock">
   <li id="memory"><a href="#"><image src="/image/icons/game.png"></a></li>
   <li id="chat"><a href="#"><img src="/image/icons/chat.png"></a></li>
   <li id="settings"><a href="#"><img src="/image/icons/settings.png"></a></li>
   <li id="weather"><a href="#"><img src="/image/icons/weather.png"></a></li>
 </ul>
`

 /**
  * Class representing a desktop dock.
  */
 class Dock extends window.HTMLElement {
  /**
   * Creates an instance of Dock.
   *
   * @memberof Dock
   */
   constructor () {
     super()

     this.attachShadow({mode: 'open'})
     this.shadowRoot.appendChild(template.content.cloneNode(true))
   }

   /**
    * The code that runs when the element is added to the DOM.
    */
   connectedCallback () {
     setup.setupWindows()

     this.shadowRoot.querySelector('#memory').addEventListener('click', event => {
       new Memory('Memory', '/image/icons/game.png').createMemoryWindow()
     })

     this.shadowRoot.querySelector('#chat').addEventListener('click', event => {
       new Chat('Chat', '/image/icons/chat.png').createChatWindow()
     })

     this.shadowRoot.querySelector('#settings').addEventListener('click', event => {
       new Settings('Settings', '/image/icons/settings.png').createSettingsWindow()
     })

     this.shadowRoot.querySelector('#weather').addEventListener('click', event => {
       new Weather('Weather', '/image/icons/weather.png').createWeatherWindow()
     })
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
