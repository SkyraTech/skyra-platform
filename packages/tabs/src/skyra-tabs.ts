import { tabsStyles } from './skyra-tabs.css.js';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraTabsElement extends BaseClass {
  private _slot: HTMLSlotElement | null = null;
  private _boundHandleTabClick: EventListener;
  private _boundHandleTabKeyDown: EventListener;
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleTabClick = this._handleTabClick.bind(this) as EventListener;
    this._boundHandleTabKeyDown = this._handleTabKeyDown.bind(this) as EventListener;
  }

  static get observedAttributes() {
    return ['value', 'default-value', 'orientation', 'activation-mode', 'variant'];
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

  get orientation(): 'horizontal' | 'vertical' {
    return (this.getAttribute('orientation') as 'horizontal' | 'vertical') || 'horizontal';
  }
  set orientation(val: 'horizontal' | 'vertical') {
    this.setAttribute('orientation', val);
  }

  get activationMode(): 'automatic' | 'manual' {
    return (this.getAttribute('activation-mode') as 'automatic' | 'manual') || 'automatic';
  }
  set activationMode(val: 'automatic' | 'manual') {
    if (val) this.setAttribute('activation-mode', val);
    else this.removeAttribute('activation-mode');
  }

  get variant(): 'default' | 'line' | 'pill' {
    return (this.getAttribute('variant') as 'default' | 'line' | 'pill') || 'line';
  }
  set variant(val: 'default' | 'line' | 'pill') {
    if (val) this.setAttribute('variant', val);
    else this.removeAttribute('variant');
  }

  connectedCallback() {
    this.render();
    
    // Defer initialization to allow children to connect
    requestAnimationFrame(() => {
      this._initializeTabs();
      this.addEventListener('skyra-tab-click', this._boundHandleTabClick);
      this.addEventListener('keydown', this._boundHandleTabKeyDown);
    });
  }

  disconnectedCallback() {
    this.removeEventListener('skyra-tab-click', this._boundHandleTabClick);
    this.removeEventListener('keydown', this._boundHandleTabKeyDown);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    
    if (name === 'value') {
      this._updateSelectedTab(newValue);
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>${tabsStyles}</style>
      <div class="skyra-tabs-list" role="tablist" aria-orientation="${this.orientation}">
        <slot name="tab"></slot>
      </div>
      <div class="skyra-tabs-panels">
        <slot></slot>
      </div>
    `;
    
    this._slot = this.shadowRoot.querySelector('slot[name="tab"]');
    if (this._slot) {
      this._slot.addEventListener('slotchange', () => this._initializeTabs());
    }
  }

  private _getTabs(): HTMLElement[] {
    return Array.from(this.querySelectorAll('skyra-tab'));
  }

  private _getPanels(): HTMLElement[] {
    return Array.from(this.querySelectorAll('skyra-tab-panel'));
  }

  private _initializeTabs() {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    
    if (tabs.length === 0) return;

    // Link tabs and panels
    tabs.forEach((tab, index) => {
      const value = tab.getAttribute('value') || `tab-${index}`;
      tab.setAttribute('value', value);
      
      const panel = panels.find(p => p.getAttribute('value') === value);
      if (panel) {
        tab.setAttribute('aria-controls', panel.id || `panel-${value}`);
        if (!panel.id) panel.id = `panel-${value}`;
        
        panel.setAttribute('aria-labelledby', tab.id || `tab-${value}`);
        if (!tab.id) tab.id = `tab-${value}`;
      }
    });

    // Set initial selection
    let activeValue = this.value;
    if (!activeValue && this.defaultValue) {
      activeValue = this.defaultValue;
    }
    if (!activeValue && tabs.length > 0) {
      activeValue = tabs.find(t => !t.hasAttribute('disabled'))?.getAttribute('value') || tabs[0].getAttribute('value');
    }
    
    if (activeValue) {
      if (!this.hasAttribute('value')) { // uncontrolled
        this._updateSelectedTab(activeValue, false);
      } else {
        this._updateSelectedTab(this.value, false);
      }
    }
  }

  private _updateSelectedTab(val: string | null, dispatchEvent = true) {
    if (!val) return;
    
    const tabs = this._getTabs();
    const panels = this._getPanels();

    tabs.forEach(tab => {
      const isSelected = tab.getAttribute('value') === val;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach(panel => {
      if (panel.getAttribute('value') === val) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    if (dispatchEvent) {
      this.dispatchEvent(new CustomEvent('skyra-tabs-change', {
        detail: { value: val },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _handleTabClick(e: Event) {
    const customEvent = e as CustomEvent;
    const val = customEvent.detail?.value;
    if (val) {
      if (!this.hasAttribute('value')) {
        this._updateSelectedTab(val);
      } else {
        // Controlled mode: just dispatch event, let consumer update 'value'
        this.dispatchEvent(new CustomEvent('skyra-tabs-change', {
          detail: { value: val },
          bubbles: true,
          composed: true
        }));
      }
    }
  }

  private _handleTabKeyDown(e: KeyboardEvent) {
    const tabs = this._getTabs().filter(t => !t.hasAttribute('disabled'));
    if (tabs.length === 0) return;

    const currentTab = e.target as HTMLElement;
    if (currentTab.tagName.toLowerCase() !== 'skyra-tab') return;

    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex === -1) return;

    let nextIndex = -1;
    const isHorizontal = this.orientation === 'horizontal';

    if (
      (isHorizontal && e.key === 'ArrowRight') ||
      (!isHorizontal && e.key === 'ArrowDown')
    ) {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (
      (isHorizontal && e.key === 'ArrowLeft') ||
      (!isHorizontal && e.key === 'ArrowUp')
    ) {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== -1) {
      const nextTab = tabs[nextIndex];
      nextTab.focus();
      
      if (this.activationMode === 'automatic') {
        const val = nextTab.getAttribute('value');
        if (val) {
          if (!this.hasAttribute('value')) {
            this._updateSelectedTab(val);
          } else {
            this.dispatchEvent(new CustomEvent('skyra-tabs-change', {
              detail: { value: val },
              bubbles: true,
              composed: true
            }));
          }
        }
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tabs')) {
  customElements.define('skyra-tabs', SkyraTabsElement);
}
