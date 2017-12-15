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

   :host img {
       width: 60px;
   }
 </style>

 <ul id="dock">
   <li id="memory"><a><image src="/image/icons/brain.png"></a></li>
   <li id="chat"><a><img src="/image/icons/chat.png"></a></li>
   <li id="settings"><a><img src="/image/icons/settings.png"></a></li>
   <li id="music"><a><img src="/image/icons/music.png"></a></li>
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
     this.shadowRoot.querySelector('#memory').addEventListener('click', event => {
       new Memory().createMemoryWindow('Memory', '/image/icons/brain.png')
     })

     this.shadowRoot.querySelector('#chat').addEventListener('click', event => {
       new Chat().createChatWindow('Chat', '/image/icons/chat.png')
     })

     this.shadowRoot.querySelector('#settings').addEventListener('click', event => {
       new Settings().createSettingsWindow('Settings', '/image/icons/settings.png')
     })

     this.shadowRoot.querySelector('#music').addEventListener('click', event => {
       console.log('open music...')
     })
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
