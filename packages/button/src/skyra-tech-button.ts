import { buttonStyles } from './skyra-tech-button.css.js';

export class SkyraTechButton extends HTMLElement {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _button: HTMLButtonElement;
  private _spinner: HTMLElement;
  private _leftIconSlot: HTMLSlotElement;
  private _rightIconSlot: HTMLSlotElement;
  private _defaultSlot: HTMLSlotElement;
  private _loadingTextEl: HTMLElement;
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Enable form association if supported
    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${buttonStyles}</style>
      <button id="button">
        <span id="spinner" class="skyra-spinner skyra-spinner--md" aria-hidden="true" style="display: none;"></span>
        <slot name="left-icon" id="left-icon-slot"></slot>
        <span id="loading-text" class="sr-only" style="display: none;"></span>
        <slot id="default-slot"></slot>
        <slot name="right-icon" id="right-icon-slot"></slot>
      </button>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this._button = this.shadowRoot!.getElementById('button') as HTMLButtonElement;
    this._spinner = this.shadowRoot!.getElementById('spinner') as HTMLElement;
    this._leftIconSlot = this.shadowRoot!.getElementById('left-icon-slot') as HTMLSlotElement;
    this._rightIconSlot = this.shadowRoot!.getElementById('right-icon-slot') as HTMLSlotElement;
    this._defaultSlot = this.shadowRoot!.getElementById('default-slot') as HTMLSlotElement;
    this._loadingTextEl = this.shadowRoot!.getElementById('loading-text') as HTMLElement;

    this._handleClick = this._handleClick.bind(this);
  }

  static get observedAttributes() {
    return [
      'variant',
      'size',
      'loading',
      'loading-text',
      'full-width',
      'icon-only',
      'disabled',
      'type'
    ];
  }

  connectedCallback() {
    this._button.addEventListener('click', this._handleClick);
    this._updateClasses();
    this._updateAttributes();
    this._updateLoadingState();
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this._handleClick);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    if (name === 'loading' || name === 'loading-text') {
      this._updateLoadingState();
    }
    this._updateClasses();
    this._updateAttributes();
  }

  // Properties mapping to attributes
  get variant() { return this.getAttribute('variant') || 'primary'; }
  set variant(val) { this.setAttribute('variant', val); }

  get size() { return this.getAttribute('size') || 'md'; }
  set size(val) { this.setAttribute('size', val); }

  get loading() { return this.hasAttribute('loading'); }
  set loading(val) { val ? this.setAttribute('loading', '') : this.removeAttribute('loading'); }
  
  get loadingText() { return this.getAttribute('loading-text') || 'Loading...'; }
  set loadingText(val) { this.setAttribute('loading-text', val); }

  get fullWidth() { return this.hasAttribute('full-width'); }
  set fullWidth(val) { val ? this.setAttribute('full-width', '') : this.removeAttribute('full-width'); }

  get iconOnly() { return this.hasAttribute('icon-only'); }
  set iconOnly(val) { val ? this.setAttribute('icon-only', '') : this.removeAttribute('icon-only'); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get type() { return this.getAttribute('type') || 'button'; }
  set type(val) { this.setAttribute('type', val); }
  
  get form() { return this._internals?.form || null; }

  // Method required for form association
  checkValidity() { return this._internals?.checkValidity() ?? true; }
  reportValidity() { return this._internals?.reportValidity() ?? true; }

  // Delegate focus
  override focus(options?: FocusOptions) {
    this._button.focus(options);
  }

  override blur() {
    this._button.blur();
  }

  private _handleClick(e: Event) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (this.type === 'submit') {
      const form = this._internals?.form;
      if (form) {
        // Find if this is inside the form, if so dispatch a submit event.
        // A simpler standard approach is requestSubmit if available.
        if (typeof form.requestSubmit === 'function') {
            try {
                // Prevent infinite loop if we manually submit
                form.requestSubmit(this);
            } catch(e) {
                form.requestSubmit();
            }
        } else {
            form.submit();
        }
      }
    } else if (this.type === 'reset') {
      const form = this._internals?.form;
      if (form) {
        form.reset();
      }
    }
  }

  private _updateClasses() {
    const variant = this.variant === 'destructive' ? 'danger' : this.variant;
    const size = this.size;
    const isLoading = this.loading;
    const fullWidth = this.fullWidth;
    const iconOnly = this.iconOnly;

    const classList = ['skyra-btn', `skyra-btn--${variant}`, `skyra-btn--${size}`];
    
    if (isLoading) classList.push('skyra-btn--loading');
    if (fullWidth) classList.push('skyra-btn--full');
    if (iconOnly) classList.push('skyra-btn--icon');

    this._button.className = classList.join(' ');
    
    // Update spinner size
    this._spinner.className = `skyra-spinner skyra-spinner--${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}`;
  }

  private _updateAttributes() {
    const isDisabled = this.disabled || this.loading;
    this._button.disabled = isDisabled;
    this._button.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    this._button.setAttribute('aria-busy', this.loading ? 'true' : 'false');
    this._button.setAttribute('type', this.type);
    
    // Web Component internals for forms
    if (this._internals && typeof this._internals.setFormValue === 'function') {
        this._internals.setFormValue(this.getAttribute('value') || null);
    }
  }

  private _updateLoadingState() {
    if (this.loading) {
      this._spinner.style.display = 'inline-block';
      this._leftIconSlot.style.display = 'none';
      this._rightIconSlot.style.display = 'none';
      
      const loadingTxt = this.loadingText;
      if (loadingTxt) {
          this._loadingTextEl.textContent = loadingTxt;
          this._loadingTextEl.style.display = 'inline-block';
          // Hide actual text content to screen readers if there's a loading text
          this._defaultSlot.setAttribute('aria-hidden', 'true');
      } else {
          this._loadingTextEl.style.display = 'none';
          this._defaultSlot.removeAttribute('aria-hidden');
      }
    } else {
      this._spinner.style.display = 'none';
      this._leftIconSlot.style.display = 'contents';
      this._rightIconSlot.style.display = 'contents';
      this._loadingTextEl.style.display = 'none';
      this._defaultSlot.removeAttribute('aria-hidden');
    }
  }
}

export function defineSkyraTechButton() {
  if (typeof window !== 'undefined' && !customElements.get('skyra-tech-button')) {
    customElements.define('skyra-tech-button', SkyraTechButton);
  }
}
