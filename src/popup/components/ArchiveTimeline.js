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
 * Accepts `<archive-timeline-item>` elements as direct children, filters out other elements.
 * 
 * Note:
 * - Use `addArchives()` to feed this component an array of archive objects.
 * 
 * Available HTML attributes:
 * - `is-authenticated`: If not "true", this component is hidden.
 * - `is-loading`: If "true", disables all nested form elements.
 */
export class ArchiveTimeline extends HTMLElement {
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() {
    return ["is-authenticated", "is-loading"];
  }

  /**
   * Upon injection into the DOM:
   * - First render
   * - Enforce singleton pattern
   */
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

  /**
   * Creates and inject `<archive-timeline-item>` elements using a list of `PermaArchive` objects.
   * Re-renders.
   * 
   * @param {PermaArchive[]} archives 
   */
  addArchives(archives) {
    if (!(archives instanceof Array)) {
      archives = [];
    }

    this.innerHTML = "";

    for (let archive of archives) {
      const item = document.createElement("archive-timeline-item");
      item.setAttribute("guid", archive?.guid);
      item.setAttribute("is-private", String(archive?.is_private));
      item.setAttribute("creation-timestamp", archive?.creation_timestamp);
      this.appendChild(item);
    }

    this.renderInnerHTML();
  }

  /**
   * Assembles a template and injects it into `innerHTML`.
   */
  renderInnerHTML() {
    const getAttribute = this.getAttribute.bind(this);
    const setAttribute = this.setAttribute.bind(this);
    const getMessage = BROWSER.i18n.getMessage;

    //
    // [1] Assemble and inject template 
    //

    // If not authenticated:
    // - Element should be `aria-hidden`
    // - InnerHTML should be empty.
    if (getAttribute("is-authenticated") !== "true") {
      setAttribute("aria-hidden", "true");
      this.innerHTML = ``;
      return;
    }

    // If authenticated:
    // - This element should behave like a list
    // - This element should only accept `<archive-timeline-item>` as direct children (filter everything else out)
    // - This element should display a message if there are no archives to display (inject it)
    setAttribute("aria-hidden", "false");
    setAttribute("role", "list");

    // Remove children that are not `<archive-timeline-item>`
    for (let child of this.children) {
      if(child.tagName !== "archive-timeline-item".toUpperCase()) {
        child.remove();
      }
    }

    // Show a message if list there is no archive to display
    if (this.children.length < 1) {
      this.innerHTML = /*html*/`
      <aside class="empty" role="listitem">
        <span>${getMessage("archive_timeline_empty")}<span>
      </aside>
      `;
    }

    //
    // [2] Side effects
    //
    // Disable all form elements when the app is loading
    for (let element of this.querySelectorAll("button, input, select")) {
      if (getAttribute("is-loading") === "true") {
        element.setAttribute("disabled", "disabled");
      }
      else {
        element.removeAttribute("disabled");
      }
    }

  }

}
customElements.define('archive-timeline', ArchiveTimeline);