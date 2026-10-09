import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { toast, SkyraToastViewportElement } from '../src/index';

describe('@skyra-tech-platform/toast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    toast.dismissAll();
    document.body.innerHTML = '';
  });

  it('registers the skyra-toast-viewport custom element', () => {
    expect(customElements.get('skyra-toast-viewport')).toBeDefined();
  });

  it('imperatively adds a toast to the viewport', () => {
    const id = toast({ title: 'Test Toast', message: 'Hello world' });
    expect(typeof id).toBe('string');
    expect(id).not.toBe('');

    const viewport = document.querySelector('skyra-toast-viewport');
    expect(viewport).not.toBeNull();

    // Check shadow DOM
    const stack = viewport!.shadowRoot!.querySelector('.skyra-toast-stack');
    expect(stack).not.toBeNull();
    const items = stack!.querySelectorAll('.skyra-toast-item');
    expect(items.length).toBe(1);

    const notification = items[0].querySelector('skyra-notification-bar');
    expect(notification).not.toBeNull();
  });

  it('dismisses a toast by id', () => {
    const id = toast({ title: 'Test Toast' });
    const viewport = document.querySelector('skyra-toast-viewport');
    expect(viewport!.shadowRoot!.querySelectorAll('.skyra-toast-item').length).toBe(1);

    toast.dismiss(id);
    expect(viewport!.shadowRoot!.querySelectorAll('.skyra-toast-item').length).toBe(0);
  });

  it('dismisses all toasts', () => {
    toast({ title: 'Toast 1' });
    toast({ title: 'Toast 2' });
    toast({ title: 'Toast 3' });
    
    const viewport = document.querySelector('skyra-toast-viewport');
    expect(viewport!.shadowRoot!.querySelectorAll('.skyra-toast-item').length).toBe(3);

    toast.dismissAll();
    expect(viewport!.shadowRoot!.querySelectorAll('.skyra-toast-item').length).toBe(0);
  });

  it('respects maxVisible limit', () => {
    // Default is 5. Let's add 6.
    for (let i = 0; i < 6; i++) {
      toast({ title: `Toast ${i}` });
    }
    const viewport = document.querySelector('skyra-toast-viewport');
    expect(viewport!.shadowRoot!.querySelectorAll('.skyra-toast-item').length).toBe(5);
  });

  it('updates an existing toast', () => {
    const id = toast({ title: 'Initial Title' });
    const viewport = document.querySelector('skyra-toast-viewport');
    
    // Internal state update check
    toast.update(id, { title: 'Updated Title' });
    
    const notification = viewport!.shadowRoot!.querySelector('skyra-notification-bar');
    // Notification renders title in a slot
    const titleSlot = notification!.querySelector('[slot="title"]');
    expect(titleSlot!.textContent).toBe('Updated Title');
  });
});
