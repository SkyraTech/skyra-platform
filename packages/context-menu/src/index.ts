export * from './skyra-context-menu.js';
export * from './skyra-context-menu-item.js';
export {
  computePopoverPosition,
  type PopoverPlacement,
  type PopoverAlign,
  type PositionResult,
} from '@skyra-tech-platform/popover';

import type { SkyraContextMenuElement, SkyraTechContextMenuElement } from './skyra-context-menu.js';
import type {
  SkyraContextMenuItemElement,
  SkyraTechContextMenuItemElement,
  SkyraContextMenuSeparatorElement,
  SkyraTechContextMenuSeparatorElement,
  SkyraContextMenuGroupElement,
  SkyraTechContextMenuGroupElement,
} from './skyra-context-menu-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'skyra-context-menu': SkyraContextMenuElement;
    'skyra-tech-context-menu': SkyraTechContextMenuElement;
    'skyra-context-menu-item': SkyraContextMenuItemElement;
    'skyra-tech-context-menu-item': SkyraTechContextMenuItemElement;
    'skyra-context-menu-separator': SkyraContextMenuSeparatorElement;
    'skyra-tech-context-menu-separator': SkyraTechContextMenuSeparatorElement;
    'skyra-context-menu-group': SkyraContextMenuGroupElement;
    'skyra-tech-context-menu-group': SkyraTechContextMenuGroupElement;
  }
}
