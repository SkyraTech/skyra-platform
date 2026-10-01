export { SkyraTechCheckbox, defineSkyraTechCheckbox } from './skyra-tech-checkbox';
export { checkboxStyles } from './skyra-tech-checkbox.css';

// Self-register by default when imported in a browser environment
import { defineSkyraTechCheckbox } from './skyra-tech-checkbox';
defineSkyraTechCheckbox();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-checkbox': import('./skyra-tech-checkbox').SkyraTechCheckbox;
  }
}
