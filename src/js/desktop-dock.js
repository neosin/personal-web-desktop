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
   :host {
       background-color: red;
 }
 </style>

 <ul id="dock"></ul>
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
