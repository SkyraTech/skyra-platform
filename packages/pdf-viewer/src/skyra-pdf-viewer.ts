import * as pdfjsLib from 'pdfjs-dist';

// Define a safe BaseElement to avoid crashing during SSR (e.g. Next.js server evaluation)
const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} as typeof HTMLElement;

// Include the standard CSS styling inside the file to inject into ShadowDOM
const styleContent = `
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 520px;
    background: var(--skyra-bg, #ffffff);
    border: 1px solid var(--skyra-border, #e5e7eb);
    border-radius: var(--skyra-radius-lg, 8px);
    overflow: hidden;
    box-shadow: var(--skyra-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    font-family: var(--skyra-font-body, system-ui, sans-serif);
    outline: none;
  }
  :host([fullscreen]) {
    height: 100vh;
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 9999;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1rem;
    background: var(--skyra-surface, #ffffff);
    border-bottom: 1px solid var(--skyra-border, #e5e7eb);
    gap: 0.75rem;
    flex-wrap: wrap;
    z-index: 20;
  }
  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .toolbar-title-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 160px;
  }
  .toolbar-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--skyra-text, #111827);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .toolbar-btn {
    background: var(--skyra-bg, #ffffff);
    border: 1px solid var(--skyra-border, #e5e7eb);
    border-radius: var(--skyra-radius-sm, 6px);
    padding: 6px 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--skyra-text, #111827);
    transition: background-color 0.15s ease;
  }
  .toolbar-btn:hover:not(:disabled) {
    background: var(--skyra-surface-hover, #f3f4f6);
  }
  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .toolbar-btn.primary {
    background: var(--skyra-primary, #3b82f6);
    color: #ffffff;
    border-color: var(--skyra-primary, #3b82f6);
  }
  .toolbar-btn.primary:hover:not(:disabled) {
    opacity: 0.9;
  }
  .divider {
    width: 1px;
    height: 18px;
    background: var(--skyra-border, #e5e7eb);
    margin: 0 4px;
  }
  .main-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .sidebar {
    width: 220px;
    height: 100%;
    background: var(--skyra-surface, #ffffff);
    border-right: 1px solid var(--skyra-border, #e5e7eb);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    left: 0;
    top: 0;
    z-index: 15;
    padding: 1rem;
    gap: 1rem;
    box-sizing: border-box;
  }
  @media (max-width: 768px) {
    .sidebar {
      position: absolute;
      width: 240px;
      box-shadow: var(--skyra-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    }
  }
  .thumbnail {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    background: transparent;
    border-radius: var(--skyra-radius-md, 8px);
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }
  .thumbnail.active {
    background: var(--skyra-primary-light, #eff6ff);
    border: 1px solid var(--skyra-primary, #3b82f6);
  }
  .thumbnail-canvas-container {
    width: 120px;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--skyra-bg, #ffffff);
    border: 1px solid var(--skyra-border, #e5e7eb);
    box-shadow: var(--skyra-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    border-radius: 4px;
    overflow: hidden;
  }
  .thumbnail.active .thumbnail-canvas-container {
    box-shadow: var(--skyra-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }
  .thumbnail-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--skyra-text-subtle, #6b7280);
  }
  .thumbnail.active .thumbnail-label {
    font-weight: 600;
    color: var(--skyra-primary, #3b82f6);
  }
  .document-area {
    flex: 1;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 1.5rem;
    background: var(--skyra-bg, #ffffff);
    position: relative;
  }
  .pdf-page-container {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border-radius: 4px;
    overflow: hidden;
    margin: auto;
    transition: transform 0.2s ease-out;
  }
  .pdf-page-canvas {
    display: block;
  }
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: var(--skyra-surface, #ffffff);
    border-top: 1px solid var(--skyra-border, #e5e7eb);
    z-index: 20;
  }
  .page-info {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--skyra-text, #111827);
  }
  .page-info-current {
    color: var(--skyra-primary, #3b82f6);
    font-weight: 600;
  }
  .message-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin: auto;
  }
  .message-container.loading {
    color: var(--skyra-text-muted, #9ca3af);
  }
  .message-container.error {
    color: var(--skyra-danger, #ef4444);
  }
  .message-text {
    font-size: 0.875rem;
  }
  .message-text.error {
    font-weight: 500;
  }
  .skeleton-doc {
    width: 560px;
    min-height: 760px;
    background: var(--skyra-surface, #ffffff);
    padding: 2.5rem;
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    color: var(--skyra-text, #111827);
    box-sizing: border-box;
    transition: transform 0.2s ease-out;
  }
  .skeleton-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid var(--skyra-border, #e5e7eb);
    padding-bottom: 1rem;
  }
  .skeleton-title {
    margin: 0;
    font-size: 1.25rem;
    color: var(--skyra-primary, #3b82f6);
  }
  .skeleton-subtitle {
    margin: 4px 0 0;
    font-size: 0.8rem;
    color: var(--skyra-text-muted, #9ca3af);
  }
  .skeleton-page-count {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--skyra-text-subtle, #6b7280);
    text-align: right;
  }
  .skeleton-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
    padding: 1rem 0;
  }
  .skeleton-line {
    height: 14px;
    background: var(--skyra-border, #e5e7eb);
    border-radius: 4px;
  }
  .skeleton-box {
    height: 80px;
    width: 100%;
    background: var(--skyra-bg, #ffffff);
    border-radius: 6px;
    margin-top: 1rem;
    border: 1px dashed var(--skyra-border, #e5e7eb);
  }
  .skeleton-footer {
    border-top: 1px solid var(--skyra-border, #e5e7eb);
    padding-top: 0.75rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--skyra-text-subtle, #6b7280);
  }
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  svg {
    display: block;
  }
`;

