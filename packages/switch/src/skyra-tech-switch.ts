import { switchStyles } from './skyra-tech-switch.css.js';

const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-on"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const iconX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-off"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const iconLoader = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-loading"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechSwitch extends BaseClass {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _btn: HTMLButtonElement;
  private _thumb: HTMLElement;
  private _labelContainer: HTMLElement;
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
      <style>${switchStyles}</style>
      <div class="skyra-switch-container" part="container">
        <div id="wrapper" class="skyra-switch-wrapper" part="wrapper">
          <button id="btn" class="skyra-switch-btn" type="button" role="switch" part="btn">
            <span class="skyra-switch-label-text on" style="display: none;">ON</span>
            <span class="skyra-switch-label-text off" style="display: none;">OFF</span>
            <span id="thumb" class="skyra-switch-thumb" part="thumb"></span>
          </button>
          
          <div class="label-text-container" part="label-text-container">
            <span id="label-text" class="label-text" part="label-text">
              <slot name="label" id="label-slot"></slot>
            </span>
            <span id="helper-msg" class="helper-text" style="display: none;" part="helper-msg">
              <slot name="helper" id="helper-slot"></slot>
            </span>
          </div>
        </div>
        <span id="error-msg" class="error-text" role="alert" style="display: none;" part="error-msg"></span>
      </div>
    `;

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this._btn = this.shadowRoot!.getElementById('btn') as HTMLButtonElement;
    this._thumb = this.shadowRoot!.getElementById('thumb') as HTMLElement;
    this._labelContainer = this.shadowRoot!.getElementById('wrapper') as HTMLElement;
    this._labelSlot = this.shadowRoot!.getElementById('label-slot') as HTMLSlotElement;
    this._labelTextEl = this.shadowRoot!.getElementById('label-text') as HTMLElement;
    this._helperContainer = this.shadowRoot!.getElementById('helper-msg') as HTMLElement;
    this._helperSlot = this.shadowRoot!.getElementById('helper-slot') as HTMLSlotElement;
    this._errorContainer = this.shadowRoot!.getElementById('error-msg') as HTMLElement;

    this._handleToggle = this._handleToggle.bind(this);
    this._handleSlotChange = this._handleSlotChange.bind(this);
  }

  static get observedAttributes() {
    return [
      'checked', 'disabled', 'readonly', 'required', 'loading',
      'name', 'value', 'variant', 'size',
      'label', 'helper-text', 'error', 'invalid'
    ];
  }

  connectedCallback() {
    this._btn.addEventListener('click', this._handleToggle);
    this._labelContainer.addEventListener('click', (e) => {
      // If click was on the button itself, don't double fire
      if (e.target !== this._btn && !this._btn.contains(e.target as Node)) {
        this._handleToggle(e);
      }
    });
    this._labelSlot.addEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.addEventListener('slotchange', this._handleSlotChange);

    const uid = Math.random().toString(36).slice(2, 9);
    this._btn.id = this.id || `skyra-switch-${uid}`;
    this._errorContainer.id = `${this._btn.id}-error`;
    this._helperContainer.id = `${this._btn.id}-helper`;

    // Defaults if not set
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'default');

    this._syncAttributes();
    this._updateUI();

    this.addEventListener('focus', () => this._btn.focus());
  }

  disconnectedCallback() {
    this._btn.removeEventListener('click', this._handleToggle);
    this._labelSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.removeEventListener('slotchange', this._handleSlotChange);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'checked') {
      this._updateInternals();
    } else if (name === 'value') {
      this._updateInternals();
    } else if (name === 'disabled') {
      this._btn.disabled = newValue !== null;
    }

    this._updateUI();
  }

  // Properties
  get checked() { return this.hasAttribute('checked'); }
  set checked(val) { val ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(val) { val ? this.setAttribute('readonly', '') : this.removeAttribute('readonly'); }

  get loading() { return this.hasAttribute('loading'); }
  set loading(val) { val ? this.setAttribute('loading', '') : this.removeAttribute('loading'); }

  get required() { return this.hasAttribute('required'); }
  set required(val) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  get value() { return this.getAttribute('value') || 'on'; }
  set value(val) { this.setAttribute('value', val); }
  
  get name() { return this.getAttribute('name'); }
  set name(val) { val !== null ? this.setAttribute('name', val) : this.removeAttribute('name'); }

  get variant() { return this.getAttribute('variant') || 'default'; }
  set variant(val) { val !== null ? this.setAttribute('variant', val) : this.removeAttribute('variant'); }

  get size() { return this.getAttribute('size') || 'md'; }
  set size(val) { val !== null ? this.setAttribute('size', val) : this.removeAttribute('size'); }

  get label() { return this.getAttribute('label'); }
  set label(val) { val !== null ? this.setAttribute('label', val) : this.removeAttribute('label'); }

  get error() { return this.getAttribute('error'); }
  set error(val) { val !== null ? this.setAttribute('error', val) : this.removeAttribute('error'); }

  get helperText() { return this.getAttribute('helper-text'); }
  set helperText(val) { val !== null ? this.setAttribute('helper-text', val) : this.removeAttribute('helper-text'); }

  get form() { return this._internals?.form || null; }
  get validity() { return this._internals?.validity || this._btn.validity; }
  get validationMessage() { return this._internals?.validationMessage || this._btn.validationMessage; }

  checkValidity() { return this._internals ? this._internals.checkValidity() : true; }
  reportValidity() { return this._internals ? this._internals.reportValidity() : true; }
  
  override focus(options?: FocusOptions) { this._btn.focus(options); }
  override blur() { this._btn.blur(); }

  private _syncAttributes() {
    this._btn.disabled = this.disabled;
    this._updateInternals();
  }

  private _handleToggle(e: Event) {
    e.preventDefault();
    if (this.disabled || this.readOnly || this.loading) return;
    
    this.checked = !this.checked;
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
    
    this._btn.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this._btn.setAttribute('aria-disabled', (this.disabled || this.loading || this.readOnly) ? 'true' : 'false');
    if (this.name) this._btn.setAttribute('name', this.name);
    else this._btn.removeAttribute('name');

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
      this._btn.setAttribute('aria-invalid', 'true');
      describedBy.push(this._errorContainer.id);
    } else {
      this._errorContainer.style.display = 'none';
      this.removeAttribute('invalid');
      this._btn.setAttribute('aria-invalid', 'false');
      
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
      this._btn.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      this._btn.removeAttribute('aria-describedby');
    }

    // Thumb content (Icons / Loading)
    if (this.loading) {
      this._thumb.innerHTML = iconLoader;
    } else if (this.variant === 'icon') {
      this._thumb.innerHTML = this.checked ? iconCheck : iconX;
    } else {
      this._thumb.innerHTML = '';
    }

    // Labeled variant text display
    const labelOn = this.shadowRoot!.querySelector('.skyra-switch-label-text.on') as HTMLElement;
    const labelOff = this.shadowRoot!.querySelector('.skyra-switch-label-text.off') as HTMLElement;
    if (this.variant === 'labeled') {
      labelOn.style.display = 'inline-block';
      labelOff.style.display = 'inline-block';
    } else {
      labelOn.style.display = 'none';
      labelOff.style.display = 'none';
    }
  }
}

export function defineSkyraTechSwitch() {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-switch')) {
    customElements.define('skyra-tech-switch', SkyraTechSwitch);
  }
}
