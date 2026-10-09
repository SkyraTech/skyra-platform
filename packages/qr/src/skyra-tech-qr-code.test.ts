import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
import { SkyraTechQRCodeElement } from './skyra-tech-qr-code';

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-tech-qr-code')) customElements.define('skyra-tech-qr-code', SkyraTechQRCodeElement);
}

describe('SkyraTechQRCodeElement', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });


  it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = 'Axe test value';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-qr-code')).toBeDefined();
  });

  it('renders initial properties', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = 'https://skyra.tech';
    el.errorCorrectionLevel = 'H';
    el.margin = 2;
    el.scale = 5;
    el.colorDark = '#000000';
    el.colorLight = '#ffffff';
    document.body.appendChild(el);

    expect(el.value).toBe('https://skyra.tech');
    expect(el.errorCorrectionLevel).toBe('H');
    expect(el.margin).toBe(2);
    expect(el.scale).toBe(5);
    expect(el.colorDark).toBe('#000000');
    expect(el.colorLight).toBe('#ffffff');
  });

  it('generates a valid QR Code SVG structure', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = 'Valid data';
    document.body.appendChild(el);

    // After connecting, shadow root should be populated with an SVG
    expect(el.shadowRoot).not.toBeNull();
    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('role')).toBe('img');
    expect(svg!.getAttribute('aria-label')).toBe('QR Code');

    // A path element representing the code should be rendered
    const path = svg!.querySelector('path');
    expect(path).not.toBeNull();
    expect(path!.getAttribute('d')).toBeTruthy();
  });

  it('regenerates when value is updated', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = 'Data1';
    document.body.appendChild(el);
    const svg1 = el.shadowRoot!.querySelector('svg');
    const path1 = svg1!.querySelector('path')!.getAttribute('d');

    // change value
    el.value = 'Data2';
    const svg2 = el.shadowRoot!.querySelector('svg');
    const path2 = svg2!.querySelector('path')!.getAttribute('d');
    expect(path1).not.toEqual(path2);
  });

  it('renders empty when value is empty', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = '';
    document.body.appendChild(el);
    expect(el.shadowRoot!.innerHTML).toContain('Enter content to generate a QR code.');
  });

  it('supports options/configurations correctly', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    el.value = 'Test options';
    el.colorDark = '#FF0000';
    el.colorLight = '#00FF00';
    el.setAttribute('aria-label', 'Custom Label');
    document.body.appendChild(el);
    
    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg!.getAttribute('aria-label')).toBe('Custom Label');
    
    const rect = svg!.querySelector('rect');
    expect(rect!.getAttribute('fill')).toBe('#00FF00');

    const path = svg!.querySelector('path');
    expect(path!.getAttribute('fill')).toBe('#FF0000');
  });

  it('clears rendering gracefully on generation failure', () => {
    const el = document.createElement('skyra-tech-qr-code') as SkyraTechQRCodeElement;
    // An extremely huge payload for a low version might fail, 
    // or passing invalid parameters could trigger a catch block. 
    // Just testing basic error protection.
    document.body.appendChild(el);
    el.version = -1; // invalid version
    el.value = 'fail data';
    expect(el.shadowRoot!.innerHTML).toContain('QR generation failed');
  });
});
