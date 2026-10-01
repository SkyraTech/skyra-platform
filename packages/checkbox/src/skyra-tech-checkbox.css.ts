export const checkboxStyles = `
  :host {
    display: block;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-checkbox-text: var(--skyra-text, #1f2937);
    --skyra-checkbox-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-checkbox-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-checkbox-bg: var(--skyra-bg, #ffffff);
    --skyra-checkbox-surface: var(--skyra-surface, #f9fafb);
    --skyra-checkbox-border: var(--skyra-border, #e5e7eb);
    --skyra-checkbox-primary: var(--skyra-primary, #0A58CA);
    --skyra-checkbox-danger: var(--skyra-danger, #EF4444);
    --skyra-checkbox-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));
    --skyra-checkbox-radius: var(--skyra-radius-sm, 4px);
    --skyra-checkbox-duration: var(--skyra-duration-fast, 0.15s);
  }

  .skyra-checkbox-container {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .skyra-checkbox-label-wrapper {
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

  :host([disabled]) .skyra-checkbox-label-wrapper {
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

  .skyra-checkbox-box {
    width: 18px;
    height: 18px;
    margin-top: 3px;
    border-radius: var(--skyra-checkbox-radius);
    border: 1.5px solid var(--skyra-checkbox-border);
    background: var(--skyra-checkbox-surface);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: none;
    transition: all var(--skyra-checkbox-duration) ease;
  }

  /* Checked & Indeterminate States */
  :host([checked]) .skyra-checkbox-box,
  :host([indeterminate]) .skyra-checkbox-box {
    border-color: var(--skyra-checkbox-primary);
    background: var(--skyra-checkbox-primary);
  }

  /* Focus States */
  .skyra-sr-only-peer:focus-visible + .skyra-checkbox-box {
    box-shadow: var(--skyra-checkbox-focus-ring);
  }

  /* Disabled States */
  :host([disabled]) .skyra-checkbox-box {
    background: var(--skyra-checkbox-bg);
  }
  :host([disabled][checked]) .skyra-checkbox-box,
  :host([disabled][indeterminate]) .skyra-checkbox-box {
    border-color: var(--skyra-checkbox-border);
    background: var(--skyra-checkbox-border);
  }

  /* Error States */
  :host([invalid]) .skyra-checkbox-box {
    border-color: var(--skyra-checkbox-danger);
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
    color: var(--skyra-checkbox-text);
    line-height: 1.4;
  }
  
  :host([disabled]) .label-text {
    color: var(--skyra-checkbox-text-subtle);
  }

  .label-text--required::after {
    content: '*';
    color: var(--skyra-checkbox-danger);
    margin-left: 4px;
  }

  .helper-text {
    font-size: 0.78rem;
    color: var(--skyra-checkbox-text-muted);
    line-height: 1.35;
  }

  .error-text {
    font-size: 0.78rem;
    color: var(--skyra-checkbox-danger);
    margin-left: 28px;
  }

  .icon {
    display: none;
  }
  
  :host([checked]) .icon-check {
    display: block;
  }
  
  :host([indeterminate]) .icon-check {
    display: none;
  }
  
  :host([indeterminate]) .icon-minus {
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-checkbox-box {
      transition: none !important;
    }
  }
`;
