export { SkyraTechButton, defineSkyraTechButton } from './skyra-tech-button';
export { buttonStyles } from './skyra-tech-button.css';

// Self-register by default when imported in a browser environment
import { defineSkyraTechButton } from './skyra-tech-button';
defineSkyraTechButton();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-button': import('./skyra-tech-button').SkyraTechButton;
  }
}
