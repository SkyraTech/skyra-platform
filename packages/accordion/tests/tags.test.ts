import '../src/index';
import { afterEach, expect, it } from 'vitest';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-accordion","skyra-accordion-item"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it.each([
  ['skyra-tech-accordion', 'skyra-tech-accordion-item'],
  ['skyra-tech-accordion', 'skyra-accordion-item'],
  ['skyra-accordion', 'skyra-tech-accordion-item'],
])('supports composition with %s and %s', async (parent, child) => {
  const host = document.createElement(parent);
  host.innerHTML = `<${child} value="one"><span slot="trigger">One</span>Content</${child}>`;
  document.body.append(host);
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const item = host.firstElementChild!;
  const trigger = item.shadowRoot!.querySelector('button')!;
  trigger.click();
  expect(item.getAttribute('data-state')).toBe('open');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});
