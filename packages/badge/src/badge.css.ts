export const badgeStyles = `
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .skyra-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--skyra-font-body, 'Inter', sans-serif);
    font-weight: 500;
    line-height: 1;
    border-radius: var(--skyra-radius-sm, 6px);
    border: 1px solid transparent;
    white-space: nowrap;
    box-sizing: border-box;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  /* Sizes */
  .skyra-badge--sm {
    font-size: 11px;
    padding: 2px 6px;
    height: 20px;
  }

  .skyra-badge--md {
    font-size: 12px;
    padding: 3px 8px;
    height: 24px;
  }

  /* Status Dot */
  .skyra-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--skyra-radius-full, 9999px);
    background: currentColor;
    display: none;
    flex-shrink: 0;
  }

  .skyra-badge--has-dot .skyra-badge-dot {
    display: inline-block;
  }

  /* Variants mapped to official Skyra Platform tokens */
  .skyra-badge--primary {
    background: var(--skyra-primary-light, rgba(10, 88, 202, 0.1));
    color: var(--skyra-primary, #0A58CA);
    border-color: rgba(10, 88, 202, 0.25);
  }

  .skyra-badge--secondary,
  .skyra-badge--neutral {
    background: var(--skyra-bg, #f4f7fc);
    color: var(--skyra-text-muted, #64748b);
    border-color: var(--skyra-border, #e2e8f0);
  }

  .skyra-badge--success {
    background: var(--skyra-success-light, rgba(16, 185, 129, 0.1));
    color: #059669;
    border-color: rgba(16, 185, 129, 0.25);
  }

  .skyra-badge--warning {
    background: var(--skyra-warning-light, rgba(245, 158, 11, 0.1));
    color: #b45309;
    border-color: rgba(245, 158, 11, 0.25);
  }

  .skyra-badge--danger {
    background: var(--skyra-danger-light, rgba(239, 68, 68, 0.1));
    color: var(--skyra-danger, #ef4444);
    border-color: rgba(239, 68, 68, 0.25);
  }

  .skyra-badge--info {
    background: var(--skyra-info-light, rgba(59, 130, 246, 0.1));
    color: var(--skyra-info, #3b82f6);
    border-color: rgba(59, 130, 246, 0.25);
  }

  .skyra-badge--orange {
    background: var(--skyra-orange-light, rgba(255, 107, 0, 0.1));
    color: var(--skyra-orange, #FF6B00);
    border-color: rgba(255, 107, 0, 0.25);
  }

  .skyra-badge--cyan {
    background: var(--skyra-cyan-light, rgba(0, 163, 224, 0.1));
    color: var(--skyra-cyan, #00A3E0);
    border-color: rgba(0, 163, 224, 0.25);
  }

  .skyra-badge--purple {
    background: rgba(124, 58, 237, 0.1);
    color: #7c3aed;
    border-color: rgba(124, 58, 237, 0.25);
  }
`;

