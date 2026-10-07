import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkyraNotificationBarElement } from './skyra-notification-bar';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

if (typeof customElements !== 'undefined' && !customElements.get('skyra-notification-bar')) {
  customElements.define('skyra-notification-bar', SkyraNotificationBarElement);
}

describe('SkyraNotificationBarElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock requestAnimationFrame and clearInterval if needed, though testing real timers requires vitest fake timers
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-notification-bar')).toBeDefined();
  });

  it('renders correctly with default type (info)', () => {
    const el = document.createElement('skyra-notification-bar') as SkyraNotificationBarElement;
    el.innerHTML = '<span slot="title">Info Title</span>This is an info message';
    document.body.appendChild(el);

    expect(el.type).toBe('info');
    expect(el.duration).toBe(5000);
    
    // Check shadowRoot structure
    const shadowRoot = el.shadowRoot!;
    expect(shadowRoot).toBeDefined();
    
    const container = shadowRoot.querySelector('.container');
    expect(container).toBeDefined();

    const titleSlot = shadowRoot.querySelector('slot[name="title"]') as HTMLSlotElement;
    expect(titleSlot).not.toBeNull();
  });

  it('renders different variants properly', () => {
    const el = document.createElement('skyra-notification-bar') as SkyraNotificationBarElement;
    el.type = 'success';
    el.code = '200';
    document.body.appendChild(el);

    expect(el.type).toBe('success');
    expect(el.code).toBe('200');

    // Code badge should be rendered
    const badge = el.shadowRoot!.querySelector('.badge');
    expect(badge).not.toBeNull();
    expect(badge!.textContent).toBe('200');
  });

  it('dismisses when close button is clicked', () => {
    const el = document.createElement('skyra-notification-bar') as SkyraNotificationBarElement;
    document.body.appendChild(el);

    let eventFired = false;
    el.addEventListener('skyra-close', () => {
      eventFired = true;
    });

    const closeBtn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.click();

    expect(eventFired).toBe(true);
    expect(el.style.display).toBe('none');
  });

  it('passes accessibility checks (axe)', async () => {
    const el = document.createElement('skyra-notification-bar') as SkyraNotificationBarElement;
    el.innerHTML = '<span slot="title">Accessible Title</span>Accessible message content';
    document.body.appendChild(el);
    
    // Ensure component renders before axe check
    await new Promise(r => setTimeout(r, 0));

    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('handles duration updates', () => {
    const el = document.createElement('skyra-notification-bar') as SkyraNotificationBarElement;
    document.body.appendChild(el);

    // Default duration is 5000
    expect(el.duration).toBe(5000);
    
    // Change duration
    el.setAttribute('duration', '3000');
    expect(el.duration).toBe(3000);
  });
});
