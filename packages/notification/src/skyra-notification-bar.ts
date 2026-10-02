const ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>`,
  neutral: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>`,
};

const TYPE_CONFIG = {
  success: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-success)',
    barColor: 'var(--skyra-success)',
    iconColor: 'var(--skyra-success)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'var(--skyra-success)',
  },
  error: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-danger)',
    barColor: 'var(--skyra-danger)',
    iconColor: 'var(--skyra-danger)',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeColor: 'var(--skyra-danger)',
  },
  warning: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-warning)',
    barColor: 'var(--skyra-warning)',
    iconColor: 'var(--skyra-warning)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'var(--skyra-warning)',
  },
  info: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-info, var(--skyra-primary))',
    barColor: 'var(--skyra-info, var(--skyra-primary))',
    iconColor: 'var(--skyra-info, var(--skyra-primary))',
    badgeBg: 'rgba(10, 88, 202, 0.12)',
    badgeColor: 'var(--skyra-primary)',
  },
  neutral: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-border)',
    barColor: 'var(--skyra-text-muted)',
    iconColor: 'var(--skyra-text-muted)',
    badgeBg: 'var(--skyra-bg)',
    badgeColor: 'var(--skyra-text-muted)',
  },
};

export class SkyraNotificationBarElement extends HTMLElement {
  private _isDismissed = false;
  private _isPaused = false;
  private _remainingTime = 5000;
  private _duration = 5000;
  private _intervalId: number | null = null;
  private _fired = false;
  private _rafId: number | null = null;
  private _lastTick: number = 0;

  static get observedAttributes() {
    return ['type', 'code', 'duration'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  get type() { return (this.getAttribute('type') || 'info') as keyof typeof TYPE_CONFIG; }
  set type(val: string) { this.setAttribute('type', val); }

  get code() { return this.getAttribute('code') || ''; }
  set code(val: string) { if (val) this.setAttribute('code', val); else this.removeAttribute('code'); }

  get duration() { return this.hasAttribute('duration') ? parseInt(this.getAttribute('duration')!, 10) : 5000; }
  set duration(val: number) { this.setAttribute('duration', val.toString()); }

  connectedCallback() {
    this.setAttribute('role', 'alert');
    this.tabIndex = 0;
    
    this._duration = this.duration;
    this._remainingTime = this._duration;

    this.addEventListener('mouseenter', this._handleMouseEnter);
    this.addEventListener('mouseleave', this._handleMouseLeave);
    this.addEventListener('focus', this._handleMouseEnter);
    this.addEventListener('blur', this._handleMouseLeave);
    
    this.render();
    this._startTimer();
  }

  disconnectedCallback() {
    this._stopTimer();
    this.removeEventListener('mouseenter', this._handleMouseEnter);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    this.removeEventListener('focus', this._handleMouseEnter);
    this.removeEventListener('blur', this._handleMouseLeave);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'duration') {
      const newDur = parseInt(newValue, 10);
      this._duration = newDur;
      this._remainingTime = newDur;
      this._startTimer();
    } else {
      this.render();
    }
  }

  private _handleMouseEnter() {
    this._isPaused = true;
  }

  private _handleMouseLeave() {
    this._isPaused = false;
  }

  private _handleCloseClick() {
    this._dismiss();
  }

  private _startTimer() {
    this._stopTimer();
    if (this._duration <= 0 || this._isDismissed) return;

    this._rafId = window.setInterval(() => {
      if (this._isDismissed) return;

      if (!this._isPaused) {
        this._remainingTime -= 50;
        this._updateProgress();

        if (this._remainingTime <= 0) {
          this._dismiss();
        }
      }
    }, 50);
  }

  private _stopTimer() {
    if (this._rafId !== null) {
      window.clearInterval(this._rafId);
      this._rafId = null;
    }
  }

  private _updateProgress() {
    if (!this.shadowRoot) return;
    const progressEl = this.shadowRoot.querySelector('.skyra-notification-progress') as HTMLElement;
    if (progressEl) {
      const percent = this._duration > 0 ? Math.max(0, (this._remainingTime / this._duration) * 100) : 0;
      progressEl.style.width = `${percent}%`;
    }
  }

  private _dismiss() {
    if (this._fired) return;
    this._fired = true;
    this._isDismissed = true;
    this._stopTimer();
    this.style.display = 'none';
    this.dispatchEvent(new CustomEvent('skyra-close', { bubbles: true, composed: true }));
  }

  render() {
    if (!this.shadowRoot || this._isDismissed) return;

    const config = TYPE_CONFIG[this.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG['neutral'];
    const iconSvg = ICONS[this.type as keyof typeof ICONS] || ICONS.neutral;

    const codeHtml = this.code ? `<span class="badge" style="background: ${config.badgeBg}; color: ${config.badgeColor}">${this.code}</span>` : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          background: ${config.bg};
          border: 1px solid var(--skyra-border);
          border-left: 4px solid ${config.border};
          border-radius: var(--skyra-radius-md);
          box-shadow: var(--skyra-shadow-md);
          overflow: hidden;
          font-family: var(--skyra-font-body);
          outline: none;
          box-sizing: border-box;
        }

        .skyra-notification-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          background: ${config.barColor};
          width: ${this._duration > 0 ? (this._remainingTime / this._duration) * 100 : 0}%;
        }

        .container {
          padding: 0.85rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .icon-wrapper {
          color: ${config.iconColor};
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .title {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--skyra-text);
        }

        .badge {
          font-size: 0.72rem;
          font-weight: 700;
          font-family: var(--skyra-font-mono, monospace);
          padding: 1px 6px;
          border-radius: var(--skyra-radius-xs, 3px);
        }

        .message {
          font-size: 0.82rem;
          color: var(--skyra-text-muted);
          line-height: 1.4;
        }
        
        .message ::slotted(*) {
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          color: var(--skyra-text-subtle);
          display: flex;
          align-items: center;
          border-radius: var(--skyra-radius-sm);
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .close-btn:hover {
          color: var(--skyra-text);
        }
      </style>
      
      ${this._duration > 0 ? `<div class="skyra-notification-progress"></div>` : ''}

      <div class="container">
        <div class="icon-wrapper">
          <slot name="icon">${iconSvg}</slot>
        </div>

        <div class="content">
          <div class="header">
            <span class="title"><slot name="title"></slot></span>
            ${codeHtml}
          </div>
          <div class="message"><slot></slot></div>
        </div>

        <button class="close-btn" type="button" aria-label="Close notification">
          ${ICONS.close}
        </button>
      </div>
    `;

    this.shadowRoot.querySelector('.close-btn')?.addEventListener('click', this._handleCloseClick);
  }
}

if (typeof window !== 'undefined' && !customElements.get('skyra-notification-bar')) {
  customElements.define('skyra-notification-bar', SkyraNotificationBarElement);
}
