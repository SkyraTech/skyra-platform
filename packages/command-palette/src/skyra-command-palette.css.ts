export const commandPaletteStyles = `
:host {
  display: contents;
}

.skyra-command-palette-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: var(--skyra-z-modal, 9999);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1rem 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

:host([open]) .skyra-command-palette-backdrop {
  opacity: 1;
  pointer-events: auto;
}

.skyra-command-palette-modal {
  width: 100%;
  max-width: 640px;
  background: var(--skyra-surface, #ffffff);
  color: var(--skyra-text, #0f172a);
  border: 1px solid var(--skyra-border, #e2e8f0);
  border-radius: var(--skyra-radius-xl, 14px);
  box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(-8px) scale(0.98);
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

:host([open]) .skyra-command-palette-modal {
  transform: translateY(0) scale(1);
}

/* Header & Search Input */
.skyra-command-palette-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  border-bottom: 1px solid var(--skyra-border, #e2e8f0);
  background: var(--skyra-surface, #ffffff);
}

.skyra-command-palette-search-icon {
  width: 18px;
  height: 18px;
  color: var(--skyra-text-muted, #64748b);
  flex-shrink: 0;
}

.skyra-command-palette-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--skyra-text, #0f172a);
  padding: 0;
  margin: 0;
}

.skyra-command-palette-input::placeholder {
  color: var(--skyra-text-muted, #94a3b8);
}

.skyra-command-palette-clear-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--skyra-radius-full, 9999px);
  color: var(--skyra-text-muted, #94a3b8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.skyra-command-palette-clear-btn:hover {
  color: var(--skyra-text, #0f172a);
  background: var(--skyra-bg-muted, #f1f5f9);
}

/* List container */
.skyra-command-palette-list {
  max-height: min(58vh, 380px);
  overflow-y: auto;
  padding: 0.5rem;
  scroll-behavior: smooth;
}

.skyra-command-palette-list::-webkit-scrollbar {
  width: 6px;
}
.skyra-command-palette-list::-webkit-scrollbar-thumb {
  background: var(--skyra-border, #cbd5e1);
  border-radius: 9999px;
}

/* Group headings */
.skyra-command-palette-group {
  margin-bottom: 0.375rem;
}

.skyra-command-palette-group-heading {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--skyra-text-muted, #64748b);
  padding: 0.5rem 0.625rem 0.25rem;
  user-select: none;
}

/* Command Item */
.skyra-command-palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--skyra-radius-md, 8px);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  color: var(--skyra-text, #0f172a);
  transition: background-color 0.1s ease, color 0.1s ease;
}

.skyra-command-palette-item--selected {
  background: var(--skyra-primary-light, rgba(14, 165, 233, 0.1));
  color: var(--skyra-primary, #0ea5e9);
}

.skyra-command-palette-item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.skyra-command-palette-item-main {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  flex: 1;
}

.skyra-command-palette-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.skyra-command-palette-item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.skyra-command-palette-item-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
}

.skyra-command-palette-item-desc {
  font-size: 0.75rem;
  color: var(--skyra-text-muted, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.1rem;
}

/* Kbd badge */
.skyra-command-palette-kbd {
  font-family: inherit;
  font-size: 0.675rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  background: var(--skyra-surface, #ffffff);
  border: 1px solid var(--skyra-border, #e2e8f0);
  border-radius: var(--skyra-radius-sm, 4px);
  color: var(--skyra-text-muted, #64748b);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

/* Empty State */
.skyra-command-palette-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  color: var(--skyra-text-muted, #64748b);
  font-size: 0.875rem;
  text-align: center;
  gap: 0.5rem;
}

.skyra-command-palette-empty-icon {
  width: 24px;
  height: 24px;
  opacity: 0.6;
}

/* Separator */
.skyra-command-palette-separator {
  height: 1px;
  background: var(--skyra-border, #e2e8f0);
  margin: 0.375rem 0;
  border: none;
}

/* Footer */
.skyra-command-palette-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--skyra-bg-muted, #f8fafc);
  border-top: 1px solid var(--skyra-border, #e2e8f0);
  font-size: 0.75rem;
  color: var(--skyra-text-muted, #64748b);
  user-select: none;
}

.skyra-command-palette-footer-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skyra-command-palette-backdrop,
  .skyra-command-palette-modal,
  .skyra-command-palette-item {
    transition: none !important;
    animation: none !important;
  }
}

/* Mobile responsive constraints */
@media (max-width: 640px) {
  .skyra-command-palette-backdrop {
    padding: 1rem 0.5rem;
    align-items: flex-start;
  }

  .skyra-command-palette-modal {
    max-height: calc(100dvh - 2rem);
  }

  .skyra-command-palette-footer {
    display: none;
  }
}
`;
