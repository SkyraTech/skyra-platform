export { SkyraTechDynamicSelect, defineSkyraTechDynamicSelect } from './skyra-tech-dynamic-select';
export { dynamicSelectStyles } from './skyra-tech-dynamic-select.css';

import { defineSkyraTechDynamicSelect } from './skyra-tech-dynamic-select';
defineSkyraTechDynamicSelect();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-dynamic-select': import('./skyra-tech-dynamic-select').SkyraTechDynamicSelect;
  }
}
