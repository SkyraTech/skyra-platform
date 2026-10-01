import { toISODateString, parseDate, icons } from './utils';
import { dateRangeFieldCss } from './date-range-field.css';
import './skyra-tech-calendar';

export class SkyraTechDateRangeField extends HTMLElement {
  static get observedAttributes() {
    return ['start-value', 'end-value', 'min', 'max', 'disabled', 'required', 'clearable', 'placeholder', 'label', 'helper-text', 'error', 'invalid'];
  }
  static formAssociated = true;

  private _internals: ElementInternals;
  private _shadowRoot: ShadowRoot;
  private _startInput!: HTMLInputElement;
  private _endInput!: HTMLInputElement;
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
      if (name === 'start-value' || name === 'end-value') {
        const val = { startDate: this.startValue, endDate: this.endValue };
        this._internals.setFormValue(JSON.stringify(val));
      }
      this._updateUI();
    }
  }

  get startValue() { return this.getAttribute('start-value') || ''; }
  set startValue(v) { if (v) this.setAttribute('start-value', v); else this.removeAttribute('start-value'); }
  get endValue() { return this.getAttribute('end-value') || ''; }
  set endValue(v) { if (v) this.setAttribute('end-value', v); else this.removeAttribute('end-value'); }
  
  get value() { return { startDate: this.startValue || null, endDate: this.endValue || null }; }
  set value(v: { startDate: string|null, endDate: string|null }) {
    this.startValue = v.startDate || '';
    this.endValue = v.endDate || '';
  }

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

  set disabledDate(fn: (date: Date) => boolean) {
    if (this._calendar) (this._calendar as any).disabledDate = fn;
  }

  private _render() {
    this._shadowRoot.innerHTML = `
      <style>${dateRangeFieldCss}</style>
      <div class="container">
        <label id="lbl"></label>
        <div class="inputs-container" id="wrapper">
          <span class="icon">${icons.calendar}</span>
          <input type="text" id="start-inp" autocomplete="off" />
          <span class="divider">to</span>
          <input type="text" id="end-inp" autocomplete="off" />
          <button type="button" class="clear-btn" id="clear" aria-label="Clear" style="display:none">
            ${icons.x}
          </button>
        </div>
        <div class="popover" id="pop">
          <skyra-tech-calendar id="cal" mode="range"></skyra-tech-calendar>
        </div>
        <div id="msg"></div>
      </div>
    `;
    this._startInput = this._shadowRoot.getElementById('start-inp') as HTMLInputElement;
    this._endInput = this._shadowRoot.getElementById('end-inp') as HTMLInputElement;
    this._popover = this._shadowRoot.getElementById('pop') as HTMLDivElement;
    this._calendar = this._shadowRoot.getElementById('cal') as HTMLElement;
  }

  private _setupListeners() {
    const wrapper = this._shadowRoot.getElementById('wrapper') as HTMLDivElement;
    const clearBtn = this._shadowRoot.getElementById('clear') as HTMLButtonElement;

    this._startInput.addEventListener('focus', () => { if (!this.disabled) this._setOpen(true); });
    this._endInput.addEventListener('focus', () => { if (!this.disabled) this._setOpen(true); });
    wrapper.addEventListener('click', (e) => {
      if (!this.disabled) {
        this._setOpen(true);
        if (e.target !== this._startInput && e.target !== this._endInput) {
          this._startInput.focus();
        }
      }
    });

    const handleBlur = () => {
      if (!this._ignoreBlur) {
        setTimeout(() => {
          if (this._shadowRoot.activeElement !== this._startInput && this._shadowRoot.activeElement !== this._endInput) {
             this._setOpen(false);
             this._validateInputs();
          }
        }, 0);
      }
    };
    
    this._startInput.addEventListener('blur', handleBlur);
    this._endInput.addEventListener('blur', handleBlur);

    this._popover.addEventListener('mousedown', () => { this._ignoreBlur = true; });
    this._popover.addEventListener('mouseup', () => { this._ignoreBlur = false; this._startInput.focus(); });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this._setOpen(false);
        this._validateInputs();
      } else if (e.key === 'Escape') {
        this._setOpen(false);
      } else if (e.key === 'ArrowDown') {
        if (!this._isOpen) this._setOpen(true);
        const days = this._calendar.shadowRoot?.querySelector('.days-grid');
        const firstFocusable = days?.querySelector('.day-btn[tabindex="0"]') as HTMLElement;
        if (firstFocusable) {
           this._ignoreBlur = true;
           firstFocusable.focus();
           this._ignoreBlur = false;
        }
        e.preventDefault();
      }
    };

    this._startInput.addEventListener('keydown', handleKeyDown);
    this._endInput.addEventListener('keydown', handleKeyDown);

    this._calendar.addEventListener('skyra-range-change', (e: Event) => {
      const custom = e as CustomEvent;
      const [startIso, endIso] = custom.detail.value;
      if (startIso !== this.startValue || endIso !== this.endValue) {
        this.startValue = startIso || '';
        this.endValue = endIso || '';
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: { startDate: startIso, endDate: endIso } }, bubbles: true }));
      }
      if (startIso && endIso) {
        this._setOpen(false);
      }
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.startValue = '';
      this.endValue = '';
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: { startDate: null, endDate: null } }, bubbles: true }));
      this._updateUI();
    });
  }

  private _validateInputs() {
    const s = parseDate(this._startInput.value);
    const e = parseDate(this._endInput.value);
    
    let nextS = s ? toISODateString(s) : '';
    let nextE = e ? toISODateString(e) : '';
    
    if (nextS && nextE && nextS > nextE) {
      [nextS, nextE] = [nextE, nextS];
    }
    
    if (nextS !== this.startValue || nextE !== this.endValue) {
      this.startValue = nextS;
      this.endValue = nextE;
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: { startDate: nextS || null, endDate: nextE || null } }, bubbles: true }));
    } else {
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
    if (!this._shadowRoot.querySelector('.container')) return;

    const lbl = this._shadowRoot.getElementById('lbl') as HTMLLabelElement;
    const wrapper = this._shadowRoot.getElementById('wrapper') as HTMLDivElement;
    const msg = this._shadowRoot.getElementById('msg') as HTMLDivElement;
    const clearBtn = this._shadowRoot.getElementById('clear') as HTMLButtonElement;

    if (this.label) {
      lbl.style.display = 'block';
      lbl.innerHTML = `${this.label}${this.required ? '<span style="color:var(--skyra-danger)">*</span>' : ''}`;
      lbl.className = this.disabled ? 'disabled' : '';
    } else {
      lbl.style.display = 'none';
    }

    this._startInput.disabled = this.disabled;
    this._endInput.disabled = this.disabled;
    this._startInput.placeholder = this.placeholder;
    this._endInput.placeholder = this.placeholder;
    this._startInput.value = this.startValue;
    this._endInput.value = this.endValue;

    if (this.disabled) wrapper.classList.add('disabled');
    else wrapper.classList.remove('disabled');

    const hasError = this.invalid || !!this.error;
    if (hasError) wrapper.classList.add('error');
    else wrapper.classList.remove('error');

    if (this.error) {
      msg.innerHTML = `<span class="error-text">${icons.alert} ${this.error}</span>`;
    } else if (this.helperText) {
      msg.innerHTML = `<span class="helper-text">${this.helperText}</span>`;
    } else {
      msg.innerHTML = '';
    }

    if (this.clearable && (this.startValue || this.endValue) && !this.disabled) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }

    this._calendar.setAttribute('range-start', this.startValue);
    this._calendar.setAttribute('range-end', this.endValue);
    if (this.min) this._calendar.setAttribute('min', this.min);
    if (this.max) this._calendar.setAttribute('max', this.max);
    
    if (this.required && (!this.startValue || !this.endValue)) {
      this._internals.setValidity({ valueMissing: true }, 'Date range is required');
    } else {
      this._internals.setValidity({});
    }
  }
}

if (!customElements.get('skyra-tech-date-range-field')) {
  customElements.define('skyra-tech-date-range-field', SkyraTechDateRangeField);
}