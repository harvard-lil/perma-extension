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

    this.generateSignInForm = this.generateSignInForm.bind(this);
    this.generateCreateArchiveForm = this.generateCreateArchiveForm.bind(this);
    this.generateFoldersPickOptions = this.generateFoldersPickOptions.bind(this);

    this.handleSignInFormSubmit = this.handleSignInFormSubmit.bind(this);
    this.handleFolderSelectChange = this.handleFolderSelectChange.bind(this);
    this.handleCreateArchiveClick = this.handleCreateArchiveClick.bind(this);
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() {
    return [
      "is-authenticated",
      "is-loading",
      "tab-url",
      "tab-title",
      "folders-list",
      "folders-pick",
    ];
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
    if (newValue !== oldValue) {
      this.renderInnerHTML();
    }
  }

  /**
   * On "submit" of the "Sign in" form:
   * - Send `AUTH_SIGN_IN` message to the service worker.
   * - If successful, also call `FOLDERS_PULL_LIST` and `ARCHIVE_PULL_TIMELINE`.
   * 
   * @param {Event} e
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
   * On "change" of the "folders pick" selector.
   * - Send `FOLDERS_PICK_ONE` message to the service worker.
   *  
   * @param {Event} e
   */
  async handleFolderSelectChange(e) {
    e.preventDefault();

    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.FOLDERS_PICK_ONE,
      folderId: this.querySelector("select[name='folders-pick']")?.value,
    });
  }

  /**
   * On "click" of the "Create archive" button.
   * - Send `ARCHIVE_CREATE_PUBLIC` message to the service worker.
   *  
   * @param {Event} e
   */
  async handleCreateArchiveClick(e) {
    e.preventDefault();
    BROWSER.runtime.sendMessage({messageId: MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC});
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

    // If authenticated: Archive creation form
    if (getAttribute("is-authenticated") === "true") {
      this.innerHTML = this.generateCreateArchiveForm();
    }
    // If not authenticated: Sign-in form
    else {
      this.innerHTML = this.generateSignInForm();
    }

    //
    // [2] Bind event listeners
    //

    // Sign-in form: Submit
    this.querySelector('form[action="#sign-in"]')?.addEventListener(
      "submit",
      this.handleSignInFormSubmit
    );

    // Create archive form: Pick default folder
    this.querySelector('form[action="#create-archive"] select')?.addEventListener(
      "change",
      this.handleFolderSelectChange
    );

    // Create archive form: Create a public archive
    this.querySelector('form[action="#create-archive"] button')?.addEventListener(
      "click",
      this.handleCreateArchiveClick
    );

    //
    // [3] Side effects
    //

    // Disable all form elements when the app is loading
    if (getAttribute("is-loading") === "true") {
      for (let element of this.querySelectorAll("button, input, select")) {
        element.setAttribute("disabled", "disabled");
      }
    }
  }

  /**
   * Generates the sign-in form.
   * @returns {string} HTML
   */
  generateSignInForm() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);

    return /*html*/`
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

  /**
   * Generates the archive creation form.
   * @returns {string} HTML
   */
  generateCreateArchiveForm() {
    const getMessage = BROWSER.i18n.getMessage;

    return /*html*/ `
    <form action="#create-archive">

      <fieldset>
        <label for="folders-pick">${getMessage("create_archive_form_select_intro")}</label>
        <select name="folders-pick"
                id="folders-pick" 
                aria-label="${getMessage("create_archive_form_select_label")}">
          <option value="">${getMessage("create_archive_form_select_default")}</option>
          ${this.generateFoldersPickOptions()}
        </select>
      </fieldset>

      <button data-action="create-archive-public"
              aria-label="${getMessage("create_archive_form_button_label")}"
              title="${getMessage("create_archive_form_button_label")}">
        ${getMessage("create_archive_form_button_caption")}
      </button>
    </form>
    `;
  }

  /**
   * Generates a list of `<option>` using the values of the `folders-list` and `folders-pick` attributes.
   * @returns {string} HTML
   */
  generateFoldersPickOptions() {
    let foldersList = this.getAttribute("folders-list");
    let foldersPick = this.getAttribute("folders-pick");

    if (!foldersList) {
      return "";
    }

    let html = "";

    for (let folder of JSON.parse(foldersList)) {
      let selected = foldersPick && parseInt(foldersPick) === folder?.id ? "selected" : "";
      let name = `${"┄".repeat(folder.depth)} ${folder.name}`;

      html += /*html*/ `
      <option ${selected} value="${folder?.id}" aria-label="${name}">${name}</option>
      `;
    }

    return html;
  }
} 
customElements.define('archive-form', ArchiveForm);
