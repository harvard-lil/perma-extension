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
 * - `auth-state`: One of "valid" | "invalid" | "signedout". Drives which form is shown:
 *   "valid" -> archive creation form, "invalid" -> "invalid key" panel (retry / update key),
 *   "signedout" (or unset) -> sign-in form.
 * - `key-hint`: Last few characters of the stored API key, shown in the "invalid key" panel.
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
    this.generateInvalidKeyPanel = this.generateInvalidKeyPanel.bind(this);
    this.generateCreateArchiveForm = this.generateCreateArchiveForm.bind(this);

    this.handleSignInFormSubmit = this.handleSignInFormSubmit.bind(this);
    this.handleRetryClick = this.handleRetryClick.bind(this);
    this.handleUpdateKeyClick = this.handleUpdateKeyClick.bind(this);
    this.handleFolderSelectChange = this.handleFolderSelectChange.bind(this);
    this.handleCreateArchiveClick = this.handleCreateArchiveClick.bind(this);

    /**
     * When `true`, show the sign-in form even though `auth-state` is "invalid" — set by the
     * "Update key" button so the user can paste a replacement key. Reset on leaving the invalid state.
     * @type {boolean}
     */
    this.showSignIn = false;
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() {
    return [
      "auth-state",
      "key-hint",
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
      await this.sendRuntimeMessage(MESSAGE_IDS.FOLDERS_PULL_LIST);
      await this.sendRuntimeMessage(MESSAGE_IDS.ARCHIVE_PULL_TIMELINE);
    }
  }

  /**
   * On "click" of the "Retry" button in the invalid-key panel:
   * - Send `AUTH_CHECK` to re-validate the stored key. If it now succeeds (transient 401 cleared,
   *   or key re-enabled), the service worker restores the session and the UI re-renders.
   * - On success, also re-pull folders and timeline — they were never loaded while the key was
   *   invalid, so the recovered archive form would otherwise come up empty (mirrors sign-in).
   *
   * @param {Event} e
   */
  async handleRetryClick(e) {
    e.preventDefault();

    const recovered = await new Promise((resolve) => {
      BROWSER.runtime.sendMessage(
        { messageId: MESSAGE_IDS.AUTH_CHECK },
        (response) => resolve(response)
      );
    });

    if (recovered === true) {
      await this.sendRuntimeMessage(MESSAGE_IDS.FOLDERS_PULL_LIST);
      await this.sendRuntimeMessage(MESSAGE_IDS.ARCHIVE_PULL_TIMELINE);
    }
  }

  /**
   * Sends a runtime message and resolves when the service worker responds.
   *
   * @param {number} messageId
   * @returns {Promise<*>}
   */
  async sendRuntimeMessage(messageId) {
    return await new Promise((resolve) => {
      BROWSER.runtime.sendMessage({ messageId }, (response) => resolve(response));
    });
  }

  /**
   * On "click" of the "Update key" button in the invalid-key panel:
   * - Reveal the sign-in form so the user can paste a replacement key (without losing their data).
   *
   * @param {Event} e
   */
  handleUpdateKeyClick(e) {
    e.preventDefault();
    this.showSignIn = true;
    this.renderInnerHTML();
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
    const authState = getAttribute("auth-state");

    // Leaving the invalid state clears the "update key" override, so the panel (not the sign-in
    // form) is what shows if the key becomes invalid again later.
    if (authState !== "invalid") {
      this.showSignIn = false;
    }

    //
    // [1] Prepare and inject template
    //
    // Valid key: Archive creation form
    if (authState === "valid") {
      this.innerHTML = this.generateCreateArchiveForm();
    }
    // Invalid key (and not updating it): "invalid key" panel.
    else if (authState === "invalid" && !this.showSignIn) {
      this.innerHTML = this.generateInvalidKeyPanel();
    }
    // Signed out, or updating an invalid key: Sign-in form.
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

    // Invalid-key panel: Retry / Update key
    this.querySelector('button[data-action="retry"]')?.addEventListener(
      "click",
      this.handleRetryClick
    );
    this.querySelector('button[data-action="update-key"]')?.addEventListener(
      "click",
      this.handleUpdateKeyClick
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
      <!-- No client-side length constraints: a wrong-format key should reach authSignIn and
           surface the same "couldn't verify your key" error as a well-formed-but-rejected one,
           rather than being silently blocked by HTML5 validation with no feedback. -->
      <input type="password"
             name="api-key"
             id="api-key"
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
   * Generates the "invalid key" panel, shown when the stored API key was rejected (401/403).
   * Keeps the user's data and offers to re-check the key ("Retry") or replace it ("Update key").
   * @returns {string} HTML
   */
  generateInvalidKeyPanel() {
    const getMessage = BROWSER.i18n.getMessage;
    const keyHint = this.getAttribute("key-hint");

    return /*html*/`
    <div class="invalid-key">
      <p>${keyHint
        ? getMessage("invalid_key_panel_intro_with_hint", [keyHint])
        : getMessage("invalid_key_panel_intro")}</p>

      <button data-action="retry">${getMessage("invalid_key_panel_retry_button_label")}</button>
      <button data-action="update-key">${getMessage("invalid_key_panel_update_button_label")}</button>
    </div>
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
