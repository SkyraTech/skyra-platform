export { SkyraTechSwitch, defineSkyraTechSwitch } from './skyra-tech-switch';
export { switchStyles } from './skyra-tech-switch.css';

import { defineSkyraTechSwitch } from './skyra-tech-switch';
defineSkyraTechSwitch();

declare global {
  interface HTMLElementTagNameMap {
    'skyra-tech-switch': import('./skyra-tech-switch').SkyraTechSwitch;
  }
}
