export * from './types.js';
export * from './skyra-command-palette.js';
export * from './skyra-command-palette.css.js';

import type {
  SkyraCommandPaletteElement,
  SkyraTechCommandPaletteElement,
} from './skyra-command-palette.js';

declare global {
  interface HTMLElementTagNameMap {
    'skyra-command-palette': SkyraCommandPaletteElement;
    'skyra-tech-command-palette': SkyraTechCommandPaletteElement;
  }
}
