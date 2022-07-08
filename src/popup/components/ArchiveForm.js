export class ArchiveForm extends HTMLElement {

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
      <h2>Form</h2>
    `;
  }

}
customElements.define('archive-form', ArchiveForm);