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
    // Should have a mechanism to receive `<archive-detail>` elements as children (and check them)
    // This component reacts to the number of children it has (and checks their type - exclude elements that are not `<archive-detail>`)
  }

}
customElements.define('archive-timeline', ArchiveTimeline);