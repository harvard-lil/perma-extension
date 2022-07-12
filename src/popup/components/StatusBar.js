// @ts-check

import { BROWSER } from "../../constants/index.js";

export class StatusBar extends HTMLElement {
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
   static get observedAttributes() { 
    return ["authenticated", "loading", "message"];
  }

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

  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);
    const message = getAttribute("message") ? getAttribute("message") : "status_default";
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
  }

}
customElements.define('status-bar', StatusBar);