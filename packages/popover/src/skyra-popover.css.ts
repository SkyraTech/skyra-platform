export const popoverStyles = `
:host {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  font-family: var(--skyra-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

*, *::before, *::after {
  box-sizing: border-box;
}

.skyra-popover-trigger-wrapper {
  display: inline-block;
  cursor: pointer;
  outline: none;
  border-radius: var(--skyra-radius-md, 0.375rem);
}

.skyra-popover-trigger-wrapper:focus-visible {
  outline: 2px solid var(--skyra-primary, #f97316);
  outline-offset: 2px;
}

:host([disabled]) .skyra-popover-trigger-wrapper {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.skyra-popover-panel {
  position: fixed;
  z-index: var(--skyra-z-popover, 1000);
  background-color: var(--skyra-surface, #ffffff);
  color: var(--skyra-text, #0f172a);
  border: 1px solid var(--skyra-border, #e2e8f0);
  border-radius: var(--skyra-radius-lg, 0.5rem);
  box-shadow: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1));
  padding: var(--skyra-spacing-md, 0.75rem);
  box-sizing: border-box;
  outline: none;
  overflow-wrap: break-word;
  display: none;
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

:host([open]) .skyra-popover-panel {
  display: block;
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .skyra-popover-panel {
    transition: none !important;
    transform: none !important;
  }
}
`;
