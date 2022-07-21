/**
 * perma-extension
 * @module popup/components/ArchiveTimelineItem
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-timeline-item>` custom element. 
 */
// @ts-check

import { BROWSER, MESSAGE_IDS } from "../../constants/index.js";

/**
 * Custom Element: `<archive-timeline-item>`. 
 * Represents a single archive in the `<archive-timeline>` element.
 * 
 * Available HTML attributes:
 * - `guid`
 * - `creation-timestamp`: String representation of Data object.
 * - `is-private`
 * 
 */
export class ArchiveTimelineItem extends HTMLElement {
  /**
   * On instantiation: 
   * - Bind local methods to `this` so they can easily be passed around
   */
  constructor() {
    super();
    this.handlePrivacyToggleClick = this.handlePrivacyToggleClick.bind(this);
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["guid", "creation-timestamp", "is-private"];
  }

  /**
   * Upon injection into the DOM:
   * - First render
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
   * On click on the "toggle privacy" button of a given item:
   * - Send `ARCHIVE_PRIVACY_STATUS_TOGGLE` message to the service worker.
   * 
   * @param {HTMLElement} button - Reference to the button that was clicked 
   */
  handlePrivacyToggleClick(button) {
    if (!("guid" in button.dataset) || !("isPrivate" in button.dataset)) {
      return;
    }

    const guid = button.dataset.guid;
    const isPrivate = button.dataset.isPrivate === "true" ? false : true;

    BROWSER.runtime.sendMessage({
      messageId: MESSAGE_IDS.ARCHIVE_PRIVACY_STATUS_TOGGLE,
      guid: guid,
      isPrivate: isPrivate
    });
  }

  /**
   * Assembles a template and injects it into `innerHTML`
   * Binds event listeners to the elements that were injected.
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);

    //
    // [1] Prepare and inject template
    //
    let guid = getAttribute("guid");
    let isPrivate = getAttribute("is-private") === "true";
    let openArchiveLabel = `${getMessage("archive_timeline_item_open_in_tab")} (${getAttribute("guid")})`;
    let toggleArchivePrivacyLabel = `${getMessage("archive_timeline_item_make_" + (isPrivate ? "public" : "private"))}`;

    /** @type {?Date} */
    let creationTimestamp = new Date(getAttribute("creation-timestamp"));

    this.innerHTML = /*html*/`
      <a href="${getMessage("perma_base_url")}${guid}" 
         target="_blank" 
         rel="noopener noreferrer"
         title="${openArchiveLabel}"
         aria-label="${openArchiveLabel}">
         <strong>${guid}</strong><br>
         <span>${creationTimestamp?.toLocaleString()}</span>
      </a>

      <button 
        aria-label="${toggleArchivePrivacyLabel}"
        title="${toggleArchivePrivacyLabel}"
        data-guid="${guid}"
        data-is-private="${isPrivate ? "true" : "false"}"
      >
          <img src="../assets/lock-${isPrivate ? "closed" : "open"}-white.svg" 
               alt="" 
               aria-hidden="true"/>
      </button>
    `;

    //
    // [2] Bind event listeners
    //
    for (let button of this.querySelectorAll("button")) {
      button.addEventListener("click", (e) => this.handlePrivacyToggleClick(button)); // TODO: Event delegation?
    }
  }

}
customElements.define('archive-timeline-item', ArchiveTimelineItem);
