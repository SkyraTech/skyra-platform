import { tabPanelStyles } from './skyra-tabs.css.js';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraTabPanelElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value'];
  }

  get value(): string | null {
    return this.getAttribute('value');
  }
  set value(val: string | null) {
    if (val) this.setAttribute('value', val);
    else this.removeAttribute('value');
  }

  connectedCallback() {
    this.render();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'tabpanel');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${tabPanelStyles}</style>
      <slot></slot>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tab-panel')) {
  customElements.define('skyra-tab-panel', SkyraTabPanelElement);
}
