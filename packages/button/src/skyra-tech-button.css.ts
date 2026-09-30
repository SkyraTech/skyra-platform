export const buttonStyles = `
  :host {
    display: inline-block;
    --skyra-btn-primary: var(--skyra-primary, #0A58CA);
    --skyra-btn-primary-hover: var(--skyra-primary-hover, #0847a8);
    --skyra-btn-primary-light: var(--skyra-primary-light, #e6f0fa);
    --skyra-btn-orange: var(--skyra-orange, #FF6B00);
    --skyra-btn-orange-hover: var(--skyra-orange-hover, #e05e00);
    --skyra-btn-danger: var(--skyra-danger, #EF4444);
    --skyra-btn-danger-hover: #dc2626;
    --skyra-btn-text: var(--skyra-text, #1f2937);
    --skyra-btn-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-btn-border: var(--skyra-border, #e5e7eb);
    --skyra-btn-bg: var(--skyra-bg, #ffffff);
    --skyra-btn-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));
    --skyra-btn-radius: var(--skyra-radius-md, 0.375rem);
    --skyra-btn-radius-sm: var(--skyra-radius-sm, 6px);
    --skyra-btn-font: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-btn-duration: var(--skyra-duration-fast, 0.15s);
  }

  :host([full-width]) {
    display: block;
    width: 100%;
  }

  .skyra-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    border-radius: var(--skyra-btn-radius);
    font-family: var(--skyra-btn-font);
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background var(--skyra-btn-duration) ease,
                box-shadow var(--skyra-btn-duration) ease,
                transform var(--skyra-btn-duration) ease,
                border-color var(--skyra-btn-duration) ease;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    min-height: 40px;
    min-width: 44px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
  }

  .skyra-btn:focus-visible {
    outline: none;
    box-shadow: var(--skyra-btn-focus-ring);
  }

  .skyra-btn:disabled,
  .skyra-btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Sizes */
  .skyra-btn--sm {
    padding: 0.4rem 0.875rem;
    font-size: 0.8125rem;
    min-height: 36px;
  }
  .skyra-btn--lg {
    padding: 0.75rem 1.75rem;
    font-size: 0.9375rem;
    min-height: 48px;
  }

  /* Primary */
  .skyra-btn--primary {
    background: var(--skyra-btn-primary);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(10, 88, 202, 0.25);
  }
  .skyra-btn--primary:hover:not(:disabled) {
    background: var(--skyra-btn-primary-hover);
    box-shadow: 0 4px 14px rgba(10, 88, 202, 0.35);
    transform: translateY(-1px);
  }
  .skyra-btn--primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(10, 88, 202, 0.25);
  }

  /* Orange */
  .skyra-btn--orange {
    background: var(--skyra-btn-orange);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(255, 107, 0, 0.25);
  }
  .skyra-btn--orange:hover:not(:disabled) {
    background: var(--skyra-btn-orange-hover);
    box-shadow: 0 4px 14px rgba(255, 107, 0, 0.35);
    transform: translateY(-1px);
  }
  .skyra-btn--orange:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Outline */
  .skyra-btn--outline {
    background: transparent;
    color: var(--skyra-btn-primary);
    border-color: var(--skyra-btn-primary);
  }
  .skyra-btn--outline:hover:not(:disabled) {
    background: var(--skyra-btn-primary-light);
  }

  /* Ghost */
  .skyra-btn--ghost {
    background: transparent;
    color: var(--skyra-btn-text-muted);
    border-color: var(--skyra-btn-border);
  }
  .skyra-btn--ghost:hover:not(:disabled) {
    background: var(--skyra-btn-bg);
    color: var(--skyra-btn-text);
  }

  /* Danger / Destructive */
  .skyra-btn--danger {
    background: var(--skyra-btn-danger);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
  }
  .skyra-btn--danger:hover:not(:disabled) {
    background: var(--skyra-btn-danger-hover);
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
    transform: translateY(-1px);
  }

  /* Link */
  .skyra-btn--link {
    background: transparent;
    color: var(--skyra-btn-primary);
    text-decoration: underline;
    box-shadow: none;
    border: none;
    padding: 0;
    min-height: auto;
    min-width: auto;
  }
  .skyra-btn--link:hover:not(:disabled) {
    color: var(--skyra-btn-primary-hover);
    background: transparent;
  }

  /* Loading State */
  .skyra-btn--loading {
    cursor: wait;
    pointer-events: none;
  }

  /* Icon only */
  .skyra-btn--icon {
    padding: 0.6rem;
    min-width: 40px;
    width: 40px;
    height: 40px;
  }
  .skyra-btn--icon.skyra-btn--sm {
    padding: 0.4rem;
    width: 36px;
    height: 36px;
  }
  .skyra-btn--icon.skyra-btn--lg {
    padding: 0.75rem;
    width: 48px;
    height: 48px;
  }

  /* Spinner */
  .skyra-spinner {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    animation: skyra-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  .skyra-spinner--sm { width: 14px; height: 14px; }
  .skyra-spinner--md { width: 20px; height: 20px; }
  .skyra-spinner--lg { width: 28px; height: 28px; }

  @keyframes skyra-spin {
    to { transform: rotate(360deg); }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-btn {
      transition: none !important;
      animation: none !important;
    }
  }
`;
