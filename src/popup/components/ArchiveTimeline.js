/**
 * perma-extension
 * @module popup/components/ArchiveTimeline
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<archive-timeline>` custom element. 
 */
/// <reference path="../../../node_modules/@harvard-lil/perma-js-sdk/types.js" />
// @ts-check
import { BROWSER } from "../../constants/index.js";

/**
 * Custom Element: `<archive-timeline>`. 
 * Shows the user the list of archives that they created for the current page.
 * Accepts `<archive-timeline-item>` elements as direct children (+ `<h3>` intro), filters out other elements.
 * 
 * Note:
 * - Use `addArchives()` to feed this component an array of archive objects (See: PermaArchive objects from `perma-js-sdk`).
 * 
 * Available HTML attributes:
 * - `is-authenticated`: If not "true", this component is hidden.
 * - `is-loading`: If "true", disables all nested form elements.
 * 
 * Note: 
 * - Singleton pattern is enforced. Only 1 element of this type can be present in a given document.
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
    document.querySelectorAll("archive-timeline:not(:first-of-type)").forEach(e => e.remove());
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
    const getMessage = BROWSER.i18n.getMessage;
    
    if (!(archives instanceof Array)) {
      archives = [];
    }

    // Intro label
    this.innerHTML = /*html*/`<h3>${getMessage("archive_timeline_intro")}</h3>`;

    // Individual `<archive-timeline-item>` entries
    for (let archive of archives) {
      const item = document.createElement("archive-timeline-item");
      item.setAttribute("guid", archive?.guid);
      item.setAttribute("archived-url", archive?.url);
      item.setAttribute("capture-status", "success"); // Default
      item.setAttribute("creation-timestamp", archive?.creation_timestamp);

      // Try to assess actual capture status.
      if ("captures" in archive && archive.captures.length > 0) {
        for (let capture of archive.captures) {
          if (capture.role === "primary") {
            item.setAttribute("capture-status", capture.status);
          }
        }
      }

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
    // - This element should only accept `<archive-timeline-item>` and `<h3>` as direct children (filter everything else out)
    // - This element should display a message if there are no archives to display (inject it)
    setAttribute("aria-hidden", "false");
    setAttribute("role", "list");

    // Remove children that are not `<archive-timeline-item>` or `<h3>`
    for (let child of this.children) {
      if(child.tagName !== "archive-timeline-item".toUpperCase() && child.tagName !== "H3") {
        child.remove();
      }
    }

    // Show a message if there is no archive to display
    if (this.querySelectorAll("archive-timeline-item").length < 1) {
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