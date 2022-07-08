export class ArchiveTimeline extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.renderInnerHTML();
  }

  disconnectedCallback() {
  }

  renderInnerHTML() {
    this.innerHTML = /*html*/`
    `;
  }

}
customElements.define('archive-timeline', ArchiveTimeline);