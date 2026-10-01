export { SkyraTechTextarea, defineSkyraTechTextarea } from './skyra-tech-textarea';
export { textareaStyles } from './skyra-tech-textarea.css';

// Self-register by default when imported in a browser environment
import { defineSkyraTechTextarea } from './skyra-tech-textarea';
defineSkyraTechTextarea();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-textarea': import('./skyra-tech-textarea').SkyraTechTextarea;
  }
}
