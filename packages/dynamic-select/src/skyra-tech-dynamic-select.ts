import { dynamicSelectStyles } from './skyra-tech-dynamic-select.css.js';

const icons = {
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  checkSmall: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-check-small" style="color: white;"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  loader: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg skyra-spin" style="color: var(--skyra-select-primary);"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
};

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechDynamicSelect extends BaseClass {
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _shadowRoot: ShadowRoot;
  
  // Properties
  private _options: any[] = [];
  private _value: any[] = [];
  
  // UI State
  private _isOpen = false;
  private _searchQuery = '';
  private _focusedIndex = -1;
  private _calculatedVisibleCount = 1;

  // Extractors (functions set via JS)
  public optionLabel?: (opt: any) => string;
  public optionValue?: (opt: any) => string;
  public optionGroup?: (opt: any) => string;
  public optionDescription?: (opt: any) => string | undefined;
  public optionDisabled?: (opt: any) => boolean;

  // Elements
  private _triggerBtn!: HTMLButtonElement;
  private _listbox!: HTMLDivElement;
  private _searchInput!: HTMLInputElement | null;
  private _triggerContent!: HTMLDivElement;
  
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    if (typeof this.attachInternals === 'function') {
      this._internals = this.attachInternals();
    }
  }

  static get observedAttributes() {
    return [
      'mode', 'searchable', 'clearable', 'select-all', 'max-visible-values',
      'max-selections', 'grouping', 'loading', 'disabled', 'allow-create',
      'dropdown-width', 'max-menu-height', 'placeholder', 'label', 'description',
      'error', 'required', 'name'
    ];
  }

  connectedCallback() {
    this._teardownListeners();
    this._renderBase();
    this._setupListeners();
    this._updateUI();
  }

  disconnectedCallback() {
    this._teardownListeners();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._updateUI();
  }

  private _resolveOption(val: any): any {
    if (typeof val === 'object' && val !== null) return val;
    const strVal = String(val);
    const found = this._options.find(o => this._getValue(o) === strVal);
    return found || { value: strVal, label: strVal };
  }

  // --- Properties ---
  get options() { return this._options; }
  set options(val: any[]) { 
    this._options = Array.isArray(val) ? val : [];
    if (this._value.length > 0) {
      this._value = this._value.map(v => this._resolveOption(v));
    }
    if (this._isOpen) {
      const optsContainer = this._shadowRoot?.querySelector('.options-container');
      if (optsContainer) {
        optsContainer.innerHTML = this._renderOptionsInnerHTML();
        this._attachOptionListeners();
      }
    }
    this._updateUI();
  }

  get value() { return this.isMulti ? this._value : (this._value[0] ?? null); }
  set value(val: any) {
    if (Array.isArray(val)) {
      this._value = val.map(v => this._resolveOption(v));
    } else if (val !== null && val !== undefined) {
      this._value = [this._resolveOption(val)];
    } else {
      this._value = [];
    }
    this._updateInternals();
    this._updateUI();
  }

  get mode() { return this.getAttribute('mode') || 'single'; }
  set mode(v) { if (v) this.setAttribute('mode', v); else this.removeAttribute('mode'); }
  get isMulti() { return this.mode === 'multiple'; }
  get searchable() { return this.hasAttribute('searchable'); }
  set searchable(v) { if (v) this.setAttribute('searchable', ''); else this.removeAttribute('searchable'); }
  get clearable() { return this.hasAttribute('clearable'); }
  set clearable(v) { if (v) this.setAttribute('clearable', ''); else this.removeAttribute('clearable'); }
  get selectAll() { return this.hasAttribute('select-all'); }
  set selectAll(v) { if (v) this.setAttribute('select-all', ''); else this.removeAttribute('select-all'); }
  get grouping() { return this.hasAttribute('grouping'); }
  set grouping(v) { if (v) this.setAttribute('grouping', ''); else this.removeAttribute('grouping'); }
  get loading() { return this.hasAttribute('loading'); }
  set loading(v) { if (v) this.setAttribute('loading', ''); else this.removeAttribute('loading'); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  set required(v) { if (v) this.setAttribute('required', ''); else this.removeAttribute('required'); }
  get allowCreate() { return this.hasAttribute('allow-create'); }
  set allowCreate(v) { if (v) this.setAttribute('allow-create', ''); else this.removeAttribute('allow-create'); }
  get maxVisibleValues() { return this.getAttribute('max-visible-values') || 'auto'; }
  set maxVisibleValues(v: string | number) { if (v !== undefined) this.setAttribute('max-visible-values', String(v)); else this.removeAttribute('max-visible-values'); }
  get maxSelections() { 
    const v = this.getAttribute('max-selections');
    return v ? parseInt(v, 10) : undefined;
  }
  set maxSelections(v: number | undefined) { if (v !== undefined) this.setAttribute('max-selections', String(v)); else this.removeAttribute('max-selections'); }
  get dropdownWidth() { return this.getAttribute('dropdown-width') || 'match'; }
  set dropdownWidth(v: string) { if (v) this.setAttribute('dropdown-width', v); else this.removeAttribute('dropdown-width'); }
  get maxMenuHeight() { return parseInt(this.getAttribute('max-menu-height') || '280', 10); }
  set maxMenuHeight(v: number) { if (v !== undefined) this.setAttribute('max-menu-height', String(v)); else this.removeAttribute('max-menu-height'); }
  get placeholder() { return this.getAttribute('placeholder') || 'Select option...'; }
  set placeholder(v: string) { if (v) this.setAttribute('placeholder', v); else this.removeAttribute('placeholder'); }
  get name() { return this.getAttribute('name'); }
  set name(v: string | null) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }

  get form() { return this._internals?.form || null; }

  // --- Helpers ---
  private _getLabel(opt: any): string {
    if (this.optionLabel) return this.optionLabel(opt);
    if (typeof opt === 'object' && opt !== null && 'label' in opt) return String(opt.label);
    return String(opt);
  }

  private _getValue(opt: any): string {
    if (this.optionValue) return this.optionValue(opt);
    if (typeof opt === 'object' && opt !== null && 'value' in opt) return String(opt.value);
    return String(opt);
  }

  private _getGroup(opt: any): string | undefined {
    if (this.optionGroup) return this.optionGroup(opt);
    if (typeof opt === 'object' && opt !== null && 'group' in opt) return String(opt.group);
    return undefined;
  }

  private _getDesc(opt: any): string | undefined {
    if (this.optionDescription) return this.optionDescription(opt);
    if (typeof opt === 'object' && opt !== null && 'description' in opt) return String(opt.description);
    return undefined;
  }

  private _getDisabled(opt: any): boolean {
    if (this.optionDisabled) return this.optionDisabled(opt);
    if (typeof opt === 'object' && opt !== null && 'disabled' in opt) return Boolean(opt.disabled);
    return false;
  }

  private _updateInternals() {
    if (!this._internals) return;
    
    // In multi select, native form data supports multiple entries for the same name,
    // but ElementInternals setFormValue currently requires FormData to represent multiples,
    // or just appending strings. For simplicity we append strings.
    if (!this.name) return;
    
    if (this._value.length === 0) {
      this._internals.setFormValue(null);
    } else {
      const fd = new FormData();
      this._value.forEach(v => fd.append(this.name!, this._getValue(v)));
      this._internals.setFormValue(fd);
    }
  }

  private _getFilteredOptions() {
    if (!this._searchQuery) return this._options;
    const q = this._searchQuery.toLowerCase().trim();
    return this._options.filter(opt => {
      const lbl = this._getLabel(opt).toLowerCase();
      const val = this._getValue(opt).toLowerCase();
      const desc = (this._getDesc(opt) || '').toLowerCase();
      return lbl.includes(q) || val.includes(q) || desc.includes(q);
    });
  }

  private _dispatchChange() {
    this._updateInternals();
    this._updateUI();
    this.dispatchEvent(new CustomEvent('skyra-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _handleSelect(opt: any) {
    if (this._getDisabled(opt)) return;

    if (this.isMulti) {
      const optVal = this._getValue(opt);
      const exists = this._value.find(v => this._getValue(v) === optVal);
      
      if (exists) {
        this._value = this._value.filter(v => this._getValue(v) !== optVal);
      } else {
        if (this.maxSelections && this._value.length >= this.maxSelections) return;
        this._value = [...this._value, opt];
      }
      this._dispatchChange();
    } else {
      this._value = [opt];
      this._isOpen = false;
      this.removeAttribute('data-open');
      this._searchQuery = '';
      this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
      this._dispatchChange();
      this._triggerBtn?.focus();
    }
  }

  private _handleClearAll(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;
    this._value = [];
    this._dispatchChange();
  }

  private _handleRemoveToken(e: Event, opt: any) {
    e.stopPropagation();
    if (this.disabled) return;
    const optVal = this._getValue(opt);
    this._value = this._value.filter(v => this._getValue(v) !== optVal);
    this._dispatchChange();
  }

  private _handleCreateNew() {
    if (!this.allowCreate || !this._searchQuery.trim()) return;
    const q = this._searchQuery.trim();
    
    this.dispatchEvent(new CustomEvent('skyra-create', {
      detail: { query: q },
      bubbles: true,
      composed: true
    }));

    // If not prevented/handled externally, default creation
    const newOpt = { value: q, label: q };
    if (this.isMulti) {
      this._value = [...this._value, newOpt];
    } else {
      this._value = [newOpt];
    }
    
    this._searchQuery = '';
    this._isOpen = false;
    this.removeAttribute('data-open');
    this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
    this._dispatchChange();
  }

  private _handleToggleSelectAll(e: Event) {
    e.stopPropagation();
    if (!this.isMulti || this.disabled) return;

    const targetPool = this._getFilteredOptions();
    const selectable = targetPool.filter(o => !this._getDisabled(o));
    if (selectable.length === 0) return;

    const currentValues = new Set(this._value.map(v => this._getValue(v)));
    const allSelected = selectable.every(o => currentValues.has(this._getValue(o)));

    if (allSelected) {
      const toRemove = new Set(selectable.map(o => this._getValue(o)));
      this._value = this._value.filter(v => !toRemove.has(this._getValue(v)));
    } else {
      const toAdd = selectable.filter(o => !currentValues.has(this._getValue(o)));
      this._value = [...this._value, ...toAdd];
      if (this.maxSelections) {
        this._value = this._value.slice(0, this.maxSelections);
      }
    }
    this._dispatchChange();
  }

  public open() {
    if (this.disabled || this._isOpen) return;
    this._toggleOpen();
  }

  public close() {
    if (!this._isOpen) return;
    this._toggleOpen();
  }

  private _toggleOpen(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (this.disabled) return;
    this._isOpen = !this._isOpen;
    if (this._isOpen) {
      this.setAttribute('data-open', '');
      this._focusedIndex = -1;
      document.dispatchEvent(new CustomEvent('skyra-select-opened', { detail: { source: this } }));
      this.dispatchEvent(new CustomEvent('skyra-open', { bubbles: true, composed: true }));
      if (this.searchable) {
        setTimeout(() => this._searchInput?.focus(), 40);
      }
    } else {
      this.removeAttribute('data-open');
      this._searchQuery = '';
      this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
    }
    this._updateUI();
  }

  private _onOtherOpened = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && detail.source !== this && this._isOpen) {
      this._isOpen = false;
      this._searchQuery = '';
      this.removeAttribute('data-open');
      this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
      this._updateUI();
    }
  };


  private _onGlobalClick = (e: Event) => {
    if (!this._isOpen) return;
    // Check if click was inside this component (composed path handles shadow DOM)
    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(this as unknown as EventTarget)) {
      this._isOpen = false;
      this.removeAttribute('data-open');
      this._searchQuery = '';
      this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
      this._updateUI();
    }
  };

  private _setupListeners() {
    document.addEventListener('pointerdown', this._onGlobalClick);
    document.addEventListener('mousedown', this._onGlobalClick);
    document.addEventListener('skyra-select-opened', this._onOtherOpened);
    
    // Resize observer for dynamic chips width
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this._calculateVisibleCount());
      // We will attach this once triggerContent is created in _updateUI.
      this._resizeObserver = ro;
    }
  }

  private _teardownListeners() {
    document.removeEventListener('pointerdown', this._onGlobalClick);
    document.removeEventListener('mousedown', this._onGlobalClick);
    document.removeEventListener('skyra-select-opened', this._onOtherOpened);
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }
  private _resizeObserver?: ResizeObserver;

  private _calculateVisibleCount() {
    if (this.maxVisibleValues !== 'auto') {
      this._calculatedVisibleCount = parseInt(this.maxVisibleValues as string, 10) || 1;
      this._updateUI();
      return;
    }

    if (!this._triggerContent || this._value.length <= 1) {
      this._calculatedVisibleCount = this._value.length;
      this._updateUI();
      return;
    }

    const containerWidth = this._triggerContent.clientWidth;
    if (containerWidth <= 0) return;

    let available = containerWidth - 45; // reserve for +N
    let count = 0;

    for (let i = 0; i < this._value.length; i++) {
      const lbl = this._getLabel(this._value[i]);
      const estWidth = 36 + Math.min(lbl.length * 7.5, 120);
      if (count === 0 || available - estWidth >= 0) {
        available -= estWidth;
        count++;
      } else break;
    }

    // Check if all fit without reserve
    let fullAvailable = containerWidth;
    let fullCount = 0;
    for (let i = 0; i < this._value.length; i++) {
      const lbl = this._getLabel(this._value[i]);
      const estWidth = 36 + Math.min(lbl.length * 7.5, 120);
      if (fullAvailable - estWidth >= 0) {
        fullAvailable -= estWidth;
        fullCount++;
      } else break;
    }

    const newCount = fullCount === this._value.length ? this._value.length : Math.max(1, count);
    if (this._calculatedVisibleCount !== newCount) {
      this._calculatedVisibleCount = newCount;
      this._updateUI();
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (!this._isOpen) {
      if (['Enter', 'ArrowDown', ' ', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        this._toggleOpen();
      } else if (e.key === 'Backspace' && this.isMulti && this._value.length > 0) {
        e.preventDefault();
        this._value = this._value.slice(0, this._value.length - 1);
        this._dispatchChange();
      }
      return;
    }

    const flatOpts = this._getFilteredOptions();

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._toggleOpen();
        this._triggerBtn?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._focusedIndex = (this._focusedIndex + 1) % flatOpts.length;
        this._updateUI();
        this._scrollToFocused();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusedIndex = this._focusedIndex - 1 < 0 ? flatOpts.length - 1 : this._focusedIndex - 1;
        this._updateUI();
        this._scrollToFocused();
        break;
      case 'Home':
        e.preventDefault();
        this._focusedIndex = 0;
        this._updateUI();
        this._scrollToFocused();
        break;
      case 'End':
        e.preventDefault();
        this._focusedIndex = flatOpts.length - 1;
        this._updateUI();
        this._scrollToFocused();
        break;
      case 'Enter':
        e.preventDefault();
        if (this._focusedIndex >= 0 && this._focusedIndex < flatOpts.length) {
          this._handleSelect(flatOpts[this._focusedIndex]);
        } else if (this.allowCreate && this._searchQuery.trim() && flatOpts.length === 0) {
          this._handleCreateNew();
        } else if (flatOpts.length === 1 && !this.isMulti) {
          this._handleSelect(flatOpts[0]);
        }
        break;
      case 'Tab':
        if (this._isOpen) {
          this._isOpen = false;
          this._searchQuery = '';
          this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
          this._updateUI();
        }
        break;
    }
  }

  private _scrollToFocused() {
    if (this._focusedIndex >= 0 && this._listbox) {
      const items = this._listbox.querySelectorAll('[data-skyra-option]');
      const activeEl = items[this._focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  // --- Rendering ---
  private _renderBase() {
    this._shadowRoot.innerHTML = `
      <style>${dynamicSelectStyles}</style>
      <div class="wrapper" part="wrapper">
        <div id="label-container"></div>
        <button id="trigger" type="button" class="trigger" part="trigger"></button>
        <div id="listbox-container"></div>
        <div id="helper-container"></div>
      </div>
    `;
    this._triggerBtn = this._shadowRoot.getElementById('trigger') as HTMLButtonElement;
    this._triggerBtn.addEventListener('click', (e) => this._toggleOpen(e));
    this._triggerBtn.addEventListener('keydown', (e) => this._handleKeyDown(e));
  }

  private _updateUI() {
    if (!this._shadowRoot || !this._triggerBtn) return;

    // Trigger States
    this._triggerBtn.disabled = this.disabled;
    this._triggerBtn.className = `trigger ${this._isOpen ? 'open' : ''} ${this.getAttribute('error') ? 'error' : ''}`;
    this._triggerBtn.setAttribute('aria-expanded', String(this._isOpen));

    // Render Label
    const labelContainer = this._shadowRoot.getElementById('label-container')!;
    const label = this.getAttribute('label');
    if (label) {
      labelContainer.innerHTML = `
        <label class="label" part="label" for="trigger" style="cursor: pointer;">
          ${label}
          ${this.required ? `<span class="required-asterisk" aria-hidden="true">*</span>` : ''}
        </label>
      `;
    } else {
      labelContainer.innerHTML = '';
    }

    // Render Trigger Content (Selected Values)
    let triggerContentHtml = '';
    if (this._value.length === 0) {
      triggerContentHtml = `<span class="placeholder" part="placeholder">${this.placeholder}</span>`;
    } else if (!this.isMulti) {
      triggerContentHtml = `<span class="single-value" part="single-value">${this._getLabel(this._value[0])}</span>`;
    } else {
      const visible = this._value.slice(0, this._calculatedVisibleCount);
      const hidden = Math.max(0, this._value.length - this._calculatedVisibleCount);
      
      triggerContentHtml = visible.map(opt => `
        <span class="chip" part="chip">
          <span class="chip-text">${this._getLabel(opt)}</span>
          ${!this.disabled ? `<span class="chip-remove" data-remove="${this._getValue(opt)}" aria-hidden="true">${icons.x}</span>` : ''}
        </span>
      `).join('');

      if (hidden > 0) {
        triggerContentHtml += `<span class="overflow-badge" part="overflow-badge">+${hidden}</span>`;
      }
    }

    this._triggerBtn.innerHTML = `
      <div id="trigger-content" class="trigger-content" part="trigger-content">${triggerContentHtml}</div>
      <div class="trigger-actions" part="trigger-actions">
        ${this.clearable && this._value.length > 0 && !this.disabled ? `<span class="clear-btn" id="clear-btn" aria-hidden="true">${icons.x}</span>` : ''}
        ${this.loading ? icons.loader : icons.chevronDown}
      </div>
    `;

    // Reattach observers/listeners for internal trigger dynamic content
    this._triggerContent = this._shadowRoot.getElementById('trigger-content') as HTMLDivElement;
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver.observe(this._triggerContent);
    }

    this._shadowRoot.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = (e.currentTarget as HTMLElement).dataset.remove;
        const opt = this._value.find(v => this._getValue(v) === val);
        if (opt) this._handleRemoveToken(e, opt);
      });
      btn.addEventListener('keydown', (e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const val = (e.currentTarget as HTMLElement).dataset.remove;
          const opt = this._value.find(v => this._getValue(v) === val);
          if (opt) this._handleRemoveToken(e, opt);
        }
      });
    });
    const clearBtn = this._shadowRoot.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => this._handleClearAll(e));
      clearBtn.addEventListener('keydown', (e: any) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._handleClearAll(e); }
      });
    }

    // Render Listbox
    const listboxContainer = this._shadowRoot.getElementById('listbox-container')!;
    if (this._isOpen) {
      const alreadyRendered = !!listboxContainer.innerHTML;
      if (!alreadyRendered) {
        // First open: build full HTML and wire up all event listeners
        listboxContainer.innerHTML = this._renderListboxHTML();
        this._listbox = this._shadowRoot.getElementById('listbox') as HTMLDivElement;

        this._searchInput = this._shadowRoot.getElementById('search-input') as HTMLInputElement;
        if (this._searchInput) {
          this._searchInput.addEventListener('input', (e: any) => {
            this._searchQuery = e.target.value;
            this._focusedIndex = 0;
            this.dispatchEvent(new CustomEvent('skyra-search', { detail: { query: this._searchQuery }, bubbles: true }));
            const optsContainer = this._shadowRoot.querySelector('.options-container');
            if (optsContainer) {
              optsContainer.innerHTML = this._renderOptionsInnerHTML();
              this._attachOptionListeners();
            }
          });
          this._searchInput.addEventListener('keydown', (e) => this._handleKeyDown(e));

          const searchClear = this._shadowRoot.getElementById('search-clear');
          if (searchClear) {
            searchClear.addEventListener('click', () => {
              this._searchQuery = '';
              const optsContainer = this._shadowRoot.querySelector('.options-container');
              if (optsContainer) {
                optsContainer.innerHTML = this._renderOptionsInnerHTML();
                this._attachOptionListeners();
              }
              this._searchInput?.focus();
            });
          }
        }

        const selectAllBtn = this._shadowRoot.getElementById('select-all-btn');
        if (selectAllBtn) {
          selectAllBtn.addEventListener('click', (e) => this._handleToggleSelectAll(e));
          selectAllBtn.addEventListener('keydown', (e: any) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._handleToggleSelectAll(e); }
          });
        }

        const multiClear = this._shadowRoot.getElementById('multi-clear-all');
        if (multiClear) {
          multiClear.addEventListener('click', (e) => this._handleClearAll(e));
        }

        this._attachOptionListeners();
      } else {
        // Already rendered: just sync visual state without destroying DOM
        this._syncDOMStates();
        this._syncFocusClasses();
      }

    } else {
      listboxContainer.innerHTML = '';
      this._listbox = null as any;
      this._searchInput = null;
    }

    // Render Helper / Error
    const helperContainer = this._shadowRoot.getElementById('helper-container')!;
    const error = this.getAttribute('error');
    const desc = this.getAttribute('description');
    
    if (error) {
      helperContainer.innerHTML = `<div class="error-text" part="error-text">${icons.alertCircle} <span>${error}</span></div>`;
    } else if (desc) {
      helperContainer.innerHTML = `<span class="helper-text" part="helper-text">${desc}</span>`;
    } else {
      helperContainer.innerHTML = '';
    }
  }

  
  private _attachOptionListeners() {
    this._shadowRoot.querySelectorAll('[data-skyra-option]').forEach((optEl, i) => {
      optEl.addEventListener('click', () => this._handleSelect(this._getFilteredOptions()[i]));
      optEl.addEventListener('mouseenter', () => {
        const opt = this._getFilteredOptions()[i];
        if (!this._getDisabled(opt)) {
          this._focusedIndex = i;
          this._syncFocusClasses();
        }
      });
    });
    const createBtn = this._shadowRoot.getElementById('create-btn');
    if (createBtn) createBtn.addEventListener('click', () => this._handleCreateNew());
  }

  private _syncFocusClasses() {
    if (!this._listbox) return;
    const opts = this._listbox.querySelectorAll('.option');
    opts.forEach((o, i) => {
      if (i === this._focusedIndex) o.classList.add('focused');
      else o.classList.remove('focused');
    });
  }

  private _renderListboxHTML(): string {
    const flatOpts = this._getFilteredOptions();
    
    const w = this.dropdownWidth === 'match' ? '100%' : this.dropdownWidth === 'auto' ? 'max-content' : `${this.dropdownWidth}px`;
    
    let html = `
      <div id="listbox" class="listbox open" role="listbox" style="width: ${w}; max-height: ${this.maxMenuHeight}px" part="listbox">
    `;

    if (this.searchable) {
      html += `
        <div class="search-header" part="search-header">
          <div class="search-box">
            <span style="color: var(--skyra-select-text-muted); display:flex;">${icons.search}</span>
            <input id="search-input" type="text" class="search-input" value="${this._searchQuery}" placeholder="Search..." aria-autocomplete="list" part="search-input" />
            ${this._searchQuery ? `<button id="search-clear" type="button" class="search-clear" aria-label="Clear search">${icons.x}</button>` : ''}
          </div>
        </div>
      `;
    }

    if (this.isMulti && this.selectAll && this._options.length > 0) {
      const selectable = flatOpts.filter(o => !this._getDisabled(o));
      const currentValues = new Set(this._value.map(v => this._getValue(v)));
      const allSelected = selectable.length > 0 && selectable.every(o => currentValues.has(this._getValue(o)));
      const someSelected = !allSelected && selectable.some(o => currentValues.has(this._getValue(o)));
      
      html += `
        <div id="select-all-btn" class="select-all-row" role="button" tabindex="0" part="select-all">
          <div style="display:flex; align-items:center; gap: 0.625rem;">
            <div class="checkbox ${allSelected ? 'checked' : someSelected ? 'indeterminate' : ''}">
              ${allSelected ? icons.checkSmall : someSelected ? '<div class="indeterminate-line"></div>' : ''}
            </div>
            <span style="font-size: 0.82rem; font-weight: 600; color: var(--skyra-select-text)">
              ${allSelected ? 'Deselect all' : 'Select all'}
            </span>
          </div>
          <span class="select-all-info">${this._value.length} / ${this._options.length}</span>
        </div>
      `;
    }

    html += `<div class="options-container" part="options-container">`;

    html += this._renderOptionsInnerHTML();
    html += `</div>`;

    if (this.isMulti) {
      html += `
        <div class="multi-footer" part="multi-footer">
          <span class="multi-footer-text">${this._value.length} selected</span>
          ${this._value.length > 0 ? `<button id="multi-clear-all" type="button" class="multi-footer-clear">Clear all</button>` : ''}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  
  private _syncDOMStates() {
    if (!this.isMulti) {
       const currentVal = this._value[0] ? this._getValue(this._value[0]) : null;
       const optionEls = this._shadowRoot.querySelectorAll('.option');
       const flatOpts = this._getFilteredOptions();
       optionEls.forEach((optEl: any, i: number) => {
         const isSelected = currentVal === this._getValue(flatOpts[i]);
         optEl.setAttribute('aria-selected', String(isSelected));
         if (isSelected) {
           optEl.classList.add('selected');
           if (!optEl.querySelector('svg.icon-check')) {
             optEl.insertAdjacentHTML('beforeend', icons.check);
           }
         } else {
           optEl.classList.remove('selected');
           const checkIcon = optEl.querySelector('svg.icon-check');
           if (checkIcon) checkIcon.remove();
         }
       });
       return;
    }

    const currentValues = new Set(this._value.map(v => this._getValue(v)));
    const optionEls = this._shadowRoot.querySelectorAll('.option');
    const flatOpts = this._getFilteredOptions();
    optionEls.forEach((optEl: any, i: number) => {
       const val = this._getValue(flatOpts[i]);
       const isSelected = currentValues.has(val);
       optEl.setAttribute('aria-selected', String(isSelected));
       if (isSelected) optEl.classList.add('selected'); else optEl.classList.remove('selected');
       const cb = optEl.querySelector('.checkbox');
       if (cb) {
         cb.className = `checkbox ${isSelected ? 'checked' : ''}`;
         cb.innerHTML = isSelected ? icons.checkSmall : '';
       }
    });
    
    const selectAllRow = this._shadowRoot.getElementById('select-all-btn');
    if (selectAllRow) {
      const selectable = flatOpts.filter(o => !this._getDisabled(o));
      const allSelected = selectable.length > 0 && selectable.every(o => currentValues.has(this._getValue(o)));
      const someSelected = !allSelected && selectable.some(o => currentValues.has(this._getValue(o)));
      const cb = selectAllRow.querySelector('.checkbox');
      if (cb) {
        cb.className = `checkbox ${allSelected ? 'checked' : someSelected ? 'indeterminate' : ''}`;
        cb.innerHTML = allSelected ? icons.checkSmall : someSelected ? '<div class="indeterminate-line"></div>' : '';
      }
      const label = selectAllRow.querySelector('span:not(.select-all-info)');
      if (label) label.textContent = allSelected ? 'Deselect all' : 'Select all';
    }
    
    const selectAllInfo = this._shadowRoot.querySelector('.select-all-info');
    if (selectAllInfo) selectAllInfo.textContent = `${this._value.length} / ${this._options.length}`;
    const multiFooterText = this._shadowRoot.querySelector('.multi-footer-text');
    if (multiFooterText) multiFooterText.textContent = `${this._value.length} selected`;
    const multiClear = this._shadowRoot.getElementById('multi-clear-all');
    if (multiClear) multiClear.style.display = this._value.length > 0 ? '' : 'none';
  }

  
  private _renderOptionsInnerHTML(): string {
    const flatOpts = this._getFilteredOptions();
    let html = '';
    if (this.loading) {
      html += `<div class="empty-state">${icons.loader} Loading options...</div>`;
    } else if (flatOpts.length === 0) {
      html += `<div class="empty-state">No results found`;
      if (this.allowCreate && this._searchQuery.trim()) {
        html += `<br/><button id="create-btn" type="button" class="create-btn">${icons.plus} Create "${this._searchQuery}"</button>`;
      }
      html += `</div>`;
    } else if (this.grouping) {
      const groups: Record<string, any[]> = {};
      flatOpts.forEach(o => {
        const g = this._getGroup(o) || 'Other';
        if (!groups[g]) groups[g] = [];
        groups[g].push(o);
      });
      let globalIndex = 0;
      for (const gName in groups) {
        html += `<div style="margin-bottom: 4px;">`;
        html += `<div class="group-header" part="group-header">${gName}</div>`;
        groups[gName]?.forEach((opt: any) => {
          html += this._renderOptionHTML(opt, globalIndex);
          globalIndex++;
        });
        html += `</div>`;
      }
    } else {
      flatOpts.forEach((opt: any, i: number) => {
        html += this._renderOptionHTML(opt, i);
      });
    }
    return html;
  }

  private _renderOptionHTML(opt: any, index: number): string {
    const val = this._getValue(opt);
    const lbl = this._getLabel(opt);
    const desc = this._getDesc(opt);
    const isDis = this._getDisabled(opt);
    const isSelected = this._value.some(v => this._getValue(v) === val);
    const isFocused = index === this._focusedIndex;
    
    let cls = `option ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`;
    
    return `
      <button type="button" class="${cls}" role="option" aria-selected="${isSelected}" aria-disabled="${isDis}" ${isDis ? 'disabled' : ''} data-skyra-option="true" part="option ${isSelected ? 'option-selected' : ''}">
        <div style="display:flex; align-items:center; gap: 0.625rem; flex:1; overflow:hidden;">
          ${this.isMulti ? `
            <div class="checkbox ${isSelected ? 'checked' : ''}">
              ${isSelected ? icons.checkSmall : ''}
            </div>
          ` : ''}
          <div class="option-text-container">
            <span class="option-label">${lbl}</span>
            ${desc ? `<span class="option-desc">${desc}</span>` : ''}
          </div>
        </div>
        ${!this.isMulti && isSelected ? icons.check : ''}
      </button>
    `;
  }
}

export function defineSkyraTechDynamicSelect() {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-dynamic-select')) {
    customElements.define('skyra-tech-dynamic-select', SkyraTechDynamicSelect);
  }
}
