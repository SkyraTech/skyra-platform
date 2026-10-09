export const accordionStyles = `
  :host {
    display: block;
    width: 100%;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
  }
`;

export const accordionItemStyles = `
  :host {
    display: block;
    border-bottom: 1px solid var(--skyra-border, #e2e8f0);
  }

  :host(:last-child) {
    border-bottom: none;
  }

  .skyra-accordion-header {
    display: flex;
    margin: 0;
    padding: 0;
  }

  .skyra-accordion-trigger {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    font-size: 1rem;
    font-weight: 500;
    font-family: inherit;
    color: var(--skyra-text, #0f172a);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;
    text-align: left;
    outline: none;
  }

  :host([disabled]) .skyra-accordion-trigger,
  :host([aria-disabled="true"]) .skyra-accordion-trigger {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .skyra-accordion-trigger:focus-visible {
    box-shadow: 0 0 0 2px var(--skyra-bg, #ffffff), 0 0 0 4px var(--skyra-primary, #0284c7);
    border-radius: 4px;
    z-index: 1;
  }

  .skyra-accordion-trigger:hover:not([disabled]):not([aria-disabled="true"]) {
    color: var(--skyra-primary, #0284c7);
  }

  .skyra-accordion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    color: var(--skyra-text-muted, #64748b);
  }

  :host([data-state="open"]) .skyra-accordion-icon {
    transform: rotate(180deg);
  }

  .skyra-accordion-content {
    overflow: hidden;
    font-size: 0.875rem;
    color: var(--skyra-text-muted, #64748b);
    display: none;
    padding-bottom: 1rem;
  }

  :host([data-state="open"]) .skyra-accordion-content {
    display: block;
    animation: accordionDown 0.2s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([data-state="open"]) .skyra-accordion-content {
      animation: none;
    }
  }

  @keyframes accordionDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
