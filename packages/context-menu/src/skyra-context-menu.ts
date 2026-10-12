import { contextMenuStyles } from './skyra-context-menu.css.js';
import {
  computePopoverPosition,
  PopoverPlacement,
  PopoverAlign,
  PositionResult,
} from '@skyra-tech-platform/popover';
import type { SkyraContextMenuItemElement } from './skyra-context-menu-item.js';

let contextMenuIdCounter = 0;

export const CONTEXT_MENU_SELECT_EVENT = 'skyra-context-menu-select';
export const CONTEXT_MENU_OPEN_EVENT = 'skyra-context-menu-open';
export const CONTEXT_MENU_CLOSE_EVENT = 'skyra-context-menu-close';
export const CONTEXT_MENU_CHANGE_EVENT = 'skyra-context-menu-change';

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export interface ContextMenuItemConfig {
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
  items?: ContextMenuItemConfig[];
}

export class SkyraContextMenuElement extends BaseClass {
  private _boundHandleTargetContextMenu: EventListener;
  private _boundHandleTargetKeyDown: EventListener;
  private _boundHandleDocumentPointerDown: EventListener;
  private _boundHandleDocumentKeyDown: EventListener;
  private _boundHandleWindowScroll: EventListener;
  private _boundHandleItemSelect: EventListener;

  private _targetWrapper: HTMLDivElement | null = null;
  private _panelEl: HTMLDivElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private _rafId: number | null = null;
  private _instanceId: string;
  private _itemsConfig: ContextMenuItemConfig[] | null = null;

  private _virtualX: number = 0;
  private _virtualY: number = 0;

  constructor() {
    super();
    this._instanceId = `skyra-context-menu-${++contextMenuIdCounter}`;
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }

    this._boundHandleTargetContextMenu = this._handleTargetContextMenu.bind(this) as EventListener;
    this._boundHandleTargetKeyDown = this._handleTargetKeyDown.bind(this) as EventListener;
    this._boundHandleDocumentPointerDown = this._handleDocumentPointerDown.bind(this) as EventListener;
    this._boundHandleDocumentKeyDown = this._handleDocumentKeyDown.bind(this) as EventListener;
    this._boundHandleWindowScroll = this._handleWindowScroll.bind(this) as EventListener;
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
      'close-on-scroll',
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
    return val !== null ? Number(val) : 2;
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

  get closeOnScroll(): boolean {
    const val = this.getAttribute('close-on-scroll');
    return val !== null ? val !== 'false' : true;
  }
  set closeOnScroll(val: boolean) {
    this.setAttribute('close-on-scroll', String(val));
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
    return this.getAttribute('menu-max-width') || 'min(90vw, 300px)';
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
    return this.getAttribute('aria-label') || 'Context actions menu';
  }
  set ariaLabel(val: string) {
    this.setAttribute('aria-label', val);
  }

  get items(): ContextMenuItemConfig[] | null {
    return this._itemsConfig;
  }
  set items(val: ContextMenuItemConfig[] | null) {
    this._itemsConfig = val;
    this._renderDeclarativeItems();
  }

  get virtualCoordinates(): { x: number; y: number } {
    return { x: this._virtualX, y: this._virtualY };
  }

  // --- Lifecycle Callbacks ---

  connectedCallback() {
    this.render();
    this._setupElements();
    this._syncState();
    this.addEventListener('skyra-context-menu-item-select', this._boundHandleItemSelect);
    this.addEventListener('skyra-dropdown-item-select', this._boundHandleItemSelect);
  }

  disconnectedCallback() {
    this._teardownListeners();
    this.removeEventListener('skyra-context-menu-item-select', this._boundHandleItemSelect);
    this.removeEventListener('skyra-dropdown-item-select', this._boundHandleItemSelect);
    if (this._targetWrapper) {
      this._targetWrapper.removeEventListener('contextmenu', this._boundHandleTargetContextMenu);
      this._targetWrapper.removeEventListener('keydown', this._boundHandleTargetKeyDown);
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
      this._panelEl.setAttribute('aria-label', newValue || 'Context actions menu');
    } else if (this.open) {
      this.recomputePosition();
    }
  }

  // --- Public Methods ---

  public openAt(x: number, y: number) {
    if (this.disabled) return;
    this._virtualX = x;
    this._virtualY = y;
    this.open = true;
  }

