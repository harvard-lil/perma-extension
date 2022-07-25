/**
 * perma-extension
 * @module popup/components/ArchiveTimelineItem
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-timeline-item>` custom element. 
 */
// @ts-check

import { BROWSER } from "../../constants/index.js";

/**
 * Custom Element: `<archive-timeline-item>`. 
 * Represents a single archive in the `<archive-timeline>` element.
 * 
 * Available HTML attributes:
 * - `guid`
 * - `archived-url`: Url that was actually captured (from `PermaArchive.url`).
 * - `creation-timestamp`: String representation of Data object.
 * - `capture-status`: From `PermaCapture.status`. Can be "pending", "failed" or "success".
 */
export class ArchiveTimelineItem extends HTMLElement {

  /**
   * Possible values for `capture-status`.
   * @static
   */
  static CAPTURE_STATUSES = ["success", "pending", "failed"];

  /**
   * On instantiation: 
   * - Bind local methods to `this` so they can easily be passed around
   */
  constructor() {
    super();
    this.handleCopyButtonClick = this.handleCopyButtonClick.bind(this);
  }

  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["guid", "creation-timestamp", "capture-status"];
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
   * Adds a reference to the Perma link that was clicked to the clipboard, in a "cite-ready" format.
   * 
   * Example: "https://lil.law.harvard.edu, archived at https://perma.cc/{guid}".
   * 
   * @param {Event} e
   */
  async handleCopyButtonClick(e) {
    e.preventDefault();
    const getMessage = BROWSER.i18n.getMessage;

    const guid = this.getAttribute("guid");
    const archivedUrl = this.getAttribute("archived-url");

    let toClipboard = `${archivedUrl}`;
    toClipboard += getMessage("archive_timeline_item_clipboard_archived_at");
    toClipboard += " ";
    toClipboard += `${getMessage("perma_base_url")}${guid}`;

    await navigator.clipboard.writeText(toClipboard);
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
    let captureStatus = getAttribute("capture-status");
    let creationTimestamp = new Date(getAttribute("creation-timestamp"));

    // Default `captureStatus` to "success" if `capture-status` not provided.
    if (!ArchiveTimelineItem.CAPTURE_STATUSES.includes(captureStatus)) {
      captureStatus = ArchiveTimelineItem.CAPTURE_STATUSES[0];
    }

    let archiveLinkLabel = `${getMessage("archive_timeline_item_open_in_tab")} (${getAttribute("guid")})`;
    let archiveCopyLabel = `${getMessage("archive_timeline_item_copy_in_clipboard")} (${getAttribute("guid")})`;

    // If capture was a success: Make link caption display date. Otherwise, display status.
    let linkCaption = creationTimestamp?.toLocaleString();

    if (["pending", "failed"].includes(captureStatus)) {
      linkCaption = getMessage(`archive_timeline_item_capture_${captureStatus}`);
    }

    this.innerHTML = /*html*/`
      <a href="${getMessage("perma_base_url")}${guid}" 
         target="_blank" 
         rel="noopener noreferrer"
         title="${archiveLinkLabel}"
         aria-label="${archiveLinkLabel}">
         <strong>${guid}</strong><br>
         <span>${linkCaption}</span>
      </a>

      <button aria-label="${archiveCopyLabel}" title="${archiveCopyLabel}">
        <img src="../assets/copy-white.svg" alt="" aria-hidden="true"/>
      </button>
    `;

    //
    // [2] Bind event listeners
    //
    for (let button of this.querySelectorAll("button")) {
      button.addEventListener("click", (e) => this.handleCopyButtonClick(e)); // TODO: Event delegation?
    }
  }

}
customElements.define('archive-timeline-item', ArchiveTimelineItem);
