export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 22,
  lg: 32,
  xl: 44,
};

const BORDER_MAP: Record<SpinnerSize, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 4,
};

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraSpinnerElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['size', 'color', 'label', 'show-label', 'inline'];
  }

  get size(): SpinnerSize {
    return (this.getAttribute('size') as SpinnerSize) || 'md';
  }
  set size(val: SpinnerSize) {
    this.setAttribute('size', val);
  }

  get color(): string {
    return this.getAttribute('color') || 'var(--skyra-primary)';
  }
  set color(val: string) {
    this.setAttribute('color', val);
  }

  get label(): string {
    return this.getAttribute('label') || 'Loading...';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  get showLabel(): boolean {
    return this.hasAttribute('show-label');
  }
  set showLabel(val: boolean) {
    if (val) this.setAttribute('show-label', '');
    else this.removeAttribute('show-label');
  }

  get inline(): boolean {
    return this.hasAttribute('inline');
  }
  set inline(val: boolean) {
    if (val) this.setAttribute('inline', '');
    else this.removeAttribute('inline');
  }

  connectedCallback() {
    // Set default inline attribute if neither inline nor block is explicitly configured, but we mimic React default inline=true.
    if (!this.hasAttribute('inline') && !this.hasAttribute('block')) {
       // Note: in React it defaulted to true, so we can just treat it as inline by default if 'block' isn't there, 
       // but custom elements are inline by default anyway unless CSS changes it.
       // We'll handle this in the CSS.
       this.setAttribute('inline', '');
    }
    
    // Ensure role="status" and aria-label are present
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }
    this.updateAria();
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      if (name === 'label') {
        this.updateAria();
      }
      this.render();
    }
  }

  private updateAria() {
    this.setAttribute('aria-label', this.label);
  }

  private render() {
    if (!this.shadowRoot) return;

    const pixelSize = SIZE_MAP[this.size] || SIZE_MAP.md;
    const borderWidth = BORDER_MAP[this.size] || BORDER_MAP.md;

    // We use a CSS animation matching the 'skyra-spin-fast' class behavior, which is typically a 0.6s linear infinite rotation.
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--skyra-font-body, system-ui, sans-serif);
        }

        :host([inline]) {
          display: inline-flex;
        }

        .spinner {
          width: ${pixelSize}px;
          height: ${pixelSize}px;
          border-radius: 50%;
          border-width: ${borderWidth}px;
          border-style: solid;
          border-color: var(--skyra-border, #e2e8f0);
          border-top-color: ${this.color};
          display: inline-block;
          box-sizing: border-box;
          flex-shrink: 0;
          animation: spin 0.6s linear infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .spinner {
            animation-duration: 2s; /* Slower rotation for reduced motion instead of complete stop to indicate progress */
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .label {
          font-size: ${this.size === 'xs' || this.size === 'sm' ? '0.78rem' : '0.875rem'};
          color: var(--skyra-text-muted, #64748b);
          font-weight: 500;
        }
      </style>
      <span class="spinner"></span>
      ${this.showLabel ? `<span class="label">${this.label}</span>` : ''}
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-spinner')) {
  customElements.define('skyra-spinner', SkyraSpinnerElement);
}
