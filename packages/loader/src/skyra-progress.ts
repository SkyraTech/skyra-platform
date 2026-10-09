export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

const HEIGHT_MAP: Record<ProgressSize, string> = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

const COLOR_MAP: Record<ProgressVariant, string> = {
  primary: 'var(--skyra-primary, #3b82f6)',
  success: 'var(--skyra-success, #10b981)',
  warning: 'var(--skyra-warning, #f59e0b)',
  danger: 'var(--skyra-danger, #ef4444)',
};

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraProgressElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value', 'max', 'size', 'variant', 'show-label', 'label'];
  }

  get value(): number | undefined {
    const val = this.getAttribute('value');
    if (val === null || val === '') return undefined;
    return parseFloat(val);
  }
  set value(val: number | undefined) {
    if (val === undefined || isNaN(val)) {
      this.removeAttribute('value');
    } else {
      this.setAttribute('value', val.toString());
    }
  }

  get max(): number {
    const val = this.getAttribute('max');
    return val ? parseFloat(val) : 100;
  }
  set max(val: number) {
    this.setAttribute('max', val.toString());
  }

  get size(): ProgressSize {
    return (this.getAttribute('size') as ProgressSize) || 'md';
  }
  set size(val: ProgressSize) {
    this.setAttribute('size', val);
  }

  get variant(): ProgressVariant {
    return (this.getAttribute('variant') as ProgressVariant) || 'primary';
  }
  set variant(val: ProgressVariant) {
    this.setAttribute('variant', val);
  }

  get showLabel(): boolean {
    return this.hasAttribute('show-label');
  }
  set showLabel(val: boolean) {
    if (val) this.setAttribute('show-label', '');
    else this.removeAttribute('show-label');
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const isIndeterminate = this.value === undefined;
    const maxVal = this.max;
    const clampedValue = Math.min(Math.max(this.value ?? 0, 0), maxVal);
    const percent = Math.round((clampedValue / maxVal) * 100);
    const barColor = COLOR_MAP[this.variant] || COLOR_MAP.primary;
    const barHeight = HEIGHT_MAP[this.size] || HEIGHT_MAP.md;

    // Build the accessible attributes for the progress bar container itself
    const ariaLabelAttr = this.label ? `aria-label="${this.label}"` : (isIndeterminate ? `aria-label="Loading"` : '');
    const ariaValueAttr = isIndeterminate ? '' : `aria-valuenow="${percent}"`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          width: 100%;
          font-family: var(--skyra-font-body, system-ui, sans-serif);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }

        .label {
          font-weight: 500;
          color: var(--skyra-text, #0f172a);
        }

        .percent {
          font-weight: 600;
          color: var(--skyra-text-muted, #64748b);
          margin-left: auto;
        }

        .track {
          width: 100%;
          height: ${barHeight};
          background: var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-full, 9999px);
          overflow: hidden;
          position: relative;
        }

        .fill {
          height: 100%;
          background: ${barColor};
          border-radius: var(--skyra-radius-full, 9999px);
          width: ${isIndeterminate ? '45%' : percent + '%'};
          transition: width 0.3s ease;
        }

        .fill.indeterminate {
          position: absolute;
          left: -45%;
          animation: indeterminate 1.5s infinite linear;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .fill {
            transition: none;
          }
          .fill.indeterminate {
            animation-duration: 4s;
          }
        }

        @keyframes indeterminate {
          0% { left: -45%; }
          100% { left: 100%; }
        }
      </style>
      
      ${(this.label || this.showLabel) ? `
        <div class="header">
          <span class="label"><slot name="label">${this.label}</slot></span>
          ${this.showLabel ? `
            <span class="percent">
              ${isIndeterminate ? 'Loading...' : percent + '%'}
            </span>
          ` : ''}
        </div>
      ` : ''}

      <div 
        role="progressbar" 
        ${ariaLabelAttr} 
        ${ariaValueAttr} 
        aria-valuemin="0" 
        aria-valuemax="100" 
        class="track"
      >
        <div class="fill ${isIndeterminate ? 'indeterminate' : ''}"></div>
      </div>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-progress')) {
  customElements.define('skyra-progress', SkyraProgressElement);
}
