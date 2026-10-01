export { SkyraTechInput, defineSkyraTechInput } from './skyra-tech-input';
export { inputStyles } from './skyra-tech-input.css';

// Self-register by default when imported in a browser environment
import { defineSkyraTechInput } from './skyra-tech-input';
defineSkyraTechInput();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-input': import('./skyra-tech-input').SkyraTechInput;
  }
}