// Icons as pure SVG strings
const ICONS = {
  sidebar: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>',
  fileText: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
  zoomOut: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
  zoomIn: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
  rotateCw: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
  maximize: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  maximize2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
  minimize2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
  printer: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  loader2: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>'
};

export class SkyraPdfViewerElement extends BaseElement {
  // State
  private _src: string | Blob | ArrayBuffer | undefined;
  private _pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;
  
  private _title: string = 'Document Preview';
  private _totalPages: number = 1;
  private _currentPage: number = 1;
  private _zoom: number = 100;
  private _rotation: number = 0;
  private _sidebarOpen: boolean = false;
  private _isFullscreen: boolean = false;
  
  private _loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
  private _pageRenderTask: pdfjsLib.RenderTask | null = null;
  private _renderId: number = 0;
  private _pageProxy: pdfjsLib.PDFPageProxy | null = null;
  private _thumbnailProxies: Map<number, pdfjsLib.PDFPageProxy> = new Map();
  private _thumbnailRenderTasks: Map<number, pdfjsLib.RenderTask> = new Map();
  private _thumbnailObservers: Map<number, IntersectionObserver> = new Map();

  // DOM Elements
  private _shadowRoot: ShadowRoot;
  private _documentArea!: HTMLDivElement;
  private _sidebarContainer!: HTMLDivElement;
  private _canvas!: HTMLCanvasElement;
  private _pageContainer!: HTMLDivElement;

