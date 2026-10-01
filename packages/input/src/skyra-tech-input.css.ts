export const inputStyles = `
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-input-text: var(--skyra-text, #1f2937);
    --skyra-input-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-input-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-input-bg: var(--skyra-bg, #ffffff);
    --skyra-input-surface: var(--skyra-surface, #f9fafb);
    --skyra-input-border: var(--skyra-border, #e5e7eb);
    --skyra-input-primary: var(--skyra-primary, #0A58CA);
    --skyra-input-danger: var(--skyra-danger, #EF4444);
    --skyra-input-success: var(--skyra-success, #10B981);
    --skyra-input-warning: var(--skyra-warning, #F59E0B);
    --skyra-input-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));
    --skyra-input-radius: var(--skyra-radius-md, 0.375rem);
    --skyra-input-duration: var(--skyra-duration-fast, 0.15s);
  }

  .skyra-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--skyra-input-text);
  }
  
  :host([disabled]) .skyra-label {
    color: var(--skyra-input-text-subtle);
  }

  .skyra-label--required::after {
    content: '*';
    color: var(--skyra-input-danger);
    margin-left: 4px;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .left-adornment {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--skyra-input-text-muted);
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 1;
  }
  
  .right-adornment {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--skyra-input-text-muted);
    z-index: 1;
  }

  .skyra-input {
    display: block;
    width: 100%;
    height: 42px;
    padding: 0.65rem 0.875rem;
    background: var(--skyra-input-bg);
    border: 1px solid var(--skyra-input-border);
    border-radius: var(--skyra-input-radius);
    color: var(--skyra-input-text);
    font-family: inherit;
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color var(--skyra-input-duration), box-shadow var(--skyra-input-duration);
  }

  .skyra-input::placeholder {
    color: var(--skyra-input-text-subtle);
  }

  .skyra-input:focus {
    border-color: var(--skyra-input-primary);
    box-shadow: var(--skyra-input-focus-ring);
  }

  .skyra-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--skyra-input-border);
    color: var(--skyra-input-text-subtle);
  }
  
  .skyra-input[readonly] {
    cursor: default;
    background: var(--skyra-input-surface);
    color: var(--skyra-input-text-muted);
  }

  /* Padding adjustments based on slots */
  :host([has-left]) .skyra-input {
    padding-left: 2.35rem; /* Fallback, in JS we'll dynamically check if it's text */
  }
  
  :host([has-right]) .skyra-input,
  :host([loading]) .skyra-input,
  :host([clearable]) .skyra-input {
    padding-right: 2.5rem;
  }

  /* Status variants */
  :host([status="error"]) .skyra-input,
  :host([invalid]) .skyra-input,
  .skyra-input.skyra-input--error {
    border: 1.5px solid var(--skyra-input-danger);
  }
  
  :host([status="success"]) .skyra-input {
    border: 1.5px solid var(--skyra-input-success);
  }
  
  :host([status="warning"]) .skyra-input {
    border: 1.5px solid var(--skyra-input-warning);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .error-msg {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    color: var(--skyra-input-danger);
  }

  .helper-msg {
    font-size: 0.78rem;
    color: var(--skyra-input-text-muted);
  }

  .char-count {
    font-size: 0.75rem;
    color: var(--skyra-input-text-subtle);
    margin-left: auto;
    flex-shrink: 0;
  }
  
  .char-count--overflow {
    color: var(--skyra-input-danger);
  }

  .clear-btn {
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    color: var(--skyra-input-text-subtle);
    display: flex;
    align-items: center;
    border-radius: var(--skyra-input-radius);
  }
  
  .clear-btn:hover {
    color: var(--skyra-input-text);
  }

  .clear-btn:focus-visible {
    outline: none;
    box-shadow: var(--skyra-input-focus-ring);
  }

  .skyra-spin {
    color: var(--skyra-input-primary);
    animation: skyra-spin-anim 0.7s linear infinite;
  }
  
  @keyframes skyra-spin-anim {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-input {
      transition: none !important;
    }
    .skyra-spin {
      animation: none !important;
    }
  }
`;
