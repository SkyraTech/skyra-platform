export const radioStyles = `
  :host {
    display: block;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-radio-text: var(--skyra-text, #1f2937);
    --skyra-radio-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-radio-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-radio-bg: var(--skyra-bg, #ffffff);
    --skyra-radio-surface: var(--skyra-surface, #f9fafb);
    --skyra-radio-border: var(--skyra-border, #e5e7eb);
    --skyra-radio-primary: var(--skyra-primary, #0A58CA);
    --skyra-radio-danger: var(--skyra-danger, #EF4444);
    --skyra-radio-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));
    --skyra-radio-duration: var(--skyra-duration-fast, 0.15s);
  }

  .skyra-radio-container {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .skyra-radio-label-wrapper {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.625rem;
    cursor: pointer;
    user-select: none;
    min-height: 44px;
    padding: 4px 0;
    position: relative;
    min-width: 0;
    max-width: 100%;
  }

  :host([disabled]) .skyra-radio-label-wrapper {
    cursor: not-allowed;
  }

  .skyra-sr-only-peer {
    position: absolute;
    opacity: 0;
    width: 44px;
    height: 44px;
    top: 0;
    left: 0;
    margin: 0;
    cursor: pointer;
    z-index: 1;
  }

  :host([disabled]) .skyra-sr-only-peer {
    cursor: not-allowed;
  }

  .skyra-radio-circle {
    width: 18px;
    height: 18px;
    margin-top: 3px;
    border-radius: 50%;
    border: 1.5px solid var(--skyra-radio-border);
    background: var(--skyra-radio-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--skyra-radio-duration) ease;
  }

  .skyra-radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: transparent;
    transition: transform var(--skyra-radio-duration) ease, background var(--skyra-radio-duration) ease;
    transform: scale(0);
  }

  /* Checked States */
  :host([checked]) .skyra-radio-circle {
    border-color: var(--skyra-radio-primary);
  }
  
  :host([checked]) .skyra-radio-dot {
    background: var(--skyra-radio-primary);
    transform: scale(1);
  }

  /* Focus States */
  .skyra-sr-only-peer:focus-visible + .skyra-radio-circle {
    box-shadow: var(--skyra-radio-focus-ring);
  }

  /* Disabled States */
  :host([disabled]) .skyra-radio-circle {
    background: var(--skyra-radio-bg);
  }
  :host([disabled][checked]) .skyra-radio-circle {
    border-color: var(--skyra-radio-border);
  }
  :host([disabled][checked]) .skyra-radio-dot {
    background: var(--skyra-radio-text-subtle);
  }

  /* Error States */
  :host([invalid]) .skyra-radio-circle {
    border-color: var(--skyra-radio-danger);
  }

  /* Label Text Container */
  .label-text-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .label-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--skyra-radio-text);
    line-height: 1.4;
  }
  
  :host([disabled]) .label-text {
    color: var(--skyra-radio-text-subtle);
  }

  .label-text--required::after {
    content: '*';
    color: var(--skyra-radio-danger);
    margin-left: 4px;
  }

  .helper-text {
    font-size: 0.78rem;
    color: var(--skyra-radio-text-muted);
    line-height: 1.35;
  }

  .error-text {
    font-size: 0.78rem;
    color: var(--skyra-radio-danger);
    margin-left: 28px;
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-radio-circle,
    .skyra-radio-dot {
      transition: none !important;
    }
  }
`;
