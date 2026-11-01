export const drawerStyles = `
  :host {
    display: contents;
    --drawer-width-sm: 360px;
    --drawer-width-md: 480px;
    --drawer-width-lg: 640px;
    --drawer-width-xl: 800px;
  }

  .skyra-drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    z-index: var(--skyra-z-modal, 200);
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  :host([open]) .skyra-drawer-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  .skyra-drawer-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: var(--drawer-width-md);
    max-width: 100vw;
    background: var(--skyra-surface, #ffffff);
    color: var(--skyra-text, #0f172a);
    box-shadow: var(--skyra-shadow-lg, 0 10px 30px rgba(0, 0, 0, 0.15));
    border-left: 1px solid var(--skyra-border, #e2e8f0);
    z-index: calc(var(--skyra-z-modal, 200) + 1);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
  }

  :host([position="left"]) .skyra-drawer-panel {
    left: 0;
    right: auto;
    border-left: none;
    border-right: 1px solid var(--skyra-border, #e2e8f0);
    transform: translateX(-100%);
  }

  :host([position="bottom"]) .skyra-drawer-panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    max-height: 80vh;
    border-left: none;
    border-top: 1px solid var(--skyra-border, #e2e8f0);
    transform: translateY(100%);
  }

  :host([size="sm"]) .skyra-drawer-panel { width: var(--drawer-width-sm); }
  :host([size="md"]) .skyra-drawer-panel { width: var(--drawer-width-md); }
  :host([size="lg"]) .skyra-drawer-panel { width: var(--drawer-width-lg); }
  :host([size="xl"]) .skyra-drawer-panel { width: var(--drawer-width-xl); }
  :host([size="full"]) .skyra-drawer-panel { width: 100vw; }

  :host([open]) .skyra-drawer-panel {
    transform: translate(0, 0);
  }

  .skyra-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--skyra-border, #e2e8f0);
    flex-shrink: 0;
  }

  .skyra-drawer-title {
    margin: 0;
    font-family: var(--skyra-font-display, 'Outfit', sans-serif);
    font-size: 16px;
    font-weight: 600;
    color: var(--skyra-text, #0f172a);
  }

  .skyra-drawer-close {
    background: transparent;
    border: none;
    color: var(--skyra-text-muted, #64748b);
    cursor: pointer;
    padding: 6px;
    border-radius: var(--skyra-radius-sm, 6px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .skyra-drawer-close:hover {
    background: var(--skyra-primary-light, rgba(10, 88, 202, 0.1));
    color: var(--skyra-primary, #0A58CA);
  }

  .skyra-drawer-close:focus-visible {
    outline: none;
    box-shadow: var(--skyra-focus-ring, 0 0 0 3px rgba(10, 88, 202, 0.12));
  }

  .skyra-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
  }

  .skyra-drawer-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid var(--skyra-border, #e2e8f0);
    background: var(--skyra-bg, #f4f7fc);
    flex-shrink: 0;
  }

  .skyra-drawer-footer:empty {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-drawer-backdrop,
    .skyra-drawer-panel {
      transition: none !important;
    }
  }
`;

