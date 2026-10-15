import { popoverStyles } from './skyra-popover.css.js';
import {
  computePopoverPosition,
  PopoverPlacement,
  PopoverAlign,
  PositionResult,
} from './positioning.js';

let popoverIdCounter = 0;

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraPopoverElement extends BaseClass {
  private _boundHandleTriggerClick: EventListener;
  private _boundHandleTriggerKeyDown: EventListener;
  private _boundHandleDocumentPointerDown: EventListener;
  private _boundHandleDocumentKeyDown: EventListener;
  private _boundHandleScrollOrResize: EventListener;

  private _triggerWrapper: HTMLDivElement | null = null;
  private _panelEl: HTMLDivElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _rafId: number | null = null;
  private _instanceId: string;

  constructor() {
    super();
    this._instanceId = `skyra-popover-${++popoverIdCounter}`;
    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
    }

    this._boundHandleTriggerClick = this._handleTriggerClick.bind(this) as EventListener;
    this._boundHandleTriggerKeyDown = this._handleTriggerKeyDown.bind(this) as EventListener;
    this._boundHandleDocumentPointerDown = this._handleDocumentPointerDown.bind(this) as EventListener;
    this._boundHandleDocumentKeyDown = this._handleDocumentKeyDown.bind(this) as EventListener;
    this._boundHandleScrollOrResize = this._handleScrollOrResize.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return [
      'open',
      'placement',
      'align',
      'offset',
      'viewport-padding',
      'close-on-outside-click',
      'close-on-escape',
      'disabled',
      'restore-focus',
      'panel-width',
      'panel-max-width',
      'panel-min-width',
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

  get panelWidth(): string | number | null {
    return this.getAttribute('panel-width');
  }

  set panelWidth(val: string | number | null) {
    if (val !== null && val !== undefined) {
      this.setAttribute('panel-width', String(val));
    } else {
      this.removeAttribute('panel-width');
    }
  }

  get panelMaxWidth(): string | number {
    return this.getAttribute('panel-max-width') || 'min(90vw, 360px)';
  }

  set panelMaxWidth(val: string | number) {
    this.setAttribute('panel-max-width', String(val));
  }

  get panelMinWidth(): string | number {
    const val = this.getAttribute('panel-min-width');
    return val !== null ? val : 200;
  }

  set panelMinWidth(val: string | number) {
    this.setAttribute('panel-min-width', String(val));
  }

  get ariaLabel(): string | null {
    return this.getAttribute('aria-label');
  }

  set ariaLabel(val: string | null) {
    if (val) {
      this.setAttribute('aria-label', val);
    } else {
      this.removeAttribute('aria-label');
    }
  }

  // --- Lifecycle Callbacks ---

  connectedCallback() {
    this.render();
    this._setupElements();
    this._syncState();
  }

  disconnectedCallback() {
    this._teardownListeners();
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
      if (newValue) {
        this._panelEl.setAttribute('aria-label', newValue);
      } else {
        this._panelEl.removeAttribute('aria-label');
      }
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
      <style>${popoverStyles}</style>
      <div
        id="${triggerId}"
        class="skyra-popover-trigger-wrapper"
        role="button"
        tabindex="0"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="${panelId}"
      >
        <slot name="trigger"></slot>
      </div>
      <div
        id="${panelId}"
        class="skyra-popover-panel"
        role="dialog"
        aria-modal="false"
        tabindex="-1"
      >
        <slot></slot>
      </div>
    `;
  }

  private _setupElements() {
    if (!this.shadowRoot) return;
    this._triggerWrapper = this.shadowRoot.querySelector('.skyra-popover-trigger-wrapper');
    this._panelEl = this.shadowRoot.querySelector('.skyra-popover-panel');

    if (this._triggerWrapper) {
      this._triggerWrapper.addEventListener('click', this._boundHandleTriggerClick);
      this._triggerWrapper.addEventListener('keydown', this._boundHandleTriggerKeyDown);
    }

    if (this._panelEl && this.ariaLabel) {
      this._panelEl.setAttribute('aria-label', this.ariaLabel);
    }
  }

  private _syncState() {
    if (!this._panelEl || !this._triggerWrapper) return;

    const isOpen = this.open;
    this._updateAriaAttributes();

    if (isOpen) {
      this._applyDimensions();
      this._attachActiveListeners();

      // Recalculate position synchronously and after next RAF for accurate layout measurements
      this.recomputePosition();
      this._rafId = requestAnimationFrame(() => {
        const result = this.recomputePosition();
        if (result) {
          this.dispatchEvent(
            new CustomEvent('skyra-popover-open', {
              detail: { placement: result.actualPlacement, align: result.actualAlign },
              bubbles: true,
              composed: true,
            })
          );
        }
      });

      this.dispatchEvent(
        new CustomEvent('skyra-popover-change', {
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
      new CustomEvent('skyra-popover-close', {
        detail: { reason },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent('skyra-popover-change', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _restoreFocusToTrigger() {
    if (!this._triggerWrapper) return;
    const trigger = this.querySelector<HTMLElement>('[slot="trigger"]');
    const selector = 'button, [tabindex="0"], input, a';
    const focusable = (trigger?.matches(selector) ? trigger : trigger?.querySelector<HTMLElement>(selector)) || this._triggerWrapper;
    focusable?.focus?.();
  }

  private _applyDimensions() {
    if (!this._panelEl) return;

    if (this.panelWidth) {
      this._panelEl.style.width = typeof this.panelWidth === 'number' ? `${this.panelWidth}px` : this.panelWidth;
    } else {
      this._panelEl.style.width = '';
    }

    if (this.panelMaxWidth) {
      this._panelEl.style.maxWidth =
        typeof this.panelMaxWidth === 'number' ? `${this.panelMaxWidth}px` : this.panelMaxWidth;
    }

    if (this.panelMinWidth) {
      this._panelEl.style.minWidth =
        typeof this.panelMinWidth === 'number' ? `${this.panelMinWidth}px` : `${this.panelMinWidth}px`;
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
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
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
    if (!this.open || !this.closeOnEscape) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this._closeWithReason('escape');
    }
  }

  private _handleScrollOrResize() {
    if (!this.open) return;
    this.recomputePosition();
  }
}

// Canonical element registration
export class SkyraTechPopoverElement extends SkyraPopoverElement {}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-popover')) {
    customElements.define('skyra-popover', SkyraPopoverElement);
  }
  if (!customElements.get('skyra-tech-popover')) {
    customElements.define('skyra-tech-popover', SkyraTechPopoverElement);
  }
}
