import { it, expect } from 'vitest';
import '../src/index';
it('restores focus to the trigger wrapper rather than an input inside content', () => {
 const el=document.createElement('skyra-popover');el.innerHTML='<span slot="trigger">Edit review</span><input aria-label="Review name">';document.body.append(el);
 try {el.open=true;el.querySelector('input')!.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector('.skyra-popover-trigger-wrapper'));}finally{el.remove();}
});
