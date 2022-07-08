/**
 * perma-extension
 * @module popup/components/ArchiveForm
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-form>` custom element. 
 */
import { liveQuery, Observable } from "dexie";
import { database } from "../../database/index.js";

/**
 * Custom Element: `<archive-form>`. 
 * Allows users to sign-in and create archives.
 * 
 * Available HTML attributes:
 * - `is-authenticated`: Switches between the sign-in form and the archive creation form if "true". 
 * - `loading`: Locks UI if "true".
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
    return ["is-authenticated", "loading"];
  }

  /**
   * Updates HTML attributes based on changes in the `appState` table.
   * @param {Object} state - From `database.appState.getAllAsMap()`
   */
  handleAppStateUpdate(state) {
    if ("apiKeyChecked" in state) {
      this.setAttribute("is-authenticated", state.apiKeyChecked);
    }

    if ("loadingBlocking" in state) {
      this.setAttribute("loading", state.loadingBlocking);
    }
  }

  /**
   * Replaces the content of this Node.
   */
  renderInnerHTML() {
    this.innerHTML = /*html*/`
      <h2>Form</h2>
    `;
  }

}
customElements.define('archive-form', ArchiveForm);