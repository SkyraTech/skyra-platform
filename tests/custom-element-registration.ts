import { afterEach, describe, expect, it, vi } from 'vitest';

// Shared contract checks for canonical tags and intentionally retained aliases.
// Each package suite imports its real public source entry point first.
export function verifyTagRegistrations(legacyTags: string[], reload: () => Promise<unknown>) {
  const canonical = (tag: string) => tag.replace('skyra-', 'skyra-tech-');
  describe('custom-element registration contract', () => {
    afterEach(async () => {
      // Let deferred connected callbacks complete before disconnecting fixtures.
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      document.body.replaceChildren();
    });

    it.each(legacyTags)('constructs canonical and compatible legacy elements for %s', legacy => {
      const Legacy = customElements.get(legacy);
      const Canonical = customElements.get(canonical(legacy));
      expect(Legacy).toBeDefined();
      expect(Canonical).toBeDefined();
      expect(Canonical).not.toBe(Legacy);
      const oldElement = document.createElement(legacy);
      const newElement = document.createElement(canonical(legacy));
      expect(oldElement).toBeInstanceOf(Legacy!);
      expect(newElement).toBeInstanceOf(Legacy!);
      expect(newElement).toBeInstanceOf(Canonical!);
      document.body.append(oldElement, newElement);
      expect(newElement.isConnected).toBe(true);
    });

    it('keeps both registry bindings stable when modules are evaluated again', async () => {
      const tags = legacyTags.flatMap(tag => [tag, canonical(tag)]);
      const bindings = tags.map(tag => customElements.get(tag));
      vi.resetModules();
      await reload();
      tags.forEach((tag, index) => {
        expect(customElements.get(tag)).toBe(bindings[index]);
        expect(document.createElement(tag).constructor).toBe(bindings[index]);
      });
    });
  });
}
