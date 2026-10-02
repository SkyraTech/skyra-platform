import '@skyra-tech-platform/notification';
import { NotificationType } from '@skyra-tech-platform/notification';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: (e: Event) => void;
  altText?: string;
}

export interface ToastOptions {
  id?: string;
  type?: NotificationType;
  title: string | HTMLElement;
  message?: string | HTMLElement;
  code?: string;
  duration?: number;
  persistent?: boolean;
  action?: ToastAction;
  icon?: string | HTMLElement;
  onClose?: () => void;
  className?: string;
  style?: string;
}

export interface ToastData extends ToastOptions {
  id: string;
  createdAt: number;
}

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} as typeof HTMLElement;

export class SkyraToastViewportElement extends BaseElement {
  private _toasts: ToastData[] = [];
  private _maxVisible = 5;
  private _position: ToastPosition = 'top-right';
  private _toastIdCounter = 0;

  static get observedAttributes() {
    return ['max-visible', 'position'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get maxVisible() { return this.hasAttribute('max-visible') ? parseInt(this.getAttribute('max-visible')!, 10) : 5; }
  set maxVisible(val: number) { this.setAttribute('max-visible', val.toString()); }

  get position() { return (this.getAttribute('position') || 'top-right') as ToastPosition; }
  set position(val: ToastPosition) { this.setAttribute('position', val); }

  connectedCallback() {
    this._maxVisible = this.maxVisible;
    this._position = this.position;
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', 'Notifications');
    this.setAttribute('aria-live', 'polite');
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'max-visible') this._maxVisible = parseInt(newValue, 10);
    if (name === 'position') this._position = newValue as ToastPosition;
    this.render();
  }

  addToast(options: ToastOptions): string {
    const id = options.id || `skyra-toast-${++this._toastIdCounter}-${Date.now()}`;
    const newToast: ToastData = {
      ...options,
      id,
      createdAt: Date.now(),
      duration: options.persistent ? 0 : (options.duration ?? 5000),
    };

    const existsIndex = this._toasts.findIndex(t => t.id === id);
    if (existsIndex >= 0) {
      this._toasts[existsIndex] = newToast;
    } else {
      this._toasts.push(newToast);
      if (this._toasts.length > this._maxVisible) {
        this._toasts = this._toasts.slice(this._toasts.length - this._maxVisible);
      }
    }

    this.render();
    return id;
  }

  updateToast(id: string, options: Partial<ToastOptions>) {
    const existsIndex = this._toasts.findIndex(t => t.id === id);
    if (existsIndex >= 0) {
      this._toasts[existsIndex] = { ...this._toasts[existsIndex], ...options } as ToastData;
      this.render();
    }
  }

  dismissToast(id: string) {
    const existsIndex = this._toasts.findIndex(t => t.id === id);
    if (existsIndex >= 0) {
      const toast = this._toasts[existsIndex];
      if (toast) toast.onClose?.();
      this._toasts.splice(existsIndex, 1);
      this.render();
    }
  }

  dismissAll() {
    this._toasts.forEach(t => t.onClose?.());
    this._toasts = [];
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          max-width: 100%;
        }

        :host([position^="top"]) {
          top: 0;
        }
        :host([position^="bottom"]) {
          bottom: 0;
        }

        :host([position$="left"]) {
          left: 0;
          align-items: flex-start;
        }
        :host([position$="center"]) {
          left: 50%;
          transform: translateX(-50%);
          align-items: center;
        }
        :host([position$="right"]) {
          right: 0;
          align-items: flex-end;
        }

        .skyra-toast-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 400px;
        }
        
        /* New toasts enter from their respective edges */
        :host([position^="top"]) .skyra-toast-stack {
          flex-direction: column;
        }
        :host([position^="bottom"]) .skyra-toast-stack {
          flex-direction: column-reverse;
        }

        .skyra-toast-item {
          pointer-events: auto;
          width: 100%;
        }

        .skyra-toast-action-wrapper {
          margin-top: 0.5rem;
        }

        .skyra-toast-action-btn {
          font-family: var(--skyra-font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--skyra-primary);
          background: transparent;
          border: 1px solid var(--skyra-primary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--skyra-radius-sm);
          cursor: pointer;
          transition: background 0.2s;
        }

