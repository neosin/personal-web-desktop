/**
 * Module for the desktop dock WebComponent.
 *
 * @module src/js/desktop-dock
 * @author Rasmus Falk
 * @version 1.0.0
 */

 'use strict'

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
   }

   connectedCallback () {
   }

   disconnectedCallback () {
   }
 }

 window.customElements.define('desktop-dock', Dock)

 // Exports
 module.exports = Dock
