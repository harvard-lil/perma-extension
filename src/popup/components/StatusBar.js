/**
 * perma-extension
 * @module popup/components/StatusBar
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<status-bar>` custom element. 
 */
// @ts-check

import { BROWSER } from "../../constants/index.js";

/**
 * Custom Element: `<status-bar>`. 
 * Informs users on the extension's current state (is loading, error messages ...).
 * 
 * Available HTML attributes:
 * - `authenticated`: If "true", will show the "Sign out" button if not loading.
 * - `loading`: If "true", will show a loading spinner.
 * - `message`: Should be a key accessible via `browser.i18n`.
 */
export class StatusBar extends HTMLElement {
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["authenticated", "loading", "message"];
  }

  /**
   * Upon injection into the DOM:
   * - First render.
   */
  connectedCallback() {
    this.renderInnerHTML();
  }

  /**
   * On HTML attribute update:
   * - Re-render if value changed. 
   * 
   * @param {string} name 
   * @param {*} oldValue 
   * @param {*} newValue 
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if(newValue !== oldValue) {
      this.renderInnerHTML();
    }
  }

  /**
   * Assembles a template and injects it into `innerHTML`
   * Binds event listeners to the elements that were injected.
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);
    const message = getAttribute("message") ? getAttribute("message") : "status_default";

    //
    // [1] Prepare and inject template
    //
    let html = ``;

    // Status text
    html += /*html*/`
      <p aria-label="${getMessage(message)}" 
         title="${getMessage(message)}">
         ${getMessage(message)}
      </p>`;

    // Sign-out button (only if authenticated and not loading) 
    if (getAttribute("authenticated") === 'true' && getAttribute("loading") !== 'true') {
      html += /*html*/`<button>${getMessage("status_bar_sign_out_button_caption")}</button>`;
    }

    // Loading icon
    if (getAttribute("loading") === 'true') {
      html += /*html*/`
      <img src="../assets/loading.svg" 
           alt="${getMessage("status_bar_loading_alt")}"/>
      `;
    }

    this.innerHTML = html;

    //
    // [2] Bind event listeners
    //
  }

}
customElements.define('status-bar', StatusBar);