import { collapsibleStyles } from './skyra-collapsible.css.js';

let collapsibleIdCounter = 0;

export class SkyraCollapsibleElement extends HTMLElement {
  private _boundHandleClick: EventListener;
  private _boundHandleKeyDown: EventListener;
  private _triggerEl: HTMLButtonElement | null = null;
  private _contentEl: HTMLDivElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleClick = this._handleClick.bind(this) as EventListener;
    this._boundHandleKeyDown = this._handleKeyDown.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['open', 'disabled'];
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(val: boolean) {
    if (val) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  connectedCallback() {
    this.render();
    this._setupElements();
    this._updateARIA();
  }

  disconnectedCallback() {
    if (this._triggerEl) {
      this._triggerEl.removeEventListener('click', this._boundHandleClick);
      this._triggerEl.removeEventListener('keydown', this._boundHandleKeyDown);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this._updateARIA();
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    const baseId = `skyra-collapsible-${collapsibleIdCounter++}`;
    const triggerId = `${baseId}-trigger`;
    const contentId = `${baseId}-content`;

    this.shadowRoot.innerHTML = `
      <style>${collapsibleStyles}</style>
      <button
        type="button"
        id="${triggerId}"
        class="skyra-collapsible-trigger"
        aria-controls="${contentId}"
      >
        <slot name="trigger"></slot>
      </button>
      <div
        id="${contentId}"
        role="region"
        aria-labelledby="${triggerId}"
        class="skyra-collapsible-content"
      >
        <div class="skyra-collapsible-content-inner">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _setupElements() {
    if (!this.shadowRoot) return;
    this._triggerEl = this.shadowRoot.querySelector('button');
    this._contentEl = this.shadowRoot.querySelector('.skyra-collapsible-content');

    if (this._triggerEl) {
      this._triggerEl.addEventListener('click', this._boundHandleClick);
      this._triggerEl.addEventListener('keydown', this._boundHandleKeyDown);
    }
  }

  private _updateARIA() {
    if (this._triggerEl) {
      const isOpen = this.open;
      const isDisabled = this.disabled;
      this._triggerEl.setAttribute('aria-expanded', String(isOpen));
      this._triggerEl.setAttribute('aria-disabled', String(isDisabled));
      if (isDisabled) {
        this._triggerEl.setAttribute('disabled', '');
      } else {
        this._triggerEl.removeAttribute('disabled');
      }
    }
  }

  private _handleClick() {
    if (this.disabled) return;
    this.toggle();
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  }

  public toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('skyra-collapsible-change', {
      detail: { open: this.open },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('skyra-collapsible')) {
  customElements.define('skyra-collapsible', SkyraCollapsibleElement);
}
