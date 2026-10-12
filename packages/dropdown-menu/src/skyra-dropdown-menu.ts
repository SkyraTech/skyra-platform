import { dropdownStyles } from './skyra-dropdown-menu.css.js';
import {
  computePopoverPosition,
  PopoverPlacement,
  PopoverAlign,
  PositionResult,
} from '@skyra-tech-platform/popover';
import type { SkyraDropdownItemElement } from './skyra-dropdown-item.js';

let dropdownIdCounter = 0;

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export interface DropdownMenuItemConfig {
  id?: string;
  type?: 'item' | 'separator' | 'group' | 'checkbox' | 'radio';
  label?: string | any;
  value?: string;
  icon?: any;
  trailing?: any;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  items?: DropdownMenuItemConfig[];
}

export class SkyraDropdownMenuElement extends BaseClass {
  private _boundHandleTriggerClick: EventListener;
  private _boundHandleTriggerKeyDown: EventListener;
  private _boundHandleDocumentPointerDown: EventListener;
  private _boundHandleDocumentKeyDown: EventListener;
  private _boundHandleScrollOrResize: EventListener;
  private _boundHandleItemSelect: EventListener;

  private _triggerWrapper: HTMLDivElement | null = null;
  private _panelEl: HTMLDivElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _rafId: number | null = null;
  private _instanceId: string;
  private _itemsConfig: DropdownMenuItemConfig[] | null = null;

  constructor() {
    super();
    this._instanceId = `skyra-dropdown-${++dropdownIdCounter}`;
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }

