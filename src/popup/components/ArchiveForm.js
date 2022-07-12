/**
 * perma-extension
 * @module popup/components/ArchiveForm
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-form>` custom element. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";

/**
 * Custom Element: `<archive-form>`. 
 * Allows users to sign-in and create archives.
 * 
 * Available HTML attributes:
 * - `authenticated`: If "true", will show the archive creation form. Will show the sign-in form otherwise.
 * - `loading`: If "true", will "block" any form element.
 * - `url`: Url of the current tab.
 * - `title`: Title of the current tab.
 */
export class ArchiveForm extends HTMLElement {

  constructor() {
    super();
    this.handleSignInFormSubmit = this.handleSignInFormSubmit.bind(this);
  }
  
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["authenticated", "loading", "url", "title"];
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
   * 
   */
  async handleSignInFormSubmit(e) {
    e.preventDefault();

    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.AUTH_SIGN_IN,
      apiKey: this.querySelector("input[name='api-key']")?.value
    });
  }

  /**
   * Assembles a template and injects it into `innerHTML`.
   * Binds event listeners to the elements that were injected.
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);

    //
    // [1] Prepare and inject template
    //
    let html = ``;

    // Heading
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

    // Current tab summary 
    html += /*html*/`
    <div id="current-tab-summary">
      <strong>${getAttribute("title")}</strong>
      <span>${getAttribute("url")}</span>
    </div>
    `;

    // If authenticated: Complete archive creation form
    if (getAttribute("authenticated") === 'true') {
      html += /*html*/`
      `;
    }
    // If not authenticated: Sign-in form
    else {
      html += /*html*/`
      <form action="#sign-in">

        <input type="password" 
               name="api-key" 
               id="api-key" 
               minlength="40"
               maxlength="40"
               required
               aria-label="${getMessage("sign_in_form_api_key_input_label")}"
               placeholder="${getMessage("sign_in_form_api_key_input_label")}"/>

        <button>${getMessage("sign_in_form_sign_in_button_label")}</button>

        <a href="${getMessage("sign_in_form_sign_in_api_key_help_url")}" 
          target="_blank" 
          rel="noopener noreferer">
          ${getMessage("sign_in_form_sign_in_api_key_help_caption")}
        </a>

        <a href="${getMessage("sign_in_form_sign_in_guest_link_url") + getAttribute("url")}" 
          target="_blank" 
          rel="noopener noreferer">
          ${getMessage("sign_in_form_sign_in_guest_link_caption")}
        </a>
      </form>
      `;
    }

    this.innerHTML = html;

    //
    // [2] Bind event listeners
    //

    // Sign-in form submit
    this.querySelector('form[action="#sign-in"]')?.addEventListener(
      "submit",
      this.handleSignInFormSubmit
    );

    //
    // [3] Side effects
    //

    // Disable all form elements while the app is loading
    if (getAttribute("loading") === "true") {
      for (let element of this.querySelectorAll("button, input")) {
        element.setAttribute("disabled", "disabled");
      }
    }
  }
 
} 
customElements.define('archive-form', ArchiveForm);
