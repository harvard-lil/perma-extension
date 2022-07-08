/**
 * perma-extension
 * @module popup/components/ArchiveForm
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-form>` custom element. 
 */
import { liveQuery } from "dexie";
import { database } from "../../database/index.js";
import { BROWSER } from "../../constants/index.js"

/**
 * Custom Element: `<archive-form>`. 
 * Allows users to sign-in and create archives.
 * 
 * Available HTML attributes:
 * - `authenticated`
 * - `loading`
 * - `tab-url`
 * - `tab-title`
 *  
 * Notes:
 * - Reacts to changes in the `appState` table.
 */
export class ArchiveForm extends HTMLElement {

  /**
   * `appState` indexedDb table observer (Dexie.liveQuery).
   * https://dexie.org/docs/liveQuery()
   * @type {Observable} 
   */
  appStateObserver = null;
  
  /**
   * Upon injection into the DOM:
   * - Start observing changes on the `appState` table.
   * - First render.
   */
  connectedCallback() {
    this.appStateObserver = liveQuery(database.appState.getAllAsMap).subscribe({
      next: this.handleAppStateUpdate.bind(this),
      error: (error) => console.log(error),
    });

    this.renderInnerHTML();
  }

  /**
   * Upon ejection from the DOM:
   * - Disconnect `appState` table observer.
   */
  disconnectedCallback() {
    this.authObserver.unsubscribe();
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
   * Determines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["authenticated", "loading", "tab-url", "tab-title"];
  }

  /**
   * Updates HTML attributes based on changes in the `appState` table.
   * @param {Object} state - From `database.appState.getAllAsMap()`
   */
  handleAppStateUpdate(state) {
    if ("apiKeyChecked" in state) {
      this.setAttribute("authenticated", state.apiKeyChecked);
    }

    if ("loadingBlocking" in state) {
      this.setAttribute("loading", state.loadingBlocking);
    }

    if ("currentTabUrl" in state) {
      this.setAttribute("tab-url", state.currentTabUrl);
    }

    if ("currentTabTitle" in state) {
      this.setAttribute("tab-title", state.currentTabTitle);
    }
  }

  /**
   * 
   */
  renderInnerHTML() {
    this.innerHTML = /*html*/`
    <h1>
      <img src="../assets/infinity-orange.svg" alt="Perma.cc"/>
      <span>${BROWSER.i18n.getMessage("create_a_new_perma_link")}<span>
    </h1>

    <div class="tab-summary">
      <strong>${this.getAttribute("tab-title")}</strong>
      <span>${this.getAttribute("tab-url")}</span>
    </div>
    `;

    // + If authenticated: complete archive creation form
    // + Otherwise: Sign in form + "Create an archive on Perma.cc" fallback link 
  }
 
} 
customElements.define('archive-form', ArchiveForm);
