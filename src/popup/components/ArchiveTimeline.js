/**
 * perma-extension
 * @module popup/components/ArchiveTimeline
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-timeline>` custom element. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";

/**
 * Custom Element: `<archive-timeline>`. 
 * Shows the user the list of archives that they created for the current page.
 * 
 * Available HTML attributes:
 * - `is-authenticated`: If not "true", this component is hidden.
 * - `is-loading`: If "true", all buttons and links in this list will be disabled.
 */
export class ArchiveTimeline extends HTMLElement {

  constructor() {
    super();
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() {
    return ["is-authenticated", "is-loading"];
  }

  connectedCallback() {
    this.renderInnerHTML();

    let instancesCount = 0;
    for (let instances of document.querySelectorAll("archive-timeline")) {
      instancesCount += 1;

      if (instancesCount > 1) {
        instances.remove();
      }
    }
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
    const getAttribute = this.getAttribute.bind(this);
    const setAttribute = this.setAttribute.bind(this);
    const getMessage = BROWSER.i18n.getMessage;

    // aria-hidden and empty if user is not authenticated
    if (getAttribute("is-authenticated") !== "true") {
      setAttribute("aria-hidden", "true");
      this.innerHTML = ``;
      return;
    }

    // If user is authenticated:
    // - Make element behave like a list
    // - Check that all children are `<archive-timeline-item>` if any
    // - Inject "empty" message if no valid children found
    setAttribute("aria-hidden", "false");
    setAttribute("role", "list");

    this.innerHTML = /*html*/``;


  }

}
customElements.define('archive-timeline', ArchiveTimeline);