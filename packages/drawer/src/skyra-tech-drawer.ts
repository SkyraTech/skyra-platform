import { drawerStyles } from './drawer.css';

const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraTechDrawer extends BaseClass {
  private _backdropEl!: HTMLElement;
  private _panelEl!: HTMLElement;
  private _titleEl!: HTMLElement;
  private _closeBtn!: HTMLButtonElement;
  private _boundKeydown: (e: KeyboardEvent) => void;
  private _previouslyFocusedElement: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._boundKeydown = this._handleKeydown.bind(this);

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${drawerStyles}</style>
      <div class="skyra-drawer-backdrop" part="backdrop" aria-hidden="true"></div>
      <div class="skyra-drawer-panel" part="panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1">
        <header class="skyra-drawer-header" part="header">
          <slot name="header">
            <h2 id="drawer-title" class="skyra-drawer-title" part="title"></h2>
            <button type="button" class="skyra-drawer-close" part="close-button" aria-label="Close drawer">
              ${CLOSE_SVG}
            </button>
          </slot>
        </header>
        <main class="skyra-drawer-body" part="body">
          <slot></slot>
        </main>
        <footer class="skyra-drawer-footer" part="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this._backdropEl = this.shadowRoot!.querySelector('.skyra-drawer-backdrop') as HTMLElement;
    this._panelEl = this.shadowRoot!.querySelector('.skyra-drawer-panel') as HTMLElement;
    this._titleEl = this.shadowRoot!.querySelector('#drawer-title') as HTMLElement;
    this._closeBtn = this.shadowRoot!.querySelector('.skyra-drawer-close') as HTMLButtonElement;
  }

  static get observedAttributes() {
    return ['open', 'position', 'size', 'title', 'backdrop'];
  }

  connectedCallback() {
    this._backdropEl.addEventListener('click', () => {
      if (this.getAttribute('backdrop') !== 'static') {
        this.close();
      }
    });

    if (this._closeBtn) {
      this._closeBtn.addEventListener('click', () => this.close());
    }

    this._updateTitle();
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._boundKeydown);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'open') {
      if (this.open) {
        this._onOpen();
      } else {
        this._onClose();
      }
    } else if (name === 'title') {
      this._updateTitle();
    }
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

  get position(): string {
    return this.getAttribute('position') || 'right';
  }
  set position(val: string) {
    this.setAttribute('position', val);
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  override get title(): string {
    return this.getAttribute('title') || '';
  }
  override set title(val: string) {
    this.setAttribute('title', val);
  }

  show(): void {
    this.open = true;
  }

  close(): void {
    if (this.open) {
      this.open = false;
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
  }

  private _updateTitle(): void {
    if (this._titleEl) {
      this._titleEl.textContent = this.title;
    }
  }

  private _onOpen(): void {
    this._previouslyFocusedElement = document.activeElement as HTMLElement | null;
    window.addEventListener('keydown', this._boundKeydown);
    this._panelEl.focus();
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
  }

  private _onClose(): void {
    window.removeEventListener('keydown', this._boundKeydown);
    if (this._previouslyFocusedElement && typeof this._previouslyFocusedElement.focus === 'function') {
      this._previouslyFocusedElement.focus();
    }
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation();
      this.close();
    }
  }
}

export function defineSkyraTechDrawer(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-drawer')) {
    customElements.define('skyra-tech-drawer', SkyraTechDrawer);
  }
}
