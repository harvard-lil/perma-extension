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
 * - `folders-cascade`: JSON-serialized folder cascade `{ levels, path, pick }` (see `storage.Folders`). Rendered as one `<select>` per opened level.
 *
 * Note:
 * - Singleton pattern is enforced. Only 1 element of this type can be present in a given document.
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
      "folders-cascade",
    ];
  }

  /**
   * Upon injection into the DOM:
   * - First render
   * - Enforce singleton pattern
   */
  connectedCallback() {
    this.renderInnerHTML();
    document.querySelectorAll("archive-form:not(:first-of-type)").forEach(e => e.remove());
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
   * On "change" of one of the cascade's folder selectors.
   * - Send `FOLDERS_PICK_ONE` message (with the changed level) to the service worker.
   *
   * @param {Event} e
   */
  async handleFolderSelectChange(e) {
    e.preventDefault();
    const select = /** @type {HTMLSelectElement} */ (e.target);

    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.FOLDERS_PICK_ONE,
      level: parseInt(select.dataset.level),
      folderId: select.value, // "" clears this level (file in the parent folder)
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

    // Create archive form: Pick a folder at any cascade level
    for (let select of this.querySelectorAll('form[action="#create-archive"] select[data-level]')) {
      select.addEventListener("change", this.handleFolderSelectChange);
    }

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
        rel="noopener noreferrer">
        ${getMessage("sign_in_form_sign_in_api_key_help_caption")}
      </a>

      <a href="${getMessage("sign_in_form_sign_in_guest_link_url") + getAttribute("tab-url")}"
        target="_blank"
        rel="noopener noreferrer">
        ${getMessage("sign_in_form_sign_in_guest_link_caption")}
      </a>
    </form>
    `;
  }

  /**
   * Generates the archive creation form.
   * Will be disabled when visiting "perma.cc/{guid}".
   *
   * @returns {string} HTML
   */
  generateCreateArchiveForm() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);

    const tabUrl = String(getAttribute("tab-url"));
    let forceDisabled = false;

    if (tabUrl.match(/^https:\/\/perma\.cc\/[A-Z0-9]{4}\-[A-Z0-9]{4}\/?$/)) {
      forceDisabled = true;
    }

    const cascade = this.getCascade();
    const hasFolders = cascade.levels.length > 0 && cascade.levels[0].length > 0;
    const hasTarget = cascade.pick !== null && cascade.pick !== undefined;

    // Don't let the user capture before folders have loaded and a real target is set:
    // a capture needs a target folder for link accounting.
    const disableButton = forceDisabled || !hasTarget;

    return /*html*/ `
    <form action="#create-archive">

      <fieldset>
        <label>${getMessage("create_archive_form_select_intro")}</label>
        ${hasFolders ? this.generateBreadcrumb(cascade) : ""}
        ${hasFolders ? this.generateCascadeSelects(cascade) : this.generateFoldersLoading()}
      </fieldset>

      <button aria-label="${getMessage("create_archive_form_button_label")}"
              title="${getMessage("create_archive_form_button_label")}"
              ${disableButton ? "disabled" : ""}>
        ${getMessage("create_archive_form_button_caption")}
      </button>
    </form>
    `;
  }

  /**
   * Reads and parses the `folders-cascade` attribute.
   * @returns {{levels: Array<Array<{id: number, name: string, hasChildren: boolean}>>, path: number[], pick: ?number}}
   */
  getCascade() {
    const raw = this.getAttribute("folders-cascade");

    if (!raw) {
      return { levels: [], path: [], pick: null };
    }

    const parsed = JSON.parse(raw);
    return {
      levels: Array.isArray(parsed?.levels) ? parsed.levels : [],
      path: Array.isArray(parsed?.path) ? parsed.path : [],
      pick: parsed?.pick ?? null,
    };
  }

  /**
   * Generates one `<select>` per opened cascade level. Levels below the top get a leading
   * "no subfolder" option (value ""), which targets the parent folder.
   *
   * @param {{levels: Array, path: number[]}} cascade
   * @returns {string} HTML
   */
  generateCascadeSelects(cascade) {
    const getMessage = BROWSER.i18n.getMessage;
    let html = "";

    for (let level = 0; level < cascade.levels.length; level++) {
      const options = cascade.levels[level];

      if (!options || options.length === 0) {
        continue; // Selected folder has no children: nothing to drill into.
      }

      const selectedId = cascade.path[level];
      let optionsHtml = "";

      // Subfolder selects can be left unset to file directly in the parent folder. While this
      // select is the active tip (nothing chosen in it yet), its empty option prompts "Choose
      // subfolder". Once a subfolder below has been picked, the empty option's job becomes "go
      // back up", so it's labelled with the parent's name (e.g. "[Personal Links]").
      if (level > 0) {
        const isUnset = selectedId === undefined || selectedId === null;
        let placeholderLabel;

        if (isUnset) {
          placeholderLabel = getMessage("create_archive_form_subfolder_choose");
        }
        else {
          const parentOptions = cascade.levels[level - 1] || [];
          const parentMatch = parentOptions.find((o) => o.id === parseInt(cascade.path[level - 1]));
          const parentName = parentMatch ? parentMatch.name : "";
          placeholderLabel = getMessage("create_archive_form_subfolder_parent", [parentName]);
        }

        optionsHtml += /*html*/ `<option value="" ${isUnset ? "selected" : ""}>${placeholderLabel}</option>`;
      }

      for (let option of options) {
        const selected = parseInt(selectedId) === option.id ? "selected" : "";
        // Mark folders that can be drilled into further.
        const marker = option.hasChildren ? " " + getMessage("create_archive_form_folder_has_children") : "";
        optionsHtml += /*html*/ `<option value="${option.id}" ${selected} aria-label="${option.name}">${option.name}${marker}</option>`;
      }

      html += /*html*/ `
        <select data-level="${level}"
                class="folders-pick${level > 0 ? " folders-pick-sub" : ""}"
                aria-label="${getMessage("create_archive_form_select_label")}">
          ${optionsHtml}
        </select>`;
    }

    return html;
  }

  /**
   * Generates a breadcrumb showing the folder the capture will be filed into.
   *
   * @param {{levels: Array, path: number[]}} cascade
   * @returns {string} HTML
   */
  generateBreadcrumb(cascade) {
    const getMessage = BROWSER.i18n.getMessage;
    const names = [];

    for (let level = 0; level < cascade.path.length; level++) {
      const options = cascade.levels[level] || [];
      const match = options.find((o) => o.id === parseInt(cascade.path[level]));

      if (match) {
        names.push(match.name);
      }
    }

    if (names.length === 0) {
      return "";
    }

    return /*html*/ `
      <p class="folders-breadcrumb">
        ${getMessage("create_archive_form_breadcrumb_intro")}
        <strong>${names.join(" › ")}</strong>
      </p>`;
  }

  /**
   * Generates a disabled placeholder select shown while top-level folders are still loading.
   * @returns {string} HTML
   */
  generateFoldersLoading() {
    const getMessage = BROWSER.i18n.getMessage;

    return /*html*/ `
      <select class="folders-pick" disabled aria-label="${getMessage("create_archive_form_folders_loading")}">
        <option>${getMessage("create_archive_form_folders_loading")}</option>
      </select>`;
  }
}
customElements.define('archive-form', ArchiveForm);
