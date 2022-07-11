/**
 * perma-extension
 * @module popup/components/ArchiveForm
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-form>` custom element. 
 */
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
   * Determines which HTML attributes should be observed by `attributeChangedCallback`.
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
   * Updates HTML attributes based on changes in the `appState` table.
   * @param {Object} newAppState - From `database.appState.getAllAsMap()`
   */
  handleAppStateUpdate(newAppState) {
    if ("apiKeyChecked" in newAppState) {
      this.setAttribute("authenticated", newAppState.apiKeyChecked);
    }

    if ("loadingBlocking" in newAppState) {
      this.setAttribute("loading", newAppState.loadingBlocking);
    }

    if ("currentTabUrl" in newAppState) {
      this.setAttribute("tab-url", newAppState.currentTabUrl);
    }

    if ("currentTabTitle" in newAppState) {
      this.setAttribute("tab-title", newAppState.currentTabTitle);
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