  public show(options?: { x?: number; y?: number }) {
    if (this.disabled || this.open) return;
    if (options && typeof options.x === 'number' && typeof options.y === 'number') {
      this.openAt(options.x, options.y);
    } else {
      const fallback = this._getFallbackCoordinates();
      this.openAt(fallback.x, fallback.y);
    }
  }

  public hide(reason: string = 'programmatic') {
    if (!this.open) return;
    this._closeWithReason(reason);
  }

  public toggle(options?: { x?: number; y?: number }) {
    if (this.disabled) return;
    if (this.open) {
      this.hide('toggle');
    } else {
      this.show(options);
    }
  }

  public recomputePosition(): PositionResult | null {
    if (!this.open || !this._panelEl) return null;

    const floatingWidth = this._panelEl.offsetWidth || 180;
    const floatingHeight = this._panelEl.offsetHeight || 120;

    const result = computePopoverPosition({
      anchorRect: {
        top: this._virtualY,
        bottom: this._virtualY,
        left: this._virtualX,
        right: this._virtualX,
        width: 0,
        height: 0,
      },
      floatingRect: {
        width: floatingWidth,
        height: floatingHeight,
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
    const targetId = `${this._instanceId}-target`;
    const panelId = `${this._instanceId}-panel`;

    this.shadowRoot.innerHTML = `
      <style>${contextMenuStyles}</style>
      <div
        id="${targetId}"
        class="skyra-context-menu-target"
        tabindex="0"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="${panelId}"
      >
        <slot name="target"></slot>
        <slot name="trigger"></slot>
        <slot></slot>
      </div>
      <div
        id="${panelId}"
        class="skyra-context-menu-panel"
        role="menu"
        aria-label="${this.ariaLabel}"
        tabindex="-1"
      >
        <slot name="menu"></slot>
        <slot name="items"></slot>
      </div>
    `;
  }

  private _setupElements() {
    if (!this.shadowRoot) return;
    this._targetWrapper = this.shadowRoot.querySelector('.skyra-context-menu-target');
    this._panelEl = this.shadowRoot.querySelector('.skyra-context-menu-panel');
    this._slotEl = this.shadowRoot.querySelector('slot:not([name])');

    if (this._targetWrapper) {
      this._targetWrapper.addEventListener('contextmenu', this._boundHandleTargetContextMenu);
      this._targetWrapper.addEventListener('keydown', this._boundHandleTargetKeyDown);
    }

    if (this._itemsConfig) {
      this._renderDeclarativeItems();
    }
  }

  private _syncState() {
    if (!this._panelEl || !this._targetWrapper) return;

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
            new CustomEvent('skyra-context-menu-open', {
              detail: {
                placement: result.actualPlacement,
                align: result.actualAlign,
                x: this._virtualX,
                y: this._virtualY,
              },
              bubbles: true,
              composed: true,
            })
          );
        }

        // Focus first enabled item
        this._focusFirstItem();
      });

