export type CircularProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

const COLOR_MAP: Record<CircularProgressVariant, string> = {
  primary: 'var(--skyra-primary, #3b82f6)',
  success: 'var(--skyra-success, #10b981)',
  warning: 'var(--skyra-warning, #f59e0b)',
  danger: 'var(--skyra-danger, #ef4444)',
};

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraCircularProgressElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value', 'size', 'stroke-width', 'variant', 'show-value'];
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

  get size(): number {
    const val = this.getAttribute('size');
    return val ? parseFloat(val) : 40;
  }
  set size(val: number) {
    this.setAttribute('size', val.toString());
  }

  get strokeWidth(): number {
    const val = this.getAttribute('stroke-width');
    return val ? parseFloat(val) : 4;
  }
  set strokeWidth(val: number) {
    this.setAttribute('stroke-width', val.toString());
  }

  get variant(): CircularProgressVariant {
    return (this.getAttribute('variant') as CircularProgressVariant) || 'primary';
  }
  set variant(val: CircularProgressVariant) {
    this.setAttribute('variant', val);
  }

  get showValue(): boolean {
    return this.hasAttribute('show-value');
  }
  set showValue(val: boolean) {
    if (val) this.setAttribute('show-value', '');
    else this.removeAttribute('show-value');
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
    const clamped = Math.min(Math.max(this.value ?? 0, 0), 100);
    const color = COLOR_MAP[this.variant] || COLOR_MAP.primary;
    
    const size = this.size;
    const sw = this.strokeWidth;
    const radius = (size - sw) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clamped / 100) * circumference;

    const ariaValueAttr = isIndeterminate ? '' : `aria-valuenow="${clamped}"`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${size}px;
          height: ${size}px;
          font-family: var(--skyra-font-body, system-ui, sans-serif);
        }

        svg {
          transform: ${isIndeterminate ? 'none' : 'rotate(-90deg)'};
          animation: ${isIndeterminate ? 'spin 1.4s linear infinite' : 'none'};
        }
        
        @media (prefers-reduced-motion: reduce) {
          svg {
            animation-duration: 4s;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .arc {
          transition: ${isIndeterminate ? 'none' : 'stroke-dashoffset 0.3s ease'};
        }

        .value-label {
          position: absolute;
          font-size: ${Math.max(10, Math.floor(size * 0.26))}px;
          font-weight: 700;
          color: var(--skyra-text, #0f172a);
        }
      </style>

      <div
        role="progressbar"
        ${ariaValueAttr}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="${isIndeterminate ? 'Loading' : 'Progress'}"
        style="width: 100%; height: 100%; display: inherit; align-items: inherit; justify-content: inherit;"
      >
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="var(--skyra-border, #e2e8f0)"
            stroke-width="${sw}"
            fill="transparent"
          ></circle>
          <circle
            class="arc"
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="${color}"
            stroke-width="${sw}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${isIndeterminate ? circumference * 0.75 : strokeDashoffset}"
            stroke-linecap="round"
            fill="transparent"
          ></circle>
        </svg>

        ${(!isIndeterminate && this.showValue) ? `
          <span class="value-label">${clamped}%</span>
        ` : ''}
      </div>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-circular-progress')) {
  customElements.define('skyra-circular-progress', SkyraCircularProgressElement);
}
