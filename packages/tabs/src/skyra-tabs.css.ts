export const tabsStyles = `
  :host {
    display: flex;
    flex-direction: column;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    width: 100%;
  }

  :host([orientation="vertical"]) {
    flex-direction: row;
  }

  .skyra-tabs-list {
    display: flex;
    position: relative;
    border-bottom: 1px solid var(--skyra-border, #e2e8f0);
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
  }
  
  .skyra-tabs-list::-webkit-scrollbar {
    display: none; /* Safari/Chrome */
  }

  :host([orientation="vertical"]) .skyra-tabs-list {
    flex-direction: column;
    border-bottom: none;
    border-right: 1px solid var(--skyra-border, #e2e8f0);
    overflow-x: visible;
    overflow-y: auto;
    min-width: 150px;
  }

  /* Variant: pill */
  :host([variant="pill"]) .skyra-tabs-list {
    border-bottom: none;
    border-right: none;
    background-color: var(--skyra-bg-muted, #f1f5f9);
    padding: 0.25rem;
    border-radius: 0.5rem;
    gap: 0.25rem;
  }
  
  :host([variant="pill"][orientation="vertical"]) .skyra-tabs-list {
    background-color: transparent;
    padding: 0;
  }

  /* Variant: line is default */
  
  .skyra-tabs-panels {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }
`;

export const tabStyles = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--skyra-text-muted, #64748b);
    cursor: pointer;
    background: transparent;
    border: none;
    white-space: nowrap;
    transition: color 0.2s, background-color 0.2s;
    outline: none;
    user-select: none;
    font-family: inherit;
    appearance: none;
    margin: 0;
  }

  /* Line Variant */
  :host-context(skyra-tabs[variant="line"])::after,
  :host-context(skyra-tabs:not([variant]))::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: transparent;
    transition: background-color 0.2s;
  }
  
  :host-context(skyra-tabs[orientation="vertical"][variant="line"])::after,
  :host-context(skyra-tabs[orientation="vertical"]:not([variant]))::after {
    bottom: 0;
    left: auto;
    right: -1px;
    width: 2px;
    height: auto;
    top: 0;
  }

  /* Hover states */
  :host(:hover:not([disabled]):not([aria-disabled="true"])) {
    color: var(--skyra-text, #0f172a);
  }

  /* Active/Selected states */
  :host([aria-selected="true"]) {
    color: var(--skyra-primary, #0284c7);
  }

  :host-context(skyra-tabs[variant="line"])[aria-selected="true"]::after,
  :host-context(skyra-tabs:not([variant]))[aria-selected="true"]::after {
    background-color: var(--skyra-primary, #0284c7);
  }

  /* Pill Variant */
  :host-context(skyra-tabs[variant="pill"]) {
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
  }
  
  :host-context(skyra-tabs[variant="pill"])[aria-selected="true"] {
    background-color: var(--skyra-bg, #ffffff);
    color: var(--skyra-text, #0f172a);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* Focus ring */
  :host(:focus-visible) {
    box-shadow: 0 0 0 2px var(--skyra-bg, #ffffff), 0 0 0 4px var(--skyra-primary, #0284c7);
    border-radius: 4px;
    z-index: 1;
  }

  /* Disabled state */
  :host([disabled]), :host([aria-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const tabPanelStyles = `
  :host {
    display: block;
    padding: 1rem 0;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    animation: fadeIn 0.2s ease-in-out;
  }
  
  :host([hidden]) {
    display: none !important;
  }

  :host(:focus-visible) {
    outline: 2px solid var(--skyra-primary, #0284c7);
    outline-offset: -2px;
    border-radius: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      animation: none;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
