import '../src/index';
import { afterEach, expect, it, vi } from 'vitest';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-notification-bar"], () => import('../src/index'));

afterEach(() => document.body.replaceChildren());
it('preserves canonical notification dismissal and its event', () => {
  const notification = document.createElement('skyra-tech-notification-bar');
  notification.setAttribute('duration', '0');
  document.body.append(notification);
  const closed = vi.fn();
  notification.addEventListener('skyra-close', closed);
  (notification.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement).click();
  expect(closed).toHaveBeenCalledTimes(1);
  expect(notification.style.display).toBe('none');
});
