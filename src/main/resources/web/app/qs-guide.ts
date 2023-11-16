// @ts-ignore
import { LitElement, html } from 'lit';
// @ts-ignore
import { customElement, property } from 'lit/decorators.js';


/**
 * This component shows the live server processes
 */
@customElement('qs-guide')
export class QsGuide extends LitElement {

  @property({type: Object}) data: any;


  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
    <div ${this.data.type}bkg">
        <h4><a href="${this.data.url}">${this.data.title}</a></h4>
        <div class="summary">
          <p>${this.data.summary}</p>
        </div>
        <div class="keywords">${this.data.keywords}</div>
        ${this.data.content ? html`<div class="content">${this.data.content}</div>`: ''}
      </div>
    `;
  }
}