import { it, expect } from 'vitest';
import '../src/index';
it('keeps the closed palette inert and synchronizes accessibility when opening and closing', () => {
 const el=document.createElement('skyra-command-palette');document.body.append(el);
 try {const backdrop=el.shadowRoot!.querySelector('#backdrop')!;expect(backdrop.hasAttribute('inert')).toBe(true);el.open=true;expect(backdrop.hasAttribute('inert')).toBe(false);expect(backdrop.getAttribute('aria-hidden')).toBe('false');el.open=false;expect(backdrop.hasAttribute('inert')).toBe(true);expect(backdrop.getAttribute('aria-hidden')).toBe('true');}finally{el.remove();}
});
