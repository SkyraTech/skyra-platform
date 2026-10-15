import { commandPaletteStyles } from './skyra-command-palette.css.js';
import {
  filterCommands,
  matchesShortcutKey,
  isInputElement,
} from '@skyra-tech-platform/utils';
import {
  CommandItem,
  COMMAND_SELECT_EVENT,
  COMMAND_PALETTE_OPEN_EVENT,
  COMMAND_PALETTE_CLOSE_EVENT,
  COMMAND_PALETTE_CHANGE_EVENT,
  COMMAND_PALETTE_QUERY_EVENT,
} from './types.js';

let commandPaletteIdCounter = 0;

const BaseElement =
  typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraCommandPaletteElement extends BaseElement {
  private _commands: CommandItem[] = [];
  private _query: string = '';
  private _activeIndex: number = 0;
  private _instanceId: string;
  private _previousActiveElement: HTMLElement | null = null;
  private _originalBodyOverflow: string | null = null;
  private _closeReason: string = 'programmatic';

  private _backdropEl: HTMLElement | null = null;
  private _modalEl: HTMLElement | null = null;
  private _inputEl: HTMLInputElement | null = null;
  private _listEl: HTMLElement | null = null;
  private _emptyEl: HTMLElement | null = null;
  private _clearBtnEl: HTMLButtonElement | null = null;

  private _boundHandleGlobalKeyDown: EventListener;
  private _boundHandleInputKeyDown: (e: KeyboardEvent) => void;
  private _boundHandleInputChange: (e: Event) => void;
  private _boundHandleBackdropClick: (e: MouseEvent) => void;

  constructor() {
    super();
    commandPaletteIdCounter += 1;
    this._instanceId = `skyra-cmd-palette-${commandPaletteIdCounter}`;

    this._boundHandleGlobalKeyDown = this._handleGlobalKeyDown.bind(this) as EventListener;
    this._boundHandleInputKeyDown = this._handleInputKeyDown.bind(this);
    this._boundHandleInputChange = this._handleInputChange.bind(this);
    this._boundHandleBackdropClick = this._handleBackdropClick.bind(this);

    if (this.attachShadow) {
      this.attachShadow({ mode: 'open' });
      this._renderTemplate();
    }
  }

  static get observedAttributes() {
    return ['open', 'shortcut', 'placeholder', 'empty-text', 'close-on-select', 'close-on-escape', 'close-on-backdrop'];
  }

  /* ─── Properties & Attributes ─── */

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

  get shortcut(): string {
    return this.getAttribute('shortcut') || 'mod+k';
  }
  set shortcut(val: string) {
    this.setAttribute('shortcut', val);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || 'Type a command or search...';
  }
  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
  }

  get emptyText(): string {
    return this.getAttribute('empty-text') || 'No matching commands found.';
  }
  set emptyText(val: string) {
    this.setAttribute('empty-text', val);
  }

  get closeOnSelect(): boolean {
    return this.getAttribute('close-on-select') !== 'false';
  }
  set closeOnSelect(val: boolean) {
    this.setAttribute('close-on-select', String(val));
  }

  get closeOnEscape(): boolean {
    return this.getAttribute('close-on-escape') !== 'false';
  }
  set closeOnEscape(val: boolean) {
    this.setAttribute('close-on-escape', String(val));
  }

  get closeOnBackdrop(): boolean {
    return this.getAttribute('close-on-backdrop') !== 'false';
  }
  set closeOnBackdrop(val: boolean) {
    this.setAttribute('close-on-backdrop', String(val));
  }

  get query(): string {
    return this._query;
  }
  set query(val: string) {
    this._query = val || '';
    if (this._inputEl && this._inputEl.value !== this._query) {
      this._inputEl.value = this._query;
    }
    this._activeIndex = 0;
    this._renderItems();
  }

  get commands(): CommandItem[] {
    return this._commands;
  }
  set commands(val: CommandItem[]) {
    this._commands = Array.isArray(val) ? val : [];
    this._renderItems();
  }

  get activeIndex(): number {
    return this._activeIndex;
  }
  set activeIndex(val: number) {
    this._activeIndex = Math.max(0, val);
    this._updateActiveSelection();
  }

  /* ─── Lifecycle ─── */

  connectedCallback() {
    this._attachGlobalShortcutListener();
    if (this.open) {
      this._onOpenStateChanged(true);
    }
  }

  disconnectedCallback() {
    this._removeGlobalShortcutListener();
    this._restoreBodyOverflow();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'open') {
      const isOpen = this.open;
      this._onOpenStateChanged(isOpen);
    } else if (name === 'placeholder' && this._inputEl) {
      this._inputEl.placeholder = this.placeholder;
    } else if (name === 'empty-text') {
      this._renderItems();
    }
  }

  /* ─── Public Methods ─── */

  public show() {
    this.open = true;
  }

  public hide(reason: string = 'programmatic') {
    this._closeReason = reason;
    this.open = false;
  }

  public toggle() {
    this.open = !this.open;
  }

  public selectCommand(id: string): boolean {
    const cmd = this._commands.find((c) => c.id === id);
    if (!cmd || cmd.disabled) return false;
    this._executeCommand(cmd);
    return true;
  }

  /* ─── Internal Template & Rendering ─── */

  private _renderTemplate() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${commandPaletteStyles}</style>
      <div class="skyra-command-palette-backdrop" id="backdrop" aria-hidden="true" inert>
        <div
          class="skyra-command-palette-modal"
          id="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          tabindex="-1"
        >
          <div class="skyra-command-palette-header">
            <svg class="skyra-command-palette-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="skyra-command-palette-input"
              id="search-input"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls="command-list"
              placeholder="${this.placeholder}"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
            />
            <button type="button" class="skyra-command-palette-clear-btn" id="clear-btn" aria-label="Clear search" style="display: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div
            class="skyra-command-palette-list"
            id="command-list"
            role="listbox"
            aria-label="Commands"
          >
            <!-- Items rendered dynamically -->
          </div>

          <div class="skyra-command-palette-footer" aria-hidden="true">
            <div class="skyra-command-palette-footer-item">
              <span class="skyra-command-palette-kbd">↑</span>
              <span class="skyra-command-palette-kbd">↓</span>
              <span>Navigate</span>
            </div>
            <div class="skyra-command-palette-footer-item">
              <span class="skyra-command-palette-kbd">↵</span>
              <span>Select</span>
            </div>
            <div class="skyra-command-palette-footer-item">
              <span class="skyra-command-palette-kbd">Esc</span>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this._backdropEl = this.shadowRoot.querySelector('#backdrop');
    this._modalEl = this.shadowRoot.querySelector('#modal');
    this._inputEl = this.shadowRoot.querySelector('#search-input');
    this._listEl = this.shadowRoot.querySelector('#command-list');
    this._clearBtnEl = this.shadowRoot.querySelector('#clear-btn');

    if (this._backdropEl) {
      this._backdropEl.addEventListener('click', this._boundHandleBackdropClick);
    }
    if (this._inputEl) {
      this._inputEl.addEventListener('keydown', this._boundHandleInputKeyDown);
      this._inputEl.addEventListener('input', this._boundHandleInputChange);
    }
    if (this._clearBtnEl) {
      this._clearBtnEl.addEventListener('click', () => {
        this.query = '';
        this._inputEl?.focus();
      });
    }

    this._renderItems();
  }

  private _onOpenStateChanged(isOpen: boolean) {
    this._backdropEl?.toggleAttribute('inert', !isOpen);
    this._backdropEl?.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      if (typeof document !== 'undefined') {
        this._previousActiveElement = document.activeElement as HTMLElement | null;
        this._lockBodyOverflow();
      }

      this._renderItems();

      // Focus search input after animation frame
      requestAnimationFrame(() => {
        this._inputEl?.focus();
      });

      this.dispatchEvent(
        new CustomEvent(COMMAND_PALETTE_OPEN_EVENT, {
          bubbles: true,
          composed: true,
          detail: { shortcut: this.shortcut },
        })
      );
      this.dispatchEvent(
        new CustomEvent(COMMAND_PALETTE_CHANGE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { open: true },
        })
      );
    } else {
      this._restoreBodyOverflow();
      this._query = '';
      if (this._inputEl) {
        this._inputEl.value = '';
      }
      this._activeIndex = 0;

      if (this._previousActiveElement && typeof this._previousActiveElement.focus === 'function') {
        try {
          this._previousActiveElement.focus();
        } catch {
          // ignore focus errors
        }
      }

      const reason = this._closeReason || 'close';
      this._closeReason = 'programmatic';
      this.dispatchEvent(
        new CustomEvent(COMMAND_PALETTE_CLOSE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { reason },
        })
      );
      this.dispatchEvent(
        new CustomEvent(COMMAND_PALETTE_CHANGE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { open: false },
        })
      );
    }
  }

  private _lockBodyOverflow() {
    if (typeof document === 'undefined' || !document.body) return;
    if (this._originalBodyOverflow === null) {
      this._originalBodyOverflow = document.body.style.overflow;
    }
    document.body.style.overflow = 'hidden';
  }

  private _restoreBodyOverflow() {
    if (typeof document === 'undefined' || !document.body) return;
    if (this._originalBodyOverflow !== null) {
      document.body.style.overflow = this._originalBodyOverflow;
      this._originalBodyOverflow = null;
    }
  }

  private _getFilteredCommands(): CommandItem[] {
    return filterCommands(this._commands, this._query);
  }

  private _getEnabledCommands(): CommandItem[] {
    return this._getFilteredCommands().filter((c) => !c.disabled);
  }

  private _renderItems() {
    if (!this._listEl) return;

    if (this._clearBtnEl) {
      this._clearBtnEl.style.display = this._query ? 'inline-flex' : 'none';
    }

    const filtered = this._getFilteredCommands();
    const enabled = this._getEnabledCommands();

    if (this._activeIndex >= enabled.length) {
      this._activeIndex = Math.max(0, enabled.length - 1);
    }

    if (filtered.length === 0) {
      this._listEl.innerHTML = `
        <div class="skyra-command-palette-empty" role="status" aria-live="polite">
          <svg class="skyra-command-palette-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>${this.emptyText}</span>
        </div>
      `;
      this._inputEl?.removeAttribute('aria-activedescendant');
      return;
    }

    // Group commands by category
    const groups = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      const g = cmd.group || 'General';
      const arr = groups.get(g) || [];
      arr.push(cmd);
      groups.set(g, arr);
    }

    let html = '';
    let flatEnabledIndex = 0;

    for (const [groupName, items] of groups.entries()) {
      const headingId = `${this._instanceId}-group-${groupName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      html += `
        <div class="skyra-command-palette-group" role="group" aria-labelledby="${headingId}">
          <div class="skyra-command-palette-group-heading" id="${headingId}">${groupName}</div>
      `;

      for (const cmd of items) {
        const itemId = `${this._instanceId}-item-${cmd.id}`;
        const isEnabled = !cmd.disabled;
        const isSelected = isEnabled && flatEnabledIndex === this._activeIndex;
        if (isEnabled) flatEnabledIndex += 1;

        const iconHtml = cmd.icon
          ? `<span class="skyra-command-palette-item-icon" aria-hidden="true">${cmd.icon}</span>`
          : `<span class="skyra-command-palette-item-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
              </svg>
            </span>`;

        const shortcutHtml = cmd.shortcut
          ? `<kbd class="skyra-command-palette-kbd">${cmd.shortcut}</kbd>`
          : '';

        const descHtml = cmd.description
          ? `<span class="skyra-command-palette-item-desc">${cmd.description}</span>`
          : '';

        html += `
          <div
            class="skyra-command-palette-item ${isSelected ? 'skyra-command-palette-item--selected' : ''} ${cmd.disabled ? 'skyra-command-palette-item--disabled' : ''}"
            id="${itemId}"
            role="option"
            data-id="${cmd.id}"
            aria-selected="${isSelected}"
            ${cmd.disabled ? 'aria-disabled="true"' : ''}
          >
            <div class="skyra-command-palette-item-main">
              ${iconHtml}
              <div class="skyra-command-palette-item-text">
                <span class="skyra-command-palette-item-label">${cmd.label}</span>
                ${descHtml}
              </div>
            </div>
            ${shortcutHtml}
          </div>
        `;
      }

      html += `</div>`;
    }

    this._listEl.innerHTML = html;

    // Attach click and hover listeners to items
    const itemElements = this._listEl.querySelectorAll<HTMLElement>('.skyra-command-palette-item');
    itemElements.forEach((el) => {
      const id = el.getAttribute('data-id');
      const cmd = filtered.find((c) => c.id === id);
      if (!cmd || cmd.disabled) return;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this._executeCommand(cmd);
      });

      el.addEventListener('mouseenter', () => {
        const enabledIdx = enabled.findIndex((c) => c.id === cmd.id);
        if (enabledIdx >= 0 && enabledIdx !== this._activeIndex) {
          this._activeIndex = enabledIdx;
          this._updateActiveSelection();
        }
      });
    });

    this._updateActiveSelection();
  }

  private _updateActiveSelection() {
    if (!this._listEl) return;
    const enabled = this._getEnabledCommands();
    const activeCmd = enabled[this._activeIndex];

    const items = this._listEl.querySelectorAll<HTMLElement>('.skyra-command-palette-item');
    items.forEach((el) => {
      const id = el.getAttribute('data-id');
      const isSelected = activeCmd && id === activeCmd.id;
      if (isSelected) {
        el.classList.add('skyra-command-palette-item--selected');
        el.setAttribute('aria-selected', 'true');
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ block: 'nearest' });
        }
      } else {
        el.classList.remove('skyra-command-palette-item--selected');
        el.setAttribute('aria-selected', 'false');
      }
    });

    if (activeCmd && this._inputEl) {
      this._inputEl.setAttribute('aria-activedescendant', `${this._instanceId}-item-${activeCmd.id}`);
    } else {
      this._inputEl?.removeAttribute('aria-activedescendant');
    }
  }

  private _executeCommand(cmd: CommandItem) {
    if (cmd.disabled) return;

    if (cmd.closeOnExecute !== false && this.closeOnSelect) {
      this._closeReason = 'select';
      this.open = false;
    }

    if (typeof cmd.onExecute === 'function') {
      try {
        cmd.onExecute();
      } catch (err) {
        console.error('Command execution error:', err);
      }
    }

    this.dispatchEvent(
      new CustomEvent(COMMAND_SELECT_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          command: cmd,
          id: cmd.id,
          label: cmd.label,
        },
      })
    );
  }

  /* ─── Keyboard & Backdrop Event Handlers ─── */

  private _handleGlobalKeyDown(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape' && this.closeOnEscape) {
      e.preventDefault();
      this._closeReason = 'escape';
      this.open = false;
      return;
    }

    if (!this.shortcut) return;

    const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
    const isMac = /(mac|iphone|ipad)/i.test(userAgent);
    let isMatch = matchesShortcutKey(e, this.shortcut, isMac ? 'mac' : 'windows');
    if (!isMatch && this.shortcut.toLowerCase().includes('mod')) {
      isMatch = matchesShortcutKey(e, this.shortcut, isMac ? 'windows' : 'mac');
    }

    // Check if event matches configured shortcut (e.g. mod+k)
    if (isMatch) {
      // If target is an editable input/textarea and palette is not open, ignore shortcut
      if (!this.open && isInputElement(e.target)) {
        return;
      }

      e.preventDefault();
      this.toggle();
    }
  }

  private _handleInputKeyDown(e: KeyboardEvent) {
    const enabled = this._getEnabledCommands();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (enabled.length > 0) {
        this.activeIndex = this._activeIndex + 1 >= enabled.length ? 0 : this._activeIndex + 1;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enabled.length > 0) {
        this.activeIndex = this._activeIndex - 1 < 0 ? enabled.length - 1 : this._activeIndex - 1;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.activeIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      this.activeIndex = Math.max(0, enabled.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeCmd = enabled[this._activeIndex];
      if (activeCmd) {
        this._executeCommand(activeCmd);
      }
    } else if (e.key === 'Escape' && this.closeOnEscape) {
      e.preventDefault();
      this._closeReason = 'escape';
      this.open = false;
    } else if (e.key === 'Tab') {
      // Keep focus inside dialog
      e.preventDefault();
    }
  }

  private _handleInputChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this._query = val;
    this._activeIndex = 0;
    this._renderItems();

    this.dispatchEvent(
      new CustomEvent(COMMAND_PALETTE_QUERY_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          query: this._query,
          count: this._getFilteredCommands().length,
        },
      })
    );
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop) return;
    if (e.target === this._backdropEl) {
      this._closeReason = 'backdrop';
      this.open = false;
    }
  }

  private _attachGlobalShortcutListener() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this._boundHandleGlobalKeyDown);
  }

  private _removeGlobalShortcutListener() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this._boundHandleGlobalKeyDown);
  }
}

export class SkyraTechCommandPaletteElement extends SkyraCommandPaletteElement {}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-command-palette')) {
    customElements.define('skyra-command-palette', SkyraCommandPaletteElement);
  }
  if (!customElements.get('skyra-tech-command-palette')) {
    customElements.define('skyra-tech-command-palette', SkyraTechCommandPaletteElement);
  }
}
