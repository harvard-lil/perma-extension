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
 * - `creation-timestamp`
 * - `is-private`
 */
export class ArchiveTimelineItem extends HTMLElement {
  /**
   * On instantiation: 
   * - Bind local methods to `this` so they can easily be passed around
   */
  constructor() {
    super();
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
   * Assembles a template and injects it into `innerHTML`
   * Binds event listeners to the elements that were injected.
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);
    const setAttribute = this.getAttribute.bind(this);

    setAttribute("role", "listitem");
    this.innerHTML = /*html*/`
      ${getAttribute("guid")} - ${getAttribute("creation-timestamp")} - ${getAttribute("is-private")}
    `;
  }

}
customElements.define('archive-timeline-item', ArchiveTimelineItem);