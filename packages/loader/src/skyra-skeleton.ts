export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

const RADIUS_MAP: Record<SkeletonRadius, string> = {
  none: '0',
  sm: 'var(--skyra-radius-sm, 4px)',
  md: 'var(--skyra-radius-md, 6px)',
  lg: 'var(--skyra-radius-lg, 8px)',
  full: '9999px',
};

function parseDimension(val: string | null, fallback: string): string {
  if (!val) return fallback;
  if (!isNaN(Number(val))) return `${val}px`;
  return val;
}

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraSkeletonElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['width', 'height', 'radius', 'animation'];
  }

  get width(): string {
    return this.getAttribute('width') || '100%';
  }
  set width(val: string) {
    this.setAttribute('width', val);
  }

  get height(): string {
    return this.getAttribute('height') || '1rem';
  }
  set height(val: string) {
    this.setAttribute('height', val);
  }

  get radius(): SkeletonRadius {
    return (this.getAttribute('radius') as SkeletonRadius) || 'md';
  }
  set radius(val: SkeletonRadius) {
    this.setAttribute('radius', val);
  }

  get animation(): SkeletonAnimation {
    return (this.getAttribute('animation') as SkeletonAnimation) || 'pulse';
  }
  set animation(val: SkeletonAnimation) {
    this.setAttribute('animation', val);
  }

  connectedCallback() {
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true');
    }
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const w = parseDimension(this.getAttribute('width'), '100%');
    const h = parseDimension(this.getAttribute('height'), '1rem');
    const rad = RADIUS_MAP[this.radius] || RADIUS_MAP.md;
    const anim = this.animation;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: ${w};
          height: ${h};
          flex-shrink: 0;
        }

        .skeleton {
          width: 100%;
          height: 100%;
          border-radius: ${rad};
          background: var(--skyra-border, #e2e8f0);
          position: relative;
          overflow: hidden;
        }

        .skeleton.pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .skeleton.shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 2s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton.pulse, .skeleton.shimmer::after {
            animation: none !important;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      </style>
      <div class="skeleton ${anim !== 'none' ? anim : ''}"></div>
    `;
  }
}

// ----------------------------------------------------------------------------
// Compositions
// ----------------------------------------------------------------------------

export class SkyraSkeletonTextElement extends BaseClass {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  static get observedAttributes() { return ['lines', 'gap']; }
  
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    if (!this.shadowRoot) return;
    const lines = parseInt(this.getAttribute('lines') || '3', 10);
    const gap = this.getAttribute('gap') || '0.5rem';

    let html = `<style>
      :host {
        display: flex;
        flex-direction: column;
        gap: ${gap};
        width: 100%;
      }
    </style>`;

    for (let i = 0; i < lines; i++) {
      const w = (i === lines - 1 && lines > 1) ? '60%' : '100%';
      html += `<skyra-skeleton height="0.875rem" width="${w}" radius="sm"></skyra-skeleton>`;
    }

    this.shadowRoot.innerHTML = html;
  }
}

export class SkyraSkeletonAvatarElement extends BaseClass {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static get observedAttributes() { return ['size']; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    if (!this.shadowRoot) return;
    const size = this.getAttribute('size') || '40';
    this.shadowRoot.innerHTML = `<skyra-skeleton width="${size}" height="${size}" radius="full"></skyra-skeleton>`;
  }
}

export class SkyraSkeletonCardElement extends BaseClass {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() { this.render(); }
  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          padding: 1.25rem;
          background: var(--skyra-surface, #ffffff);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-md, 6px);
          box-sizing: border-box;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
      </style>
      <div class="header">
        <skyra-skeleton-avatar size="40"></skyra-skeleton-avatar>
        <div class="header-text">
          <skyra-skeleton width="50%" height="0.9rem" radius="sm"></skyra-skeleton>
          <skyra-skeleton width="30%" height="0.75rem" radius="sm"></skyra-skeleton>
        </div>
      </div>
      <skyra-skeleton-text lines="2"></skyra-skeleton-text>
      <skyra-skeleton width="100%" height="36px" radius="md"></skyra-skeleton>
    `;
  }
}

export class SkyraSkeletonTableElement extends BaseClass {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static get observedAttributes() { return ['rows', 'columns']; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    if (!this.shadowRoot) return;
    const rows = parseInt(this.getAttribute('rows') || '4', 10);
    const cols = parseInt(this.getAttribute('columns') || '4', 10);

    let html = `
      <style>
        :host {
          display: block;
          width: 100%;
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-md, 6px);
          overflow: hidden;
          background: var(--skyra-surface, #ffffff);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(${cols}, 1fr);
          gap: 1rem;
        }
        .header {
          padding: 0.75rem 1rem;
          background: var(--skyra-bg, #f8fafc);
          border-bottom: 1px solid var(--skyra-border, #e2e8f0);
        }
        .row {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--skyra-border, #e2e8f0);
        }
        .row:last-child {
          border-bottom: none;
        }
      </style>
    `;

    html += `<div class="grid header">`;
    for (let c = 0; c < cols; c++) {
      html += `<skyra-skeleton height="14px" width="70%" radius="sm"></skyra-skeleton>`;
    }
    html += `</div>`;

    for (let r = 0; r < rows; r++) {
      html += `<div class="grid row">`;
      for (let c = 0; c < cols; c++) {
        const w = c === 0 ? '85%' : '60%';
        html += `<skyra-skeleton height="12px" width="${w}" radius="sm"></skyra-skeleton>`;
      }
      html += `</div>`;
    }

    this.shadowRoot.innerHTML = html;
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-skeleton')) customElements.define('skyra-skeleton', SkyraSkeletonElement);
  if (!customElements.get('skyra-skeleton-text')) customElements.define('skyra-skeleton-text', SkyraSkeletonTextElement);
  if (!customElements.get('skyra-skeleton-avatar')) customElements.define('skyra-skeleton-avatar', SkyraSkeletonAvatarElement);
  if (!customElements.get('skyra-skeleton-card')) customElements.define('skyra-skeleton-card', SkyraSkeletonCardElement);
  if (!customElements.get('skyra-skeleton-table')) customElements.define('skyra-skeleton-table', SkyraSkeletonTableElement);
}