  static get observedAttributes() {
    return ['title', 'src', 'initial-page', 'initial-zoom', 'worker-src'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFsChange = this.handleFsChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  // Properties
  get src() { return this._src; }
  set src(val: string | Blob | ArrayBuffer | undefined) {
    if (this._src !== val) {
      this._src = val;
      this.loadPdf();
    }
  }

  get docTitle() { return this._title; }
  set docTitle(val: string) {
    this._title = val;
    this.setAttribute('title', val);
    this.render();
  }

  get currentPage() { return this._currentPage; }
  set currentPage(val: number) {
    if (val !== this._currentPage && val >= 1 && val <= this._totalPages) {
      this._currentPage = val;
      this.renderPage();
      this.render();
      this.dispatchEvent(new CustomEvent('skyra-page-change', { detail: val }));
    }
  }

  get zoom() { return this._zoom; }
  set zoom(val: number) {
    const newZoom = Math.min(Math.max(val, 50), 300);
    if (newZoom !== this._zoom) {
      this._zoom = newZoom;
      this.updatePageTransform();
      this.render();
      this.dispatchEvent(new CustomEvent('skyra-zoom-change', { detail: newZoom }));
    }
  }

  get rotation() { return this._rotation; }
  set rotation(val: number) {
    const newRotation = val % 360;
    if (newRotation !== this._rotation) {
      this._rotation = newRotation;
      this.renderPage();
      this.render();
    }
  }

  // Lifecycle
  connectedCallback() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', `PDF Viewer: ${this._title}`);

    // Set worker
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = this.getAttribute('worker-src') || `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    this._title = this.getAttribute('title') || 'Document Preview';
    const initialPageAttr = this.getAttribute('initial-page');
    if (initialPageAttr) this._currentPage = parseInt(initialPageAttr, 10);
    const initialZoomAttr = this.getAttribute('initial-zoom');
    if (initialZoomAttr) this._zoom = parseInt(initialZoomAttr, 10);

    const srcAttr = this.getAttribute('src');
    if (srcAttr && !this._src) {
      this._src = srcAttr;
    }

    this.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('fullscreenchange', this.handleFsChange);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.render();
    if (this._src) this.loadPdf();
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('fullscreenchange', this.handleFsChange);
    window.removeEventListener('resize', this.handleResize);
    this.cleanupPdf();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'title':
        this._title = newValue || 'Document Preview';
        this.setAttribute('aria-label', `PDF Viewer: ${this._title}`);
        this.render();
        break;
      case 'src':
        this._src = newValue;
        this.loadPdf();
        break;
      case 'initial-page':
        if (!this._pdfDocument) {
          this._currentPage = parseInt(newValue, 10) || 1;
        }
        break;
      case 'initial-zoom':
        if (!this._pdfDocument) {
          this._zoom = parseInt(newValue, 10) || 100;
        }
        break;
      case 'worker-src':
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = newValue;
        }
        break;
    }
  }

  private handleResize() {
    if (window.innerWidth >= 1024) {
      if (!this._sidebarOpen) {
        this._sidebarOpen = true;
        this.render();
      }
    } else {
      if (this._sidebarOpen) {
        this._sidebarOpen = false;
        this.render();
      }
    }
  }

  private handleFsChange() {
    const isFs = !!document.fullscreenElement;
    if (this._isFullscreen !== isFs) {
      this._isFullscreen = isFs;
      if (isFs) {
        this.setAttribute('fullscreen', '');
      } else {
        this.removeAttribute('fullscreen');
      }
      this.render();
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      this.nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      this.previousPage();
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      this.zoomIn();
    } else if (e.key === '-') {
      e.preventDefault();
      this.zoomOut();
    }
  }

  // API Methods
  public nextPage() {
    this.currentPage = this._currentPage + 1;
  }

  public previousPage() {
    this.currentPage = this._currentPage - 1;
  }

  public goToPage(page: number) {
    this.currentPage = page;
  }

  public zoomIn() {
    this.zoom = this._zoom + 25;
  }

  public zoomOut() {
    this.zoom = this._zoom - 25;
  }

  public setZoom(zoom: number) {
    this.zoom = zoom;
  }

  public rotate() {
    this.rotation = this._rotation + 90;
  }

  public fitWidth() {
    if (this._documentArea) {
      const containerWidth = this._documentArea.clientWidth - 48; // padding
      const standardPdfWidth = 595; // A4 approx
      const newZoom = Math.floor((containerWidth / standardPdfWidth) * 100);
      this.zoom = newZoom;
    }
  }

  public toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  public async print() {
    this.dispatchEvent(new CustomEvent('skyra-print'));
    const url = await this.getBlobUrl();
    if (url && typeof window !== 'undefined') {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        if (url !== this._src) setTimeout(() => URL.revokeObjectURL(url), 10000);
      };
    }
  }

  public async download() {
    this.dispatchEvent(new CustomEvent('skyra-download'));
    const url = await this.getBlobUrl();
    if (url && typeof window !== 'undefined') {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this._title.toLowerCase().replace(/\\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (url !== this._src) URL.revokeObjectURL(url);
    }
  }

  private async getBlobUrl() {
    if (typeof this._src === 'string') return this._src;
    if (this._src instanceof Blob) return URL.createObjectURL(this._src);
    if (this._src instanceof ArrayBuffer) return URL.createObjectURL(new Blob([this._src], { type: 'application/pdf' }));
    return null;
  }

  private cleanupPdf() {
    if (this._loadingTask) {
      this._loadingTask.destroy().catch(() => {});
      this._loadingTask = null;
    }
    if (this._pageRenderTask) {
      this._pageRenderTask.cancel();
      this._pageRenderTask = null;
    }
    if (this._pageProxy) {
      this._pageProxy.cleanup();
      this._pageProxy = null;
    }
    
    // Cleanup thumbnails
    this._thumbnailRenderTasks.forEach(task => task.cancel());
    this._thumbnailRenderTasks.clear();
    this._thumbnailProxies.forEach(proxy => proxy.cleanup());
    this._thumbnailProxies.clear();
    this._thumbnailObservers.forEach(obs => obs.disconnect());
    this._thumbnailObservers.clear();

    if (this._pdfDocument) {
      this._pdfDocument.destroy();
      this._pdfDocument = null;
    }
  }

  private async loadPdf() {
    this.cleanupPdf();
    
    if (!this._src) {
      this._loading = false;
      this._error = null;
      this.render();
      return;
    }

    this._loading = true;
    this._error = null;
    this.dispatchEvent(new CustomEvent('skyra-load-start'));
    this.render();

    try {
      let source;
      if (typeof this._src === 'string') {
        source = { url: this._src };
      } else if (this._src instanceof ArrayBuffer) {
        source = { data: this._src };
      } else if (this._src instanceof Blob) {
        source = { data: await this._src.arrayBuffer() };
      }

      if (source) {
        this._loadingTask = pdfjsLib.getDocument(source);
        const pdf = await this._loadingTask.promise;
        this._pdfDocument = pdf;
        this._totalPages = pdf.numPages;
        this._currentPage = Math.min(Math.max(1, this._currentPage), this._totalPages);
        this._loading = false;
        this.dispatchEvent(new CustomEvent('skyra-document-loaded', { detail: { totalPages: this._totalPages } }));
        this.render();
        this.renderPage();
        this.renderSidebarThumbnails();
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'RenderingCancelledException') {
        this._error = err.message || 'Failed to load document';
        this._loading = false;
        this.dispatchEvent(new CustomEvent('skyra-error', { detail: this._error }));
        this.render();
      }
    }
  }

  private async renderPage() {
    if (!this._pdfDocument || !this._canvas || !this._pageContainer) return;

    const currentRenderId = ++this._renderId;

    if (this._pageRenderTask) {
      this._pageRenderTask.cancel();
      try {
        await this._pageRenderTask.promise;
      } catch (e) {
        // Ignore cancellation exception
      }
      this._pageRenderTask = null;
    }
    
    if (this._renderId !== currentRenderId) return;

    if (this._pageProxy) {
      this._pageProxy.cleanup();
      this._pageProxy = null;
    }

    try {
      this._pageProxy = await this._pdfDocument.getPage(this._currentPage);
      
      const viewport = this._pageProxy.getViewport({ scale: 1, rotation: this._rotation });
      const context = this._canvas.getContext('2d');
      if (!context) return;

      const outputScale = window.devicePixelRatio || 1;
      this._canvas.width = Math.floor(viewport.width * outputScale);
      this._canvas.height = Math.floor(viewport.height * outputScale);
      this._canvas.style.width = `${viewport.width}px`;
      this._canvas.style.height = `${viewport.height}px`;

      // Set container base dimensions
      this._pageContainer.style.width = `${viewport.width}px`;
      this._pageContainer.style.height = `${viewport.height}px`;
      this.updatePageTransform();

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : undefined;

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };

      this._pageRenderTask = this._pageProxy.render(renderContext);
      await this._pageRenderTask.promise;
      this.dispatchEvent(new CustomEvent('skyra-render-complete', { detail: { page: this._currentPage } }));
    } catch (err) {
      if (err instanceof Error && err.name !== 'RenderingCancelledException') {
        console.error('Error rendering page:', err);
      }
    }
  }

  private updatePageTransform() {
    if (this._pageContainer) {
      this._pageContainer.style.transform = `scale(${this._zoom / 100})`;
    }
    // Also update skeleton if present
    const skeleton = this._shadowRoot.querySelector('.skeleton-doc') as HTMLElement;
    if (skeleton) {
      skeleton.style.transform = `scale(${this._zoom / 100}) rotate(${this._rotation}deg)`;
    }
  }

  private renderSidebarThumbnails() {
    if (!this._sidebarContainer || !this._pdfDocument) return;
    
    this._sidebarContainer.innerHTML = '';
    
    for (let i = 1; i <= this._totalPages; i++) {
      const thumb = document.createElement('div');
      thumb.className = `thumbnail ${this._currentPage === i ? 'active' : ''}`;
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', `Page ${i}`);
      if (this._currentPage === i) thumb.setAttribute('aria-current', 'page');
      
      thumb.addEventListener('click', () => {
        this.currentPage = i;
        if (window.innerWidth < 768) {
          this._sidebarOpen = false;
          this.render();
        }
      });
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.currentPage = i;
        }
      });

      const container = document.createElement('div');
      container.className = 'thumbnail-canvas-container';
      
      const label = document.createElement('span');
      label.className = 'thumbnail-label';
      label.textContent = i.toString();

      thumb.appendChild(container);
      thumb.appendChild(label);
      this._sidebarContainer.appendChild(thumb);

      // Setup lazy loading via IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          this.renderThumbnail(i, container);
          observer.disconnect();
          this._thumbnailObservers.delete(i);
        }
      }, { rootMargin: '200px' });
      
      observer.observe(thumb);
      this._thumbnailObservers.set(i, observer);
    }
  }

  private updateSidebarActiveState() {
    if (!this._sidebarContainer) return;
    const thumbs = Array.from(this._sidebarContainer.querySelectorAll('.thumbnail'));
    thumbs.forEach((thumb, index) => {
      if (index + 1 === this._currentPage) {
        thumb.classList.add('active');
        thumb.setAttribute('aria-current', 'page');
      } else {
        thumb.classList.remove('active');
        thumb.removeAttribute('aria-current');
      }
    });
  }

  private async renderThumbnail(pageNumber: number, container: HTMLDivElement) {
    if (!this._pdfDocument) return;
    try {
      const pageProxy = await this._pdfDocument.getPage(pageNumber);
      this._thumbnailProxies.set(pageNumber, pageProxy);
      
      const width = 118;
      let viewport = pageProxy.getViewport({ scale: 1 });
      const scale = width / viewport.width;
      viewport = pageProxy.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      
      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : undefined;

      const renderTask = pageProxy.render({ canvasContext: context, transform, viewport });
      this._thumbnailRenderTasks.set(pageNumber, renderTask);
      await renderTask.promise;
      
      container.innerHTML = '';
      container.appendChild(canvas);
    } catch (err) {
      if (err instanceof Error && err.name !== 'RenderingCancelledException') {
        container.innerHTML = '<div style="color: var(--skyra-text-muted); font-size: 0.75rem;">Failed</div>';
      }
    }
  }

  private render() {
    const hasPdf = !!this._pdfDocument;
    
    let html = `<style>${styleContent}</style>`;

    // Toolbar
    html += `
      <div class="toolbar">
        <div class="toolbar-title-group">
          <button type="button" class="toolbar-btn" aria-label="Toggle sidebar" id="btn-sidebar" ${!hasPdf ? 'disabled' : ''}>
            ${ICONS.sidebar}
          </button>
          <span style="color: var(--skyra-primary);">${ICONS.fileText}</span>
          <span class="toolbar-title">${this._title}</span>
        </div>
        
        <div class="toolbar-group">
          <button type="button" class="toolbar-btn" aria-label="Zoom out" id="btn-zoom-out" ${!hasPdf ? 'disabled' : ''}>
            ${ICONS.zoomOut}
          </button>
          <button type="button" class="toolbar-btn" aria-label="Reset zoom" id="btn-zoom-reset" ${!hasPdf ? 'disabled' : ''} style="font-size: 0.78rem; font-weight: 600; min-width: 48px;">
            ${this._zoom}%
          </button>
          <button type="button" class="toolbar-btn" aria-label="Zoom in" id="btn-zoom-in" ${!hasPdf ? 'disabled' : ''}>
            ${ICONS.zoomIn}
          </button>
          <div class="divider"></div>
          <button type="button" class="toolbar-btn" aria-label="Rotate clockwise" id="btn-rotate" ${!hasPdf ? 'disabled' : ''}>
            ${ICONS.rotateCw}
          </button>
          <button type="button" class="toolbar-btn" aria-label="Fit width" id="btn-fit-width" ${!hasPdf ? 'disabled' : ''}>
            ${ICONS.maximize}
          </button>
        </div>
        
        <div class="toolbar-group">
          <button type="button" class="toolbar-btn" aria-label="Toggle fullscreen" id="btn-fullscreen">
            ${this._isFullscreen ? ICONS.minimize2 : ICONS.maximize2}
          </button>
          <button type="button" class="toolbar-btn" aria-label="Print document" id="btn-print" ${!hasPdf && !this._src ? 'disabled' : ''}>
            ${ICONS.printer}
          </button>
          <button type="button" class="toolbar-btn primary" aria-label="Download document" id="btn-download" ${!hasPdf && !this._src ? 'disabled' : ''}>
            ${ICONS.download}
          </button>
        </div>
      </div>
    `;

    // Main body
    html += `<div class="main-body">`;
    
    // Sidebar
    html += `<div class="sidebar" id="sidebar" style="display: ${this._sidebarOpen && hasPdf ? 'flex' : 'none'}"></div>`;
    
    // Document area
    html += `<div class="document-area" id="document-area">`;
    
    if (this._loading) {
      html += `
        <div class="message-container loading">
          ${ICONS.loader2}
          <span class="message-text">Loading document...</span>
        </div>
      `;
    } else if (this._error) {
      html += `
        <div class="message-container error">
          ${ICONS.alertCircle}
          <span class="message-text error">${this._error}</span>
        </div>
      `;
    } else if (!this._src) {
      html += `
        <div class="skeleton-doc" style="transform: scale(${this._zoom / 100}) rotate(${this._rotation}deg);">
          <div class="skeleton-header">
            <div>
              <h2 class="skeleton-title">${this._title}</h2>
              <p class="skeleton-subtitle">Document ID: DOC-${this._currentPage}9842</p>
            </div>
            <div class="skeleton-page-count">PAGE ${this._currentPage} OF ${this._totalPages}</div>
          </div>
          <div class="skeleton-body">
            <div class="skeleton-line" style="width: 80%"></div>
            <div class="skeleton-line" style="width: 95%"></div>
            <div class="skeleton-line" style="width: 70%"></div>
            <div class="skeleton-box"></div>
          </div>
          <div class="skeleton-footer">
            <span>Confidential — Skyra Platform Document</span>
            <span>Page ${this._currentPage}</span>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="pdf-page-container" id="page-container" style="transform: scale(${this._zoom / 100});">
          <canvas class="pdf-page-canvas" id="pdf-canvas"></canvas>
        </div>
      `;
    }
    html += `</div></div>`; // End document area, End main body

    // Bottom Bar
    html += `
      <div class="bottom-bar">
        <button type="button" class="toolbar-btn" aria-label="Previous page" id="btn-prev" ${this._currentPage <= 1 || this._loading ? 'disabled' : ''}>
          ${ICONS.chevronLeft}
        </button>
        <span class="page-info">
          Page <strong class="page-info-current">${this._currentPage}</strong> of ${this._totalPages}
        </span>
        <button type="button" class="toolbar-btn" aria-label="Next page" id="btn-next" ${this._currentPage >= this._totalPages || this._loading ? 'disabled' : ''}>
          ${ICONS.chevronRight}
        </button>
      </div>
    `;

    this._shadowRoot.innerHTML = html;

    // Attach refs
    this._documentArea = this._shadowRoot.getElementById('document-area') as HTMLDivElement;
    this._sidebarContainer = this._shadowRoot.getElementById('sidebar') as HTMLDivElement;
    
    if (hasPdf && !this._loading) {
      this._canvas = this._shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
      this._pageContainer = this._shadowRoot.getElementById('page-container') as HTMLDivElement;
      this.renderPage();
      this.renderSidebarThumbnails(); // This will re-render all thumbnails which is ok, but we could optimize. For now it matches React's re-render.
      this.updateSidebarActiveState();
    }

    // Attach events
    this._shadowRoot.getElementById('btn-sidebar')?.addEventListener('click', () => {
      this._sidebarOpen = !this._sidebarOpen;
      this.render();
    });
    this._shadowRoot.getElementById('btn-zoom-out')?.addEventListener('click', () => this.zoomOut());
    this._shadowRoot.getElementById('btn-zoom-in')?.addEventListener('click', () => this.zoomIn());
    this._shadowRoot.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.setZoom(100));
    this._shadowRoot.getElementById('btn-rotate')?.addEventListener('click', () => this.rotate());
    this._shadowRoot.getElementById('btn-fit-width')?.addEventListener('click', () => this.fitWidth());
    this._shadowRoot.getElementById('btn-fullscreen')?.addEventListener('click', () => this.toggleFullscreen());
    this._shadowRoot.getElementById('btn-print')?.addEventListener('click', () => this.print());
    this._shadowRoot.getElementById('btn-download')?.addEventListener('click', () => this.download());
    this._shadowRoot.getElementById('btn-prev')?.addEventListener('click', () => this.previousPage());
    this._shadowRoot.getElementById('btn-next')?.addEventListener('click', () => this.nextPage());
  }
}

if (typeof customElements !== 'undefined') {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-pdf-viewer')) {
    customElements.define('skyra-tech-pdf-viewer', SkyraPdfViewerElement);
  }
}
