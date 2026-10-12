export const contextMenuStyles = `
:host {
  display: block;
  position: relative;
  box-sizing: border-box;
  font-family: var(--skyra-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

*, *::before, *::after {
  box-sizing: border-box;
}

.skyra-context-menu-target {
  display: block;
  outline: none;
}

:host([disabled]) .skyra-context-menu-target {
  cursor: not-allowed;
  opacity: 0.6;
}

.skyra-context-menu-panel {
  position: fixed;
  z-index: var(--skyra-z-dropdown, 1000);
  background-color: var(--skyra-surface, #ffffff);
  color: var(--skyra-text, #0f172a);
  border: 1px solid var(--skyra-border, #e2e8f0);
  border-radius: var(--skyra-radius-lg, 0.5rem);
  box-shadow: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1));
  padding: var(--skyra-spacing-xs, 0.25rem);
  box-sizing: border-box;
  outline: none;
  display: none;
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
  max-height: 80vh;
}

:host([open]) .skyra-context-menu-panel {
  display: flex;
  flex-direction: column;
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .skyra-context-menu-panel {
    transition: none !important;
    transform: none !important;
  }
}
`;

export const itemStyles = `
:host {
  display: block;
  box-sizing: border-box;
  font-family: var(--skyra-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

*, *::before, *::after {
  box-sizing: border-box;
}

.skyra-menu-item-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.625rem;
  min-height: 2rem;
  border-radius: var(--skyra-radius-md, 0.375rem);
  font-size: var(--skyra-text-sm, 0.875rem);
  color: var(--skyra-text, #0f172a);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  user-select: none;
  outline: none;
  transition: background-color 0.1s ease, color 0.1s ease;
}

.skyra-menu-item-button:hover,
.skyra-menu-item-button:focus-visible,
:host([focused]) .skyra-menu-item-button {
  background-color: var(--skyra-bg-subtle, #f1f5f9);
  color: var(--skyra-text, #0f172a);
}

:host([destructive]) .skyra-menu-item-button {
  color: var(--skyra-danger, #ef4444);
}

:host([destructive]) .skyra-menu-item-button:hover,
:host([destructive]) .skyra-menu-item-button:focus-visible,
:host([destructive][focused]) .skyra-menu-item-button {
  background-color: var(--skyra-danger-light, #fee2e2);
  color: var(--skyra-danger, #ef4444);
}

:host([disabled]) .skyra-menu-item-button {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.skyra-menu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1rem;
  color: var(--skyra-text-muted, #64748b);
}

:host([destructive]) .skyra-menu-item-icon {
  color: var(--skyra-danger, #ef4444);
}

.skyra-menu-item-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skyra-menu-item-shortcut {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--skyra-text-muted, #64748b);
  font-family: var(--skyra-font-mono, monospace);
  padding-left: 0.5rem;
}

.skyra-menu-item-trailing {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
}

.skyra-menu-item-check-indicator,
.skyra-menu-item-radio-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  flex-shrink: 0;
  color: var(--skyra-primary, #f97316);
}
`;

export const separatorStyles = `
:host {
  display: block;
  height: 1px;
  background-color: var(--skyra-border, #e2e8f0);
  margin: 0.25rem 0;
}
`;

export const groupStyles = `
:host {
  display: block;
}

.skyra-menu-group-label {
  padding: 0.375rem 0.625rem 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--skyra-text-muted, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
`;
