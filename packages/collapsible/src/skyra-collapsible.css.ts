export const collapsibleStyles = `
  :host {
    display: block;
    width: 100%;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
  }

  .skyra-collapsible-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    outline: none;
  }

  :host([disabled]) .skyra-collapsible-trigger,
  :host([aria-disabled="true"]) .skyra-collapsible-trigger {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .skyra-collapsible-trigger:focus-visible {
    box-shadow: 0 0 0 2px var(--skyra-bg, #ffffff), 0 0 0 4px var(--skyra-primary, #0284c7);
    border-radius: 4px;
    z-index: 1;
  }

  .skyra-collapsible-content {
    overflow: hidden;
    display: none;
  }

  :host([open]) .skyra-collapsible-content {
    display: block;
    animation: collapsibleDown 0.2s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([open]) .skyra-collapsible-content {
      animation: none;
    }
  }

  @keyframes collapsibleDown {
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
