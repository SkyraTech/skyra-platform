import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/skyra-pdf-viewer'; // ensure custom element is registered

describe('PdfViewer Web Component', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('skyra-tech-pdf-viewer');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    vi.restoreAllMocks();
  });

  it('registers the custom element', () => {
    expect(customElements.get('skyra-tech-pdf-viewer')).toBeDefined();
  });

  it('reflects title property', () => {
    element.docTitle = 'Test Document';
    expect(element.getAttribute('title')).toBe('Test Document');
    
    // Check shadow dom toolbar title
    const titleSpan = element.shadowRoot.querySelector('.toolbar-title');
    expect(titleSpan.textContent).toBe('Test Document');
  });

  it('updates zoom correctly', () => {
    expect(element.zoom).toBe(100);
    element.zoomIn();
    expect(element.zoom).toBe(125);
    element.setZoom(200);
    expect(element.zoom).toBe(200);
  });

  it('updates page numbers correctly', () => {
    // Total pages is initially 1 because no PDF is loaded
    expect(element.currentPage).toBe(1);
    
    // Note: since no PDF is loaded, changing pages won't work perfectly, but testing bounds logic
    element.currentPage = 2; // Should be capped at 1
    expect(element.currentPage).toBe(1);
  });
  
  it('renders skeleton document when src is missing', () => {
    const skeleton = element.shadowRoot.querySelector('.skeleton-doc');
    expect(skeleton).not.toBeNull();
  });

  it('handles fullscreen toggle', () => {
    // requestFullscreen mock
    element.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    
    const fsBtn = element.shadowRoot.querySelector('#btn-fullscreen');
    expect(fsBtn).not.toBeNull();
    
    // Fire click
    fsBtn.dispatchEvent(new MouseEvent('click'));
    
    // Check if requestFullscreen was called
    expect(element.requestFullscreen).toHaveBeenCalled();
  });

  it('fires skyra-zoom-change event on zoom change', () => {
    const zoomSpy = vi.fn();
    element.addEventListener('skyra-zoom-change', zoomSpy);
    element.zoomOut();
    expect(zoomSpy).toHaveBeenCalledTimes(1);
    expect(zoomSpy.mock.calls[0][0].detail).toBe(75);
  });
});
