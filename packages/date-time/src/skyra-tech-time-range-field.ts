import { icons } from './utils';
import './skyra-tech-time-field';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechTimeRangeField extends BaseClass {
  static get observedAttributes() {
    return ['start-value', 'end-value', 'format', 'minute-step', 'disabled', 'required', 'label', 'helper-text', 'error'];
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
      if (name === 'start-value' || name === 'end-value') {
        const val = { start: this.startValue, end: this.endValue };
        this._internals.setFormValue(JSON.stringify(val));
      }
      this._updateUI();
    }
  }

  get startValue() { return this.getAttribute('start-value') || ''; }
  set startValue(v) { if (v) this.setAttribute('start-value', v); else this.removeAttribute('start-value'); }
  get endValue() { return this.getAttribute('end-value') || ''; }
  set endValue(v) { if (v) this.setAttribute('end-value', v); else this.removeAttribute('end-value'); }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  get label() { return this.getAttribute('label') || ''; }
  get helperText() { return this.getAttribute('helper-text') || ''; }
  get error() { return this.getAttribute('error') || ''; }
  get format() { return this.getAttribute('format') || '12h'; }

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
      const custom = e as CustomEvent;
      this.startValue = custom.detail.value;
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: { start: this.startValue, end: this.endValue } }, bubbles: true }));
    });
    this._endField.addEventListener('skyra-change', (e: Event) => {
      const custom = e as CustomEvent;
      this.endValue = custom.detail.value;
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: { start: this.startValue, end: this.endValue } }, bubbles: true }));
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

    this._startField.setAttribute('value', this.startValue);
    this._endField.setAttribute('value', this.endValue);
    
    if (this.disabled) {
       this._startField.setAttribute('disabled', '');
       this._endField.setAttribute('disabled', '');
    } else {
       this._startField.removeAttribute('disabled');
       this._endField.removeAttribute('disabled');
    }

    this._startField.setAttribute('format', this.format);
    this._endField.setAttribute('format', this.format);
    
    if (this.required && (!this.startValue || !this.endValue)) {
      this._internals.setValidity({ valueMissing: true }, 'Start and end times are required');
    } else {
      this._internals.setValidity({});
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-time-range-field')) {
  customElements.define('skyra-tech-time-range-field', SkyraTechTimeRangeField);
}