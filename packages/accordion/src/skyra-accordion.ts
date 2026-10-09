import { accordionStyles } from './skyra-accordion.css.js';
import type { SkyraAccordionItemElement } from './skyra-accordion-item.js';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraAccordionElement extends BaseClass {
  private _boundHandleInternalToggle: EventListener;
  private _boundHandleKeyDown: EventListener;
  private _slot: HTMLSlotElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleInternalToggle = this._handleInternalToggle.bind(this) as EventListener;
    this._boundHandleKeyDown = this._handleKeyDown.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['type', 'value', 'default-value', 'collapsible'];
  }

  get type(): 'single' | 'multiple' {
    return (this.getAttribute('type') as 'single' | 'multiple') || 'single';
  }
  set type(val: 'single' | 'multiple') {
    this.setAttribute('type', val);
  }

  get value(): string | null {
    return this.getAttribute('value');
  }
  set value(val: string | null) {
    if (val) this.setAttribute('value', val);
    else this.removeAttribute('value');
  }

  get defaultValue(): string | null {
    return this.getAttribute('default-value');
  }
  set defaultValue(val: string | null) {
    if (val) this.setAttribute('default-value', val);
    else this.removeAttribute('default-value');
  }

  get collapsible(): boolean {
    return this.hasAttribute('collapsible');
  }
  set collapsible(val: boolean) {
    if (val) this.setAttribute('collapsible', '');
    else this.removeAttribute('collapsible');
  }

  connectedCallback() {
    this.render();

    requestAnimationFrame(() => {
      this._initializeItems();
      this.addEventListener('skyra-accordion-internal-toggle', this._boundHandleInternalToggle);
      this.addEventListener('keydown', this._boundHandleKeyDown);
    });
  }

  disconnectedCallback() {
    this.removeEventListener('skyra-accordion-internal-toggle', this._boundHandleInternalToggle);
    this.removeEventListener('keydown', this._boundHandleKeyDown);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'value') {
      this._updateItemsState(this._parseValue(newValue));
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${accordionStyles}</style>
      <slot></slot>
    `;
    this._slot = this.shadowRoot.querySelector('slot');
    if (this._slot) {
      this._slot.addEventListener('slotchange', () => this._initializeItems());
    }
  }

  private _getItems(): SkyraAccordionItemElement[] {
    return Array.from(this.querySelectorAll('skyra-accordion-item')) as SkyraAccordionItemElement[];
  }

  private _parseValue(val: string | null): string[] {
    if (!val) return [];
    if (this.type === 'single') return [val];
    return val.split(',').map(v => v.trim()).filter(Boolean);
  }

  private _serializeValue(vals: string[]): string {
    return this.type === 'single' ? (vals[0] || '') : vals.join(',');
  }

  private _initializeItems() {
    let activeValues = this._parseValue(this.value);
    
    // Fallback to uncontrolled default
    if (!this.hasAttribute('value') && this.defaultValue) {
      activeValues = this._parseValue(this.defaultValue);
    }
    
    this._updateItemsState(activeValues, false);
  }

  private _updateItemsState(activeValues: string[], dispatchEvent = true) {
    const items = this._getItems();
    items.forEach(item => {
      const val = item.getAttribute('value');
      if (val) {
        if (activeValues.includes(val)) {
          item.setAttribute('data-state', 'open');
        } else {
          item.setAttribute('data-state', 'closed');
        }
      }
    });

    if (dispatchEvent) {
      this.dispatchEvent(new CustomEvent('skyra-accordion-change', {
        detail: { value: this._serializeValue(activeValues) },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _handleInternalToggle(e: Event) {
    e.stopPropagation();
    const customEvent = e as CustomEvent;
    const toggledValue = customEvent.detail?.value;
    if (!toggledValue) return;

    // Determine current uncontrolled active values
    const items = this._getItems();
    let activeValues = items.filter(item => item.getAttribute('data-state') === 'open')
                            .map(item => item.getAttribute('value'))
                            .filter(Boolean) as string[];

    if (this.type === 'single') {
      const isCurrentlyOpen = activeValues.includes(toggledValue);
      if (isCurrentlyOpen) {
        activeValues = this.collapsible ? [] : [toggledValue];
      } else {
        activeValues = [toggledValue];
      }
    } else {
      // Multiple
      if (activeValues.includes(toggledValue)) {
        activeValues = activeValues.filter(v => v !== toggledValue);
      } else {
        activeValues.push(toggledValue);
      }
    }

    if (!this.hasAttribute('value')) {
      // Uncontrolled: we update internal state
      this._updateItemsState(activeValues, true);
    } else {
      // Controlled: just dispatch event
      this.dispatchEvent(new CustomEvent('skyra-accordion-change', {
        detail: { value: this._serializeValue(activeValues) },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    const items = this._getItems();
    if (items.length === 0) return;

    // Find the currently focused item by inspecting composed path
    const composedPath = e.composedPath();
    const currentItem = items.find(item => composedPath.includes(item));
    if (!currentItem) return;

    const currentIndex = items.indexOf(currentItem);
    let nextIndex = -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== -1) {
      const nextItem = items[nextIndex];
      const trigger = nextItem.shadowRoot?.querySelector('button');
      if (trigger) {
        trigger.focus();
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-accordion')) {
  customElements.define('skyra-accordion', SkyraAccordionElement);
}
