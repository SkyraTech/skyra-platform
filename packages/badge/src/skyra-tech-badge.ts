import { badgeStyles } from './badge.css';

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraTechBadge extends BaseClass {
  private _badgeEl!: HTMLElement;
  private _dotEl!: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${badgeStyles}</style>
      <span class="skyra-badge" part="badge">
        <span class="skyra-badge-dot" part="dot" aria-hidden="true"></span>
        <slot></slot>
      </span>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));
    this._badgeEl = this.shadowRoot!.querySelector('.skyra-badge') as HTMLElement;
    this._dotEl = this.shadowRoot!.querySelector('.skyra-badge-dot') as HTMLElement;
  }

  static get observedAttributes() {
    return ['variant', 'size', 'dot'];
  }

  connectedCallback() {
    this._updateClasses();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this._updateClasses();
  }

  get variant(): string {
    return this.getAttribute('variant') || 'neutral';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get size(): string {
    return this.getAttribute('size') || 'sm';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  get dot(): boolean {
    return this.hasAttribute('dot');
  }
  set dot(val: boolean) {
    if (val) {
      this.setAttribute('dot', '');
    } else {
      this.removeAttribute('dot');
    }
  }

  private _updateClasses(): void {
    const variant = this.variant;
    const size = this.size;
    const hasDot = this.dot;

    const classes = [
      'skyra-badge',
      `skyra-badge--${variant}`,
      `skyra-badge--${size}`
    ];

    if (hasDot) {
      classes.push('skyra-badge--has-dot');
    }

    this._badgeEl.className = classes.join(' ');
  }
}

export function defineSkyraTechBadge(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-badge')) {
    customElements.define('skyra-tech-badge', SkyraTechBadge);
  }
}

