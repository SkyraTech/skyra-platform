import { css } from './dialog.css';

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraTechDialog extends BaseElement {
  static formAssociated = true;

  private _internals!: ElementInternals;
  private _dialogEl!: HTMLDialogElement;
  private _closeBtn!: HTMLButtonElement;

  constructor() {
    super();
    if (typeof HTMLElement === 'undefined') return; // Skip in SSR
    
    this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals();
    
    this.shadowRoot!.innerHTML = `
      <style>${css}</style>
      <dialog part="dialog">
        <div part="header" id="header" hidden>
          <h2 part="title"><slot name="title"></slot></h2>
          <button part="close" id="close-btn" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div part="content">
          <slot></slot>
        </div>
        <div part="footer" id="footer" hidden>
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }

  static get observedAttributes() {
    return ['open', 'mode', 'size', 'side', 'drawer-width', 'hide-close-button'];
  }

  get open() { return this.hasAttribute('open'); }
  set open(val: boolean) { 
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get mode() { return this.getAttribute('mode') || 'modal'; }
  set mode(val: string) { this.setAttribute('mode', val); }

  get size() { return this.getAttribute('size') || 'md'; }
  set size(val: string) { this.setAttribute('size', val); }

  get side() { return this.getAttribute('side') || 'right'; }
  set side(val: string) { this.setAttribute('side', val); }

  get drawerWidth() { return this.getAttribute('drawer-width') || '480px'; }
  set drawerWidth(val: string) { this.setAttribute('drawer-width', val); }
  
  get closeOnBackdrop() { return this.getAttribute('close-on-backdrop') !== 'false'; }
  get closeOnEscape() { return this.getAttribute('close-on-escape') !== 'false'; }

  connectedCallback() {
    if (typeof HTMLElement === 'undefined') return;
    this._dialogEl = this.shadowRoot!.querySelector('dialog')!;
    this._closeBtn = this.shadowRoot!.querySelector('#close-btn')!;

    this._dialogEl.addEventListener('close', this._handleNativeClose);
    this._dialogEl.addEventListener('click', this._handleBackdropClick);
    this._dialogEl.addEventListener('keydown', this._handleKeyDown);
    this._closeBtn.addEventListener('click', this._handleCloseClick);
    
    // Check slots to show/hide header and footer
    const titleSlot = this.shadowRoot!.querySelector('slot[name="title"]') as HTMLSlotElement;
    const footerSlot = this.shadowRoot!.querySelector('slot[name="footer"]') as HTMLSlotElement;
    
    titleSlot.addEventListener('slotchange', () => this._updateHeaderVisibility());
    footerSlot.addEventListener('slotchange', () => {
      this.shadowRoot!.querySelector('#footer')!.toggleAttribute('hidden', footerSlot.assignedNodes().length === 0);
    });

    this._updateHeaderVisibility();
    this._applyDynamicStyles();
    
    if (this.open && !this._dialogEl.open) {
      this._dialogEl.showModal();
      this._lockScroll();
    }
  }

  disconnectedCallback() {
    if (typeof HTMLElement === 'undefined') return;
    this._dialogEl.removeEventListener('close', this._handleNativeClose);
    this._dialogEl.removeEventListener('click', this._handleBackdropClick);
    this._dialogEl.removeEventListener('keydown', this._handleKeyDown);
    this._closeBtn.removeEventListener('click', this._handleCloseClick);
    this._unlockScroll();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (typeof HTMLElement === 'undefined') return;
    if (oldVal === newVal) return;
    
    if (name === 'open') {
      const isOpen = this.hasAttribute('open');
      if (this._dialogEl) {
        if (isOpen && !this._dialogEl.open) {
          this._dialogEl.showModal();
          this._lockScroll();
          this.dispatchEvent(new CustomEvent('skyra-open', { bubbles: true, composed: true }));
        } else if (!isOpen && this._dialogEl.open) {
          this._dialogEl.close();
          // The native 'close' event will unlock scroll and dispatch 'skyra-close'
        }
      }
    }
    
    if (name === 'hide-close-button') {
      this._updateHeaderVisibility();
    }

    if (['mode', 'size', 'side', 'drawer-width'].includes(name) && this._dialogEl) {
      this._applyDynamicStyles();
    }
  }

  private _updateHeaderVisibility() {
    const titleSlot = this.shadowRoot!.querySelector('slot[name="title"]') as HTMLSlotElement;
    const hasTitle = titleSlot.assignedNodes().length > 0;
    const hideClose = this.hasAttribute('hide-close-button');
    
    const header = this.shadowRoot!.querySelector('#header') as HTMLElement;
    header.toggleAttribute('hidden', !hasTitle && hideClose);
    this._closeBtn.style.display = hideClose ? 'none' : 'flex';
  }

  private _applyDynamicStyles() {
    this._dialogEl.dataset.mode = this.mode;
    if (this.mode === 'modal') {
      this._dialogEl.dataset.size = this.size;
      this._dialogEl.style.removeProperty('--drawer-width');
    } else {
      this._dialogEl.dataset.side = this.side;
      this._dialogEl.style.setProperty('--drawer-width', this.drawerWidth);
    }
  }

  private _handleNativeClose = () => {
    this.open = false;
    this._unlockScroll();
    this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
  };

  private _handleCloseClick = () => {
    this._dialogEl.close();
  };

  private _handleBackdropClick = (e: MouseEvent) => {
    if (!this.closeOnBackdrop) return;
    if (e.target === this._dialogEl) {
      const rect = this._dialogEl.getBoundingClientRect();
      const isInDialog = 
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      
      if (!isInDialog) {
        this.dispatchEvent(new CustomEvent('skyra-cancel', { bubbles: true, composed: true }));
        this._dialogEl.close();
      }
    }
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (!this.closeOnEscape) {
        e.preventDefault();
      } else {
        this.dispatchEvent(new CustomEvent('skyra-cancel', { bubbles: true, composed: true }));
      }
    }
  };

  private _lockScroll() {
    document.body.style.setProperty('overflow', 'hidden', 'important');
  }

  private _unlockScroll() {
    document.body.style.removeProperty('overflow');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-dialog')) {
  customElements.define('skyra-tech-dialog', SkyraTechDialog);
}
