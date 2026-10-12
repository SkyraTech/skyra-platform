import { itemStyles, separatorStyles, groupStyles } from './skyra-dropdown-menu.css.js';

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export type DropdownItemType = 'item' | 'checkbox' | 'radio';

export class SkyraDropdownItemElement extends BaseClass {
  private _buttonEl: HTMLButtonElement | null = null;
  private _boundHandleClick: EventListener;

  constructor() {
    super();
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open', delegatesFocus: true });
    }
    this._boundHandleClick = this._handleClick.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['value', 'type', 'checked', 'disabled', 'destructive', 'shortcut', 'focused'];
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }
  set value(val: string) {
    this.setAttribute('value', val);
  }

  get type(): DropdownItemType {
    return (this.getAttribute('type') as DropdownItemType) || 'item';
  }
  set type(val: DropdownItemType) {
    this.setAttribute('type', val);
  }

  get checked(): boolean {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    if (val) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get destructive(): boolean {
    return this.hasAttribute('destructive');
  }
  set destructive(val: boolean) {
    if (val) {
      this.setAttribute('destructive', '');
    } else {
      this.removeAttribute('destructive');
    }
  }

  get shortcut(): string {
    return this.getAttribute('shortcut') || '';
  }
  set shortcut(val: string) {
    this.setAttribute('shortcut', val);
  }

  get focused(): boolean {
    return this.hasAttribute('focused');
  }
  set focused(val: boolean) {
    if (val) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }
  }

  connectedCallback() {
    this.render();
    this._buttonEl = this.shadowRoot?.querySelector('button') || null;
    if (this._buttonEl) {
      this._buttonEl.addEventListener('click', this._boundHandleClick);
    }
    this._syncRoleAndAria();
  }

  disconnectedCallback() {
    if (this._buttonEl) {
      this._buttonEl.removeEventListener('click', this._boundHandleClick);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'type' || name === 'checked' || name === 'disabled') {
      this._syncRoleAndAria();
    }
    if (name === 'focused' && this._buttonEl) {
      if (this.focused) {
        this._buttonEl.focus();
      }
    }
    if (name === 'shortcut') {
      const sc = this.shadowRoot?.querySelector('.skyra-menu-item-shortcut');
      if (sc) sc.textContent = this.shortcut;
    }
  }

  override focus(options?: FocusOptions) {
    if (this._buttonEl) {
      this._buttonEl.focus(options);
    } else {
      super.focus(options);
    }
  }

  public focusItem() {
    this.focus();
  }

  public triggerSelect() {
    if (this.disabled) return;
    if (this.type === 'checkbox') {
      this.checked = !this.checked;
    } else if (this.type === 'radio') {
      this.checked = true;
    }

    this.dispatchEvent(
      new CustomEvent('skyra-dropdown-item-select', {
        bubbles: true,
        composed: true,
        detail: {
          item: this,
          value: this.value,
          checked: this.checked,
          type: this.type,
        },
      })
    );
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.triggerSelect();
  }

  private _syncRoleAndAria() {
    if (!this._buttonEl) return;
    let role = 'menuitem';
    if (this.type === 'checkbox') role = 'menuitemcheckbox';
    if (this.type === 'radio') role = 'menuitemradio';

    this._buttonEl.setAttribute('role', role);
    this.setAttribute('role', role);

    if (this.type === 'checkbox' || this.type === 'radio') {
      this._buttonEl.setAttribute('aria-checked', String(this.checked));
      this.setAttribute('aria-checked', String(this.checked));
      const ind = this.shadowRoot?.querySelector('.skyra-menu-item-indicator');
      if (ind) {
        ind.innerHTML = this.type === 'checkbox'
          ? (this.checked ? '✓' : '')
          : (this.checked ? '●' : '');
      }
    }

    if (this.disabled) {
      this._buttonEl.setAttribute('aria-disabled', 'true');
      this._buttonEl.disabled = true;
    } else {
      this._buttonEl.removeAttribute('aria-disabled');
      this._buttonEl.disabled = false;
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    const isIndicator = this.type === 'checkbox' || this.type === 'radio';

    this.shadowRoot.innerHTML = `
      <style>${itemStyles}</style>
      <button
        type="button"
        class="skyra-menu-item-button"
        tabindex="-1"
      >
        ${isIndicator ? `<span class="skyra-menu-item-indicator">${this.type === 'checkbox' ? (this.checked ? '✓' : '') : (this.checked ? '●' : '')}</span>` : ''}
        <span class="skyra-menu-item-icon"><slot name="icon"></slot></span>
        <span class="skyra-menu-item-content"><slot></slot></span>
        <span class="skyra-menu-item-shortcut">${this.shortcut}</span>
        <span class="skyra-menu-item-trailing"><slot name="trailing"></slot></span>
      </button>
    `;
  }
}

export class SkyraTechDropdownItemElement extends SkyraDropdownItemElement {}

export class SkyraDropdownSeparatorElement extends BaseClass {
  constructor() {
    super();
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'separator');
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<style>${separatorStyles}</style>`;
    }
  }
}

export class SkyraTechDropdownSeparatorElement extends SkyraDropdownSeparatorElement {}

export class SkyraDropdownGroupElement extends BaseClass {
  constructor() {
    super();
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  static get observedAttributes() {
    return ['label'];
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  connectedCallback() {
    this.setAttribute('role', 'group');
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    }
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'label') {
      if (newValue) this.setAttribute('aria-label', newValue);
      const lbl = this.shadowRoot?.querySelector('.skyra-menu-group-label');
      if (lbl) lbl.textContent = newValue || '';
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${groupStyles}</style>
      ${this.label ? `<div class="skyra-menu-group-label">${this.label}</div>` : ''}
      <slot></slot>
    `;
  }
}

export class SkyraTechDropdownGroupElement extends SkyraDropdownGroupElement {}

// Safe Custom Elements registration
if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-dropdown-item')) {
    customElements.define('skyra-dropdown-item', SkyraDropdownItemElement);
  }
  if (!customElements.get('skyra-tech-dropdown-item')) {
    customElements.define('skyra-tech-dropdown-item', SkyraTechDropdownItemElement);
  }
  if (!customElements.get('skyra-dropdown-separator')) {
    customElements.define('skyra-dropdown-separator', SkyraDropdownSeparatorElement);
  }
  if (!customElements.get('skyra-tech-dropdown-separator')) {
    customElements.define('skyra-tech-dropdown-separator', SkyraTechDropdownSeparatorElement);
  }
  if (!customElements.get('skyra-dropdown-group')) {
    customElements.define('skyra-dropdown-group', SkyraDropdownGroupElement);
  }
  if (!customElements.get('skyra-tech-dropdown-group')) {
    customElements.define('skyra-tech-dropdown-group', SkyraTechDropdownGroupElement);
  }
}
