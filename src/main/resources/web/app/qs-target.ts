import {html, LitElement} from 'lit';
import {customElement, property, state, queryAll} from 'lit/decorators.js';
import './qs-guide'
import {QS_END_EVENT, QS_NEXT_PAGE_EVENT, QS_RESULT_EVENT, QS_RESULT_NEXT_EVENT, QS_START_EVENT, QsResult} from "./qs-form";
import debounce from 'lodash/debounce';


/**
 * This component shows the live server processes
 */
@customElement('qs-target')
export class QsTarget extends LitElement {

  @property({type: String}) private type: string;
  @state() private _result: QsResult | undefined;
  @state() private _loading = false;
  @queryAll('.qs-hit') private _hits: NodeListOf<HTMLElement>;

  private _form: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this._form = document.querySelector("qs-form");
    this._form.addEventListener(QS_RESULT_EVENT, this._handleResult);
    this._form.addEventListener(QS_RESULT_NEXT_EVENT, this._handleNextResult);
    this._form.addEventListener(QS_START_EVENT, this._loadingStart);
    this._form.addEventListener(QS_END_EVENT, this._loadingEnd);
    document.addEventListener('scroll', this._handleScrollDebounced)
  }

  disconnectedCallback() {
    this._form.removeEventListener(QS_RESULT_EVENT, this._handleResult);
    this._form.removeEventListener(QS_RESULT_NEXT_EVENT, this._handleNextResult);
    this._form.removeEventListener(QS_START_EVENT, this._loadingStart);
    this._form.removeEventListener(QS_END_EVENT, this._loadingEnd);
    document.removeEventListener('scroll', this._handleScrollDebounced);
    super.disconnectedCallback();
  }

  render() {
    if (this._result?.hits) {
      if (this._result.hits.length === 0) {
        return html`
          <div id="qs-target">
            <p>No results found</p>
          </div>
        `;
      }
      const result = this._result.hits.map(i => this._renderHit(i));
      return html`
        <div id="qs-target">
          ${result}
        </div>
        ${this._loading ? this._renderLoading() : ''}
      `;
    }
    if (this._loading) {
      return html`<div id="qs-target">${this._renderLoading()}</div>`;
    }
    return html`
      <div id="qs-target">
        <slot></slot>
      </div>
    `;
  }


  private _renderLoading() {
    return html`
      <p>Loading...</p>
    `;
  }

  private _renderHit(i) {
    switch (this.type) {
      case 'guide':
        return html`
          <qs-guide class="qs-hit" .data=${i}></qs-guide>`
    }
    return ''
  }


  private _handleScroll = (e) => {

    if (!this._result?.hasMoreHits) {
      // No more hits to fetch.
      console.log("no more hits");
      return
    }
    const lastHit = this._hits.length == 0 ? null : this._hits[this._hits.length - 1]
    if (!lastHit) {
      // No result card is being displayed at the moment.
      return
    }
    const scrollElement = document.documentElement // Scroll bar is on the <html> element
    const bottomOfViewport = scrollElement.scrollTop + scrollElement.clientHeight
    const topOfLastResultCard = lastHit.offsetTop
    if (bottomOfViewport >= topOfLastResultCard) {
      // We have scrolled to the bottom of the last result card.
      this._form.dispatchEvent(new CustomEvent(QS_NEXT_PAGE_EVENT))
    }
  }
  private _handleScrollDebounced = debounce(this._handleScroll, 100);

  private _handleResult = (e: CustomEvent) => {
    console.debug("Received _result in qs-target: ", e.detail);
    this._result = e.detail;
  }

  private _handleNextResult = (e: CustomEvent) => {
    console.debug("Received next _result in qs-target: ", e.detail);
    if (!this._result) {
      this._result = e.detail;
      return;
    }
    this._result.hits = this._result.hits.concat(e.detail.hits);
    this._result.hasMoreHits = e.detail.hasMoreHits;
  }

  private _loadingStart = () => {
    this._loading = true;
  }

  private _loadingEnd = () => {
    this._loading = false;
  }
}