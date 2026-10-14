import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SkyraTechDialog } from '../src/index';

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');

describe('SkyraTechDialog', () => {
  let dialog: SkyraTechDialog;
  let native: HTMLDialogElement;
  let closeButton: HTMLButtonElement;
  let showModal: ReturnType<typeof vi.fn>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // jsdom provides HTMLDialogElement but not these native methods. Model only
    // open-state changes and the asynchronously delivered native close event;
    // do not simulate top-layer rendering, focus trapping or Escape defaults.
    showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
    });
    close = vi.fn(function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.open = false;
      queueMicrotask(() => this.dispatchEvent(new Event('close')));
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: showModal });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: close });
    dialog = document.createElement('skyra-tech-dialog') as SkyraTechDialog;
    document.body.append(dialog);
    native = dialog.shadowRoot!.querySelector('dialog')!;
    closeButton = dialog.shadowRoot!.querySelector('button')!;
  });

  afterEach(async () => {
    // Drain native-close deliveries before removing fixtures/restoring spies.
    await Promise.resolve();
    document.body.replaceChildren();
    document.body.style.removeProperty('overflow');
    vi.restoreAllMocks();
  });

  afterAll(() => {
    for (const [name, descriptor] of [['showModal', originalShowModal], ['close', originalClose]] as const) {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
      else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
    }
  });

  it('exports and registers the public custom-element class', () => {
    expect(customElements.get('skyra-tech-dialog')).toBe(SkyraTechDialog);
    expect(dialog).toBeInstanceOf(SkyraTechDialog);
    expect(SkyraTechDialog.formAssociated).toBe(true);
  });

  it('starts closed with documented defaults and native dialog markup', () => {
    expect(dialog.open).toBe(false);
    expect(native).toBeInstanceOf(HTMLDialogElement);
    expect(native.open).toBe(false);
    expect(dialog.mode).toBe('modal');
    expect(dialog.size).toBe('md');
    expect(dialog.side).toBe('right');
    expect(dialog.drawerWidth).toBe('480px');
    expect(dialog.closeOnBackdrop).toBe(true);
    expect(dialog.closeOnEscape).toBe(true);
    expect(closeButton.getAttribute('aria-label')).toBe('Close');
    expect(dialog.shadowRoot!.querySelector('h2 slot')!.getAttribute('name')).toBe('title');
    expect(showModal).not.toHaveBeenCalled();
  });

  it('opens through the property, locks scroll and emits one public event', () => {
    const listener = vi.fn();
    dialog.parentElement!.addEventListener('skyra-open', listener, { once: true });
    dialog.open = true;
    expect(dialog.getAttribute('open')).toBe('');
    expect(native.open).toBe(true);
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(document.body.style.getPropertyValue('overflow')).toBe('hidden');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.target).toBe(dialog);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it.each(['', 'true'])('opens for the supported open attribute value %j', value => {
    dialog.setAttribute('open', value);
    expect(dialog.open).toBe(true);
    expect(native.open).toBe(true);
  });

  it.each(['false', 'undefined'])('closes for the explicit false-like open value %j', async value => {
    dialog.open = true;
    dialog.setAttribute('open', value);
    await Promise.resolve();
    expect(native.open).toBe(false);
    expect(dialog.open).toBe(false);
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('opens on connection when the open attribute was set while detached', () => {
    // A fresh detached element has no cached native element until connection.
    const initial = document.createElement('skyra-tech-dialog') as SkyraTechDialog;
    initial.setAttribute('open', '');
    const initialNative = initial.shadowRoot!.querySelector('dialog')!;
    expect(initialNative.open).toBe(false);
    document.body.append(initial);
    expect(initialNative.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes through the property and emits a bubbling composed close event', async () => {
    const listener = vi.fn();
    dialog.parentElement!.addEventListener('skyra-close', listener, { once: true });
    dialog.open = true;
    dialog.open = false;
    expect(close).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(dialog.open).toBe(false);
    expect(native.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('synchronizes host state after a native close', async () => {
    dialog.open = true;
    native.close();
    await Promise.resolve();
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('restores focus to the element that opened the dialog', async () => {
    const trigger = document.createElement('button');
    const content = document.createElement('button');
    document.body.prepend(trigger);
    dialog.append(content);
    trigger.focus();
    dialog.open = true;
    content.focus();
    expect(document.activeElement).toBe(content);
    dialog.open = false;
    await Promise.resolve();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes from the close button without emitting cancel', async () => {
    const cancel = vi.fn();
    dialog.addEventListener('skyra-cancel', cancel);
    dialog.open = true;
    closeButton.click();
    await Promise.resolve();
    expect(dialog.open).toBe(false);
    expect(cancel).not.toHaveBeenCalled();
  });

  it('handles repeated open/close cycles without duplicate events', async () => {
    const opened = vi.fn();
    const closed = vi.fn();
    dialog.addEventListener('skyra-open', opened);
    dialog.addEventListener('skyra-close', closed);
    for (let index = 0; index < 3; index++) {
      dialog.open = true;
      dialog.open = true;
      dialog.open = false;
      await Promise.resolve();
      dialog.open = false;
    }
    expect(showModal).toHaveBeenCalledTimes(3);
    expect(close).toHaveBeenCalledTimes(3);
    expect(opened).toHaveBeenCalledTimes(3);
    expect(closed).toHaveBeenCalledTimes(3);
  });

  function backdropClick(x: number, y: number) {
    vi.spyOn(native, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 100, 80));
    native.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
  }

  it('cancels and closes for a click outside the dialog bounds', async () => {
    const events: Event[] = [];
    dialog.addEventListener('skyra-cancel', event => events.push(event));
    dialog.addEventListener('skyra-close', event => events.push(event));
    dialog.open = true;
    backdropClick(0, 0);
    await Promise.resolve();
    expect(events.map(event => event.type)).toEqual(['skyra-cancel', 'skyra-close']);
    expect(events[0].bubbles).toBe(true);
    expect(events[0].composed).toBe(true);
    expect(dialog.open).toBe(false);
  });

  it.each([[10, 20], [110, 100], [50, 50]])('keeps the dialog open for an inside/boundary click at %j,%j', (x, y) => {
    dialog.open = true;
    backdropClick(x, y);
    expect(native.open).toBe(true);
    expect(close).not.toHaveBeenCalled();
  });

  it('ignores clicks on content even when their coordinates are outside', () => {
    dialog.open = true;
    const content = dialog.shadowRoot!.querySelector('[part="content"]')!;
    content.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: -10, clientY: -10 }));
    expect(close).not.toHaveBeenCalled();
  });

  it('honors a live close-on-backdrop=false attribute', () => {
    dialog.open = true;
    dialog.setAttribute('close-on-backdrop', 'false');
    backdropClick(0, 0);
    expect(dialog.closeOnBackdrop).toBe(false);
    expect(native.open).toBe(true);
    dialog.removeAttribute('close-on-backdrop');
    backdropClick(0, 0);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('emits cancel for Escape while leaving native dismissal to the browser', () => {
    const cancel = vi.fn();
    dialog.addEventListener('skyra-cancel', cancel);
    dialog.open = true;
    const key = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    native.dispatchEvent(key);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(key.defaultPrevented).toBe(false);
    expect(close).not.toHaveBeenCalled();
  });

  it('prevents Escape dismissal when disabled and ignores unrelated keys', () => {
    const cancel = vi.fn();
    dialog.addEventListener('skyra-cancel', cancel);
    dialog.open = true;
    dialog.setAttribute('close-on-escape', 'false');
    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    native.dispatchEvent(escape);
    expect(dialog.closeOnEscape).toBe(false);
    expect(escape.defaultPrevented).toBe(true);
    native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(cancel).not.toHaveBeenCalled();
    expect(native.open).toBe(true);
  });

  it('reflects modal/drawer properties and updates native styles', () => {
    dialog.size = 'lg';
    expect(dialog.getAttribute('size')).toBe('lg');
    expect(native.dataset.size).toBe('lg');
    dialog.mode = 'drawer';
    dialog.side = 'left';
    dialog.drawerWidth = '360px';
    expect(dialog.getAttribute('mode')).toBe('drawer');
    expect(dialog.getAttribute('side')).toBe('left');
    expect(dialog.getAttribute('drawer-width')).toBe('360px');
    expect(native.dataset.mode).toBe('drawer');
    expect(native.dataset.side).toBe('left');
    expect(native.style.getPropertyValue('--drawer-width')).toBe('360px');
    dialog.setAttribute('mode', 'modal');
    expect(dialog.mode).toBe('modal');
    expect(native.dataset.mode).toBe('modal');
    expect(native.style.getPropertyValue('--drawer-width')).toBe('');
  });

  it('updates title/header visibility and close-button visibility', () => {
    const header = dialog.shadowRoot!.querySelector('#header')!;
    dialog.setAttribute('hide-close-button', '');
    expect(header.hasAttribute('hidden')).toBe(true);
    expect(closeButton.style.display).toBe('none');
    const title = document.createElement('span');
    title.slot = 'title';
    title.textContent = 'Confirm action';
    dialog.append(title);
    const slot = dialog.shadowRoot!.querySelector('slot[name="title"]')!;
    slot.dispatchEvent(new Event('slotchange'));
    expect(header.hasAttribute('hidden')).toBe(false);
    title.remove();
    slot.dispatchEvent(new Event('slotchange'));
    expect(header.hasAttribute('hidden')).toBe(true);
    dialog.removeAttribute('hide-close-button');
    expect(header.hasAttribute('hidden')).toBe(false);
    expect(closeButton.style.display).toBe('flex');
  });

  it('shows and hides the footer when assigned content changes', () => {
    const footer = dialog.shadowRoot!.querySelector('#footer')!;
    const slot = dialog.shadowRoot!.querySelector('slot[name="footer"]')!;
    expect(footer.hasAttribute('hidden')).toBe(true);
    const action = document.createElement('button');
    action.slot = 'footer';
    dialog.append(action);
    slot.dispatchEvent(new Event('slotchange'));
    expect(footer.hasAttribute('hidden')).toBe(false);
    action.remove();
    slot.dispatchEvent(new Event('slotchange'));
    expect(footer.hasAttribute('hidden')).toBe(true);
  });

  it('unlocks scrolling and removes native event listeners on disconnect', () => {
    const cancel = vi.fn();
    const closed = vi.fn();
    dialog.addEventListener('skyra-cancel', cancel);
    dialog.addEventListener('skyra-close', closed);
    dialog.open = true;
    dialog.remove();
    expect(document.body.style.overflow).toBe('');
    native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    native.dispatchEvent(new Event('close'));
    closeButton.click();
    backdropClick(0, 0);
    expect(cancel).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it('reattaches native listeners once after reconnection', async () => {
    const closed = vi.fn();
    dialog.addEventListener('skyra-close', closed);
    dialog.remove();
    document.body.append(dialog);
    dialog.open = true;
    closeButton.click();
    await Promise.resolve();
    expect(close).toHaveBeenCalledTimes(1);
    expect(closed).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);
  });
});