        .skyra-toast-action-btn:hover {
          background: var(--skyra-primary-light, rgba(0, 0, 0, 0.05));
        }
      </style>
      
      <div class="skyra-toast-stack"></div>
    `;

    const stack = this.shadowRoot.querySelector('.skyra-toast-stack');
    if (!stack) return;

    this._toasts.forEach(toast => {
      const itemWrap = document.createElement('div');
      itemWrap.className = 'skyra-toast-item';
      
      const notificationBar = document.createElement('skyra-notification-bar');
      notificationBar.setAttribute('type', toast.type || 'info');
      if (toast.code) notificationBar.setAttribute('code', toast.code);
      notificationBar.setAttribute('duration', toast.duration?.toString() || '0');
      if (toast.className) notificationBar.className = toast.className;
      if (toast.style) notificationBar.setAttribute('style', toast.style);

      // Title
      if (typeof toast.title === 'string') {
        const titleSpan = document.createElement('span');
        titleSpan.slot = 'title';
        titleSpan.textContent = toast.title;
        notificationBar.appendChild(titleSpan);
      } else if (toast.title instanceof HTMLElement) {
        toast.title.slot = 'title';
        notificationBar.appendChild(toast.title);
      }

      // Message
      const messageWrap = document.createElement('div');
      
      if (toast.message) {
        if (typeof toast.message === 'string') {
          const msgSpan = document.createElement('div');
          msgSpan.textContent = toast.message;
          messageWrap.appendChild(msgSpan);
        } else if (toast.message instanceof HTMLElement) {
          messageWrap.appendChild(toast.message);
        }
      }

      // Action
      if (toast.action) {
        const actionWrap = document.createElement('div');
        actionWrap.className = 'skyra-toast-action-wrapper';
        const actionBtn = document.createElement('button');
        actionBtn.className = 'skyra-toast-action-btn';
        actionBtn.textContent = toast.action.label;
        if (toast.action.altText) actionBtn.setAttribute('aria-label', toast.action.altText);
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toast.action!.onClick(e);
        });
        actionWrap.appendChild(actionBtn);
        messageWrap.appendChild(actionWrap);
      }

      if (messageWrap.childNodes.length > 0) {
        notificationBar.appendChild(messageWrap);
      }

      // Icon
      if (toast.icon) {
        if (typeof toast.icon === 'string') {
          const iconSpan = document.createElement('span');
          iconSpan.slot = 'icon';
          iconSpan.innerHTML = toast.icon;
          notificationBar.appendChild(iconSpan);
        } else if (toast.icon instanceof HTMLElement) {
          toast.icon.slot = 'icon';
          notificationBar.appendChild(toast.icon);
        }
      }

      // Close handler
      notificationBar.addEventListener('skyra-close', () => {
        this.dismissToast(toast.id);
      });

      itemWrap.appendChild(notificationBar);
      stack.appendChild(itemWrap);
    });
  }
}

if (typeof window !== 'undefined' && !customElements.get('skyra-toast-viewport')) {
  customElements.define('skyra-toast-viewport', SkyraToastViewportElement);
}

// Global imperative API (Vanilla JS)
let globalViewport: SkyraToastViewportElement | null = null;

function getGlobalViewport(): SkyraToastViewportElement {
  if (globalViewport && document.body.contains(globalViewport)) {
    return globalViewport;
  }
  const existing = document.querySelector('skyra-toast-viewport') as SkyraToastViewportElement;
  if (existing) {
    globalViewport = existing;
    return existing;
  }
  globalViewport = document.createElement('skyra-toast-viewport') as SkyraToastViewportElement;
  document.body.appendChild(globalViewport);
  return globalViewport;
}

export const toast = (options: ToastOptions): string => {
  if (typeof window === 'undefined') return '';
  const viewport = getGlobalViewport();
  return viewport.addToast(options);
};

toast.dismiss = (id: string) => {
  if (typeof window === 'undefined') return;
  getGlobalViewport().dismissToast(id);
};

toast.dismissAll = () => {
  if (typeof window === 'undefined') return;
  getGlobalViewport().dismissAll();
};

toast.update = (id: string, options: Partial<ToastOptions>) => {
  if (typeof window === 'undefined') return;
  getGlobalViewport().updateToast(id, options);
};
