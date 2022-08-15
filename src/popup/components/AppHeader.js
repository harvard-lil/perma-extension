/**
 * perma-extension
 * @module popup/components/IntroHeader
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description `<app-header>` custom element. 
 */
// @ts-check

import { BROWSER } from "../../constants/index.js";

/**
 * Custom Element: `<app-header>`.
 * 
 * Available HTML attributes: 
 * - `tab-url`: Url of the current tab.
 * - `tab-title`: Title of the current tab.
 * 
 * Note: 
 * - Singleton pattern is enforced. Only 1 element of this type can be present in a given document.
 */
export class AppHeader extends HTMLElement {
  /**
   * Defines which HTML attributes should be observed by `attributeChangedCallback`.
   */
  static get observedAttributes() { 
    return ["tab-url", "tab-title"];
  }

  /**
   * Upon injection into the DOM:
   * - First render
   * - Enforce singleton pattern
   */
  connectedCallback() {
    this.renderInnerHTML();
    document.querySelectorAll("app-header:not(:first-of-type)").forEach(e => e.remove());
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
   */
  renderInnerHTML() {
    const getMessage = BROWSER.i18n.getMessage;
    const getAttribute = this.getAttribute.bind(this);
    const tabUrl = getAttribute("tab-url");
    const tabTitle = getAttribute("tab-title");

    this.innerHTML = /*html*/`
    <h1>
      <a href="${getMessage("perma_base_url")}" 
         target="_blank" 
         rel="noopener noreferrer" 
         title="${getMessage("app_header_link_label")}" 
         aria-label="${getMessage("app_header_link_label")}">
        <img src="../assets/infinity-orange.svg" alt="Perma.cc"/>
      </a>
      
      <span>${getMessage("app_header_title")}<span>
    </h1>
    
    <div>
      <strong>${tabUrl ? tabUrl : "&nbsp;"}</strong>
      <span>${tabTitle ? tabTitle : "&nbsp;"}</span>
    </div>
    `;
    // Note: that `&nbsp;` was added to cover a rare edge case in which `tabUrl` and `tabTitle` are null, and we want the space to be filled in.
  }

}
customElements.define('app-header', AppHeader);