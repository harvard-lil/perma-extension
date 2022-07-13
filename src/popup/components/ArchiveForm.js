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
 * - `is-authenticated`: If "true", will show the archive creation form. Will show the sign-in form otherwise.
 * - `is-loading`: If "true", will "block" any form element.
 * - `tab-url`: Url of the current tab.
 * - `tab-title`: Title of the current tab.
 * - `folders-list`: JSON-serialized storage entry for "folders.available", if available. Should contain an array of objects (id, depth, name).
 * - `folders-pick`: Id of the folder the user has picked as a default, if any. 
 */
export class ArchiveForm extends HTMLElement {
  /**
   * On instantiation: 
   * - Bind local methods to `this` so they can easily be passed around
   */
  constructor() {
    super();
    this.handleSignInFormSubmit = this.handleSignInFormSubmit.bind(this);
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["is-authenticated", "is-loading", "tab-url", "tab-title", "folders-list", "folders-pick"];
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
   * On "submit" of the "Sign in" form:
   * - Send `AUTH_SIGN_IN` message to the service worker.
   * - If successful, also call `FOLDERS_PULL_LIST` and `ARCHIVE_PULL_TIMELINE`.
   */
  async handleSignInFormSubmit(e) {
    e.preventDefault();

    const signedIn = await new Promise((resolve) => {
      BROWSER.runtime.sendMessage(
        {
          messageId: MESSAGE_IDS.AUTH_SIGN_IN,
          apiKey: this.querySelector("input[name='api-key']")?.value,
        },
        (response) => resolve(response)
      );
    });

    if (signedIn === true) {
      BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.FOLDERS_PULL_LIST });
      BROWSER.runtime.sendMessage({ messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE });
    }
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

    // If authenticated: Complete archive creation form
    if (getAttribute("is-authenticated") === 'true') {
      html += /*html*/`
      <form action="#create-archive">

        <select name="folder-pick">
          <option name="">(Default folder)</option>
        </select>

        <button>Archive</button>

      </form>
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

        <a href="${getMessage("sign_in_form_sign_in_guest_link_url") + getAttribute("tab-url")}" 
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
    if (getAttribute("is-loading") === "true") {
      for (let element of this.querySelectorAll("button, input")) {
        element.setAttribute("disabled", "disabled");
      }
    }
  }
 
} 
customElements.define('archive-form', ArchiveForm);
