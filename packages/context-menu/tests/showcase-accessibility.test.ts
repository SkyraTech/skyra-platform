import { it, expect } from 'vitest';
import '../src/index';
it('gives the keyboard context target a role supporting its ARIA state', () => {
 const el = document.createElement('skyra-tech-context-menu');document.body.append(el);
 try {const target=el.shadowRoot!.querySelector('.skyra-context-menu-target')!;expect(target.getAttribute('role')).toBe('button');expect(target.getAttribute('aria-expanded')).toBe('false');}finally{el.remove();}
});
