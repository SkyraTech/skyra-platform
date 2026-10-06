export const css = `
:host {
  display: block;
  font-family: var(--skyra-font-body);
  width: 100%;
}

.skyra-dynamic-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skyra-dynamic-form *,
  .skyra-dynamic-form button,
  .skyra-dynamic-form input {
    transition: none !important;
    animation: none !important;
  }
}

/* Form Level Alerts */
.skyra-form-alert {
  background: var(--skyra-danger-light, rgba(239, 68, 68, 0.08));
  border: 1px solid var(--skyra-danger);
  border-radius: var(--skyra-radius-md);
  padding: 0.85rem 1.25rem;
  color: var(--skyra-danger);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

/* Validation Summary */
.skyra-validation-summary {
  background: var(--skyra-danger-light, rgba(239, 68, 68, 0.08));
  border: 1px solid var(--skyra-danger);
  border-radius: var(--skyra-radius-md);
  padding: 1rem 1.25rem;
  color: var(--skyra-danger);
}

.skyra-validation-summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.skyra-validation-summary ul {
  margin: 0;
  padding-left: 1.5rem;
  font-size: 0.825rem;
}

/* Fieldset */
.skyra-fieldset-card {
  margin: 0;
  padding: 0;
  border: none;
}
.skyra-fieldset-card.framed {
  border: 1px solid var(--skyra-border);
  border-radius: var(--skyra-radius-xl);
  background: var(--skyra-surface);
  box-shadow: var(--skyra-shadow-sm);
}

.skyra-fieldset-legend {
  display: block;
  float: left;
  width: 100%;
  margin: 0;
  padding: 1rem 1.25rem;
  background: var(--skyra-bg-alt);
  border-bottom: 1px solid var(--skyra-border);
  border-radius: var(--skyra-radius-xl) var(--skyra-radius-xl) 0 0;
  box-sizing: border-box;
}

.skyra-fieldset-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skyra-fieldset-title {
  margin: 0;
  font-family: var(--skyra-font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--skyra-text);
}

.skyra-fieldset-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--skyra-text-muted);
}

.skyra-fieldset-collapse-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--skyra-radius-sm);
  color: var(--skyra-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
.skyra-fieldset-collapse-btn:hover {
  background: var(--skyra-bg);
}

.skyra-fieldset-body {
  clear: both;
  padding: 1.5rem;
}
.skyra-fieldset-body.collapsed {
  display: none;
}

/* Form Grid */
.skyra-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 1.5rem;
}

/* Field Wrap */
.skyra-field-wrap {
  display: block;
}

/* Repeatable Group */
.skyra-repeatable-group {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--skyra-bg);
  border: 1px solid var(--skyra-border);
  border-radius: var(--skyra-radius-lg);
}

.skyra-repeatable-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skyra-repeatable-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--skyra-text);
}
.skyra-repeatable-count {
  font-size: 0.75rem;
  color: var(--skyra-text-muted);
}

.skyra-repeatable-empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--skyra-text-muted);
  font-style: italic;
}

.skyra-repeatable-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skyra-repeatable-item {
  position: relative;
  border: 1px solid var(--skyra-border);
  border-radius: var(--skyra-radius-md);
  padding: 1rem;
  background: var(--skyra-surface);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.skyra-repeatable-item:focus-within {
  border-color: var(--skyra-primary);
  box-shadow: 0 0 0 1px var(--skyra-primary);
}

.skyra-repeatable-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed var(--skyra-border);
}

.skyra-repeatable-item-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--skyra-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skyra-repeatable-item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: 1rem;
}

/* Actions Row */
.skyra-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Danger Zone */
.skyra-danger-zone {
  margin-top: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--skyra-danger);
  border-radius: var(--skyra-radius-lg);
  background: var(--skyra-danger-light, rgba(239, 68, 68, 0.05));
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.skyra-danger-zone h4 {
  margin: 0 0 0.25rem;
  color: var(--skyra-danger);
  font-weight: 700;
  font-size: 1rem;
}

.skyra-danger-zone p {
  margin: 0;
  color: var(--skyra-text-muted);
  font-size: 0.85rem;
}
`;
