export const dynamicSelectStyles = `
  :host([data-open]) {
    position: relative;
    z-index: 1000;
  }
  :host([data-open]) .wrapper {
    z-index: 1000;
  }

  :host {
    display: block;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-select-text: var(--skyra-text, #1f2937);
    --skyra-select-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-select-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-select-bg: var(--skyra-bg, #ffffff);
    --skyra-select-surface: var(--skyra-surface, #f9fafb);
    --skyra-select-border: var(--skyra-border, #e5e7eb);
    --skyra-select-primary: var(--skyra-primary, #0A58CA);
    --skyra-select-primary-light: var(--skyra-primary-light, #e0f2fe);
    --skyra-select-danger: var(--skyra-danger, #EF4444);
    
    --skyra-select-radius-sm: var(--skyra-radius-sm, 6px);
    --skyra-select-radius-md: var(--skyra-radius-md, 8px);
    --skyra-select-radius-xs: var(--skyra-radius-xs, 4px);
    
    --skyra-select-shadow-lg: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05));
    --skyra-select-shadow-glow: var(--skyra-shadow-glow, 0 0 0 2px rgba(10, 88, 202, 0.2));
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
    position: relative;
  }

  /* Label */
  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--skyra-select-text);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  :host([disabled]) .label {
    color: var(--skyra-select-text-subtle);
  }

  .required-asterisk {
    color: var(--skyra-select-danger);
  }

  /* Trigger */
  .trigger {
    width: 100%;
    height: 42px;
    min-height: 42px;
    max-height: 42px;
    padding: 0.45rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    background: var(--skyra-select-bg);
    border: 1px solid var(--skyra-select-border);
    border-radius: var(--skyra-select-radius-md);
    cursor: pointer;
    outline: none;
    text-align: left;
    overflow: hidden;
    box-sizing: border-box;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  :host([disabled]) .trigger {
    background: var(--skyra-select-border);
    cursor: not-allowed;
  }

  .trigger.open {
    border-color: var(--skyra-select-primary);
    box-shadow: var(--skyra-select-shadow-glow);
  }

  .trigger.error {
    border-color: var(--skyra-select-danger);
  }

  /* Content area inside trigger */
  .trigger-content {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .placeholder {
    color: var(--skyra-select-text-subtle);
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .single-value {
    display: block;
    font-size: 0.875rem;
    color: var(--skyra-select-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  /* Multi-select chips */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.15rem 0.5rem;
    background: var(--skyra-select-primary-light);
    color: var(--skyra-select-primary);
    border-radius: var(--skyra-select-radius-sm);
    font-size: 0.78rem;
    font-weight: 600;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chip-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    padding: 2px;
    color: currentColor;
    background: transparent;
    border: none;
  }
  
  .chip-remove:hover {
    background: rgba(0,0,0,0.05);
  }

  .overflow-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.15rem 0.45rem;
    background: var(--skyra-select-border);
    color: var(--skyra-select-text-muted);
    border-radius: var(--skyra-select-radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    border: none;
  }

  /* Trigger Actions */
  .trigger-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .clear-btn {
    cursor: pointer;
    color: var(--skyra-select-text-subtle);
    display: inline-flex;
    padding: 2px;
    border-radius: var(--skyra-select-radius-sm);
    background: none;
    border: none;
  }
  
  .clear-btn:hover {
    color: var(--skyra-select-text);
  }

  .chevron {
    color: var(--skyra-select-text-muted);
    transition: transform 0.2s ease;
  }
  
  .trigger.open .chevron {
    transform: rotate(180deg);
  }

  /* Listbox (Dropdown Menu) */
  .listbox {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    background: var(--skyra-select-surface);
    border: 1px solid var(--skyra-select-border);
    border-radius: var(--skyra-select-radius-md);
    box-shadow: var(--skyra-select-shadow-lg);
    z-index: 1001;
    overflow: hidden;
    display: none;
    flex-direction: column;
    animation: skyra-fade-in-up 0.2s ease forwards;
  }

  .listbox.open {
    display: flex;
  }

  :host([placement="top"]) .listbox {
    top: auto;
    bottom: calc(100% + 4px);
    box-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
    animation: skyra-fade-in-down 0.2s ease forwards;
  }

  @keyframes skyra-fade-in-down {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Search Header */
  .search-header {
    padding: 0.5rem 0.65rem;
    border-bottom: 1px solid var(--skyra-select-border);
    background: var(--skyra-select-surface);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.6rem;
    background: var(--skyra-select-bg);
    border: 1px solid var(--skyra-select-border);
    border-radius: var(--skyra-select-radius-sm);
  }

  .search-input {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.85rem;
    color: var(--skyra-select-text);
    font-family: inherit;
  }

  .search-clear {
    background: none;
    border: none;
    color: var(--skyra-select-text-subtle);
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Select All Row */
  .select-all-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--skyra-select-border);
    background: var(--skyra-select-bg);
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
  }
  
  .select-all-info {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--skyra-select-text-muted);
    background: var(--skyra-select-surface);
    padding: 0.15rem 0.45rem;
    border-radius: var(--skyra-select-radius-sm);
    border: 1px solid var(--skyra-select-border);
  }

  /* Options list */
  .options-container {
    overflow-y: auto;
    min-height: 0;
    flex: 1;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .empty-state {
    padding: 0.75rem 1rem;
    text-align: center;
    color: var(--skyra-select-text-subtle);
    font-size: 0.85rem;
  }

  .create-btn {
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.35rem 0.65rem;
    background: var(--skyra-select-primary-light);
    color: var(--skyra-select-primary);
    border: 1px solid var(--skyra-select-primary);
    border-radius: var(--skyra-select-radius-sm);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .group-header {
    padding: 0.35rem 0.75rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--skyra-select-text-subtle);
    background: var(--skyra-select-bg);
    border-radius: var(--skyra-select-radius-sm);
  }

  .option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    padding: 0.55rem 0.75rem;
    border-radius: var(--skyra-select-radius-sm);
    background: transparent;
    color: var(--skyra-select-text);
    font-size: 0.85rem;
    cursor: pointer;
    border: none;
    text-align: left;
    transition: background 0.2s ease;
  }

  .option:hover,
  .option.focused {
    background: var(--skyra-select-bg);
  }

  .option.selected {
    background: var(--skyra-select-primary-light);
    color: var(--skyra-select-primary);
  }
  
  .option[aria-disabled="true"] {
    opacity: 0.55;
    color: var(--skyra-select-text-subtle);
    cursor: not-allowed;
  }

  .option-text-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 1px;
    flex: 1;
  }

  .option-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .option.selected .option-label {
    font-weight: 600;
  }

  .option-desc {
    font-size: 0.75rem;
    color: var(--skyra-select-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Multi-Select Sticky Footer */
  .multi-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--skyra-select-border);
    background: var(--skyra-select-bg);
    flex-shrink: 0;
  }
  
  .multi-footer-text {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--skyra-select-text-muted);
  }

  .multi-footer-clear {
    background: none;
    border: none;
    color: var(--skyra-select-danger);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: var(--skyra-select-radius-xs);
  }

  /* Error / Helper */
  .helper-text {
    font-size: 0.78rem;
    color: var(--skyra-select-text-muted);
  }

  .error-text {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    color: var(--skyra-select-danger);
  }

  /* Icons */
  .icon-svg {
    width: 14px;
    height: 14px;
    stroke-width: 2;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .icon-check { width: 16px; height: 16px; stroke-width: 2; }
  .icon-check-small { width: 12px; height: 12px; stroke-width: 3; }
  
  .checkbox {
    width: 18px;
    height: 18px;
    border-radius: var(--skyra-select-radius-xs);
    border: 1.5px solid var(--skyra-select-border);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .checkbox.checked, .checkbox.indeterminate {
    border-color: var(--skyra-select-primary);
    background: var(--skyra-select-primary);
  }
  
  .indeterminate-line {
    width: 8px;
    height: 2px;
    background: #ffffff;
    border-radius: 1px;
  }

  .skyra-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes skyra-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
