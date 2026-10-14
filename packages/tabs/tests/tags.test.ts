import '../src/index';
import { afterEach, expect, it } from 'vitest';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-tabs","skyra-tab","skyra-tab-panel"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it.each([
  ['skyra-tech-tabs', 'skyra-tech-tab', 'skyra-tech-tab-panel'],
  ['skyra-tech-tabs', 'skyra-tab', 'skyra-tab-panel'],
  ['skyra-tabs', 'skyra-tech-tab', 'skyra-tech-tab-panel'],
])('supports selection and arrow keys with %s and %s', async (parent, tab, panel) => {
  const host = document.createElement(parent);
  host.innerHTML = `<${tab} slot="tab" value="one">One</${tab}><${tab} slot="tab" value="two">Two</${tab}>
    <${panel} value="one">First</${panel}><${panel} value="two">Second</${panel}>`;
  document.body.append(host);
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const tabs = host.querySelectorAll(tab);
  const panels = host.querySelectorAll(panel);
  expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  tabs[1].dispatchEvent(new CustomEvent('skyra-tab-click', { detail: { value: 'two' }, bubbles: true }));
  expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  expect(panels[1].hasAttribute('hidden')).toBe(false);
  tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  expect(panels[0].hasAttribute('hidden')).toBe(false);
  expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
});
