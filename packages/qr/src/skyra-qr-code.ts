import { generateQRCode, buildSVGPath } from './core';

export class SkyraQRCodeElement extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'error-correction-level', 'version', 'margin', 'mask-pattern', 'scale', 'color-light', 'color-dark'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(val: string) { this.setAttribute('value', val); }

  get errorCorrectionLevel() { return (this.getAttribute('error-correction-level') || 'M') as 'L' | 'M' | 'Q' | 'H'; }
  set errorCorrectionLevel(val: 'L' | 'M' | 'Q' | 'H') { this.setAttribute('error-correction-level', val); }

  get version() { return this.hasAttribute('version') ? parseInt(this.getAttribute('version')!, 10) : undefined; }
  set version(val: number | undefined) { if (val) this.setAttribute('version', val.toString()); else this.removeAttribute('version'); }

  get margin() { return this.hasAttribute('margin') ? parseInt(this.getAttribute('margin')!, 10) : 4; }
  set margin(val: number) { this.setAttribute('margin', val.toString()); }

  get maskPattern() { return this.hasAttribute('mask-pattern') ? parseInt(this.getAttribute('mask-pattern')!, 10) : undefined; }
  set maskPattern(val: number | undefined) { if (val !== undefined) this.setAttribute('mask-pattern', val.toString()); else this.removeAttribute('mask-pattern'); }

  get scale() { return this.hasAttribute('scale') ? parseInt(this.getAttribute('scale')!, 10) : 4; }
  set scale(val: number) { this.setAttribute('scale', val.toString()); }

  get colorLight() { return this.getAttribute('color-light') || '#ffffff'; }
  set colorLight(val: string) { this.setAttribute('color-light', val); }

  get colorDark() { return this.getAttribute('color-dark') || '#000000'; }
  set colorDark(val: string) { this.setAttribute('color-dark', val); }

  render() {
    if (!this.shadowRoot) return;
    const value = this.value;
    if (!value) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    try {
      const matrix = generateQRCode(value, {
        errorCorrectionLevel: this.errorCorrectionLevel,
        version: this.version,
        maskPattern: this.maskPattern,
      });

      const { size } = matrix;
      const margin = this.margin;
      const totalSize = size + margin * 2;
      const scale = this.scale;
      
      const width = this.getAttribute('width');
      const responsiveWidth = width ?? (totalSize * scale).toString();

      const pathData = buildSVGPath(matrix, margin);
      const lightColor = this.colorLight;
      const darkColor = this.colorDark;

      const ariaLabel = this.getAttribute('aria-label') || 'QR Code';

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            max-width: 100%;
          }
          svg {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
        <div style="width: ${responsiveWidth}px; max-width: 100%;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${totalSize} ${totalSize}"
            shape-rendering="crispEdges"
            role="img"
            aria-label="${ariaLabel}"
          >
            <title>${ariaLabel}</title>
            ${lightColor.toLowerCase() !== 'transparent' ? \`<rect width="100%" height="100%" fill="\${lightColor}" />\` : ''}
            <path d="${pathData}" fill="${darkColor}" />
          </svg>
        </div>
      `;
    } catch (e) {
      console.error('[@skyra/qr] Failed to generate QR code in web component:', e);
      this.shadowRoot.innerHTML = '';
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get('skyra-qr-code')) {
  customElements.define('skyra-qr-code', SkyraQRCodeElement);
}
