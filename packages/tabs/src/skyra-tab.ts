import { tabStyles } from './skyra-tabs.css.js';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraTabElement extends BaseClass {
  private _boundHandleClick: EventListener;
  private _boundHandleKeyDown: EventListener;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleClick = this._handleClick.bind(this) as EventListener;
    this._boundHandleKeyDown = this._handleKeyDown.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['value', 'disabled', 'aria-selected'];
  }

  get value(): string | null {
    return this.getAttribute('value');
  }
  set value(val: string | null) {
    if (val) this.setAttribute('value', val);
    else this.removeAttribute('value');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  connectedCallback() {
    this.render();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'tab');
    if (!this.hasAttribute('slot')) this.setAttribute('slot', 'tab');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');

    this.addEventListener('click', this._boundHandleClick);
    this.addEventListener('keydown', this._boundHandleKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._boundHandleClick);
    this.removeEventListener('keydown', this._boundHandleKeyDown);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'disabled') {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${tabStyles}</style>
      <slot></slot>
    `;
  }

  private _handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('skyra-tab-click', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('skyra-tab-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }));
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tab')) {
  customElements.define('skyra-tab', SkyraTabElement);
}
