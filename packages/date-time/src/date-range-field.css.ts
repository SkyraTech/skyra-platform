export const dateRangeFieldCss = `
:host {
  display: block;
  font-family: var(--skyra-font-body, system-ui, sans-serif);
  position: relative;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--skyra-text, #18181b);
}

label.disabled {
  color: var(--skyra-text-subtle, #a1a1aa);
}

.inputs-container {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 42px;
  padding: 0 0.75rem;
  background: var(--skyra-bg, #ffffff);
  border: 1px solid var(--skyra-border, #e4e4e7);
  border-radius: var(--skyra-radius-md, 6px);
  box-sizing: border-box;
  position: relative;
  transition: box-shadow 0.2s, border-color 0.2s;
  cursor: text;
}

.inputs-container:focus-within {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.inputs-container.disabled {
  background: var(--skyra-border, #e4e4e7);
  cursor: not-allowed;
  opacity: 0.7;
}

.inputs-container.error {
  border-color: var(--skyra-danger, #ef4444);
}

.icon {
  color: var(--skyra-text-muted, #71717a);
  flex-shrink: 0;
  display: flex;
}

.divider {
  color: var(--skyra-text-muted, #71717a);
  font-weight: 500;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: var(--skyra-text, #18181b);
  padding: 0;
  min-width: 0;
  font-family: inherit;
  text-align: center;
}
input::placeholder {
  color: var(--skyra-text-muted, #71717a);
}
input:disabled {
  cursor: not-allowed;
  color: var(--skyra-text-subtle, #a1a1aa);
}

.clear-btn {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--skyra-text-subtle, #a1a1aa);
  display: flex;
  outline: none;
  border-radius: 4px;
}
.clear-btn:hover {
  color: var(--skyra-text, #18181b);
}
.clear-btn:focus-visible {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  background: var(--skyra-surface, #ffffff);
  border: 1px solid var(--skyra-border, #e4e4e7);
  border-radius: var(--skyra-radius-md, 6px);
  box-shadow: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
  display: none;
}
.popover.open {
  display: block;
}

.helper-text {
  font-size: 0.78rem;
  color: var(--skyra-text-muted, #71717a);
}

.error-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--skyra-danger, #ef4444);
}
`;