      this.dispatchEvent(
        new CustomEvent('skyra-context-menu-change', {
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
      this._restoreFocusToTarget();
    }

    this.dispatchEvent(
      new CustomEvent('skyra-context-menu-close', {
        detail: { reason },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent('skyra-context-menu-change', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _restoreFocusToTarget() {
    if (!this._targetWrapper) return;
    const focusable = this.querySelector<HTMLElement>('button, [tabindex="0"], a') || this._targetWrapper;
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
    if (this._targetWrapper) {
      this._targetWrapper.setAttribute('aria-expanded', String(this.open));
      if (this.disabled) {
        this._targetWrapper.setAttribute('aria-disabled', 'true');
      } else {
        this._targetWrapper.removeAttribute('aria-disabled');
      }
    }
  }

  private _getMenuItems(): HTMLElement[] {
    const items: HTMLElement[] = [];
    const elements = Array.from(this.querySelectorAll<HTMLElement>(
      'skyra-context-menu-item, skyra-tech-context-menu-item, skyra-dropdown-item, skyra-tech-dropdown-item, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], button'
    ));

    for (const el of elements) {
      const isDisabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
      if (!isDisabled && !el.closest('[slot="target"]') && !el.closest('[slot="trigger"]')) {
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
    if (!item) return;
    if ('focusItem' in item && typeof (item as any).focusItem === 'function') {
      (item as any).focusItem();
    } else {
      item.focus();
    }
  }

  private _attachActiveListeners() {
    if (typeof document === 'undefined') return;
    document.addEventListener('pointerdown', this._boundHandleDocumentPointerDown, { capture: true });
    document.addEventListener('keydown', this._boundHandleDocumentKeyDown, { capture: true });
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this._boundHandleWindowScroll, { capture: true, passive: true });
    }
  }

  private _teardownListeners() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', this._boundHandleDocumentPointerDown, { capture: true });
      document.removeEventListener('keydown', this._boundHandleDocumentKeyDown, { capture: true });
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._boundHandleWindowScroll, { capture: true });
    }
  }

  private _getFallbackCoordinates(): { x: number; y: number } {
    if (this._targetWrapper) {
      const rect = this._targetWrapper.getBoundingClientRect();
      return {
        x: Math.round(rect.left + Math.min(24, rect.width / 2)),
        y: Math.round(rect.top + Math.min(24, rect.height / 2)),
      };
    }
    return { x: 100, y: 100 };
  }

  private _handleTargetContextMenu(e: MouseEvent) {
    if (this.disabled) return;
    // Don't trigger if right-click happened inside the open menu panel
    if (this.open && this._panelEl && (this._panelEl.contains(e.target as Node) || this.contains(e.target as Node))) {
      const isTargetArea = this._targetWrapper && this._targetWrapper.contains(e.target as Node);
      const isPanelArea = this._panelEl.contains(e.target as Node);
      if (isPanelArea) return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.openAt(e.clientX, e.clientY);
  }

  private _handleTargetKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      e.stopPropagation();
      const fallback = this._getFallbackCoordinates();
      this.openAt(fallback.x, fallback.y);
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

  private _handleWindowScroll() {
    if (!this.open) return;
    if (this.closeOnScroll) {
      this._closeWithReason('scroll');
    } else {
      this.recomputePosition();
    }
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
      new CustomEvent('skyra-context-menu-select', {
        bubbles: true,
        composed: true,
        detail,
      })
    );

    if (this.closeOnSelect) {
      this._closeWithReason('item-select');
    }
  }

  private _renderDeclarativeItems() {
    if (!this._itemsConfig) return;

    // Remove existing non-target children
    const existing = Array.from(this.querySelectorAll(':not([slot="target"]):not([slot="trigger"])'));
    existing.forEach((node) => node.remove());

    const renderConfigs = (configs: ContextMenuItemConfig[], parent: HTMLElement) => {
      configs.forEach((cfg) => {
        if (cfg.type === 'separator') {
          const sep = document.createElement('skyra-context-menu-separator');
          sep.setAttribute('slot', 'menu');
          parent.appendChild(sep);
        } else if (cfg.type === 'group' && cfg.items) {
          const grp = document.createElement('skyra-context-menu-group');
          grp.setAttribute('slot', 'menu');
          if (cfg.label) grp.setAttribute('label', String(cfg.label));
          renderConfigs(cfg.items, grp);
          parent.appendChild(grp);
        } else {
          const item = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
          item.setAttribute('slot', 'menu');
          item.type = cfg.type === 'checkbox' ? 'checkbox' : cfg.type === 'radio' ? 'radio' : 'item';
          if (cfg.value) item.value = cfg.value;
          if (cfg.label) item.textContent = String(cfg.label);
          if (cfg.shortcut) item.shortcut = cfg.shortcut;
          if (cfg.disabled) item.disabled = true;
          if (cfg.destructive) item.destructive = true;
          if (cfg.checked) item.checked = true;

          if (cfg.onClick) {
            item.addEventListener('skyra-context-menu-item-select', () => cfg.onClick?.());
          }
          if (cfg.onCheckedChange) {
            item.addEventListener('skyra-context-menu-item-select', (e: any) => {
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

export class SkyraTechContextMenuElement extends SkyraContextMenuElement {}

// Safe Custom Elements registration
if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-context-menu')) {
    customElements.define('skyra-context-menu', SkyraContextMenuElement);
  }
  if (!customElements.get('skyra-tech-context-menu')) {
    customElements.define('skyra-tech-context-menu', SkyraTechContextMenuElement);
  }
}
