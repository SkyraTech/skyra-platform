import { accordionItemStyles } from './skyra-accordion.css.js';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraAccordionItemElement extends BaseClass {
  private _boundHandleClick: EventListener;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleClick = this._handleClick.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['value', 'disabled', 'data-state'];
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
    if (!this.hasAttribute('data-state')) {
      this.setAttribute('data-state', 'closed');
    }
  }

  disconnectedCallback() {
    const trigger = this.shadowRoot?.querySelector('button');
    if (trigger) {
      trigger.removeEventListener('click', this._boundHandleClick);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'disabled') {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
      const trigger = this.shadowRoot?.querySelector('button');
      if (trigger) {
        trigger.disabled = this.disabled;
        trigger.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
      }
    } else if (name === 'data-state') {
      this._updateAriaExpanded();
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const baseId = this.id || `accordion-item-${Math.random().toString(36).substring(2, 9)}`;
    const triggerId = `${baseId}-trigger`;
    const contentId = `${baseId}-content`;

    this.shadowRoot.innerHTML = `
      <style>${accordionItemStyles}</style>
      <h3 class="skyra-accordion-header">
        <button
          type="button"
          id="${triggerId}"
          class="skyra-accordion-trigger"
          aria-controls="${contentId}"
          aria-expanded="false"
          ${this.disabled ? 'disabled aria-disabled="true"' : ''}
        >
          <div class="skyra-accordion-trigger-text">
            <slot name="trigger"></slot>
          </div>
          <div class="skyra-accordion-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      </h3>
      <div
        id="${contentId}"
        role="region"
        aria-labelledby="${triggerId}"
        class="skyra-accordion-content"
      >
        <slot></slot>
      </div>
    `;

    const trigger = this.shadowRoot.querySelector('button');
    if (trigger) {
      trigger.addEventListener('click', this._boundHandleClick);
    }
    
    this._updateAriaExpanded();
  }

  private _updateAriaExpanded() {
    const trigger = this.shadowRoot?.querySelector('button');
    if (trigger) {
      trigger.setAttribute('aria-expanded', this.getAttribute('data-state') === 'open' ? 'true' : 'false');
    }
  }

  private _handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-accordion-item')) {
  customElements.define('skyra-accordion-item', SkyraAccordionItemElement);
}
