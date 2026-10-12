import { itemStyles, separatorStyles, groupStyles } from './skyra-context-menu.css.js';

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export const CONTEXT_MENU_ITEM_SELECT_EVENT = 'skyra-context-menu-item-select';
export const CONTEXT_MENU_CHECKED_CHANGE_EVENT = 'skyra-context-menu-checked-change';

export type ContextMenuItemType = 'item' | 'checkbox' | 'radio';

export class SkyraContextMenuItemElement extends BaseClass {
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

  get type(): ContextMenuItemType {
    return (this.getAttribute('type') as ContextMenuItemType) || 'item';
  }
  set type(val: ContextMenuItemType) {
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
    queueMicrotask(() => {
      this._syncRoleAndAria();
    });
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

    const detail = {
      item: this,
      value: this.value,
      checked: this.checked,
      type: this.type,
    };

    this.dispatchEvent(
      new CustomEvent('skyra-context-menu-item-select', {
        bubbles: true,
        composed: true,
        detail,
      })
    );

    // Also dispatch generic item select event for interop
    this.dispatchEvent(
      new CustomEvent('skyra-dropdown-item-select', {
        bubbles: true,
        composed: true,
        detail,
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
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', role);
    }

    if (this.type === 'checkbox' || this.type === 'radio') {
      this._buttonEl.setAttribute('aria-checked', String(this.checked));
      if (!this.hasAttribute('aria-checked')) {
        this.setAttribute('aria-checked', String(this.checked));
      }
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

export class SkyraTechContextMenuItemElement extends SkyraContextMenuItemElement {}

export class SkyraContextMenuSeparatorElement extends BaseClass {
  constructor() {
    super();
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  connectedCallback() {
    queueMicrotask(() => {
      if (!this.hasAttribute('role')) this.setAttribute('role', 'separator');
      if (!this.hasAttribute('aria-orientation')) this.setAttribute('aria-orientation', 'horizontal');
    });
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<style>${separatorStyles}</style>`;
    }
  }
}

export class SkyraTechContextMenuSeparatorElement extends SkyraContextMenuSeparatorElement {}

export class SkyraContextMenuGroupElement extends BaseClass {
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
    queueMicrotask(() => {
      if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
      if (this.label && !this.hasAttribute('aria-label')) {
        this.setAttribute('aria-label', this.label);
      }
    });
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'label') {
      if (newValue) {
        this.setAttribute('aria-label', newValue);
      } else {
        this.removeAttribute('aria-label');
      }
      const labelEl = this.shadowRoot?.querySelector('.skyra-menu-group-label');
      if (labelEl) {
        labelEl.textContent = newValue || '';
      }
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

export class SkyraTechContextMenuGroupElement extends SkyraContextMenuGroupElement {}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-context-menu-item')) {
    customElements.define('skyra-context-menu-item', SkyraContextMenuItemElement);
  }
  if (!customElements.get('skyra-tech-context-menu-item')) {
    customElements.define('skyra-tech-context-menu-item', SkyraTechContextMenuItemElement);
  }
  if (!customElements.get('skyra-context-menu-separator')) {
    customElements.define('skyra-context-menu-separator', SkyraContextMenuSeparatorElement);
  }
  if (!customElements.get('skyra-tech-context-menu-separator')) {
    customElements.define('skyra-tech-context-menu-separator', SkyraTechContextMenuSeparatorElement);
  }
  if (!customElements.get('skyra-context-menu-group')) {
    customElements.define('skyra-context-menu-group', SkyraContextMenuGroupElement);
  }
  if (!customElements.get('skyra-tech-context-menu-group')) {
    customElements.define('skyra-tech-context-menu-group', SkyraTechContextMenuGroupElement);
  }
}
