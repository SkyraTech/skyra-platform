import { icons } from './utils';
import './skyra-tech-date-field';
import './skyra-tech-time-field';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechDateTimeField extends BaseClass {
  static get observedAttributes() {
    return ['value', 'name', 'min', 'max', 'disabled', 'required', 'label', 'helper-text', 'error', 'time-format'];
  }
  static formAssociated = true;

  private _internals: ElementInternals;
  private _shadowRoot: ShadowRoot;
  private _dateField!: HTMLElement;
  private _timeField!: HTMLElement;

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
  get dateValue() { return this.value.includes('T') ? this.value.split('T')[0] : this.value; }
  get timeValue() { return this.value.includes('T') ? this.value.split('T')[1] || '' : ''; }
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
  get min() { return this.getAttribute('min') || ''; }
  get max() { return this.getAttribute('max') || ''; }
  get timeFormat() { return this.getAttribute('time-format') || '12h'; }

  private _render() {
    this._shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: var(--skyra-font-body, system-ui, sans-serif); }
        .container { display: flex; flex-direction: column; gap: 0.375rem; width: 100%; }
        label { font-size: 0.875rem; font-weight: 500; color: var(--skyra-text, #18181b); }
        label.disabled { color: var(--skyra-text-subtle, #a1a1aa); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; align-items: flex-start; }
        .helper-text { font-size: 0.78rem; color: var(--skyra-text-muted, #71717a); }
        .error-text { display: inline-flex; items-align: center; gap: 4px; font-size: 0.78rem; color: var(--skyra-danger, #ef4444); }
      </style>
      <div class="container">
        <label id="lbl"></label>
        <div class="grid">
          <skyra-tech-date-field id="df"></skyra-tech-date-field>
          <skyra-tech-time-field id="tf"></skyra-tech-time-field>
        </div>
        <div id="msg"></div>
      </div>
    `;
    this._dateField = this._shadowRoot.getElementById('df') as HTMLElement;
    this._timeField = this._shadowRoot.getElementById('tf') as HTMLElement;
  }

  private _setupListeners() {
    this._dateField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const d = custom.detail.value;
      const t = this.value.includes('T') ? this.value.split('T')[1] : '';
      const newVal = d ? (t ? `${d}T${t}` : d) : '';
      if (newVal !== this.value) {
        this.value = newVal;
        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));
      }
    });
    this._timeField.addEventListener('skyra-change', (e: Event) => {
      e.stopPropagation();
      const custom = e as CustomEvent;
      const t = custom.detail.value;
      const d = this.value.split('T')[0] || '';
      const newVal = d ? (t ? `${d}T${t}` : d) : '';
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

    this._dateField.setAttribute('value', this.dateValue);
    this._timeField.setAttribute('value', this.timeValue);
    
    if (this.disabled) {
       this._dateField.setAttribute('disabled', '');
       this._timeField.setAttribute('disabled', '');
    } else {
       this._dateField.removeAttribute('disabled');
       this._timeField.removeAttribute('disabled');
    }

    if (this.required) {
       this._dateField.setAttribute('required', '');
    } else {
       this._dateField.removeAttribute('required');
    }

    this._timeField.setAttribute('format', this.timeFormat);
    if (this.min) this._dateField.setAttribute('min', this.min);
    if (this.max) this._dateField.setAttribute('max', this.max);
    
    if (this.required && !this.value) {
      if (this._internals && typeof this._internals.setValidity === 'function') {
      this._internals.setValidity({ valueMissing: true }, 'Date and time are required');
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
    if (this.required && !this.value) return false;
    return true;
  }

  public reportValidity() {
    if (this._internals && typeof (this._internals as any).reportValidity === 'function') {
      return (this._internals as any).reportValidity();
    }
    return this.checkValidity();
  }
}
if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-date-time-field')) {
  customElements.define('skyra-tech-date-time-field', SkyraTechDateTimeField);
}
