export const timeFieldCss = `
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
}

.inputs-container:focus-within {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.inputs-container.disabled {
  background: var(--skyra-border, #e4e4e7);
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

.colon {
  color: var(--skyra-text-muted, #71717a);
  font-weight: 600;
}

.time-select-btn {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--skyra-text, #18181b);
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: var(--skyra-radius-sm, 4px);
  transition: box-shadow 0.2s;
}

.time-select-btn:focus-visible {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.time-select-btn:disabled {
  cursor: not-allowed;
  color: var(--skyra-text-subtle, #a1a1aa);
}

.am-pm-toggle {
  display: flex;
  margin-left: auto;
  border: 1px solid var(--skyra-border, #e4e4e7);
  border-radius: var(--skyra-radius-sm, 4px);
  overflow: hidden;
  background: var(--skyra-surface, #ffffff);
  flex-shrink: 0;
}

.am-pm-btn {
  border: none;
  padding: 2px 6px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--skyra-text-muted, #71717a);
  outline: none;
}

.am-pm-btn.active {
  background: var(--skyra-primary, #3b82f6);
  color: #ffffff;
}

.am-pm-btn:disabled {
  cursor: not-allowed;
}
.am-pm-btn:focus-visible {
  box-shadow: inset 0 0 0 2px var(--skyra-focus-ring, #3b82f6);
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
  margin-left: auto;
  flex-shrink: 0;
}
.am-pm-toggle + .clear-btn {
  margin-left: 0;
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
  z-index: 50;
  background: var(--skyra-surface, #ffffff);
  border: 1px solid var(--skyra-border, #e4e4e7);
  border-radius: var(--skyra-radius-md, 6px);
  box-shadow: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
  display: none;
  max-height: 220px;
  overflow-y: auto;
  flex-direction: column;
  padding: 4px;
  min-width: 60px;
  outline: none;
}
.popover.open {
  display: flex;
}

.option-btn {
  padding: 6px 8px;
  background: transparent;
  color: var(--skyra-text, #18181b);
  border: none;
  border-radius: var(--skyra-radius-sm, 4px);
  text-align: center;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 400;
  outline: none;
}

.option-btn.selected {
  background: var(--skyra-primary, #3b82f6);
  color: #ffffff;
  font-weight: 600;
}

.option-btn:not(.selected):hover, .option-btn:not(.selected):focus {
  background: var(--skyra-bg, #f4f4f5);
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