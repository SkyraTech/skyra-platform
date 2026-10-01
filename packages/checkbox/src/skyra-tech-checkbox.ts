import { checkboxStyles } from './skyra-tech-checkbox.css.js';

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const MINUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="icon icon-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

export class SkyraTechCheckbox extends HTMLElement {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _input: HTMLInputElement;
  private _labelContainer: HTMLLabelElement;
  private _labelSlot: HTMLSlotElement;
  private _labelTextEl: HTMLElement;
  private _helperContainer: HTMLElement;
  private _helperSlot: HTMLSlotElement;
  private _errorContainer: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${checkboxStyles}</style>
      <div class="skyra-checkbox-container" part="container">
        <label id="label-wrapper" class="skyra-checkbox-label-wrapper" part="label-wrapper">
          <input type="checkbox" id="input" class="skyra-sr-only-peer" part="input">
          <span class="skyra-checkbox-box" part="box">
            ${CHECK_ICON}
            ${MINUS_ICON}
          </span>
          <div class="label-text-container" part="label-text-container">
            <span id="label-text" class="label-text" part="label-text">
              <slot name="label" id="label-slot"></slot>
            </span>
            <span id="helper-msg" class="helper-text" style="display: none;" part="helper-msg">
              <slot name="helper" id="helper-slot"></slot>
            </span>
          </div>
        </label>
        <span id="error-msg" class="error-text" role="alert" style="display: none;" part="error-msg"></span>
      </div>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this._input = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    this._labelContainer = this.shadowRoot!.getElementById('label-wrapper') as HTMLLabelElement;
    this._labelSlot = this.shadowRoot!.getElementById('label-slot') as HTMLSlotElement;
    this._labelTextEl = this.shadowRoot!.getElementById('label-text') as HTMLElement;
    this._helperContainer = this.shadowRoot!.getElementById('helper-msg') as HTMLElement;
    this._helperSlot = this.shadowRoot!.getElementById('helper-slot') as HTMLSlotElement;
    this._errorContainer = this.shadowRoot!.getElementById('error-msg') as HTMLElement;

