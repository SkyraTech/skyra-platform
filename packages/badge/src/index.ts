export { SkyraTechBadge, defineSkyraTechBadge } from './skyra-tech-badge';
export { badgeStyles } from './badge.css';

import { defineSkyraTechBadge } from './skyra-tech-badge';
defineSkyraTechBadge();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-badge': import('./skyra-tech-badge').SkyraTechBadge;
  }
}

