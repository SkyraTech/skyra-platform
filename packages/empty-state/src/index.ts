export { SkyraTechEmptyState, defineSkyraTechEmptyState } from './skyra-tech-empty-state';
export { emptyStateStyles } from './empty-state.css';

import { defineSkyraTechEmptyState } from './skyra-tech-empty-state';
defineSkyraTechEmptyState();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-empty-state': import('./skyra-tech-empty-state').SkyraTechEmptyState;
  }
}