    this._boundHandleTriggerClick = this._handleTriggerClick.bind(this) as EventListener;
    this._boundHandleTriggerKeyDown = this._handleTriggerKeyDown.bind(this) as EventListener;
    this._boundHandleDocumentPointerDown = this._handleDocumentPointerDown.bind(this) as EventListener;
    this._boundHandleDocumentKeyDown = this._handleDocumentKeyDown.bind(this) as EventListener;
    this._boundHandleScrollOrResize = this._handleScrollOrResize.bind(this) as EventListener;
    this._boundHandleItemSelect = this._handleItemSelect.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return [
      'open',
      'placement',
      'align',
      'offset',
      'viewport-padding',
      'close-on-select',
      'close-on-outside-click',
      'close-on-escape',
      'disabled',
      'restore-focus',
      'menu-width',
      'menu-max-width',
      'menu-min-width',
      'aria-label',
    ];
  }

  // --- Getters & Setters ---

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    if (val) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get placement(): PopoverPlacement {
    return (this.getAttribute('placement') as PopoverPlacement) || 'bottom';
  }
  set placement(val: PopoverPlacement) {
    this.setAttribute('placement', val);
  }

  get align(): PopoverAlign {
    return (this.getAttribute('align') as PopoverAlign) || 'start';
  }
  set align(val: PopoverAlign) {
    this.setAttribute('align', val);
  }

  get offset(): number {
    const val = this.getAttribute('offset');
    return val !== null ? Number(val) : 6;
  }
  set offset(val: number) {
    this.setAttribute('offset', String(val));
  }

  get viewportPadding(): number {
    const val = this.getAttribute('viewport-padding');
    return val !== null ? Number(val) : 8;
  }
  set viewportPadding(val: number) {
    this.setAttribute('viewport-padding', String(val));
  }

  get closeOnSelect(): boolean {
    const val = this.getAttribute('close-on-select');
    return val !== null ? val !== 'false' : true;
  }
  set closeOnSelect(val: boolean) {
    this.setAttribute('close-on-select', String(val));
  }

  get closeOnOutsideClick(): boolean {
    const val = this.getAttribute('close-on-outside-click');
    return val !== null ? val !== 'false' : true;
  }
  set closeOnOutsideClick(val: boolean) {
    this.setAttribute('close-on-outside-click', String(val));
  }

  get closeOnEscape(): boolean {
    const val = this.getAttribute('close-on-escape');
    return val !== null ? val !== 'false' : true;
  }
  set closeOnEscape(val: boolean) {
    this.setAttribute('close-on-escape', String(val));
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

  get restoreFocus(): boolean {
    const val = this.getAttribute('restore-focus');
    return val !== null ? val !== 'false' : true;
  }
  set restoreFocus(val: boolean) {
    this.setAttribute('restore-focus', String(val));
  }

  get menuWidth(): string | number | null {
    return this.getAttribute('menu-width');
  }
  set menuWidth(val: string | number | null) {
    if (val !== null && val !== undefined) {
      this.setAttribute('menu-width', String(val));
    } else {
      this.removeAttribute('menu-width');
    }
  }

  get menuMaxWidth(): string | number {
    return this.getAttribute('menu-max-width') || 'min(90vw, 320px)';
  }
  set menuMaxWidth(val: string | number) {
    this.setAttribute('menu-max-width', String(val));
  }

  get menuMinWidth(): string | number {
    const val = this.getAttribute('menu-min-width');
    return val !== null ? val : 180;
  }
  set menuMinWidth(val: string | number) {
    this.setAttribute('menu-min-width', String(val));
  }

  get ariaLabel(): string {
    return this.getAttribute('aria-label') || 'Actions menu';
  }
  set ariaLabel(val: string) {
    this.setAttribute('aria-label', val);
  }

  get items(): DropdownMenuItemConfig[] | null {
    return this._itemsConfig;
  }
  set items(val: DropdownMenuItemConfig[] | null) {
    this._itemsConfig = val;
    this._renderDeclarativeItems();
  }

  // --- Lifecycle Callbacks ---

  connectedCallback() {
    this.render();
    this._setupElements();
    this._syncState();
    this.addEventListener('skyra-dropdown-item-select', this._boundHandleItemSelect);
  }

  disconnectedCallback() {
    this._teardownListeners();
    this.removeEventListener('skyra-dropdown-item-select', this._boundHandleItemSelect);
    if (this._triggerWrapper) {
      this._triggerWrapper.removeEventListener('click', this._boundHandleTriggerClick);
      this._triggerWrapper.removeEventListener('keydown', this._boundHandleTriggerKeyDown);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'open') {
      this._syncState();
    } else if (name === 'disabled') {
      if (this.disabled && this.open) {
        this.open = false;
      }
      this._updateAriaAttributes();
    } else if (name === 'aria-label' && this._panelEl) {
      this._panelEl.setAttribute('aria-label', newValue || 'Actions menu');
    } else if (this.open) {
      this.recomputePosition();
    }
  }

  // --- Public Methods ---

  public show() {
    if (this.disabled || this.open) return;
    this.open = true;
  }

  public hide(reason: string = 'programmatic') {
    if (!this.open) return;
    this._closeWithReason(reason);
  }

  public toggle() {
    if (this.disabled) return;
    if (this.open) {
      this.hide('toggle');
    } else {
      this.show();
    }
  }

  public recomputePosition(): PositionResult | null {
    if (!this.open || !this._triggerWrapper || !this._panelEl) return null;

    const anchorRect = this._triggerWrapper.getBoundingClientRect();
    const panelRect = this._panelEl.getBoundingClientRect();

    const result = computePopoverPosition({
      anchorRect,
      floatingRect: {
        width: panelRect.width || this._panelEl.offsetWidth,
        height: panelRect.height || this._panelEl.offsetHeight,
      },
      placement: this.placement,
      align: this.align,
      offset: this.offset,
      viewportPadding: this.viewportPadding,
    });

    this._panelEl.style.top = `${result.top}px`;
    this._panelEl.style.left = `${result.left}px`;
    this._panelEl.setAttribute('data-placement', result.actualPlacement);
    this._panelEl.setAttribute('data-align', result.actualAlign);

    return result;
  }

  // --- Private Helpers ---

  private render() {
    if (!this.shadowRoot) return;
    const triggerId = `${this._instanceId}-trigger`;
    const panelId = `${this._instanceId}-panel`;

    this.shadowRoot.innerHTML = `
      <style>${dropdownStyles}</style>
      <div
        id="${triggerId}"
        class="skyra-dropdown-trigger"
        role="button"
        tabindex="0"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="${panelId}"
      >
        <slot name="trigger"></slot>
      </div>
      <div
        id="${panelId}"
        class="skyra-dropdown-panel"
        role="menu"
        aria-label="${this.ariaLabel}"
        tabindex="-1"
      >
        <slot></slot>
      </div>
    `;
  }

  private _setupElements() {
    if (!this.shadowRoot) return;
    this._triggerWrapper = this.shadowRoot.querySelector('.skyra-dropdown-trigger');
    this._panelEl = this.shadowRoot.querySelector('.skyra-dropdown-panel');
    this._slotEl = this.shadowRoot.querySelector('slot:not([name])');

    if (this._triggerWrapper) {
      this._triggerWrapper.addEventListener('click', this._boundHandleTriggerClick);
      this._triggerWrapper.addEventListener('keydown', this._boundHandleTriggerKeyDown);
    }

    if (this._itemsConfig) {
      this._renderDeclarativeItems();
    }
  }

  private _syncState() {
    if (!this._panelEl || !this._triggerWrapper) return;

    const isOpen = this.open;
    this._updateAriaAttributes();

    if (isOpen) {
      this._applyDimensions();
      this._attachActiveListeners();

      this.recomputePosition();
      this._rafId = requestAnimationFrame(() => {
        const result = this.recomputePosition();
        if (result) {
          this.dispatchEvent(
            new CustomEvent('skyra-dropdown-open', {
              detail: { placement: result.actualPlacement, align: result.actualAlign },
              bubbles: true,
              composed: true,
            })
          );
        }

        // Focus first enabled item
        this._focusFirstItem();
      });

      this.dispatchEvent(
        new CustomEvent('skyra-dropdown-change', {
          detail: { open: true },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this._teardownListeners();
    }
  }

  private _closeWithReason(reason: string) {
    this.open = false;

    if (this.restoreFocus) {
      this._restoreFocusToTrigger();
    }

    this.dispatchEvent(
      new CustomEvent('skyra-dropdown-close', {
        detail: { reason },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent('skyra-dropdown-change', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _restoreFocusToTrigger() {
    if (!this._triggerWrapper) return;
    const focusable = this.querySelector<HTMLElement>('button, [tabindex="0"], a') || this._triggerWrapper;
    focusable?.focus?.();
  }

  private _applyDimensions() {
    if (!this._panelEl) return;

    if (this.menuWidth) {
      this._panelEl.style.width = typeof this.menuWidth === 'number' ? `${this.menuWidth}px` : this.menuWidth;
    } else {
      this._panelEl.style.width = '';
    }

    if (this.menuMaxWidth) {
      this._panelEl.style.maxWidth =
        typeof this.menuMaxWidth === 'number' ? `${this.menuMaxWidth}px` : this.menuMaxWidth;
    }

    if (this.menuMinWidth) {
      this._panelEl.style.minWidth =
        typeof this.menuMinWidth === 'number' ? `${this.menuMinWidth}px` : `${this.menuMinWidth}px`;
    }
  }

  private _updateAriaAttributes() {
    if (this._triggerWrapper) {
      this._triggerWrapper.setAttribute('aria-expanded', String(this.open));
      if (this.disabled) {
        this._triggerWrapper.setAttribute('aria-disabled', 'true');
      } else {
        this._triggerWrapper.removeAttribute('aria-disabled');
      }
    }
  }

  private _getMenuItems(): HTMLElement[] {
    // Search both light DOM children and panel content
    const items: HTMLElement[] = [];
    const elements = Array.from(this.querySelectorAll<HTMLElement>(
      'skyra-dropdown-item, skyra-tech-dropdown-item, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], button'
    ));

    for (const el of elements) {
      const isDisabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
      if (!isDisabled && !el.closest('[slot="trigger"]')) {
        items.push(el);
      }
    }

    return items;
  }

  private _focusFirstItem() {
    const items = this._getMenuItems();
    if (items.length > 0) {
      this._focusItem(items[0]);
    }
  }

  private _focusLastItem() {
    const items = this._getMenuItems();
    if (items.length > 0) {
      this._focusItem(items[items.length - 1]);
    }
  }

  private _focusItem(item: HTMLElement) {
    if ('focusItem' in item && typeof (item as any).focusItem === 'function') {
      (item as any).focusItem();
    } else {
      item.focus();
    }
  }

  private _attachActiveListeners() {
    if (typeof window === 'undefined') return;

    document.addEventListener('pointerdown', this._boundHandleDocumentPointerDown, true);
    document.addEventListener('mousedown', this._boundHandleDocumentPointerDown, true);
    document.addEventListener('touchstart', this._boundHandleDocumentPointerDown, true);
    document.addEventListener('keydown', this._boundHandleDocumentKeyDown, true);
    window.addEventListener('resize', this._boundHandleScrollOrResize, { passive: true });
    window.addEventListener('scroll', this._boundHandleScrollOrResize, { capture: true, passive: true });

    if (typeof ResizeObserver !== 'undefined' && this._panelEl) {
      this._resizeObserver = new ResizeObserver(() => {
        this.recomputePosition();
      });
      this._resizeObserver.observe(this._panelEl);
    }
  }

  private _teardownListeners() {
    if (typeof window === 'undefined') return;

    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    document.removeEventListener('pointerdown', this._boundHandleDocumentPointerDown, true);
    document.removeEventListener('mousedown', this._boundHandleDocumentPointerDown, true);
    document.removeEventListener('touchstart', this._boundHandleDocumentPointerDown, true);
    document.removeEventListener('keydown', this._boundHandleDocumentKeyDown, true);
    window.removeEventListener('resize', this._boundHandleScrollOrResize);
    window.removeEventListener('scroll', this._boundHandleScrollOrResize, { capture: true });

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  private _handleTriggerClick(e: Event) {
    if (this.disabled) return;
    this.toggle();
  }

  private _handleTriggerKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      if (!this.open) {
        e.preventDefault();
        this.show();
      }
    } else if (e.key === 'Escape' && this.open) {
      e.preventDefault();
      this.hide('escape');
    }
  }

  private _handleDocumentPointerDown(e: Event) {
    if (!this.open || !this.closeOnOutsideClick) return;

    const target = e.target as Node | null;
    if (e.composedPath) {
      const path = e.composedPath();
      if (path.includes(this) || (this._panelEl && path.includes(this._panelEl))) {
        return;
      }
    } else if (target && (this.contains(target) || (this._panelEl && this._panelEl.contains(target)))) {
      return;
    }

    this._closeWithReason('outside-click');
  }

  private _handleDocumentKeyDown(e: KeyboardEvent) {
    if (!this.open) return;

    if (e.key === 'Escape' && this.closeOnEscape) {
      e.preventDefault();
      e.stopPropagation();
      this._closeWithReason('escape');
      return;
    }

    if (e.key === 'Tab') {
      this._closeWithReason('tab');
      return;
    }

    const items = this._getMenuItems();
    if (items.length === 0) return;

    const activeEl = document.activeElement as HTMLElement;
    let currentIndex = items.findIndex((it) => it === activeEl || it.contains(activeEl) || it.shadowRoot?.contains(activeEl));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      this._focusItem(items[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      this._focusItem(items[prevIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this._focusFirstItem();
    } else if (e.key === 'End') {
      e.preventDefault();
      this._focusLastItem();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentIndex >= 0 && currentIndex < items.length) {
        const item = items[currentIndex];
        e.preventDefault();
        if ('triggerSelect' in item && typeof (item as any).triggerSelect === 'function') {
          (item as any).triggerSelect();
        } else {
          item.click();
        }
      }
    }
  }

  private _handleItemSelect(e: Event) {
    const detail = (e as CustomEvent).detail;
    this.dispatchEvent(
      new CustomEvent('skyra-dropdown-select', {
        bubbles: true,
        composed: true,
        detail,
      })
    );

    if (this.closeOnSelect) {
      this._closeWithReason('item-select');
    }
  }

  private _handleScrollOrResize() {
    if (!this.open) return;
    this.recomputePosition();
  }

  private _renderDeclarativeItems() {
    if (!this._itemsConfig) return;

    // Remove existing non-trigger children
    const existing = Array.from(this.querySelectorAll(':not([slot="trigger"])'));
    existing.forEach((node) => node.remove());

    const renderConfigs = (configs: DropdownMenuItemConfig[], parent: HTMLElement) => {
      configs.forEach((cfg) => {
        if (cfg.type === 'separator') {
          const sep = document.createElement('skyra-dropdown-separator');
          parent.appendChild(sep);
        } else if (cfg.type === 'group' && cfg.items) {
          const grp = document.createElement('skyra-dropdown-group');
          if (cfg.label) grp.setAttribute('label', String(cfg.label));
          renderConfigs(cfg.items, grp);
          parent.appendChild(grp);
        } else {
          const item = document.createElement('skyra-dropdown-item') as SkyraDropdownItemElement;
          item.type = cfg.type === 'checkbox' ? 'checkbox' : cfg.type === 'radio' ? 'radio' : 'item';
          if (cfg.value) item.value = cfg.value;
          if (cfg.label) item.textContent = String(cfg.label);
          if (cfg.shortcut) item.shortcut = cfg.shortcut;
          if (cfg.disabled) item.disabled = true;
          if (cfg.destructive) item.destructive = true;
          if (cfg.checked) item.checked = true;

          if (cfg.onClick) {
            item.addEventListener('skyra-dropdown-item-select', () => cfg.onClick?.());
          }
          if (cfg.onCheckedChange) {
            item.addEventListener('skyra-dropdown-item-select', (e: any) => {
              cfg.onCheckedChange?.(e.detail.checked);
            });
          }

          parent.appendChild(item);
        }
      });
    };

    renderConfigs(this._itemsConfig, this);
  }
}

export class SkyraTechDropdownMenuElement extends SkyraDropdownMenuElement {}

// Safe Custom Elements registration
if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-dropdown-menu')) {
    customElements.define('skyra-dropdown-menu', SkyraDropdownMenuElement);
  }
  if (!customElements.get('skyra-tech-dropdown-menu')) {
    customElements.define('skyra-tech-dropdown-menu', SkyraTechDropdownMenuElement);
  }
}
