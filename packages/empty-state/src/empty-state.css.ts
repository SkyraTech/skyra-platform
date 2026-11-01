export const emptyStateStyles = `
  :host {
    display: block;
  }

  .skyra-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 24px;
    box-sizing: border-box;
    border-radius: var(--skyra-radius-md, 10px);
    background: transparent;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  .skyra-empty-state--dashed {
    border: 1px dashed var(--skyra-border, #e2e8f0);
    background: var(--skyra-surface, #ffffff);
  }

  .skyra-empty-state--outline {
    border: 1px solid var(--skyra-border, #e2e8f0);
    background: var(--skyra-surface, #ffffff);
  }

  .skyra-empty-state--compact {
    padding: 24px 16px;
  }

  .skyra-empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--skyra-text-subtle, #94a3b8);
  }

  .skyra-empty-state-icon svg {
    width: 44px;
    height: 44px;
  }

  .skyra-empty-state-title {
    margin: 0 0 8px 0;
    font-family: var(--skyra-font-display, 'Outfit', sans-serif);
    font-size: 16px;
    font-weight: 600;
    color: var(--skyra-text, #0f172a);
  }

  .skyra-empty-state-desc {
    margin: 0;
    max-width: 420px;
    font-family: var(--skyra-font-body, 'Inter', sans-serif);
    font-size: 13px;
    line-height: 1.5;
    color: var(--skyra-text-muted, #64748b);
  }

  .skyra-empty-state-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }

  .skyra-empty-state-actions:empty {
    display: none;
  }
`;

