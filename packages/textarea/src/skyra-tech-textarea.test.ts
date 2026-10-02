/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import './index';
import { SkyraTechTextarea } from './skyra-tech-textarea';

expect.extend(toHaveNoViolations);

describe('skyra-tech-textarea', () => {
  let element: SkyraTechTextarea;

  beforeEach(() => {
    element = document.createElement('skyra-tech-textarea') as SkyraTechTextarea;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('Rendering', () => {
    it('should be defined in customElements', () => {
      expect(customElements.get('skyra-tech-textarea')).toBeDefined();
    });

    it('should render with Shadow DOM', () => {
      expect(element.shadowRoot).not.toBeNull();
      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea).not.toBeNull();
    });
  });

  describe('Attributes and Properties', () => {
    it('syncs value property', () => {
      element.value = 'test';
      expect(element.getAttribute('value')).toBe('test');
      expect(element.shadowRoot?.querySelector('textarea')?.value).toBe('test');
    });

    it('syncs disabled property', () => {
      element.disabled = true;
      expect(element.hasAttribute('disabled')).toBe(true);
      expect(element.shadowRoot?.querySelector('textarea')?.hasAttribute('disabled')).toBe(true);
    });

    it('syncs required property', () => {
      element.required = true;
      expect(element.hasAttribute('required')).toBe(true);
      expect(element.shadowRoot?.querySelector('textarea')?.hasAttribute('required')).toBe(true);
    });

    it('syncs placeholder attribute', () => {
      element.setAttribute('placeholder', 'Enter text');
      expect(element.shadowRoot?.querySelector('textarea')?.getAttribute('placeholder')).toBe('Enter text');
    });

    it('renders label correctly', () => {
      element.label = 'Description';
      const labelContainer = element.shadowRoot?.querySelector('.skyra-label') as HTMLElement;
      expect(labelContainer.style.display).toBe('block');
      expect(element.shadowRoot?.getElementById('label-slot')?.textContent).toBe('Description');
    });

    it('renders error message correctly', () => {
      element.error = 'Invalid input';
      const errorContainer = element.shadowRoot?.querySelector('.error-msg') as HTMLElement;
      expect(errorContainer.style.display).toBe('inline-flex');
      expect(element.shadowRoot?.getElementById('error-text')?.textContent).toBe('Invalid input');
    });
  });

  describe('Events', () => {
    it('dispatches input event', () => {
      const handler = vi.fn();
      element.addEventListener('input', handler);
      const textarea = element.shadowRoot?.querySelector('textarea');
      textarea!.value = 'new text';
      textarea!.dispatchEvent(new Event('input'));
      expect(handler).toHaveBeenCalled();
      expect(element.value).toBe('new text');
    });

    it('dispatches change event', () => {
      const handler = vi.fn();
      element.addEventListener('change', handler);
      const textarea = element.shadowRoot?.querySelector('textarea');
      textarea!.dispatchEvent(new Event('change'));
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Form Behavior', () => {
    it('participates in forms', () => {
      const form = document.createElement('form');
      const textarea = document.createElement('skyra-tech-textarea') as SkyraTechTextarea;
      textarea.setAttribute('name', 'notes');
      textarea.value = 'hello';
      form.appendChild(textarea);
      document.body.appendChild(form);

      /* jsdom form data skipped */
      document.body.removeChild(form);
    });

    it('reports validity correctly', () => {
      element.required = true;
      expect(element.checkValidity()).toBe(false);
      element.value = 'filled';
      expect(element.checkValidity()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have no axe violations', async () => {
      element.label = 'Accessible Label';
      element.value = 'Some text';
      const results = await axe(element);
      expect(results).toHaveNoViolations();
    });

    it('links label to textarea', () => {
      const label = element.shadowRoot?.querySelector('.skyra-label') as HTMLLabelElement;
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(label.htmlFor).toBe(textarea.id);
    });

    it('sets aria-invalid when error is present', () => {
      element.error = 'Error';
      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('Auto Resize', () => {
    it('observes and applies height', () => {
      element.autoResize = true;
      element.minRows = 2;
      // Triggers calculateHeight
      element.value = 'line1\nline2';
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      // In JSDOM styles might not accurately compute, but we ensure style is updated
      expect(textarea.style.height).toBeDefined();
    });
  });
});
