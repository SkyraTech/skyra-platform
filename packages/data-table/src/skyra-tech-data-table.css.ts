export const dataTableStyles = `
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--skyra-bg);
    color: var(--skyra-text);
    border: 1px solid var(--skyra-border);
    border-radius: var(--skyra-radius-md);
    box-shadow: var(--skyra-shadow-sm);
    font-family: inherit;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  *, *::before, *::after {
    box-sizing: inherit;
  }

  .skyra-data-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--skyra-border);
    background-color: var(--skyra-surface);
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .skyra-data-table-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    position: relative;
  }

  .skyra-data-table-search {
    position: relative;
    max-width: 280px;
    width: 100%;
  }

  .skyra-data-table-search input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid var(--skyra-border);
    border-radius: var(--skyra-radius-md);
    background: var(--skyra-bg);
    color: var(--skyra-text);
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .skyra-data-table-search input:focus {
    outline: none;
    border-color: var(--skyra-primary);
    box-shadow: 0 0 0 3px var(--skyra-primary-light);
  }

  .skyra-data-table-search svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--skyra-text-muted);
  }

  .skyra-data-table-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    white-space: nowrap;
  }

  thead {
    background-color: var(--skyra-surface);
  }

  th {
    padding: 0.85rem 1.25rem;
    font-weight: 500;
    font-size: 0.8125rem;
    color: var(--skyra-text-subtle);
    border-bottom: 1px solid var(--skyra-border);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    user-select: none;
    position: relative;
  }

  .skyra-th-sortable {
    cursor: pointer;
  }
  
  .skyra-th-sortable:hover {
    color: var(--skyra-text);
  }

  .skyra-th-content {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .skyra-resizer {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    user-select: none;
    touch-action: none;
    display: flex;
    justify-content: center;
    z-index: 1;
  }

  .skyra-resizer-line {
    width: 2px;
    height: 100%;
    background-color: var(--skyra-border);
    opacity: 0;
    transition: background-color 0.2s, opacity 0.2s;
  }

  .skyra-resizer:hover .skyra-resizer-line,
  .skyra-resizer.is-resizing .skyra-resizer-line {
    background-color: var(--skyra-primary);
    opacity: 1;
  }

  td {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    color: var(--skyra-text);
    border-bottom: 1px solid var(--skyra-border);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tr {
    transition: background-color 0.15s ease;
  }

  tr:hover {
    background-color: var(--skyra-bg);
  }

  tr.selected {
    background-color: var(--skyra-primary-light, rgba(59, 130, 246, 0.08));
  }

  tr.selected:hover {
    background-color: var(--skyra-primary-light, rgba(59, 130, 246, 0.12));
  }

  .skyra-data-table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--skyra-border);
    flex-wrap: wrap;
    gap: 0.85rem;
    background-color: var(--skyra-surface);
  }
  
  .skyra-pagination-info {
    font-size: 0.8125rem;
    color: var(--skyra-text-muted);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .skyra-pagination-nav {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }

  .skyra-page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--skyra-radius-sm);
    border: none;
    background: transparent;
    color: var(--skyra-text);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .skyra-page-btn:hover:not(:disabled) {
    background: var(--skyra-border);
  }

  .skyra-page-btn.active {
    background: var(--skyra-primary);
    color: white;
  }

  .skyra-page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
    color: var(--skyra-text-muted);
  }

  select {
    background: var(--skyra-bg);
    border: 1px solid var(--skyra-border);
    border-radius: var(--skyra-radius-sm);
    padding: 0.25rem 0.5rem;
    font-size: 0.8125rem;
    color: var(--skyra-text);
    cursor: pointer;
    outline: none;
  }

  /* Skeleton Loading */
  @keyframes skyra-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skyra-skeleton-bar {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      var(--skyra-border) 25%,
      var(--skyra-surface) 50%,
      var(--skyra-border) 75%
    );
    background-size: 200% 100%;
    animation: skyra-shimmer 1.5s infinite linear;
  }

  @media (prefers-reduced-motion: reduce) {
    .skyra-skeleton-bar {
      animation: none !important;
      background: var(--skyra-border) !important;
    }
    tr {
      transition: none !important;
    }
  }

  /* Dropdown styles for column visibility */
  .col-vis-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: var(--skyra-bg);
    border: 1px solid var(--skyra-border);
    border-radius: var(--skyra-radius-md);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    z-index: 50;
    min-width: 180px;
    padding: 0.5rem;
    display: none;
  }

  .col-vis-dropdown.open {
    display: block;
  }
  
  .col-vis-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 0.8125rem;
    border-radius: var(--skyra-radius-sm);
    color: var(--skyra-text);
  }
  
  .col-vis-label:hover {
    background-color: var(--skyra-bg);
  }
`;
