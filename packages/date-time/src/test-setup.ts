import { vi } from 'vitest';

class ElementInternalsMock {
  states = new Set<string>();
  validity = {} as ValidityState;
  validationMessage = '';
  willValidate = true;
  labels = Object.freeze([]) as unknown as NodeList;
  form = null;
  
  setFormValue = vi.fn();
  setValidity = vi.fn();
  checkValidity = vi.fn(() => true);
  reportValidity = vi.fn(() => true);
}

if (!window.ElementInternals) {
  Object.defineProperty(window, 'ElementInternals', {
    value: ElementInternalsMock,
    writable: true,
    configurable: true,
  });
}

if (!HTMLElement.prototype.attachInternals) {
  HTMLElement.prototype.attachInternals = function() {
    return new ElementInternalsMock() as unknown as ElementInternals;
  };
}
