/**
 * perma-extension
 * @module popup/components/ArchiveForm
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-form>` custom element. 
 */
// @ts-check

import { BROWSER } from "../../constants/index.js";

/**
 * Custom Element: `<archive-form>`. 
 * Allows users to sign-in and create archives.
 * 
 * Available HTML attributes:
 * - `authenticated`
 * - `loading`
 * - `tab-url`
 * - `tab-title`
 */
export class ArchiveForm extends HTMLElement {
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["authenticated", "loading", "tab-url", "tab-title"];
  }

  /**
   * Upon injection into the DOM:
   * - Start observing changes in the `appState` table.
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
   * 
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);
    let html = ``;

    //
    // Heading
    //
    html += /*html*/`
    <h1>
      <a href="https://perma.cc" 
         target="_blank" 
         rel="noopener noreferer" 
         title="${getMessage("archive_form_heading_link_caption")}" 
         aria-label="${getMessage("archive_form_heading_link_caption")}">
        <img src="../assets/infinity-orange.svg" alt="Perma.cc"/>
      </a>
      
      <span>${getMessage("archive_form_heading")}<span>
    </h1>`;

    //
    // Current tab summary 
    //
    html += /*html*/`
    <div id="current-tab-summary">
      <strong>${getAttribute("tab-title")}</strong>
      <span>${getAttribute("tab-url")}</span>
    </div>
    `;

    //
    // If authenticated: Complete archive creation form
    // 
    if (getAttribute("authenticated") === 'true') {
      html += /*html*/``;
    }
    //
    // If not authenticated: Sign-in form
    //
    else {
      html += /*html*/`
      <form action="#sign-in">

        <input type="password" 
               name="api-key" 
               id="api-key" 
               minlength="40"
               maxlength="40"
               aria-label="${getMessage("sign_in_form_api_key_input_label")}"
               placeholder="${getMessage("sign_in_form_api_key_input_label")}"/>

        <button>${getMessage("sign_in_form_sign_in_button_label")}</button>

        <a href="${getMessage("sign_in_form_sign_in_api_key_help_url")}" 
          target="_blank" 
          rel="noopener noreferer">
          ${getMessage("sign_in_form_sign_in_api_key_help_caption")}
        </a>

        <a href="${getMessage("sign_in_form_sign_in_guest_link_url") + getAttribute("tab-url")}" 
          target="_blank" 
          rel="noopener noreferer">
          ${getMessage("sign_in_form_sign_in_guest_link_caption")}
        </a>
      </form>
      `;
    }

    this.innerHTML = html;
  }
 
} 
customElements.define('archive-form', ArchiveForm);
