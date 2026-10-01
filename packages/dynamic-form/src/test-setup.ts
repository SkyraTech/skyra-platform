import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the UI web component packages so they don't load their real implementations
vi.mock('@skyra-tech-platform/input', () => ({}));
vi.mock('@skyra-tech-platform/textarea', () => ({}));
vi.mock('@skyra-tech-platform/dynamic-select', () => ({}));
vi.mock('@skyra-tech-platform/checkbox', () => ({}));
vi.mock('@skyra-tech-platform/radio', () => ({}));
vi.mock('@skyra-tech-platform/switch', () => ({}));
vi.mock('@skyra-tech-platform/button', () => ({}));
vi.mock('@skyra-tech-platform/date-time', () => ({}));

if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  
  window.HTMLElement.prototype.attachShadow = function() {
    const shadow = document.createElement('div');
    shadow.setAttribute('data-shadow-root', 'true');
    (shadow as any).getElementById = function(id: string) {
      return this.querySelector(`[id="${id}"]`);
    };
    Object.defineProperty(this, 'shadowRoot', {
      get: () => shadow,
      configurable: true
    });
    return shadow as any;
  };

  const origAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    const res = origAppendChild.call(this, child);
    if (child instanceof HTMLElement && child.shadowRoot && child.shadowRoot !== child && !Array.from(child.children).includes(child.shadowRoot as any)) {
      origAppendChild.call(child, child.shadowRoot);
    }
    if (child instanceof HTMLElement) {
      child.querySelectorAll('*').forEach(desc => {
        if (desc.shadowRoot && desc.shadowRoot !== desc && !Array.from(desc.children).includes(desc.shadowRoot as any)) {
          origAppendChild.call(desc, desc.shadowRoot);
        }
      });
    }
    return res;
  };
  
  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    const res = origInsertBefore.call(this, newNode, referenceNode);
    if (newNode instanceof HTMLElement && newNode.shadowRoot && newNode.shadowRoot !== newNode && !Array.from(newNode.children).includes(newNode.shadowRoot as any)) {
      origAppendChild.call(newNode, newNode.shadowRoot);
    }
    if (newNode instanceof HTMLElement) {
      newNode.querySelectorAll('*').forEach(desc => {
        if (desc.shadowRoot && desc.shadowRoot !== desc && !Array.from(desc.children).includes(desc.shadowRoot as any)) {
          origAppendChild.call(desc, desc.shadowRoot);
        }
      });
    }
    return res;
  };
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          if (node.shadowRoot && node.shadowRoot !== node && !Array.from(node.children).includes(node.shadowRoot as any)) {
            origAppendChild.call(node, node.shadowRoot);
          }
          node.querySelectorAll('*').forEach(desc => {
            if (desc.shadowRoot && desc.shadowRoot !== desc && !Array.from(desc.children).includes(desc.shadowRoot as any)) {
              origAppendChild.call(desc, desc.shadowRoot);
            }
          });
        }
      });
    });
  });
  observer.observe(document, { childList: true, subtree: true });

  window.HTMLElement.prototype.attachInternals = function() {
    return {
      setFormValue: vi.fn(),
      setValidity: vi.fn(),
      checkValidity: () => true,
      reportValidity: () => true,
    } as any;
  };

  const defineDummy = (tag: string, template: (el: HTMLElement) => string) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {

        connectedCallback() {
          const originalText = this.innerHTML;
          this.innerHTML = template(this).replace('{TEXT}', originalText);
          if (this.hasAttribute('error')) {
            const input = this.querySelector('input, select, textarea');
            if (input) input.setAttribute('aria-invalid', 'true');
          }
          
          const internalInput = this.querySelector('input, select, textarea');
          if (internalInput) {
            internalInput.addEventListener('change', (e: Event) => {
              const val = (e.target as any).value ?? (e.target as HTMLInputElement).checked;
              this.dispatchEvent(new CustomEvent('skyra-change', { bubbles: true, composed: true, detail: { value: val } }));
            });
            internalInput.addEventListener('input', (e: Event) => {
              const val = (e.target as any).value ?? (e.target as HTMLInputElement).checked;
              this.dispatchEvent(new CustomEvent('skyra-change', { bubbles: true, composed: true, detail: { value: val } }));
            });
            internalInput.addEventListener('blur', () => {
              this.dispatchEvent(new CustomEvent('skyra-blur', { bubbles: true, composed: true }));
            });
          }
        }
        
        static get observedAttributes() {
          return ['error', 'required', 'helper-text'];
        }

        attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
          if (oldVal === newVal) return;
          
          const input = this.querySelector('input, select, textarea');
          if (!input) return;
          
          if (name === 'error') {
            if (newVal) {
              input.setAttribute('aria-invalid', 'true');
            } else {
              input.removeAttribute('aria-invalid');
            }
          }
          
          let describedby = [];
          const baseId = this.id.replace('field-', '');
          if (this.hasAttribute('error')) describedby.push(`${baseId}-error`);
          if (this.hasAttribute('helper-text')) describedby.push(`${baseId}-helper`);
          
          if (describedby.length > 0) {
            input.setAttribute('aria-describedby', describedby.join(' '));
          } else {
            input.removeAttribute('aria-describedby');
          }
          
          if (name === 'required') {
             if (this.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
             } else {
                input.removeAttribute('aria-required');
             }
          }
        }
        get value() {
          const input = this.querySelector('input, select, textarea') as any;
          return input ? input.value : this.getAttribute('value') || '';
        }
        set value(v: string) {
          this.setAttribute('value', v);
          const input = this.querySelector('input, select, textarea') as any;
          if (input) input.value = v;
        }
        get checked() {
          const input = this.querySelector('input') as any;
          return input ? input.checked : this.hasAttribute('checked');
        }
        set checked(v: boolean) {
          if (v) this.setAttribute('checked', 'true');
          else this.removeAttribute('checked');
          const input = this.querySelector('input') as any;
          if (input) input.checked = v;
        }
      });
    }
  };

  const buildAria = (el: HTMLElement) => {
    let str = '';
    const baseId = el.id.replace('field-', '');
    if (el.hasAttribute('required')) str += ' aria-required="true"';
    
    let describedby = [];
    if (el.hasAttribute('error')) describedby.push(`${baseId}-error`);
    if (el.hasAttribute('helper-text')) describedby.push(`${baseId}-helper`);
    
    if (describedby.length > 0) {
      str += ` aria-describedby="${describedby.join(' ')}"`;
    }
    return str;
  };

  const buildHelper = (el: HTMLElement) => {
    const text = el.getAttribute('helper-text');
    const baseId = el.id.replace('field-', '');
    return text ? `<div id="${baseId}-helper">${text}</div>` : '<div></div>';
  };

  defineDummy('skyra-tech-input', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="${el.getAttribute('type') || 'text'}" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-number-input', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="number" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-password-input', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="password" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-search-input', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="search" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-textarea', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><textarea id="${el.id}-input" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)}>${el.getAttribute('value') || ''}</textarea>${buildHelper(el)}`);
  defineDummy('skyra-tech-dynamic-select', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><select id="${el.id}-input" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)}><option value="draft">draft</option><option value="India">India</option></select>${buildHelper(el)}`);
  defineDummy('skyra-tech-checkbox', el => `<input id="${el.id}-input" type="checkbox" ${el.hasAttribute('required') ? 'required' : ''} ${el.hasAttribute('checked') ? 'checked' : ''}${buildAria(el)} /><label for="${el.id}-input">${el.getAttribute('label') || '{TEXT}'}</label>${buildHelper(el)}`);
  defineDummy('skyra-tech-switch', el => `<input id="${el.id}-input" type="checkbox" role="switch" ${el.hasAttribute('required') ? 'required' : ''} ${el.hasAttribute('checked') ? 'checked' : ''}${buildAria(el)} /><label for="${el.id}-input">${el.getAttribute('label') || '{TEXT}'}</label>${buildHelper(el)}`);
  defineDummy('skyra-tech-button', el => `<button type="${el.getAttribute('type') || 'button'}">{TEXT}</button>`);
  defineDummy('skyra-tech-date-field', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="date" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-date-range-field', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="text" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-time-field', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="time" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
  defineDummy('skyra-tech-date-time-field', el => `<label for="${el.id}-input">${el.getAttribute('label') || ''}</label><input id="${el.id}-input" type="datetime-local" value="${el.getAttribute('value') || ''}" ${el.hasAttribute('required') ? 'required' : ''}${buildAria(el)} />${buildHelper(el)}`);
}
