import { toISODateString, parseDate, icons } from './utils';
import { dateFieldCss } from './date-field.css';
import './skyra-tech-calendar';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechDateField extends BaseClass {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'required', 'clearable', 'placeholder', 'label', 'helper-text', 'error', 'invalid'];
  }
  static formAssociated = true;

  private _internals: ElementInternals;
  private _shadowRoot: ShadowRoot;
  private _input!: HTMLInputElement;
  private _popover!: HTMLDivElement;
  private _calendar!: HTMLElement;
  private _isOpen = false;
  private _ignoreBlur = false;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
    this._setupListeners();
    this._updateUI();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal && this.isConnected) {
      if (name === 'value') {
        this._internals.setFormValue(newVal);
      }
      this._updateUI();
    }
  }

  // Properties
  get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get min() { return this.getAttribute('min') || ''; }
  set min(v) { if (v) this.setAttribute('min', v); else this.removeAttribute('min'); }
  get max() { return this.getAttribute('max') || ''; }
  set max(v) { if (v) this.setAttribute('max', v); else this.removeAttribute('max'); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  set required(v) { if (v) this.setAttribute('required', ''); else this.removeAttribute('required'); }
  get clearable() { return this.getAttribute('clearable') !== 'false'; }
  set clearable(v: boolean) { if (!v) this.setAttribute('clearable', 'false'); else this.removeAttribute('clearable'); }
  get placeholder() { return this.getAttribute('placeholder') || 'YYYY-MM-DD'; }
  set placeholder(v) { if (v) this.setAttribute('placeholder', v); else this.removeAttribute('placeholder'); }
  get label() { return this.getAttribute('label') || ''; }
  set label(v) { if (v) this.setAttribute('label', v); else this.removeAttribute('label'); }
  get helperText() { return this.getAttribute('helper-text') || ''; }
  set helperText(v) { if (v) this.setAttribute('helper-text', v); else this.removeAttribute('helper-text'); }
  get error() { return this.getAttribute('error') || ''; }
  set error(v) { if (v) this.setAttribute('error', v); else this.removeAttribute('error'); }
  get invalid() { return this.hasAttribute('invalid'); }
  set invalid(v) { if (v) this.setAttribute('invalid', ''); else this.removeAttribute('invalid'); }

  get name() { return this.getAttribute('name') || ''; }
  get form() { return this._internals.form; }

  // Additional props
  set disabledDate(fn: (date: Date) => boolean) {
    if (this._calendar) (this._calendar as any).disabledDate = fn;
  }

  private _render() {
    this._shadowRoot.innerHTML = `
      <style>${dateFieldCss}</style>
      <div class="skyra-date-field-container">
        <label id="lbl"></label>
        <div class="input-wrapper" id="wrapper">
          <span class="icon">${icons.calendar}</span>
          <input type="text" id="inp" autocomplete="off" />
          <button type="button" class="clear-btn" id="clear" aria-label="Clear" style="display:none">
            ${icons.x}
          </button>
        </div>
        <div class="popover" id="pop">
          <skyra-tech-calendar id="cal"></skyra-tech-calendar>
        </div>
        <div id="msg"></div>
      </div>
    `;
    this._input = this._shadowRoot.getElementById('inp') as HTMLInputElement;
    this._popover = this._shadowRoot.getElementById('pop') as HTMLDivElement;
    this._calendar = this._shadowRoot.getElementById('cal') as HTMLElement;
  }

  private _setupListeners() {
    const wrapper = this._shadowRoot.getElementById('wrapper') as HTMLDivElement;
    const clearBtn = this._shadowRoot.getElementById('clear') as HTMLButtonElement;

    // Focus triggers popover opening
    this._input.addEventListener('focus', () => {
      if (!this.disabled) this._setOpen(true);
    });
    
    wrapper.addEventListener('click', () => {
      if (!this.disabled) {
        this._setOpen(true);
        this._input.focus();
      }
    });

    // Close logic
    this._input.addEventListener('blur', () => {
      if (!this._ignoreBlur) {
        this._setOpen(false);
        this._validateInput(this._input.value);
      }
    });

    this._popover.addEventListener('mousedown', () => {
      this._ignoreBlur = true;
    });

    this._popover.addEventListener('mouseup', () => {
      this._ignoreBlur = false;
      this._input.focus();
    });

    // Manual typing
    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._setOpen(false);
        this._validateInput(this._input.value);
      } else if (e.key === 'Escape') {
        this._setOpen(false);
      } else if (e.key === 'ArrowDown') {
        if (!this._isOpen) this._setOpen(true);
        // focus calendar
        const days = this._calendar.shadowRoot?.querySelector('.days-grid');
        const firstFocusable = days?.querySelector('.day-btn[tabindex="0"]') as HTMLElement;
        if (firstFocusable) {
           this._ignoreBlur = true;
           firstFocusable.focus();
           this._ignoreBlur = false;
        }
        e.preventDefault();
      }
    });

    // Handle Calendar selection
    this._calendar.addEventListener('skyra-change', (e: Event) => {
      const custom = e as CustomEvent;
      const iso = custom.detail.value;
      if (iso !== this.value) {
        this.value = iso;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: iso }, bubbles: true }));
      }
      this._setOpen(false);
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.value = '';
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: '' }, bubbles: true }));
      this._updateUI();
    });
  }

  private _validateInput(text: string) {
    const d = parseDate(text);
    if (d) {
      const iso = toISODateString(d);
      if (iso !== this.value) {
        this.value = iso;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: iso }, bubbles: true }));
      }
    } else if (text === '') {
      this.value = '';
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: '' }, bubbles: true }));
    } else {
      // Revert input text to actual value
      this._updateUI();
    }
  }

  private _setOpen(open: boolean) {
    if (open === this._isOpen) return;
    this._isOpen = open;
    if (open) {
      this._popover.classList.add('open');
      this.dispatchEvent(new CustomEvent('skyra-open', { bubbles: true }));
    } else {
      this._popover.classList.remove('open');
      this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true }));
    }
  }

  private _updateUI() {
    if (!this._shadowRoot.querySelector('.skyra-date-field-container')) return;

    const lbl = this._shadowRoot.getElementById('lbl') as HTMLLabelElement;
    const wrapper = this._shadowRoot.getElementById('wrapper') as HTMLDivElement;
    const msg = this._shadowRoot.getElementById('msg') as HTMLDivElement;
    const clearBtn = this._shadowRoot.getElementById('clear') as HTMLButtonElement;

    // Label
    if (this.label) {
      lbl.style.display = 'block';
      lbl.innerHTML = `${this.label}${this.required ? '<span style="color:var(--skyra-danger)">*</span>' : ''}`;
      lbl.className = this.disabled ? 'disabled' : '';
    } else {
      lbl.style.display = 'none';
    }

    // Input
    this._input.disabled = this.disabled;
    this._input.placeholder = this.placeholder;
    this._input.value = this.value;

    if (this.disabled) wrapper.classList.add('disabled');
    else wrapper.classList.remove('disabled');

    const hasError = this.invalid || !!this.error;
    if (hasError) wrapper.classList.add('error');
    else wrapper.classList.remove('error');

    // Messages
    if (this.error) {
      msg.innerHTML = `<span class="error-text">${icons.alert} ${this.error}</span>`;
    } else if (this.helperText) {
      msg.innerHTML = `<span class="helper-text">${this.helperText}</span>`;
    } else {
      msg.innerHTML = '';
    }

    // Clear btn
    if (this.clearable && this.value && !this.disabled) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }

    // Calendar sync
    this._calendar.setAttribute('value', this.value);
    if (this.min) this._calendar.setAttribute('min', this.min);
    if (this.max) this._calendar.setAttribute('max', this.max);
    
    // Element internals valid state (simplified)
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Date is required');
    } else {
      this._internals.setValidity({});
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-date-field')) {
  customElements.define('skyra-tech-date-field', SkyraTechDateField);
}