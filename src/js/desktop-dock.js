/**
 * Module for the desktop dock WebComponent.
 *
 * @module src/js/desktop-dock
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const template = document.createElement('template')
 const MemoryGame = require('./MemoryGame')

 template.innerHTML = `
 <style>
   :host ul {
       margin: 0px;
       padding: 0px;
       text-align: center;
   }
   :host li {
       display: inline-block;
       padding: 10px;
       margin-left: 20px;
   }
   :host img {
       width: 80px;
   }
 </style>

 <ul id="dock">
   <li id="memory"><a><image src="/image/brain.png"></a></li>
   <li id="chat"><a><img src="/image/chat.png"></a></li>
   <li id="settings"><a><img src="/image/settings.png"></a></li>
   <li id="music"><a><img src="/image/music.png"></a></li>
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
       new MemoryGame().createMemory()
     })

     this.shadowRoot.querySelector('#chat').addEventListener('click', event => {
       console.log('open chat...')
     })

     this.shadowRoot.querySelector('#settings').addEventListener('click', event => {
       console.log('open settings...')
     })

     this.shadowRoot.querySelector('#music').addEventListener('click', event => {
       console.log('open music...')
     })
   }

   /**
    * The code that runs when the element is removed from the DOM.
    */
   disconnectedCallback () {
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
