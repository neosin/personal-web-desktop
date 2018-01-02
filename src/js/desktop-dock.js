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
 const PhotoBooth = require('./PhotoBooth')

 template.innerHTML = `
 <style>
   :host {
       position: fixed;
       bottom: 0px;
       width: 100%;
       z-index: 1000;
    }

   :host ul {
       margin: 0px;
       padding: 0px;
       text-align: center;
   }

   :host li {
       display: inline-block;
       padding: 10px;
       transition: transform 0.2s; 
   }

   :host li:hover {
       transform: scale(1.3);
   }
 </style>

 <ul id="dock">
   <li id="memory"><a href="#"><image src="/image/appIcons/game.png"></a></li>
   <li id="chat"><a href="#"><img src="/image/appIcons/chat.png"></a></li>
   <li id="weather"><a href="#"><img src="/image/appIcons/weather.png"></a></li>
   <li id="camera"><a href="#"><img src="/image/appIcons/camera.png"></a></li>
   <li id="settings"><a href="#"><img src="/image/appIcons/settings.png"></a></li>
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

     this.shadowRoot.addEventListener('click', event => {
       if (event.target.closest('li').id === 'memory') {
         new Memory('Memory', '/image/appIcons/game.png').createMemoryWindow()
       } else if (event.target.closest('li').id === 'chat') {
         new Chat('Chat', '/image/appIcons/chat.png').createChatWindow()
       } else if (event.target.closest('li').id === 'settings') {
         new Settings('Settings', '/image/appIcons/settings.png').createSettingsWindow()
       } else if (event.target.closest('li').id === 'weather') {
         new Weather('Weather', '/image/appIcons/weather.png').createWeatherWindow()
       } else if (event.target.closest('li').id === 'camera') {
         new PhotoBooth('Photo Booth', '/image/appIcons/camera.png').createPhotoBoothWindow()
       }
     })
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
