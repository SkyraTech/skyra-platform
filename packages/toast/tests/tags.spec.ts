import '../src/index';
import { afterEach, expect, it } from 'vitest';
import { toast } from '../src/index';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-toast-viewport"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it('reuses an existing canonical viewport for the imperative toast API', () => {
  const viewport = document.createElement('skyra-tech-toast-viewport');
  document.body.append(viewport);
  const id = toast({ title: 'Canonical toast', persistent: true });
  expect(document.querySelector('skyra-toast-viewport')).toBeNull();
  expect(viewport.shadowRoot!.querySelectorAll('.skyra-toast-item')).toHaveLength(1);
  expect(viewport.getAttribute('aria-live')).toBe('polite');
  toast.dismiss(id);
  expect(viewport.shadowRoot!.querySelectorAll('.skyra-toast-item')).toHaveLength(0);
});
