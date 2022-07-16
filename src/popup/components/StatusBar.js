/**
 * perma-extension
 * @module popup/components/StatusBar
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<status-bar>` custom element. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";

/**
 * Custom Element: `<status-bar>`. 
 * Informs users on the extension's current state (is loading, error messages ...).
 * 
 * Available HTML attributes:
 * - `is-authenticated`: If "true", will show the "Sign out" button if not loading.
 * - `is-loading`: If "true", will show a loading spinner.
 * - `message`: Should be a key accessible via `browser.i18n`.
 * 
 * Note: 
 * - Singleton pattern is enforced. Only 1 element of this type can be present in a given document.
 */
export class StatusBar extends HTMLElement {
  /**
   * On instantiation: 
   * - Bind local methods to `this` so they can easily be passed around
   */
  constructor() {
    super();
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["is-authenticated", "is-loading", "message"];
  }

  /**
   * Upon injection into the DOM:
   * - First render.
   * - Enforce singleton pattern
   */
  connectedCallback() {
    this.renderInnerHTML();
    document.querySelectorAll("status-bar:not(:first-of-type)").forEach(e => e.remove());
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
   * On "click" on the "Sign out" button:
   * - Send `AUTH_SIGN)_OUT` message to the service worker.
   */
   async handleSignOutClick(e) {
    e.preventDefault();
    BROWSER.runtime.sendMessage({messageId: MESSAGE_IDS.AUTH_SIGN_OUT});
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
         title="${getMessage(message)}"
         aria-live="polite">
         ${getMessage(message)}
      </p>`;

    // Sign-out button (only if authenticated and not loading) 
    if (getAttribute("is-authenticated") === 'true' && getAttribute("is-loading") !== 'true') {
      html += /*html*/`<button>${getMessage("status_bar_sign_out_button_caption")}</button>`;
    }

    // Loading icon
    if (getAttribute("is-loading") === 'true') {
      html += /*html*/`
      <img src="../assets/loading.svg" 
           alt="${getMessage("status_bar_loading_alt")}"/>
      `;
    }

    this.innerHTML = html;

    //
    // [2] Bind event listeners
    //
    // Sign-out button click
    this.querySelector("button")?.addEventListener("click", this.handleSignOutClick);
  }

}
customElements.define('status-bar', StatusBar);