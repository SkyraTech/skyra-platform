import '../src/index';
import { afterEach, expect, it } from 'vitest';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-spinner","skyra-progress","skyra-circular-progress","skyra-skeleton","skyra-skeleton-text","skyra-skeleton-avatar","skyra-skeleton-card","skyra-skeleton-table"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it('renders canonical loading status and composed skeleton content', () => {
  const spinner = document.createElement('skyra-tech-spinner');
  const card = document.createElement('skyra-tech-skeleton-card');
  document.body.append(spinner, card);
  expect(spinner.getAttribute('role')).toBe('status');
  expect(spinner.getAttribute('aria-label')).toBe('Loading...');
  expect(card.shadowRoot!.querySelector('skyra-skeleton-text')!.shadowRoot).not.toBeNull();
});
