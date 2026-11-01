export { SkyraTechDrawer, defineSkyraTechDrawer } from './skyra-tech-drawer';
export { drawerStyles } from './drawer.css';

import { defineSkyraTechDrawer } from './skyra-tech-drawer';
defineSkyraTechDrawer();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-drawer': import('./skyra-tech-drawer').SkyraTechDrawer;
  }
}

