import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkyraTechEmptyState, defineSkyraTechEmptyState } from '../src/skyra-tech-empty-state';

defineSkyraTechEmptyState();

function createEmptyState(attrs: Record<string, string> = {}): SkyraTechEmptyState {
  const el = document.createElement('skyra-tech-empty-state') as SkyraTechEmptyState;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  document.body.appendChild(el);
  return el;
}

function cleanup(el: Element) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

describe('SkyraTechEmptyState Web Component', () => {
  let emptyState: SkyraTechEmptyState;

  beforeEach(() => {
    emptyState = createEmptyState({ headline: 'No Logs Found', description: 'Try adjusting your search criteria' });
  });

  afterEach(() => {
    cleanup(emptyState);
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-empty-state')).toBe(SkyraTechEmptyState);
  });

  it('renders headline and description', () => {
    const titleEl = emptyState.shadowRoot!.querySelector('.skyra-empty-state-title');
    const descEl = emptyState.shadowRoot!.querySelector('.skyra-empty-state-desc');
    expect(titleEl?.textContent).toBe('No Logs Found');
    expect(descEl?.textContent).toBe('Try adjusting your search criteria');
  });

  it('supports dashed and outline variants', () => {
    emptyState.variant = 'dashed';
    const root = emptyState.shadowRoot!.querySelector('.skyra-empty-state');
    expect(root?.classList.contains('skyra-empty-state--dashed')).toBe(true);

    emptyState.variant = 'outline';
    expect(root?.classList.contains('skyra-empty-state--outline')).toBe(true);
  });
});

