import '../src/index';
import { afterEach, expect, it } from 'vitest';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-collapsible"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it('preserves canonical toggle and ARIA behavior', () => {
  const host = document.createElement('skyra-tech-collapsible');
  document.body.append(host);
  const trigger = host.shadowRoot!.querySelector('button')!;
  trigger.click();
  expect(host.hasAttribute('open')).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});
