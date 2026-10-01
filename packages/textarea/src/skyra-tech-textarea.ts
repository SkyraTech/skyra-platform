import { textareaStyles } from './skyra-tech-textarea.css.js';

const ALERT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;

export class SkyraTechTextarea extends HTMLElement {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _textarea: HTMLTextAreaElement;
  private _labelContainer: HTMLLabelElement;
  private _labelSlot: HTMLSlotElement;
  private _errorContainer: HTMLElement;
  private _helperContainer: HTMLElement;
  private _helperSlot: HTMLSlotElement;
  private _charCount: HTMLElement;
  
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <style>${textareaStyles}</style>
      <label id="label" class="skyra-label" style="display: none;" part="label">
        <slot name="label" id="label-slot"></slot>
      </label>
      <textarea id="textarea" class="skyra-textarea" part="textarea"></textarea>
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

    this._textarea = this.shadowRoot!.getElementById('textarea') as HTMLTextAreaElement;
    this._labelContainer = this.shadowRoot!.getElementById('label') as HTMLLabelElement;
    this._labelSlot = this.shadowRoot!.getElementById('label-slot') as HTMLSlotElement;
    this._errorContainer = this.shadowRoot!.getElementById('error-msg') as HTMLElement;
    this._helperContainer = this.shadowRoot!.getElementById('helper-msg') as HTMLElement;
    this._helperSlot = this.shadowRoot!.getElementById('helper-slot') as HTMLSlotElement;
    this._charCount = this.shadowRoot!.getElementById('char-count') as HTMLElement;

