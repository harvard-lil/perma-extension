export class StatusBar extends HTMLElement {

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
      <h2>Status bar</h2>
    `;
  }

}
customElements.define('status-bar', StatusBar);