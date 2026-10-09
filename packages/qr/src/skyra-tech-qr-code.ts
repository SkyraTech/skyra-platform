import { generateQRCode, renderToSVGString } from './core';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechQRCodeElement extends BaseClass {
  static get observedAttributes() {
    return [
      'value', 'error-correction-level', 'version', 'margin', 'mask-pattern', 
      'scale', 'color-light', 'color-dark', 'module-shape', 'finder-shape', 'finder-color'
    ];
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

  get moduleShape() { return (this.getAttribute('module-shape') as any) || 'square'; }
  set moduleShape(val: 'square' | 'rounded' | 'dot') { this.setAttribute('module-shape', val); }

  get finderShape() { return (this.getAttribute('finder-shape') as any) || 'square'; }
  set finderShape(val: 'square' | 'rounded') { this.setAttribute('finder-shape', val); }

  get finderColor() { return this.getAttribute('finder-color') || this.colorDark; }
  set finderColor(val: string) { this.setAttribute('finder-color', val); }

  render() {
    if (!this.shadowRoot) return;
    const value = this.value;
    if (!value) {
      this.shadowRoot.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--skyra-text-muted);font-family:inherit;text-align:center;">Enter content to generate a QR code.</div>';
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

      const ariaLabel = this.getAttribute('aria-label') || 'QR Code';

      const svgString = renderToSVGString(matrix, {
        margin,
        scale,
        color: {
          light: this.colorLight,
          dark: this.colorDark
        },
        style: {
          moduleShape: this.moduleShape,
          finderShape: this.finderShape,
          finderColor: this.finderColor
        },
        responsive: true
      });

      // Inject the aria-label and role into the generated SVG
      const accessibleSvg = svgString
        .replace('<svg ', `<svg role="img" aria-label="${ariaLabel}" `)
        .replace('</svg>', `<title>${ariaLabel}</title></svg>`);

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
          ${accessibleSvg}
        </div>
      `;
    } catch (e) {
      console.error('[@skyra-tech-platform/qr] Failed to generate QR code in web component:', e);
      this.shadowRoot.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--skyra-error);font-family:inherit;text-align:center;border:1px solid var(--skyra-error-alpha-20);border-radius:4px;padding:1rem;">QR generation failed</div>';
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-qr-code')) {
  customElements.define('skyra-tech-qr-code', SkyraTechQRCodeElement);
}
