export const textareaStyles = `
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-textarea-text: var(--skyra-text, #1f2937);
    --skyra-textarea-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-textarea-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-textarea-bg: var(--skyra-bg, #ffffff);
    --skyra-textarea-surface: var(--skyra-surface, #f9fafb);
    --skyra-textarea-border: var(--skyra-border, #e5e7eb);
    --skyra-textarea-primary: var(--skyra-primary, #0A58CA);
    --skyra-textarea-danger: var(--skyra-danger, #EF4444);
    --skyra-textarea-success: var(--skyra-success, #10B981);
    --skyra-textarea-warning: var(--skyra-warning, #F59E0B);
    --skyra-textarea-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));
    --skyra-textarea-radius: var(--skyra-radius-md, 0.375rem);
    --skyra-textarea-duration: var(--skyra-duration-fast, 0.15s);
  }

  .skyra-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--skyra-textarea-text);
  }
  
  :host([disabled]) .skyra-label {
    color: var(--skyra-textarea-text-subtle);
  }

  .skyra-label--required::after {
    content: '*';
    color: var(--skyra-textarea-danger);
    margin-left: 4px;
  }

  .skyra-textarea {
    display: block;
    width: 100%;
    padding: 0.65rem 0.875rem;
    background: var(--skyra-textarea-bg);
    border: 1px solid var(--skyra-textarea-border);
    border-radius: var(--skyra-textarea-radius);
    color: var(--skyra-textarea-text);
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.5;
    outline: none;
    box-sizing: border-box;
    transition: border-color var(--skyra-textarea-duration), box-shadow var(--skyra-textarea-duration);
    resize: vertical;
  }
  
  /* Fallback resize rules */
  :host([resize="none"]) .skyra-textarea { resize: none; }
  :host([resize="horizontal"]) .skyra-textarea { resize: horizontal; }
  :host([resize="both"]) .skyra-textarea { resize: both; }
  :host([auto-resize]) .skyra-textarea { resize: none; } /* handled via JS */

  .skyra-textarea::placeholder {
    color: var(--skyra-textarea-text-subtle);
  }

  .skyra-textarea:focus {
    border-color: var(--skyra-textarea-primary);
    box-shadow: var(--skyra-textarea-focus-ring);
  }

  .skyra-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--skyra-textarea-border);
    color: var(--skyra-textarea-text-subtle);
  }
  
  .skyra-textarea[readonly] {
    cursor: default;
    background: var(--skyra-textarea-surface);
    color: var(--skyra-textarea-text-muted);
  }

  /* Status variants */
  :host([status="error"]) .skyra-textarea,
  :host([invalid]) .skyra-textarea,
  .skyra-textarea.skyra-textarea--error {
    border: 1.5px solid var(--skyra-textarea-danger);
  }
  
  :host([status="success"]) .skyra-textarea {
    border: 1.5px solid var(--skyra-textarea-success);
  }
  
  :host([status="warning"]) .skyra-textarea {
    border: 1.5px solid var(--skyra-textarea-warning);
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
    color: var(--skyra-textarea-danger);
  }

  .helper-msg {
    font-size: 0.78rem;
    color: var(--skyra-textarea-text-muted);
  }

  .char-count {
    font-size: 0.75rem;
    color: var(--skyra-textarea-text-subtle);
    margin-left: auto;
    flex-shrink: 0;
  }
  
  .char-count--overflow {
    color: var(--skyra-textarea-danger);
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-textarea {
      transition: none !important;
    }
  }
`;
