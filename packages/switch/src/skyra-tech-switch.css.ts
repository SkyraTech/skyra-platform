export const switchStyles = `
  :host {
    display: block;
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    --skyra-switch-text: var(--skyra-text, #1f2937);
    --skyra-switch-text-muted: var(--skyra-text-muted, #6b7280);
    --skyra-switch-text-subtle: var(--skyra-text-subtle, #9ca3af);
    --skyra-switch-bg: var(--skyra-bg, #ffffff);
    --skyra-switch-surface: var(--skyra-surface, #f9fafb);
    --skyra-switch-border: var(--skyra-border, #e5e7eb);
    --skyra-switch-primary: var(--skyra-primary, #0A58CA);
    --skyra-switch-danger: var(--skyra-danger, #EF4444);
    --skyra-switch-shadow-sm: var(--skyra-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    --skyra-switch-radius-full: var(--skyra-radius-full, 9999px);
    --skyra-switch-duration: var(--skyra-duration-fast, 0.2s);
    --skyra-switch-focus-ring: var(--skyra-focus-ring, 0 0 0 2px rgba(10, 88, 202, 0.4));

    /* Default size md */
    --track-w: 44px;
    --track-h: 24px;
    --thumb-s: 18px;
    --thumb-translate: 20px;
    --label-size: 0.7rem;
  }

  /* Size SM */
  :host([size="sm"]) {
    --track-w: 34px;
    --track-h: 18px;
    --thumb-s: 14px;
    --thumb-translate: 16px;
    --label-size: 0.6rem;
  }
  
  :host([size="sm"][variant="compact"]) {
    --track-w: 28px;
    --track-h: 16px;
    --thumb-s: 12px;
    --thumb-translate: 12px;
  }
  
  :host([size="sm"][variant="labeled"]) {
    --track-w: 42px;
    --track-h: 18px;
    --thumb-s: 14px;
    --thumb-translate: 24px;
  }

  /* Size MD */
  :host([size="md"][variant="compact"]) {
    --track-w: 34px;
    --track-h: 18px;
    --thumb-s: 14px;
    --thumb-translate: 16px;
  }
  
  :host([size="md"][variant="labeled"]) {
    --track-w: 52px;
    --track-h: 24px;
    --thumb-s: 18px;
    --thumb-translate: 28px;
  }

  /* Size LG */
  :host([size="lg"]) {
    --track-w: 54px;
    --track-h: 28px;
    --thumb-s: 22px;
    --thumb-translate: 26px;
  }
  
  :host([size="lg"][variant="compact"]) {
    --track-w: 42px;
    --track-h: 22px;
    --thumb-s: 18px;
    --thumb-translate: 20px;
  }
  
  :host([size="lg"][variant="labeled"]) {
    --track-w: 64px;
    --track-h: 28px;
    --thumb-s: 22px;
    --thumb-translate: 36px;
  }

  .skyra-switch-container {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .skyra-switch-wrapper {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.75rem;
    min-height: 38px;
    padding: 2px 0;
    cursor: pointer;
    min-width: 0;
    max-width: 100%;
  }

  :host([disabled]) .skyra-switch-wrapper {
    cursor: not-allowed;
  }
  
  :host([readonly]) .skyra-switch-wrapper {
    cursor: default;
  }

  .skyra-switch-btn {
    position: relative;
    width: var(--track-w);
    height: var(--track-h);
    border-radius: var(--skyra-switch-radius-full);
    background: var(--skyra-switch-border);
    border: none;
    padding: 2px;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    transition: background var(--skyra-switch-duration) ease, border var(--skyra-switch-duration) ease;
  }

  /* Checked states */
  :host([checked]) .skyra-switch-btn {
    background: var(--skyra-switch-primary);
  }

  /* Outline variant overrides */
  :host([variant="outline"]) .skyra-switch-btn {
    background: transparent;
    border: 2px solid var(--skyra-switch-border);
  }
  :host([variant="outline"][checked]) .skyra-switch-btn {
    border-color: var(--skyra-switch-primary);
  }

  /* Disabled state */
  :host([disabled]) .skyra-switch-btn {
    cursor: not-allowed;
  }
  :host([disabled]:not([variant="outline"])) .skyra-switch-btn {
    background: var(--skyra-switch-border);
  }
  :host([readonly]) .skyra-switch-btn {
    cursor: default;
  }

  .skyra-switch-btn:focus-visible {
    box-shadow: var(--skyra-switch-focus-ring);
  }

  .skyra-switch-thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--thumb-s);
    height: var(--thumb-s);
    border-radius: 50%;
    background: #ffffff;
    box-shadow: var(--skyra-switch-shadow-sm);
    transform: translateX(0);
    flex-shrink: 0;
    transition: transform var(--skyra-switch-duration) ease, background var(--skyra-switch-duration) ease;
  }

  :host([checked]) .skyra-switch-thumb {
    transform: translateX(var(--thumb-translate));
  }

  :host([variant="outline"][checked]) .skyra-switch-thumb {
    background: var(--skyra-switch-primary);
  }

  /* Labeled Text */
  .skyra-switch-label-text {
    position: absolute;
    font-size: var(--label-size);
    font-weight: 700;
    line-height: 1;
    user-select: none;
    transition: opacity var(--skyra-switch-duration) ease;
  }
  
  .skyra-switch-label-text.off {
    right: 6px;
    color: var(--skyra-switch-text-muted);
  }
  
  .skyra-switch-label-text.on {
    left: 6px;
    color: #ffffff;
    opacity: 0;
  }
  
  :host([checked]) .skyra-switch-label-text.off {
    opacity: 0;
  }
  
  :host([checked]) .skyra-switch-label-text.on {
    opacity: 1;
  }

  /* Icons */
  .icon-svg {
    width: 10px;
    height: 10px;
    stroke-width: 3;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .icon-off {
    color: var(--skyra-switch-text-muted);
  }
  
  .icon-on {
    color: var(--skyra-switch-primary);
  }
  
  :host([variant="outline"]) .icon-on {
    color: #ffffff;
  }

  .icon-loading {
    color: var(--skyra-switch-primary);
    animation: skyra-spin 1s linear infinite;
  }
  
  :host([variant="outline"][checked]) .icon-loading {
    color: #ffffff;
  }

  @keyframes skyra-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
    color: var(--skyra-switch-text);
    line-height: 1.4;
  }
  
  :host([disabled]) .label-text {
    color: var(--skyra-switch-text-subtle);
  }

  .label-text--required::after {
    content: '*';
    color: var(--skyra-switch-danger);
    margin-left: 4px;
  }

  .helper-text {
    font-size: 0.78rem;
    color: var(--skyra-switch-text-muted);
    line-height: 1.35;
  }

  .error-text {
    font-size: 0.78rem;
    color: var(--skyra-switch-danger);
    margin-left: var(--track-w);
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-switch-btn,
    .skyra-switch-thumb,
    .skyra-switch-label-text,
    .icon-loading {
      transition: none !important;
      animation: none !important;
    }
  }
`;
