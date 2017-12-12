/**
 * Module for the desktop dock WebComponent.
 *
 * @module src/js/desktop-dock
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

 const template = document.createElement('template')

 template.innerHTML = `
 <style>
   :host ul {
       background-color: red;
       margin: 0px;
       padding: 0px;
       text-align: center;
   }
   :host li {
       display: inline-block;
       padding: 10px;
       margin-left: 20px;
   }
 </style>

 <ul id="dock">
   <li><a>Memory</a></li>
   <li><a>Chat</a></li>
   <li><a>Settings</a></li>
   <li><a>Music</a></li>
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

   connectedCallback () {
     console.log('test')
   }

   disconnectedCallback () {
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
