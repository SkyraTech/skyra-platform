import { inputStyles } from './skyra-tech-input.css.js';

const ALERT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="skyra-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraTechInput extends BaseClass {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _input: HTMLInputElement;
  private _labelContainer: HTMLLabelElement;
  private _labelSlot: HTMLSlotElement;
  private _leftAdornment: HTMLElement;
  private _rightAdornment: HTMLElement;
  private _leftSlot: HTMLSlotElement;
  private _rightSlot: HTMLSlotElement;
  private _errorContainer: HTMLElement;
  private _helperContainer: HTMLElement;
  private _helperSlot: HTMLSlotElement;
  private _charCount: HTMLElement;
  private _clearBtn: HTMLButtonElement;
  private _spinnerContainer: HTMLElement;
  
  private _hasLeftContent = false;
  private _hasRightContent = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${inputStyles}</style>
      <label id="label" class="skyra-label" style="display: none;" part="label">
        <slot name="label" id="label-slot"></slot>
      </label>
      <div class="input-wrapper" part="wrapper">
        <span class="left-adornment" id="left-adornment" style="display: none;" part="left-adornment">
          <slot name="left-icon" id="left-slot"></slot>
        </span>
        <input id="input" class="skyra-input" part="input" />
        <div class="right-adornment" id="right-adornment" part="right-adornment">
          <button type="button" id="clear-btn" class="clear-btn" aria-label="Clear input" style="display: none;" part="clear-btn">
            ${X_SVG}
          </button>
          <span id="spinner" style="display: none;" part="spinner">
            ${SPINNER_SVG}
          </span>
          <span id="right-slot-container" style="display: none; align-items: center;" part="right-slot">
            <slot name="right-icon" id="right-slot"></slot>
          </span>
        </div>
      </div>
      <div class="footer" part="footer">
        <div>
          <span id="error-msg" class="error-msg" role="alert" style="display: none;" part="error-msg">
            <span aria-hidden="true" style="display: flex;">${ALERT_SVG}</span>
            <span id="error-text"></span>
          </span>
          <span id="helper-msg" class="helper-msg" style="display: none;" part="helper-msg">
            <slot name="helper" id="helper-slot"></slot>
          </span>
        </div>
        <span id="char-count" class="char-count" style="display: none;" part="char-count"></span>
      </div>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this._input = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    this._labelContainer = this.shadowRoot!.getElementById('label') as HTMLLabelElement;
    this._labelSlot = this.shadowRoot!.getElementById('label-slot') as HTMLSlotElement;
    this._leftAdornment = this.shadowRoot!.getElementById('left-adornment') as HTMLElement;
    this._rightAdornment = this.shadowRoot!.getElementById('right-adornment') as HTMLElement;
    this._leftSlot = this.shadowRoot!.getElementById('left-slot') as HTMLSlotElement;
    this._rightSlot = this.shadowRoot!.getElementById('right-slot') as HTMLSlotElement;
    this._errorContainer = this.shadowRoot!.getElementById('error-msg') as HTMLElement;
    this._helperContainer = this.shadowRoot!.getElementById('helper-msg') as HTMLElement;
    this._helperSlot = this.shadowRoot!.getElementById('helper-slot') as HTMLSlotElement;
    this._charCount = this.shadowRoot!.getElementById('char-count') as HTMLElement;
    this._clearBtn = this.shadowRoot!.getElementById('clear-btn') as HTMLButtonElement;
    this._spinnerContainer = this.shadowRoot!.getElementById('spinner') as HTMLElement;

    // Bind event handlers
    this._handleInput = this._handleInput.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSlotChange = this._handleSlotChange.bind(this);
    this._handleClearClick = this._handleClearClick.bind(this);
  }

  static get observedAttributes() {
    return [
      'type', 'value', 'placeholder', 'disabled', 'readonly', 'required', 
      'name', 'autocomplete', 'minlength', 'maxlength', 'min', 'max', 'step', 'pattern',
      'label', 'error', 'helper-text', 'status', 'loading', 'clearable', 'show-count',
      'invalid'
    ];
  }

  connectedCallback() {
    this._input.addEventListener('input', this._handleInput);
    this._input.addEventListener('change', this._handleChange);
    this._clearBtn.addEventListener('click', this._handleClearClick);
    this._leftSlot.addEventListener('slotchange', this._handleSlotChange);
    this._rightSlot.addEventListener('slotchange', this._handleSlotChange);
    this._labelSlot.addEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.addEventListener('slotchange', this._handleSlotChange);
    
    // Connect IDs for accessibility
    const uid = Math.random().toString(36).slice(2, 9);
    this._input.id = this.id || `skyra-input-${uid}`;
    this._labelContainer.htmlFor = this._input.id;
    this._errorContainer.id = `${this._input.id}-error`;
    this._helperContainer.id = `${this._input.id}-helper`;

    this._syncAttributes();
    this._updateUI();
  }

  disconnectedCallback() {
    this._input.removeEventListener('input', this._handleInput);
    this._input.removeEventListener('change', this._handleChange);
    this._clearBtn.removeEventListener('click', this._handleClearClick);
    this._leftSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._rightSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._labelSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.removeEventListener('slotchange', this._handleSlotChange);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    // Synchronize native input attributes
    const nativeAttrs = ['type', 'placeholder', 'disabled', 'readonly', 'required', 'name', 'autocomplete', 'minlength', 'maxlength', 'min', 'max', 'step', 'pattern'];
    
    if (nativeAttrs.includes(name)) {
      if (newValue === null) {
        this._input.removeAttribute(name);
      } else {
        this._input.setAttribute(name, newValue);
      }
    }
    
    if (name === 'value') {
      if (this._input.value !== newValue) {
        this._input.value = newValue || '';
        this._updateInternals();
        this._updateUI();
      }
    }

    this._updateUI();
  }

  // --- Properties ---

  get value() { return this._input.value; }
  set value(val: string) { 
    this._input.value = val;
    this.setAttribute('value', val);
    this._updateInternals();
    this._updateUI();
  }

  get type() { return this.getAttribute('type') || 'text'; }
  set type(val) { this.setAttribute('type', val); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(val) { val ? this.setAttribute('readonly', '') : this.removeAttribute('readonly'); }
  
  get required() { return this.hasAttribute('required'); }
  set required(val) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  get label() { return this.getAttribute('label'); }
  set label(val) { val !== null ? this.setAttribute('label', val) : this.removeAttribute('label'); }

  get error() { return this.getAttribute('error'); }
  set error(val) { val !== null ? this.setAttribute('error', val) : this.removeAttribute('error'); }
  
  get helperText() { return this.getAttribute('helper-text'); }
  set helperText(val) { val !== null ? this.setAttribute('helper-text', val) : this.removeAttribute('helper-text'); }

  get status() { return this.getAttribute('status') || 'default'; }
  set status(val) { this.setAttribute('status', val); }

  get loading() { return this.hasAttribute('loading'); }
  set loading(val) { val ? this.setAttribute('loading', '') : this.removeAttribute('loading'); }
  
  get clearable() { return this.hasAttribute('clearable'); }
  set clearable(val) { val ? this.setAttribute('clearable', '') : this.removeAttribute('clearable'); }
  
  get showCount() { return this.hasAttribute('show-count'); }
  set showCount(val) { val ? this.setAttribute('show-count', '') : this.removeAttribute('show-count'); }

  get form() { return this._internals?.form || null; }
  get name() { return this.getAttribute('name'); }
  get validity() { return this._internals?.validity || this._input.validity; }
  get validationMessage() { return this._internals?.validationMessage || this._input.validationMessage; }

  // --- Methods ---

  checkValidity() { return this._internals && typeof (this._internals as unknown as { checkValidity: () => boolean }).checkValidity === 'function' ? (this._internals as unknown as { checkValidity: () => boolean }).checkValidity() : this._input.checkValidity(); }
  reportValidity() { return this._internals && typeof (this._internals as unknown as { reportValidity: () => boolean }).reportValidity === 'function' ? (this._internals as unknown as { reportValidity: () => boolean }).reportValidity() : this._input.reportValidity(); }
  
  override focus(options?: FocusOptions) { this._input.focus(options); }
  override blur() { this._input.blur(); }
  
  select() { this._input.select(); }
  setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none") {
    this._input.setSelectionRange(start, end, direction);
  }

  // --- Internal Logic ---

  private _syncAttributes() {
    // Initial sync of properties to input
    const nativeAttrs = ['type', 'placeholder', 'disabled', 'readonly', 'required', 'name', 'autocomplete', 'minlength', 'maxlength', 'min', 'max', 'step', 'pattern'];
    for (const attr of nativeAttrs) {
      if (this.hasAttribute(attr)) {
        this._input.setAttribute(attr, this.getAttribute(attr)!);
      }
    }
    if (this.hasAttribute('value')) {
      this._input.value = this.getAttribute('value')!;
      this._updateInternals();
    }
  }

  private _handleInput(e: Event) {
    // Sync internal value out
    if (this.getAttribute('value') !== this._input.value) {
      this.setAttribute('value', this._input.value);
    }
    this._updateInternals();
    this._updateUI();
    
    // Bubble native event
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private _handleChange(e: Event) {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private _handleSlotChange() {
    this._hasLeftContent = this._leftSlot.assignedNodes().length > 0;
    this._hasRightContent = this._rightSlot.assignedNodes().length > 0;
    this._updateUI();
  }

  private _handleClearClick() {
    this.value = '';
    this._input.focus();
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private _updateInternals() {
    if (this._internals && typeof this._internals.setFormValue === 'function') {
      this._internals.setFormValue(this._input.value);
    }
  }

  private _updateUI() {
    const errorMsg = this.error;
    const hasErrorMsg = !!errorMsg;
    const isExplicitlyInvalid = this.hasAttribute('invalid');
    const helperMsg = this.helperText;
    
    // Label
    const hasLabelText = !!this.label;
    const hasLabelSlot = this._labelSlot.assignedNodes().length > 0;
    if (hasLabelText || hasLabelSlot) {
      this._labelContainer.style.display = 'block';
      if (hasLabelText && !hasLabelSlot) {
        if (this._labelSlot.textContent !== this.label) {
          this._labelSlot.textContent = this.label;
        }
      }
      this.required 
        ? this._labelContainer.classList.add('skyra-label--required') 
        : this._labelContainer.classList.remove('skyra-label--required');
    } else {
      this._labelContainer.style.display = 'none';
    }

    // Left Adornment
    if (this._hasLeftContent) {
      this._leftAdornment.style.display = 'flex';
      this.setAttribute('has-left', '');
    } else {
      this._leftAdornment.style.display = 'none';
      this.removeAttribute('has-left');
    }

    // Right Adornment Area
    let rightActive = false;
    
    if (this.clearable && this._input.value && !this.disabled && !this.readOnly) {
      this._clearBtn.style.display = 'flex';
      rightActive = true;
    } else {
      this._clearBtn.style.display = 'none';
    }

    if (this.loading) {
      this._spinnerContainer.style.display = 'flex';
      rightActive = true;
    } else {
      this._spinnerContainer.style.display = 'none';
    }

    const rightSlotContainer = this.shadowRoot!.getElementById('right-slot-container')!;
    if (this._hasRightContent && !this.loading) {
      rightSlotContainer.style.display = 'flex';
      rightActive = true;
    } else {
      rightSlotContainer.style.display = 'none';
    }

    if (rightActive) {
      this.setAttribute('has-right', '');
    } else {
      this.removeAttribute('has-right');
    }

    // Footer (Error / Helper)
    let describedBy = [];
    
    if (hasErrorMsg) {
      this._errorContainer.style.display = 'inline-flex';
      this.shadowRoot!.getElementById('error-text')!.textContent = errorMsg || '';
      this._helperContainer.style.display = 'none';
      this._input.setAttribute('aria-invalid', 'true');
      describedBy.push(this._errorContainer.id);
    } else {
      this._errorContainer.style.display = 'none';
      this._input.setAttribute('aria-invalid', isExplicitlyInvalid ? 'true' : 'false');
      
      const hasHelperSlot = this._helperSlot.assignedNodes().length > 0;
      if (helperMsg || hasHelperSlot) {
        this._helperContainer.style.display = 'block';
        if (helperMsg && !hasHelperSlot) {
          if (this._helperSlot.textContent !== helperMsg) {
            this._helperSlot.textContent = helperMsg;
          }
        }
        describedBy.push(this._helperContainer.id);
      } else {
        this._helperContainer.style.display = 'none';
      }
    }

    // Character Count
    const maxLength = this.getAttribute('maxlength');
    if (this.showCount && maxLength) {
      const currentLength = this._input.value.length;
      this._charCount.style.display = 'block';
      this._charCount.textContent = `${currentLength} / ${maxLength}`;
      if (currentLength >= parseInt(maxLength, 10)) {
        this._charCount.classList.add('char-count--overflow');
      } else {
        this._charCount.classList.remove('char-count--overflow');
      }
    } else {
      this._charCount.style.display = 'none';
    }

    if (describedBy.length > 0) {
      this._input.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      this._input.removeAttribute('aria-describedby');
    }
  }
}

export function defineSkyraTechInput() {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-input')) {
    customElements.define('skyra-tech-input', SkyraTechInput);
  }
}
