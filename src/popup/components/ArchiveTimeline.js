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
      <h2>Timeline</h2>
    `;
  }

}
customElements.define('archive-timeline', ArchiveTimeline);