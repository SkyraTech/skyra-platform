export const calendarCss = `
:host {
  display: block;
  user-select: none;
  font-family: var(--skyra-font-body, system-ui, sans-serif);
}

.calendar-container {
  padding: 0.75rem;
  background: var(--skyra-surface, #ffffff);
  border-radius: var(--skyra-radius-md, 6px);
  width: 280px;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.nav-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: var(--skyra-radius-sm, 4px);
  color: var(--skyra-text-muted, #71717a);
  display: flex;
  align-items: center;
  outline: none;
}
.nav-btn:hover:not(:disabled) {
  background: var(--skyra-bg-hover, #f4f4f5);
  color: var(--skyra-text, #18181b);
}
.nav-btn:focus-visible {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--skyra-text, #18181b);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 4px;
}

.weekday {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--skyra-text, #18181b);
  padding: 4px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-btn {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-family: inherit;
  font-weight: 400;
  color: var(--skyra-text, #18181b);
  background: transparent;
  border: none;
  border-radius: var(--skyra-radius-sm, 4px);
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s, color 0.2s;
}

.day-btn.not-current-month {
  color: var(--skyra-text-muted, #71717a);
}

.day-btn.today {
  font-weight: 600;
  border: 1px solid var(--skyra-primary, #3b82f6);
  background: var(--skyra-bg, #f8fafc);
}

.day-btn.selected {
  font-weight: 700;
  color: #ffffff !important;
  background: var(--skyra-primary, #3b82f6) !important;
  border-color: var(--skyra-primary, #3b82f6);
}

.day-btn.in-range {
  background: var(--skyra-primary-light, #eff6ff);
  border-radius: 0;
}

.day-btn:hover:not(:disabled):not(.selected) {
  background: var(--skyra-bg-hover, #f4f4f5);
}
.day-btn.in-range:hover:not(:disabled):not(.selected) {
  background: var(--skyra-primary-hover-light, #dbeafe);
}

.day-btn:focus-visible {
  box-shadow: inset 0 0 0 2px var(--skyra-focus-ring, #3b82f6);
}

.day-btn:disabled {
  color: var(--skyra-text-subtle, #a1a1aa) !important;
  cursor: not-allowed;
  background: transparent !important;
  opacity: 0.35;
  border-color: transparent !important;
}

.footer {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--skyra-border, #e4e4e7);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.today-btn {
  background: none;
  border: none;
  color: var(--skyra-text, #18181b);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--skyra-radius-sm, 4px);
  outline: none;
}
.today-btn:hover {
  background: var(--skyra-bg-hover, #f4f4f5);
}
.today-btn:focus-visible {
  box-shadow: var(--skyra-focus-ring, 0 0 0 2px #3b82f6);
}

.footer-date {
  font-size: 0.72rem;
  color: var(--skyra-text-muted, #71717a);
}
`;