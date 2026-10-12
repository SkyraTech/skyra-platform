export * from './skyra-dropdown-menu.js';
export * from './skyra-dropdown-item.js';
export {
  dropdownStyles,
  itemStyles,
  separatorStyles,
  groupStyles,
} from './skyra-dropdown-menu.css.js';

import type { SkyraDropdownMenuElement } from './skyra-dropdown-menu.js';
import type {
  SkyraDropdownItemElement,
  SkyraDropdownSeparatorElement,
  SkyraDropdownGroupElement,
} from './skyra-dropdown-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'skyra-dropdown-menu': SkyraDropdownMenuElement;
    'skyra-tech-dropdown-menu': SkyraDropdownMenuElement;
    'skyra-dropdown-item': SkyraDropdownItemElement;
    'skyra-tech-dropdown-item': SkyraDropdownItemElement;
    'skyra-dropdown-separator': SkyraDropdownSeparatorElement;
    'skyra-tech-dropdown-separator': SkyraDropdownSeparatorElement;
    'skyra-dropdown-group': SkyraDropdownGroupElement;
    'skyra-tech-dropdown-group': SkyraDropdownGroupElement;
  }
}
