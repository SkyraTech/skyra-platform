import { describe, it, expect, beforeEach } from 'vitest';
import '../src/index'; // Registers all custom elements

describe('Skyra Loading System Web Components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('skyra-spinner', () => {
    it('registers the element', () => {
      expect(customElements.get('skyra-spinner')).toBeDefined();
    });

    it('sets default attributes correctly', () => {
      const el = document.createElement('skyra-spinner');
      document.body.appendChild(el);
      
      expect(el.getAttribute('role')).toBe('status');
      expect(el.getAttribute('inline')).toBe('');
      expect(el.getAttribute('aria-label')).toBe('Loading...');
      expect(el.shadowRoot?.innerHTML).toContain('class="spinner"');
    });

    it('respects size and color attributes', () => {
      const el = document.createElement('skyra-spinner');
      el.setAttribute('size', 'lg');
      el.setAttribute('color', 'red');
      document.body.appendChild(el);

      expect(el.shadowRoot?.innerHTML).toContain('width: 32px');
      expect(el.shadowRoot?.innerHTML).toContain('border-top-color: red');
    });
  });

  describe('skyra-progress', () => {
    it('registers the element', () => {
      expect(customElements.get('skyra-progress')).toBeDefined();
    });

    it('renders indeterminate state when value is omitted', () => {
      const el = document.createElement('skyra-progress');
      document.body.appendChild(el);

      const track = el.shadowRoot?.querySelector('[role="progressbar"]');
      expect(track?.getAttribute('aria-label')).toBe('Loading');
      expect(track?.hasAttribute('aria-valuenow')).toBe(false);
      expect(el.shadowRoot?.innerHTML).toContain('indeterminate');
    });

    it('renders determinate state with percentage', () => {
      const el = document.createElement('skyra-progress');
      el.setAttribute('value', '45');
      document.body.appendChild(el);

      const track = el.shadowRoot?.querySelector('[role="progressbar"]');
      expect(track?.getAttribute('aria-valuenow')).toBe('45');
      expect(el.shadowRoot?.innerHTML).toContain('width: 45%');
    });
  });

  describe('skyra-circular-progress', () => {
    it('registers the element', () => {
      expect(customElements.get('skyra-circular-progress')).toBeDefined();
    });

    it('renders indeterminate state', () => {
      const el = document.createElement('skyra-circular-progress');
      document.body.appendChild(el);

      const track = el.shadowRoot?.querySelector('[role="progressbar"]');
      expect(track?.getAttribute('aria-label')).toBe('Loading');
    });

    it('renders value and shows percentage', () => {
      const el = document.createElement('skyra-circular-progress');
      el.setAttribute('value', '75');
      el.setAttribute('show-value', '');
      document.body.appendChild(el);

      const track = el.shadowRoot?.querySelector('[role="progressbar"]');
      expect(track?.getAttribute('aria-valuenow')).toBe('75');
      expect(el.shadowRoot?.innerHTML).toContain('75%');
    });
  });

  describe('skyra-skeleton', () => {
    it('registers the core and composite elements', () => {
      expect(customElements.get('skyra-skeleton')).toBeDefined();
      expect(customElements.get('skyra-skeleton-text')).toBeDefined();
      expect(customElements.get('skyra-skeleton-avatar')).toBeDefined();
      expect(customElements.get('skyra-skeleton-card')).toBeDefined();
      expect(customElements.get('skyra-skeleton-table')).toBeDefined();
    });

    it('sets aria-hidden true by default', () => {
      const el = document.createElement('skyra-skeleton');
      document.body.appendChild(el);
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('composes text skeleton correctly', () => {
      const el = document.createElement('skyra-skeleton-text');
      el.setAttribute('lines', '2');
      document.body.appendChild(el);
      
      expect(el.shadowRoot?.innerHTML).toContain('<skyra-skeleton');
      // Should have 2 skeletons
      const html = el.shadowRoot?.innerHTML || '';
      const match = html.match(/<skyra-skeleton/g);
      expect(match?.length).toBe(2);
    });
  });
});
