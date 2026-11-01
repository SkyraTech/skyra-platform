import { emptyStateStyles } from './empty-state.css';

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraTechEmptyState extends BaseClass {
  private _rootEl!: HTMLElement;
  private _titleEl!: HTMLElement;
  private _descEl!: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${emptyStateStyles}</style>
      <div class="skyra-empty-state" part="container">
        <div class="skyra-empty-state-icon" part="icon">
          <slot name="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </slot>
        </div>
        <slot name="headline">
          <h3 class="skyra-empty-state-title" part="title"></h3>
        </slot>
        <slot name="description">
          <p class="skyra-empty-state-desc" part="description"></p>
        </slot>
        <slot></slot>
        <div class="skyra-empty-state-actions" part="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));
    this._rootEl = this.shadowRoot!.querySelector('.skyra-empty-state') as HTMLElement;
    this._titleEl = this.shadowRoot!.querySelector('.skyra-empty-state-title') as HTMLElement;
    this._descEl = this.shadowRoot!.querySelector('.skyra-empty-state-desc') as HTMLElement;
  }

  static get observedAttributes() {
    return ['variant', 'headline', 'description'];
  }

  connectedCallback() {
    this._updateUI();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this._updateUI();
  }

  get variant(): string {
    return this.getAttribute('variant') || 'default';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get headline(): string {
    return this.getAttribute('headline') || '';
  }
  set headline(val: string) {
    this.setAttribute('headline', val);
  }

  get description(): string {
    return this.getAttribute('description') || '';
  }
  set description(val: string) {
    this.setAttribute('description', val);
  }

  private _updateUI(): void {
    const variant = this.variant;
    this._rootEl.className = `skyra-empty-state skyra-empty-state--${variant}`;

    if (this._titleEl) {
      this._titleEl.textContent = this.headline;
      this._titleEl.style.display = this.headline ? 'block' : 'none';
    }

    if (this._descEl) {
      this._descEl.textContent = this.description;
      this._descEl.style.display = this.description ? 'block' : 'none';
    }
  }
}

export function defineSkyraTechEmptyState(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-empty-state')) {
    customElements.define('skyra-tech-empty-state', SkyraTechEmptyState);
  }
}

