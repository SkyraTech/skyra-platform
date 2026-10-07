import { icons } from './utils';
import './skyra-tech-time-field';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechTimeRangeField extends BaseClass {
  static get observedAttributes() {
    return ['value', 'name', 'format', 'minute-step', 'disabled', 'required', 'label', 'helper-text', 'error'];
  }
  static formAssociated = true;

  private _internals: ElementInternals;
  private _shadowRoot: ShadowRoot;
  private _startField!: HTMLElement;
  private _endField!: HTMLElement;

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
        if (this._internals && typeof this._internals.setFormValue === 'function') {
          this._internals.setFormValue(newVal);
        }
      }
      this._updateUI();
    }
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get startValue() { return this.value.split(',')[0] || ''; }
  get endValue() { return this.value.split(',')[1] || ''; }
  get name() { return this.getAttribute('name') || ''; }
  set name(v) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }



  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  set required(v) { if (v) this.setAttribute('required', ''); else this.removeAttribute('required'); }
  get label() { return this.getAttribute('label') || ''; }
  set label(v) { if (v) this.setAttribute('label', v); else this.removeAttribute('label'); }
  get helperText() { return this.getAttribute('helper-text') || ''; }
  set helperText(v) { if (v) this.setAttribute('helper-text', v); else this.removeAttribute('helper-text'); }
  get error() { return this.getAttribute('error') || ''; }
  set error(v) { if (v) this.setAttribute('error', v); else this.removeAttribute('error'); }
  get format() { return this.getAttribute('format') || '12h'; }
  set format(v) { if (v) this.setAttribute('format', v); else this.removeAttribute('format'); }

  private _render() {
    this._shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: var(--skyra-font-body, system-ui, sans-serif); }
        .container { display: flex; flex-direction: column; gap: 0.375rem; width: 100%; }
        label { font-size: 0.875rem; font-weight: 500; color: var(--skyra-text, #18181b); }
        label.disabled { color: var(--skyra-text-subtle, #a1a1aa); }
        .grid { display: flex; gap: 0.75rem; align-items: center; }
        .grid > * { flex: 1; }
        .divider { font-weight: 500; color: var(--skyra-text-muted, #71717a); flex: 0 0 auto; }
        .helper-text { font-size: 0.78rem; color: var(--skyra-text-muted, #71717a); }
        .error-text { display: inline-flex; items-align: center; gap: 4px; font-size: 0.78rem; color: var(--skyra-danger, #ef4444); }
      </style>
      <div class="container">
        <label id="lbl"></label>
        <div class="grid">
          <skyra-tech-time-field id="start-tf" aria-label="Start time"></skyra-tech-time-field>
          <span class="divider">to</span>
          <skyra-tech-time-field id="end-tf" aria-label="End time"></skyra-tech-time-field>
        </div>
        <div id="msg"></div>
      </div>
    `;
    this._startField = this._shadowRoot.getElementById('start-tf') as HTMLElement;
    this._endField = this._shadowRoot.getElementById('end-tf') as HTMLElement;
  }

  private _setupListeners() {
    this._startField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const s = custom.detail.value;
      const e_val = this.value.includes(',') ? this.value.split(',')[1] : '';
      const newVal = (s || e_val) ? `${s},${e_val}` : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });
    this._endField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const e_val = custom.detail.value;
      const s = this.value.split(',')[0] || '';
      const newVal = (s || e_val) ? `${s},${e_val}` : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });
  }

  private _updateUI() {
    if (!this._shadowRoot.querySelector('.container')) return;

    const lbl = this._shadowRoot.getElementById('lbl') as HTMLLabelElement;
    const msg = this._shadowRoot.getElementById('msg') as HTMLDivElement;

    if (this.label) {
      lbl.style.display = 'block';
      lbl.innerHTML = `${this.label}${this.required ? '<span style="color:var(--skyra-danger)">*</span>' : ''}`;
      lbl.className = this.disabled ? 'disabled' : '';
    } else {
      lbl.style.display = 'none';
    }

    if (this.error) {
      msg.innerHTML = `<span class="error-text">${icons.alert} ${this.error}</span>`;
    } else if (this.helperText) {
      msg.innerHTML = `<span class="helper-text">${this.helperText}</span>`;
    } else {
      msg.innerHTML = '';
    }

    const parts = this.value.split(',');
    const s = parts[0] || '';
    const e_val = parts[1] || '';
    if (s) this._startField.setAttribute('value', s); else this._startField.removeAttribute('value');
    if (e_val) this._endField.setAttribute('value', e_val); else this._endField.removeAttribute('value');
    
    if (this.disabled) {
       this._startField.setAttribute('disabled', '');
       this._endField.setAttribute('disabled', '');
    } else {
       this._startField.removeAttribute('disabled');
       this._endField.removeAttribute('disabled');
    }

    this._startField.setAttribute('format', this.format);
    this._endField.setAttribute('format', this.format);
    
    if (this.required && !this.value) {
      if (this._internals && typeof this._internals.setValidity === 'function') {
      this._internals.setValidity({ valueMissing: true }, 'Start and end times are required');
    }

    } else {
      if (this._internals && typeof this._internals.setValidity === 'function') {
      this._internals.setValidity({});
    }

    }
  }

  public checkValidity() {
    if (this._internals && typeof (this._internals as any).checkValidity === 'function') {
      return (this._internals as any).checkValidity();
    }
    if (this.required && (!this.value || this.value.split(',').length < 2 || !this.value.split(',')[0] || !this.value.split(',')[1])) return false;
    return true;
  }

  public reportValidity() {
    if (this._internals && typeof (this._internals as any).reportValidity === 'function') {
      return (this._internals as any).reportValidity();
    }
    return this.checkValidity();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-time-range-field')) {
  customElements.define('skyra-tech-time-range-field', SkyraTechTimeRangeField);
}