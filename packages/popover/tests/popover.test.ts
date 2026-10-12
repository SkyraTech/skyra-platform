import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index.js';
import type { SkyraPopoverElement } from '../src/index.js';
import { computePopoverPosition } from '../src/positioning.js';

describe('SkyraPopoverElement', () => {
  let popover: SkyraPopoverElement;

  beforeEach(() => {
    popover = document.createElement('skyra-popover') as SkyraPopoverElement;
    document.body.appendChild(popover);
  });

  afterEach(() => {
    popover.remove();
  });

  it('registers the custom element in customElements registry', () => {
    expect(customElements.get('skyra-popover')).toBeDefined();
    expect(customElements.get('skyra-tech-popover')).toBeDefined();
  });

  it('initializes with default closed state and correct ARIA defaults', () => {
    expect(popover.open).toBe(false);
    expect(popover.disabled).toBe(false);
    expect(popover.placement).toBe('bottom');
    expect(popover.align).toBe('start');
    expect(popover.offset).toBe(6);
    expect(popover.viewportPadding).toBe(8);

    const trigger = popover.shadowRoot?.querySelector('.skyra-popover-trigger-wrapper');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('role')).toBe('button');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('reflects property changes to attributes and vice-versa', () => {
    popover.placement = 'top';
    expect(popover.getAttribute('placement')).toBe('top');

    popover.setAttribute('align', 'end');
    expect(popover.align).toBe('end');

    popover.offset = 12;
    expect(popover.getAttribute('offset')).toBe('12');

    popover.open = true;
    expect(popover.hasAttribute('open')).toBe(true);
    const trigger = popover.shadowRoot?.querySelector('.skyra-popover-trigger-wrapper');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    popover.open = false;
    expect(popover.hasAttribute('open')).toBe(false);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles open state on trigger click', () => {
    const trigger = popover.shadowRoot?.querySelector('.skyra-popover-trigger-wrapper') as HTMLElement;
    trigger.click();
    expect(popover.open).toBe(true);

    trigger.click();
    expect(popover.open).toBe(false);
  });

  it('toggles open state with Enter and Space keys on trigger', () => {
    const trigger = popover.shadowRoot?.querySelector('.skyra-popover-trigger-wrapper') as HTMLElement;

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(enterEvent);
    expect(popover.open).toBe(true);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    trigger.dispatchEvent(spaceEvent);
    expect(popover.open).toBe(false);
  });

  it('does not toggle when disabled', () => {
    popover.disabled = true;
    const trigger = popover.shadowRoot?.querySelector('.skyra-popover-trigger-wrapper') as HTMLElement;

    trigger.click();
    expect(popover.open).toBe(false);

    popover.show();
    expect(popover.open).toBe(false);

    popover.toggle();
    expect(popover.open).toBe(false);
  });

  it('emits open, close, and change custom events with correct detail payloads', () => {
    let openEventDetail: any = null;
    let closeEventDetail: any = null;
    const changeEvents: boolean[] = [];

    popover.addEventListener('skyra-popover-open', (e: Event) => {
      openEventDetail = (e as CustomEvent).detail;
    });

    popover.addEventListener('skyra-popover-close', (e: Event) => {
      closeEventDetail = (e as CustomEvent).detail;
    });

    popover.addEventListener('skyra-popover-change', (e: Event) => {
      changeEvents.push((e as CustomEvent).detail.open);
    });

    popover.show();
    expect(changeEvents).toContain(true);

    popover.hide('programmatic-test');
    expect(changeEvents).toContain(false);
    expect(closeEventDetail).toEqual({ reason: 'programmatic-test' });
  });

  it('dismisses on Escape key and restores focus', () => {
    const button = document.createElement('button');
    button.slot = 'trigger';
    button.textContent = 'Trigger Button';
    popover.appendChild(button);

    popover.show();
    expect(popover.open).toBe(true);

    const focusSpy = vi.spyOn(button, 'focus');

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escEvent);

    expect(popover.open).toBe(false);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('dismisses on outside pointer click', () => {
    popover.show();
    expect(popover.open).toBe(true);

    const outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);

    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    outsideEl.dispatchEvent(mouseEvent);

    expect(popover.open).toBe(false);
    outsideEl.remove();
  });

  it('does not dismiss when clicking inside popover content', () => {
    popover.show();
    expect(popover.open).toBe(true);

    const contentButton = document.createElement('button');
    contentButton.textContent = 'Inside Button';
    popover.appendChild(contentButton);

    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    contentButton.dispatchEvent(mouseEvent);

    expect(popover.open).toBe(true);
  });

  it('cleans up listeners on disconnectedCallback without memory leaks', () => {
    popover.show();
    expect(popover.open).toBe(true);

    // Disconnecting element
    popover.remove();

    // Firing outside event should not crash or throw
    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    document.dispatchEvent(mouseEvent);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escEvent);
  });
});

describe('computePopoverPosition', () => {
  it('calculates default bottom start coordinates correctly', () => {
    const result = computePopoverPosition({
      anchorRect: { top: 100, bottom: 140, left: 200, right: 300, width: 100, height: 40 },
      floatingRect: { width: 200, height: 100 },
      placement: 'bottom',
      align: 'start',
      offset: 6,
      viewportPadding: 8,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    expect(result.actualPlacement).toBe('bottom');
    expect(result.actualAlign).toBe('start');
    expect(result.top).toBe(146); // bottom (140) + offset (6)
    expect(result.left).toBe(200); // start align
  });

  it('flips to top when colliding with bottom viewport edge', () => {
    const result = computePopoverPosition({
      anchorRect: { top: 700, bottom: 740, left: 200, right: 300, width: 100, height: 40 },
      floatingRect: { width: 200, height: 100 },
      placement: 'bottom',
      align: 'start',
      offset: 6,
      viewportPadding: 8,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    // 740 + 6 + 100 = 846 > 800 - 8 (792) -> flips to top
    expect(result.actualPlacement).toBe('top');
    expect(result.top).toBe(700 - 100 - 6); // 594
  });

  it('flips to bottom when colliding with top viewport edge', () => {
    const result = computePopoverPosition({
      anchorRect: { top: 20, bottom: 60, left: 200, right: 300, width: 100, height: 40 },
      floatingRect: { width: 200, height: 100 },
      placement: 'top',
      align: 'start',
      offset: 6,
      viewportPadding: 8,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    // 20 - 6 - 100 = -86 < 8 -> flips to bottom
    expect(result.actualPlacement).toBe('bottom');
    expect(result.top).toBe(66);
  });

  it('clamps cross-axis left coordinate within viewport boundary', () => {
    // Anchor is near the far right of the viewport
    const result = computePopoverPosition({
      anchorRect: { top: 100, bottom: 140, left: 950, right: 990, width: 40, height: 40 },
      floatingRect: { width: 300, height: 100 },
      placement: 'bottom',
      align: 'start',
      offset: 6,
      viewportPadding: 10,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    // Left coordinate clamped to 1000 - 10 - 300 = 690
    expect(result.left).toBe(690);
  });

  it('aligns center properly on horizontal placement', () => {
    const result = computePopoverPosition({
      anchorRect: { top: 200, bottom: 240, left: 300, right: 400, width: 100, height: 40 },
      floatingRect: { width: 150, height: 100 },
      placement: 'right',
      align: 'center',
      offset: 10,
      viewportPadding: 8,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    expect(result.actualPlacement).toBe('right');
    expect(result.left).toBe(410); // right (400) + offset (10)
    expect(result.top).toBe(170); // 200 + 40/2 - 100/2 = 170
  });
});