    // Bind event handlers
    this._handleChange = this._handleChange.bind(this);
    this._handleSlotChange = this._handleSlotChange.bind(this);
  }

  static get observedAttributes() {
    return [
      'checked', 'indeterminate', 'disabled', 'required', 'name', 'value',
      'label', 'helper-text', 'error', 'invalid'
    ];
  }

  connectedCallback() {
    this._input.addEventListener('change', this._handleChange);
    this._labelSlot.addEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.addEventListener('slotchange', this._handleSlotChange);

    const uid = Math.random().toString(36).slice(2, 9);
    this._input.id = this.id || `skyra-checkbox-${uid}`;
    this._labelContainer.htmlFor = this._input.id;
    this._errorContainer.id = `${this._input.id}-error`;
    this._helperContainer.id = `${this._input.id}-helper`;

    this._syncAttributes();
    this._updateUI();
  }

  disconnectedCallback() {
    this._input.removeEventListener('change', this._handleChange);
    this._labelSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.removeEventListener('slotchange', this._handleSlotChange);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'checked') {
      this._input.checked = this.hasAttribute('checked');
      if (this.hasAttribute('checked')) {
        this.removeAttribute('indeterminate'); // checked overrides indeterminate naturally
      }
      this._updateInternals();
    } else if (name === 'indeterminate') {
      this._input.indeterminate = this.hasAttribute('indeterminate');
      this._updateInternals();
    } else if (['disabled', 'required', 'name', 'value'].includes(name)) {
      if (newValue === null) {
        this._input.removeAttribute(name);
      } else {
        this._input.setAttribute(name, newValue);
      }
      if (name === 'value') this._updateInternals();
    }

    this._updateUI();
  }

  // --- Properties ---

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) { 
    val ? this.setAttribute('checked', '') : this.removeAttribute('checked'); 
  }

  get indeterminate() { return this.hasAttribute('indeterminate'); }
  set indeterminate(val) { 
    val ? this.setAttribute('indeterminate', '') : this.removeAttribute('indeterminate'); 
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get required() { return this.hasAttribute('required'); }
  set required(val) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  get value() { return this.getAttribute('value') || 'on'; }
  set value(val) { this.setAttribute('value', val); }
  
  get name() { return this.getAttribute('name'); }
  set name(val) { val !== null ? this.setAttribute('name', val) : this.removeAttribute('name'); }

  get label() { return this.getAttribute('label'); }
  set label(val) { val !== null ? this.setAttribute('label', val) : this.removeAttribute('label'); }

  get error() { return this.getAttribute('error'); }
  set error(val) { val !== null ? this.setAttribute('error', val) : this.removeAttribute('error'); }

  get helperText() { return this.getAttribute('helper-text'); }
  set helperText(val) { val !== null ? this.setAttribute('helper-text', val) : this.removeAttribute('helper-text'); }

  get form() { return this._internals?.form || null; }
  get validity() { return this._internals?.validity || this._input.validity; }
  get validationMessage() { return this._internals?.validationMessage || this._input.validationMessage; }

  // --- Methods ---

  checkValidity() { return this._internals ? this._internals.checkValidity() : this._input.checkValidity(); }
  reportValidity() { return this._internals ? this._internals.reportValidity() : this._input.reportValidity(); }
  
  override focus(options?: FocusOptions) { this._input.focus(options); }
  override blur() { this._input.blur(); }

  // --- Internal Logic ---

  private _syncAttributes() {
    this._input.checked = this.hasAttribute('checked');
    this._input.indeterminate = this.hasAttribute('indeterminate');
    
    for (const attr of ['disabled', 'required', 'name', 'value']) {
      if (this.hasAttribute(attr)) {
        this._input.setAttribute(attr, this.getAttribute(attr)!);
      }
    }
    this._updateInternals();
  }

  private _handleChange(e: Event) {
    this.checked = this._input.checked;
    this.indeterminate = false; // changing a checkbox clears indeterminate state
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private _handleSlotChange() {
    this._updateUI();
  }

  private _updateInternals() {
    if (this._internals && typeof this._internals.setFormValue === 'function') {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  private _updateUI() {
    const errorMsg = this.error;
    const hasError = !!errorMsg || this.hasAttribute('invalid');
    const helperMsg = this.helperText;

    // Required label asterisk
    this.required 
      ? this._labelTextEl.classList.add('label-text--required') 
      : this._labelTextEl.classList.remove('label-text--required');

    // Label fallback
    const hasLabelText = !!this.label;
    const hasLabelSlot = this._labelSlot.assignedNodes().length > 0;
    if (hasLabelText && !hasLabelSlot) {
      this._labelSlot.textContent = this.label;
    }

    // Error / Helper
    let describedBy = [];
    
    if (hasError) {
      this._errorContainer.style.display = 'block';
      this._errorContainer.textContent = errorMsg || '';
      this._helperContainer.style.display = 'none';
      this.setAttribute('invalid', '');
      this._input.setAttribute('aria-invalid', 'true');
      describedBy.push(this._errorContainer.id);
    } else {
      this._errorContainer.style.display = 'none';
      this.removeAttribute('invalid');
      this._input.setAttribute('aria-invalid', 'false');
      
      const hasHelperSlot = this._helperSlot.assignedNodes().length > 0;
      if (helperMsg || hasHelperSlot) {
        this._helperContainer.style.display = 'block';
        if (helperMsg && !hasHelperSlot) {
          this._helperSlot.textContent = helperMsg;
        }
        describedBy.push(this._helperContainer.id);
      } else {
        this._helperContainer.style.display = 'none';
      }
    }

    if (describedBy.length > 0) {
      this._input.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      this._input.removeAttribute('aria-describedby');
    }
  }
}

export function defineSkyraTechCheckbox() {
  if (typeof window !== 'undefined' && !customElements.get('skyra-tech-checkbox')) {
    customElements.define('skyra-tech-checkbox', SkyraTechCheckbox);
  }
}
