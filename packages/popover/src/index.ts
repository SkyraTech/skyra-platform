export * from './skyra-popover.js';
export * from './positioning.js';
export { popoverStyles } from './skyra-popover.css.js';

import type { SkyraPopoverElement } from './skyra-popover.js';

declare global {
  interface HTMLElementTagNameMap {
    'skyra-popover': SkyraPopoverElement;
    'skyra-tech-popover': SkyraPopoverElement;
  }
}