    // Bind event handlers
    this._handleInput = this._handleInput.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSlotChange = this._handleSlotChange.bind(this);
  }

  static get observedAttributes() {
    return [
      'value', 'placeholder', 'disabled', 'readonly', 'required', 
      'name', 'minlength', 'maxlength', 'rows', 'cols', 'wrap', 'autocomplete', 'spellcheck',
      'label', 'error', 'helper-text', 'status', 'show-count', 'auto-resize', 'resize',
      'min-rows', 'max-rows', 'invalid'
    ];
  }

  connectedCallback() {
    this._textarea.addEventListener('input', this._handleInput);
    this._textarea.addEventListener('change', this._handleChange);
    this._labelSlot.addEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.addEventListener('slotchange', this._handleSlotChange);
    
    // Connect IDs for accessibility
    const uid = Math.random().toString(36).slice(2, 9);
    this._textarea.id = this.id || `skyra-textarea-${uid}`;
    this._labelContainer.htmlFor = this._textarea.id;
    this._errorContainer.id = `${this._textarea.id}-error`;
    this._helperContainer.id = `${this._textarea.id}-helper`;

    // Handle auto resize observer logic
    if (typeof ResizeObserver !== 'undefined' && this.autoResize) {
      this._setupResizeObserver();
    }

    this._syncAttributes();
    this._updateUI();
    if (this.autoResize) {
      this._calculateHeight();
    }
  }

  disconnectedCallback() {
    this._textarea.removeEventListener('input', this._handleInput);
    this._textarea.removeEventListener('change', this._handleChange);
    this._labelSlot.removeEventListener('slotchange', this._handleSlotChange);
    this._helperSlot.removeEventListener('slotchange', this._handleSlotChange);
    
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    const nativeAttrs = ['placeholder', 'disabled', 'readonly', 'required', 'name', 'minlength', 'maxlength', 'rows', 'cols', 'wrap', 'autocomplete', 'spellcheck'];
    
    if (nativeAttrs.includes(name)) {
      if (newValue === null) {
        this._textarea.removeAttribute(name);
      } else {
        this._textarea.setAttribute(name, newValue);
      }
    }
    
    if (name === 'value') {
      if (this._textarea.value !== newValue) {
        this._textarea.value = newValue || '';
        this._updateInternals();
        this._updateUI();
        if (this.autoResize) this._calculateHeight();
      }
    }

    if (name === 'auto-resize') {
      if (this.autoResize) {
        this._setupResizeObserver();
        this._calculateHeight();
      } else if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
        this._textarea.style.height = 'auto'; // Reset
      }
    }

    if (name === 'min-rows' || name === 'max-rows') {
      if (this.autoResize) this._calculateHeight();
    }

    this._updateUI();
  }

  // --- Properties ---

  get value() { return this._textarea.value; }
  set value(val: string) { 
    this._textarea.value = val;
    this.setAttribute('value', val);
    this._updateInternals();
    this._updateUI();
    if (this.autoResize) this._calculateHeight();
  }

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
  
  get showCount() { return this.hasAttribute('show-count'); }
  set showCount(val) { val ? this.setAttribute('show-count', '') : this.removeAttribute('show-count'); }

  get autoResize() { return this.hasAttribute('auto-resize'); }
  set autoResize(val) { val ? this.setAttribute('auto-resize', '') : this.removeAttribute('auto-resize'); }

  get minRows() { return parseInt(this.getAttribute('min-rows') || '3', 10); }
  set minRows(val) { this.setAttribute('min-rows', val.toString()); }

  get maxRows() { 
    const max = this.getAttribute('max-rows');
    return max ? parseInt(max, 10) : null;
  }
  set maxRows(val) { val !== null ? this.setAttribute('max-rows', val.toString()) : this.removeAttribute('max-rows'); }

  get form() { return this._internals?.form || null; }
  get name() { return this.getAttribute('name'); }
  get validity() { return this._internals?.validity || this._textarea.validity; }
  get validationMessage() { return this._internals?.validationMessage || this._textarea.validationMessage; }

  // --- Methods ---

  checkValidity() { return this._internals ? this._internals.checkValidity() : this._textarea.checkValidity(); }
  reportValidity() { return this._internals ? this._internals.reportValidity() : this._textarea.reportValidity(); }
  
  override focus(options?: FocusOptions) { this._textarea.focus(options); }
  override blur() { this._textarea.blur(); }
  
  select() { this._textarea.select(); }
  setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none") {
    this._textarea.setSelectionRange(start, end, direction);
  }

  // --- Internal Logic ---

  private _syncAttributes() {
    const nativeAttrs = ['placeholder', 'disabled', 'readonly', 'required', 'name', 'minlength', 'maxlength', 'rows', 'cols', 'wrap', 'autocomplete', 'spellcheck'];
    for (const attr of nativeAttrs) {
      if (this.hasAttribute(attr)) {
        this._textarea.setAttribute(attr, this.getAttribute(attr)!);
      }
    }
    if (this.hasAttribute('value')) {
      this._textarea.value = this.getAttribute('value')!;
      this._updateInternals();
    }
  }

  private _handleInput(e: Event) {
    if (this.getAttribute('value') !== this._textarea.value) {
      this.setAttribute('value', this._textarea.value);
    }
    this._updateInternals();
    this._updateUI();
    if (this.autoResize) this._calculateHeight();
    
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private _handleChange(e: Event) {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private _handleSlotChange() {
    this._updateUI();
  }

  private _updateInternals() {
    if (this._internals && typeof this._internals.setFormValue === 'function') {
      this._internals.setFormValue(this._textarea.value);
    }
  }

  private _setupResizeObserver() {
    if (this._resizeObserver) return;
    this._resizeObserver = new ResizeObserver(() => {
      if (this.autoResize) this._calculateHeight();
    });
    this._resizeObserver.observe(this);
  }

  private _calculateHeight() {
    const el = this._textarea;
    
    // Reset to auto to get correct scrollHeight
    el.style.height = 'auto';
    
    // Using standard 1.5 line-height and ~0.875rem font size which equals approx 21px
    const lineHeight = 21; 
    const minHeight = this.minRows * lineHeight + 20; // 20 for vertical padding roughly
    const calculatedHeight = Math.max(el.scrollHeight, minHeight);

    const max = this.maxRows;
    if (max) {
      const maxHeight = max * lineHeight + 20;
      el.style.height = `${Math.min(calculatedHeight, maxHeight)}px`;
      el.style.overflowY = calculatedHeight > maxHeight ? 'auto' : 'hidden';
    } else {
      el.style.height = `${calculatedHeight}px`;
      el.style.overflowY = 'hidden';
    }
  }

  private _updateUI() {
    const errorMsg = this.error;
    const hasError = !!errorMsg || this.hasAttribute('invalid');
    const helperMsg = this.helperText;
    
    // Label
    const hasLabelText = !!this.label;
    const hasLabelSlot = this._labelSlot.assignedNodes().length > 0;
    if (hasLabelText || hasLabelSlot) {
      this._labelContainer.style.display = 'block';
      if (hasLabelText && !hasLabelSlot) {
        this._labelSlot.textContent = this.label;
      }
      this.required 
        ? this._labelContainer.classList.add('skyra-label--required') 
        : this._labelContainer.classList.remove('skyra-label--required');
    } else {
      this._labelContainer.style.display = 'none';
    }

    // Footer (Error / Helper)
    let describedBy = [];
    
    if (hasError) {
      this._errorContainer.style.display = 'inline-flex';
      this.shadowRoot!.getElementById('error-text')!.textContent = errorMsg || '';
      this._helperContainer.style.display = 'none';
      this.setAttribute('invalid', '');
      this._textarea.setAttribute('aria-invalid', 'true');
      describedBy.push(this._errorContainer.id);
    } else {
      this._errorContainer.style.display = 'none';
      this.removeAttribute('invalid');
      this._textarea.setAttribute('aria-invalid', 'false');
      
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

    // Character Count
    const maxLength = this.getAttribute('maxlength');
    if (this.showCount && maxLength) {
      const currentLength = this._textarea.value.length;
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
      this._textarea.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      this._textarea.removeAttribute('aria-describedby');
    }
  }
}

export function defineSkyraTechTextarea() {
  if (typeof window !== 'undefined' && !customElements.get('skyra-tech-textarea')) {
    customElements.define('skyra-tech-textarea', SkyraTechTextarea);
  }
}
