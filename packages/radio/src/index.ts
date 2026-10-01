export { SkyraTechRadio, defineSkyraTechRadio } from './skyra-tech-radio';
export { radioStyles } from './skyra-tech-radio.css';

// Self-register by default when imported in a browser environment
import { defineSkyraTechRadio } from './skyra-tech-radio';
defineSkyraTechRadio();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-radio': import('./skyra-tech-radio').SkyraTechRadio;
  }
}
