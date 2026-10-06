export class SkyraAppShell extends HTMLElement {
  private _collapsed: boolean = false;
  private _mobileOpen: boolean = false;
  private mql: MediaQueryList | null = null;
  private boundMqHandler: (e: MediaQueryListEvent) => void;
  private boundBackdropClick: () => void;
  private boundKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: flex;
          min-height: 100dvh;
          background: var(--skyra-bg, #f3f4f6);
          --skyra-sidebar-width: 280px;
          --skyra-sidebar-width-collapsed: 72px;
          --skyra-header-height: 64px;
        }

        .skyra-sidebar-container {
          width: var(--skyra-sidebar-width);
          flex-shrink: 0;
          background: var(--skyra-sidebar-bg, #002B66);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host([collapsed]) .skyra-sidebar-container {
          width: var(--skyra-sidebar-width-collapsed);
        }

        .skyra-sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 19;
          display: none;
        }

        .skyra-main-container {
          flex: 1;
          margin-left: var(--skyra-sidebar-width);
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }

        :host([collapsed]) .skyra-main-container {
          margin-left: var(--skyra-sidebar-width-collapsed);
        }

        .skyra-header-container {
          height: var(--skyra-header-height);
          background: var(--skyra-surface, #ffffff);
          border-bottom: 1px solid var(--skyra-border, #e5e7eb);
          position: sticky;
          top: 0;
          z-index: 9;
          box-shadow: var(--skyra-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
          display: flex;
          align-items: stretch;
        }
        
        .skyra-header-container ::slotted([slot="header"]) {
          width: 100%;
        }

        .skyra-content-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .skyra-main-container, :host([collapsed]) .skyra-main-container {
            margin-left: 0;
          }
          
          .skyra-sidebar-container, :host([collapsed]) .skyra-sidebar-container {
            transform: translateX(-100%);
            width: var(--skyra-sidebar-width);
          }

          :host([mobile-open]) .skyra-sidebar-container {
            transform: translateX(0);
          }

          :host([mobile-open]) .skyra-sidebar-backdrop {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skyra-sidebar-container,
          .skyra-main-container {
            transition: none !important;
          }
        }
      </style>
      
      <div class="skyra-sidebar-backdrop" part="backdrop" aria-hidden="true"></div>
      
      <aside class="skyra-sidebar-container" part="sidebar" id="skyra-sidebar">
        <slot name="sidebar"></slot>
      </aside>
      
      <div class="skyra-main-container" part="main">
        <header class="skyra-header-container" part="header">
          <slot name="header"></slot>
        </header>
        
        <div class="skyra-content-container" part="content">
          <slot></slot>
        </div>
      </div>
    `;
    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this.boundMqHandler = this.handleMediaQueryChange.bind(this);
    this.boundBackdropClick = this.handleBackdropClick.bind(this);
    this.boundKeydown = this.handleKeydown.bind(this);
  }

  static get observedAttributes() {
    return ['collapsed', 'mobile-open'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'collapsed') {
      this._collapsed = newValue !== null;
    } else if (name === 'mobile-open') {
      this._mobileOpen = newValue !== null;
    }
  }

  get collapsed() { return this._collapsed; }
  set collapsed(val: boolean) {
    this._collapsed = val;
    if (val) this.setAttribute('collapsed', '');
    else this.removeAttribute('collapsed');
  }

  get mobileOpen() { return this._mobileOpen; }
  set mobileOpen(val: boolean) {
    this._mobileOpen = val;
    if (val) this.setAttribute('mobile-open', '');
    else this.removeAttribute('mobile-open');
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('skyra-sidebar-toggle', {
      detail: { open: val, isMobile: true },
      bubbles: true,
      composed: true
    }));
  }

  toggle() {
    const isMobile = this.mql?.matches;
    if (isMobile) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.collapsed = !this.collapsed;
      this.dispatchEvent(new CustomEvent('skyra-sidebar-toggle', {
        detail: { collapsed: this.collapsed, isMobile: false },
        bubbles: true,
        composed: true
      }));
    }
  }

  connectedCallback() {
    if (typeof window !== 'undefined') {
      this.mql = window.matchMedia('(max-width: 768px)');
      
      // Setup modern media query listener
      if (this.mql.addEventListener) {
        this.mql.addEventListener('change', this.boundMqHandler);
      } else {
        // Fallback for older browsers
        this.mql.addListener(this.boundMqHandler);
      }
    }

    const backdrop = this.shadowRoot!.querySelector('.skyra-sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', this.boundBackdropClick);
    }
    
    document.addEventListener('keydown', this.boundKeydown);
  }

  disconnectedCallback() {
    if (this.mql) {
      if (this.mql.removeEventListener) {
        this.mql.removeEventListener('change', this.boundMqHandler);
      } else {
        this.mql.removeListener(this.boundMqHandler);
      }
    }
    
    const backdrop = this.shadowRoot!.querySelector('.skyra-sidebar-backdrop');
    if (backdrop) {
      backdrop.removeEventListener('click', this.boundBackdropClick);
    }

    document.removeEventListener('keydown', this.boundKeydown);
  }

  private handleMediaQueryChange(e: MediaQueryListEvent) {
    if (!e.matches && this.mobileOpen) {
      this.mobileOpen = false;
    }
  }

  private handleBackdropClick() {
    if (this.mobileOpen) {
      this.mobileOpen = false;
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileOpen) {
      this.mobileOpen = false;
    }
  }
}

export function registerAppShell() {
  if (typeof window !== 'undefined' && !window.customElements.get('skyra-tech-app-shell')) {
    window.customElements.define('skyra-tech-app-shell', SkyraAppShell);
  }
}
