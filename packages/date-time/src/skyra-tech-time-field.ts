import { icons } from './utils';
import { timeFieldCss } from './time-field.css';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechTimeField extends BaseClass {
  static get observedAttributes() {
    return ['value', 'format', 'minute-step', 'disabled', 'required', 'clearable', 'label', 'helper-text', 'error', 'invalid'];
  }
  static formAssociated = true;

  private _internals: ElementInternals;
  private _shadowRoot: ShadowRoot;
  
  private _hourBtn!: HTMLButtonElement;
  private _minuteBtn!: HTMLButtonElement;
  private _amBtn!: HTMLButtonElement | null;
  private _pmBtn!: HTMLButtonElement | null;
  private _clearBtn!: HTMLButtonElement;
  
  private _hourPopover!: HTMLDivElement;
  private _minutePopover!: HTMLDivElement;

  private _openPopover: 'hour' | 'minute' | null = null;
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
        if (this._internals && typeof this._internals.setFormValue === 'function') {
      this._internals.setFormValue(newVal);
    }

      }
      this._updateUI();
    }
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  get format() { return this.getAttribute('format') || '12h'; }
  set format(v) { if (v) this.setAttribute('format', v); else this.removeAttribute('format'); }
  get minuteStep() { return parseInt(this.getAttribute('minute-step') || '5', 10); }
  set minuteStep(v) { this.setAttribute('minute-step', String(v)); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  set required(v) { if (v) this.setAttribute('required', ''); else this.removeAttribute('required'); }
  get clearable() { return this.getAttribute('clearable') !== 'false'; }
  set clearable(v: boolean) { if (!v) this.setAttribute('clearable', 'false'); else this.removeAttribute('clearable'); }
  get label() { return this.getAttribute('label') || ''; }
  set label(v) { if (v) this.setAttribute('label', v); else this.removeAttribute('label'); }
  get helperText() { return this.getAttribute('helper-text') || ''; }
  set helperText(v) { if (v) this.setAttribute('helper-text', v); else this.removeAttribute('helper-text'); }
  get error() { return this.getAttribute('error') || ''; }
  set error(v) { if (v) this.setAttribute('error', v); else this.removeAttribute('error'); }
  get invalid() { return this.hasAttribute('invalid'); }
  set invalid(v) { if (v) this.setAttribute('invalid', ''); else this.removeAttribute('invalid'); }

  private get _parsedValue() {
    let hours = this.format === '12h' ? '12' : '00';
    let minutes = '00';
    let period = 'AM';
    
    if (this.value) {
      if (this.format === '12h') {
        const parts = this.value.trim().split(' ');
        if (parts[0]) {
          const [h, m] = parts[0].split(':');
          if (h) hours = h.padStart(2, '0');
          if (m) minutes = m.padStart(2, '0');
        }
        if (parts[1] === 'AM' || parts[1] === 'PM') {
          period = parts[1];
        }
      } else {
        const [h, m] = this.value.split(':');
        if (h) hours = h.padStart(2, '0');
        if (m) minutes = m.padStart(2, '0');
      }
    }
    return { hours, minutes, period };
  }

  private _updateTime(h: string, m: string, p: string) {
    let result = '';
    if (this.format === '12h') {
      result = `${h.padStart(2, '0')}:${m.padStart(2, '0')} ${p}`;
    } else {
      result = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    }
    if (result !== this.value) {
      this.value = result;
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: result }, bubbles: true }));
    }
  }

  private _render() {
    const is12h = this.format === '12h';
    
    this._shadowRoot.innerHTML = `
      <style>${timeFieldCss}</style>
      <div class="container">
        <label id="lbl"></label>
        <div class="inputs-container" id="wrapper">
          <span class="icon">${icons.clock}</span>
          
          <button type="button" class="time-select-btn" id="hour-btn" aria-haspopup="listbox">
            <span id="hour-val">12</span> ${icons.chevronDown}
          </button>
          <div class="popover" id="hour-pop" role="listbox" tabindex="-1"></div>
          
          <span class="colon">:</span>
          
          <button type="button" class="time-select-btn" id="min-btn" aria-haspopup="listbox">
            <span id="min-val">00</span> ${icons.chevronDown}
          </button>
          <div class="popover" id="min-pop" role="listbox" tabindex="-1"></div>
          
          ${is12h ? `
            <div class="am-pm-toggle" id="ampm-toggle">
              <button type="button" class="am-pm-btn" id="am-btn">AM</button>
              <button type="button" class="am-pm-btn" id="pm-btn">PM</button>
            </div>
          ` : ''}

          <button type="button" class="clear-btn" id="clear" aria-label="Clear" style="display:none">
            ${icons.x}
          </button>
        </div>
        <div id="msg"></div>
      </div>
    `;

    this._hourBtn = this._shadowRoot.getElementById('hour-btn') as HTMLButtonElement;
    this._minuteBtn = this._shadowRoot.getElementById('min-btn') as HTMLButtonElement;
    this._hourPopover = this._shadowRoot.getElementById('hour-pop') as HTMLDivElement;
    this._minutePopover = this._shadowRoot.getElementById('min-pop') as HTMLDivElement;
    this._clearBtn = this._shadowRoot.getElementById('clear') as HTMLButtonElement;
    this._amBtn = this._shadowRoot.getElementById('am-btn') as HTMLButtonElement | null;
    this._pmBtn = this._shadowRoot.getElementById('pm-btn') as HTMLButtonElement | null;
  }

  private _populateDropdowns() {
    const minH = this.format === '12h' ? 1 : 0;
    const maxH = this.format === '12h' ? 12 : 23;
    let hHtml = '';
    for (let h = minH; h <= maxH; h++) {
      const s = String(h).padStart(2, '0');
      hHtml += `<button type="button" class="option-btn" data-val="${s}">${s}</button>`;
    }
    this._hourPopover.innerHTML = hHtml;

    let mHtml = '';
    const step = Math.max(1, Math.min(60, this.minuteStep));
    for (let m = 0; m < 60; m += step) {
      const s = String(m).padStart(2, '0');
      mHtml += `<button type="button" class="option-btn" data-val="${s}">${s}</button>`;
    }
    this._minutePopover.innerHTML = mHtml;
  }

  private _setOpen(target: 'hour' | 'minute' | null) {
    if (this.disabled) return;
    this._openPopover = target;
    
    this._hourPopover.classList.remove('open');
    this._minutePopover.classList.remove('open');
    this._hourBtn.setAttribute('aria-expanded', 'false');
    this._minuteBtn.setAttribute('aria-expanded', 'false');
    
    if (target === 'hour') {
      this._hourPopover.classList.add('open');
      this._hourBtn.setAttribute('aria-expanded', 'true');
      
      const val = this._parsedValue.hours;
      const el = this._hourPopover.querySelector(`[data-val="${val}"]`) as HTMLElement;
      if (el) setTimeout(() => { el.scrollIntoView({ block: 'nearest' }); el.focus(); }, 10);
    } else if (target === 'minute') {
      this._minutePopover.classList.add('open');
      this._minuteBtn.setAttribute('aria-expanded', 'true');
      
      const val = this._parsedValue.minutes;
      const el = this._minutePopover.querySelector(`[data-val="${val}"]`) as HTMLElement;
      if (el) setTimeout(() => { el.scrollIntoView({ block: 'nearest' }); el.focus(); }, 10);
    }
  }

  private _setupListeners() {
    // Populate once
    this._populateDropdowns();
    
    // Position adjustments
    const updatePos = () => {
       const w1 = this._hourBtn.getBoundingClientRect();
       const w2 = this._minuteBtn.getBoundingClientRect();
       const container = this._shadowRoot.getElementById('wrapper')?.getBoundingClientRect();
       if (container) {
         this._hourPopover.style.left = `${w1.left - container.left}px`;
         this._minutePopover.style.left = `${w2.left - container.left}px`;
       }
    };
    
    this._hourBtn.addEventListener('click', () => {
      updatePos();
      this._setOpen(this._openPopover === 'hour' ? null : 'hour');
    });
    this._minuteBtn.addEventListener('click', () => {
      updatePos();
      this._setOpen(this._openPopover === 'minute' ? null : 'minute');
    });

    const handleBlur = (e: FocusEvent) => {
      if (!this._ignoreBlur) {
        setTimeout(() => {
          const root = this._shadowRoot;
          if (!root.activeElement || 
              (root.activeElement !== this._hourBtn && root.activeElement !== this._minuteBtn && 
               !this._hourPopover.contains(root.activeElement) && !this._minutePopover.contains(root.activeElement))) {
            this._setOpen(null);
          }
        }, 0);
      }
    };

    this._hourBtn.addEventListener('blur', handleBlur);
    this._minuteBtn.addEventListener('blur', handleBlur);
    this._hourPopover.addEventListener('blur', handleBlur, true);
    this._minutePopover.addEventListener('blur', handleBlur, true);
    
    this._hourPopover.addEventListener('mousedown', () => { this._ignoreBlur = true; });
    this._minutePopover.addEventListener('mousedown', () => { this._ignoreBlur = true; });
    this._hourPopover.addEventListener('mouseup', () => { this._ignoreBlur = false; });
    this._minutePopover.addEventListener('mouseup', () => { this._ignoreBlur = false; });

    const handleSelection = (e: Event, type: 'hour' | 'minute') => {
      const target = e.target as HTMLElement;
      if (target.matches('.option-btn')) {
        const val = target.getAttribute('data-val');
        if (val) {
          const p = this._parsedValue;
          if (type === 'hour') this._updateTime(val, p.minutes, p.period);
          else this._updateTime(p.hours, val, p.period);
        }
        this._setOpen(null);
        if (type === 'hour') this._hourBtn.focus();
        else this._minuteBtn.focus();
      }
    };

    this._hourPopover.addEventListener('click', (e) => handleSelection(e, 'hour'));
    this._minutePopover.addEventListener('click', (e) => handleSelection(e, 'minute'));

    const handleKeyNav = (e: KeyboardEvent, popover: HTMLDivElement) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const active = this._shadowRoot.activeElement as HTMLElement;
        if (active && active.nextElementSibling) (active.nextElementSibling as HTMLElement).focus();
        else if (popover.firstElementChild) (popover.firstElementChild as HTMLElement).focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const active = this._shadowRoot.activeElement as HTMLElement;
        if (active && active.previousElementSibling) (active.previousElementSibling as HTMLElement).focus();
        else if (popover.lastElementChild) (popover.lastElementChild as HTMLElement).focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        (this._shadowRoot.activeElement as HTMLElement)?.click();
      } else if (e.key === 'Escape') {
        this._setOpen(null);
      }
    };

    this._hourPopover.addEventListener('keydown', (e) => handleKeyNav(e, this._hourPopover));
    this._minutePopover.addEventListener('keydown', (e) => handleKeyNav(e, this._minutePopover));

    if (this._amBtn) {
      this._amBtn.addEventListener('click', () => {
        if (this.disabled) return;
        const p = this._parsedValue;
        this._updateTime(p.hours, p.minutes, 'AM');
      });
    }
    if (this._pmBtn) {
      this._pmBtn.addEventListener('click', () => {
        if (this.disabled) return;
        const p = this._parsedValue;
        this._updateTime(p.hours, p.minutes, 'PM');
      });
    }

    this._clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.value = '';
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: '' }, bubbles: true }));
    });
  }

  private _updateUI() {
    if (!this._shadowRoot.querySelector('.container')) return;
    
    // Check if format changed requires re-render
    if (this.format === '12h' && !this._amBtn) { this._render(); this._setupListeners(); }
    if (this.format === '24h' && this._amBtn) { this._render(); this._setupListeners(); }

    const lbl = this._shadowRoot.getElementById('lbl') as HTMLLabelElement;
    const wrapper = this._shadowRoot.getElementById('wrapper') as HTMLDivElement;
    const msg = this._shadowRoot.getElementById('msg') as HTMLDivElement;
    
    if (this.label) {
      lbl.style.display = 'block';
      lbl.innerHTML = `${this.label}${this.required ? '<span style="color:var(--skyra-danger)">*</span>' : ''}`;
      lbl.className = this.disabled ? 'disabled' : '';
    } else {
      lbl.style.display = 'none';
    }

    this._hourBtn.disabled = this.disabled;
    this._minuteBtn.disabled = this.disabled;
    
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

    if (this.clearable && this.value && !this.disabled) {
      this._clearBtn.style.display = 'flex';
    } else {
      this._clearBtn.style.display = 'none';
    }

    const { hours, minutes, period } = this._parsedValue;
    
    const hVal = this._shadowRoot.getElementById('hour-val');
    const mVal = this._shadowRoot.getElementById('min-val');
    if (hVal) hVal.textContent = hours;
    if (mVal) mVal.textContent = minutes;
    
    // Update selected states
    this._hourPopover.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    const hSel = this._hourPopover.querySelector(`[data-val="${hours}"]`);
    if (hSel) hSel.classList.add('selected');
    
    this._minutePopover.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    const mSel = this._minutePopover.querySelector(`[data-val="${minutes}"]`);
    if (mSel) mSel.classList.add('selected');

    if (this._amBtn && this._pmBtn) {
      this._amBtn.disabled = this.disabled;
      this._pmBtn.disabled = this.disabled;
      this._amBtn.classList.toggle('active', period === 'AM');
      this._pmBtn.classList.toggle('active', period === 'PM');
    }

    if (this.required && !this.value) {
      if (this._internals && typeof this._internals.setValidity === 'function') {
      this._internals.setValidity({ valueMissing: true }, 'Time is required');
    }

    } else {
      if (this._internals && typeof this._internals.setValidity === 'function') {
      this._internals.setValidity({});
    }

    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-time-field')) {
  customElements.define('skyra-tech-time-field', SkyraTechTimeField);
}