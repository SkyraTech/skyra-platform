import { toISODateString, parseDate, MONTH_NAMES, DAY_NAMES, icons } from './utils';
import { calendarCss } from './calendar.css';

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechCalendar extends BaseClass {
  static get observedAttributes() {
    return ['mode', 'value', 'range-start', 'range-end', 'min', 'max', 'disable-weekends', 'show-today'];
  }

  private _shadowRoot: ShadowRoot;
  private _viewDate: Date;
  private _hoverDate: string | null = null;
  private _disabledDateFn?: (date: Date) => boolean;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._viewDate = new Date();
  }

  connectedCallback() {
    this._render();
    this._setupListeners();
    // Initialize view date
    const initial = parseDate(this.value) || parseDate(this.rangeStart) || new Date();
    this._viewDate = initial;
    this._updateUI();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal && this.isConnected) {
      if (name === 'value' || name === 'range-start') {
        const d = parseDate(newVal);
        if (d && (d.getMonth() !== this._viewDate.getMonth() || d.getFullYear() !== this._viewDate.getFullYear())) {
          this._viewDate = d;
        }
      }
      this._updateUI();
    }
  }

  // Properties
  get mode() { return this.getAttribute('mode') || 'single'; }
  set mode(v) { if (v) this.setAttribute('mode', v); else this.removeAttribute('mode'); }
  
  get value() { return this.getAttribute('value'); }
  set value(v) { if (v) this.setAttribute('value', v); else this.removeAttribute('value'); }
  
  get rangeStart() { return this.getAttribute('range-start'); }
  set rangeStart(v) { if (v) this.setAttribute('range-start', v); else this.removeAttribute('range-start'); }
  
  get rangeEnd() { return this.getAttribute('range-end'); }
  set rangeEnd(v) { if (v) this.setAttribute('range-end', v); else this.removeAttribute('range-end'); }
  
  get min() { return this.getAttribute('min'); }
  set min(v) { if (v) this.setAttribute('min', v); else this.removeAttribute('min'); }
  
  get max() { return this.getAttribute('max'); }
  set max(v) { if (v) this.setAttribute('max', v); else this.removeAttribute('max'); }
  
  get disableWeekends() { return this.hasAttribute('disable-weekends'); }
  set disableWeekends(v) { if (v) this.setAttribute('disable-weekends', ''); else this.removeAttribute('disable-weekends'); }
  
  get showToday() { return this.getAttribute('show-today') !== 'false'; }
  set showToday(v: boolean) { if (!v) this.setAttribute('show-today', 'false'); else this.removeAttribute('show-today'); }

  set disabledDate(fn: (date: Date) => boolean) {
    this._disabledDateFn = fn;
    this._updateUI();
  }

  private _isDateDisabled(date: Date): boolean {
    const iso = toISODateString(date);
    const minParsed = parseDate(this.min);
    const maxParsed = parseDate(this.max);
    if (minParsed && iso < toISODateString(minParsed)) return true;
    if (maxParsed && iso > toISODateString(maxParsed)) return true;
    if (this.disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
    if (this._disabledDateFn && this._disabledDateFn(date)) return true;
    return false;
  }

  private _handleDateClick(date: Date) {
    if (this._isDateDisabled(date)) return;
    const iso = toISODateString(date);

    if (this.mode === 'single') {
      this.value = iso;
      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: iso }, bubbles: true, composed: true }));
    } else if (this.mode === 'range') {
      if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
        this.rangeStart = iso;
        this.rangeEnd = null;
      } else {
        if (iso < this.rangeStart) {
          const oldStart = this.rangeStart;
          this.rangeStart = iso;
          this.rangeEnd = oldStart;
          this.dispatchEvent(new CustomEvent('skyra-range-change', { detail: { value: [iso, oldStart] }, bubbles: true, composed: true }));
        } else {
          this.rangeEnd = iso;
          this.dispatchEvent(new CustomEvent('skyra-range-change', { detail: { value: [this.rangeStart, iso] }, bubbles: true, composed: true }));
        }
      }
      this._updateUI();
    } else if (this.mode === 'week') {
      const d = new Date(date);
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.getFullYear(), d.getMonth(), diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const startIso = toISODateString(monday);
      const endIso = toISODateString(sunday);
      this.rangeStart = startIso;
      this.rangeEnd = endIso;
      this.dispatchEvent(new CustomEvent('skyra-range-change', { detail: { value: [startIso, endIso] }, bubbles: true, composed: true }));
      this._updateUI();
    }
  }

  private _render() {
    this._shadowRoot.innerHTML = `
      <style>${calendarCss}</style>
      <div class="calendar-container" part="container">
        <div class="header" part="header">
          <button type="button" class="nav-btn prev-btn" aria-label="Previous month">${icons.chevronLeft}</button>
          <span class="title month-title"></span>
          <button type="button" class="nav-btn next-btn" aria-label="Next month">${icons.chevronRight}</button>
        </div>
        <div class="weekdays" part="weekdays">
          ${DAY_NAMES.map(n => `<div class="weekday">${n}</div>`).join('')}
        </div>
        <div class="days-grid" part="days-grid"></div>
        <div class="footer" part="footer" style="display:none">
          <button type="button" class="today-btn">Today</button>
          <span class="footer-date"></span>
        </div>
      </div>
    `;
  }

  private _setupListeners() {
    const prevBtn = this._shadowRoot.querySelector('.prev-btn') as HTMLButtonElement;
    const nextBtn = this._shadowRoot.querySelector('.next-btn') as HTMLButtonElement;
    const todayBtn = this._shadowRoot.querySelector('.today-btn') as HTMLButtonElement;
    const daysGrid = this._shadowRoot.querySelector('.days-grid') as HTMLDivElement;

    prevBtn.addEventListener('click', () => {
      this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() - 1, 1);
      this._updateUI();
    });

    nextBtn.addEventListener('click', () => {
      this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
      this._updateUI();
    });

    todayBtn.addEventListener('click', () => {
      const today = new Date();
      this._viewDate = today;
      if (!this._isDateDisabled(today)) {
        this._handleDateClick(today);
      } else {
        this._updateUI();
      }
    });

    daysGrid.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('.day-btn:not(:disabled)')) {
        this._hoverDate = target.getAttribute('data-date');
        this._updateUI();
      }
    });
    
    daysGrid.addEventListener('mouseout', (e) => {
      this._hoverDate = null;
      this._updateUI();
    });

    daysGrid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('.day-btn:not(:disabled)')) {
        const d = target.getAttribute('data-date');
        if (d) {
          const parsed = parseDate(d);
          if (parsed) this._handleDateClick(parsed);
        }
      }
    });

    daysGrid.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('.day-btn')) {
        const dStr = target.getAttribute('data-date');
        if (!dStr) return;
        const d = parseDate(dStr);
        if (!d) return;

        let nextD = new Date(d);
        if (e.key === 'ArrowRight') nextD.setDate(d.getDate() + 1);
        else if (e.key === 'ArrowLeft') nextD.setDate(d.getDate() - 1);
        else if (e.key === 'ArrowDown') nextD.setDate(d.getDate() + 7);
        else if (e.key === 'ArrowUp') nextD.setDate(d.getDate() - 7);
        else if (e.key === 'Home') nextD.setDate(1);
        else if (e.key === 'End') nextD.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
        else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._handleDateClick(d);
          return;
        } else return;
        
        e.preventDefault();
        
        // If navigating outside current month
        if (nextD.getMonth() !== this._viewDate.getMonth() || nextD.getFullYear() !== this._viewDate.getFullYear()) {
          this._viewDate = nextD;
          this._updateUI();
        }
        
        // Focus the new date
        requestAnimationFrame(() => {
          const btn = this._shadowRoot.querySelector(`[data-date="${toISODateString(nextD)}"]`) as HTMLButtonElement;
          if (btn) btn.focus();
        });
      }
    });
  }

  private _updateUI() {
    if (!this._shadowRoot.querySelector('.calendar-container')) return;

    const titleEl = this._shadowRoot.querySelector('.month-title') as HTMLSpanElement;
    const daysGrid = this._shadowRoot.querySelector('.days-grid') as HTMLDivElement;
    const footer = this._shadowRoot.querySelector('.footer') as HTMLDivElement;
    const footerDate = this._shadowRoot.querySelector('.footer-date') as HTMLSpanElement;

    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    titleEl.textContent = `${MONTH_NAMES[month]} ${year}`;

    if (this.showToday) {
      footer.style.display = 'flex';
      const today = new Date();
      footerDate.textContent = `${MONTH_NAMES[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    } else {
      footer.style.display = 'none';
    }

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    
    const todayIso = toISODateString(new Date());
    const selectedIso = this.value ? toISODateString(parseDate(this.value) || new Date()) : null;

    let html = '';
    for (let i = 0; i < totalCells; i++) {
      let d: Date;
      let isCurrentMonth = true;

      if (i < firstDayIndex) {
        d = new Date(year, month - 1, daysInPrevMonth - firstDayIndex + i + 1);
        isCurrentMonth = false;
      } else if (i < firstDayIndex + daysInMonth) {
        d = new Date(year, month, i - firstDayIndex + 1);
      } else {
        d = new Date(year, month + 1, i - (firstDayIndex + daysInMonth) + 1);
        isCurrentMonth = false;
      }

      const iso = toISODateString(d);
      const isDisabled = this._isDateDisabled(d);
      const isToday = iso === todayIso;
      const isSelected = this.mode === 'single' ? iso === selectedIso : (iso === this.rangeStart || iso === this.rangeEnd);
      
      let inRange = false;
      if ((this.mode === 'range' || this.mode === 'week') && this.rangeStart) {
        if (this.rangeEnd && iso > this.rangeStart && iso < this.rangeEnd) inRange = true;
        if (!this.rangeEnd && this._hoverDate) {
          if (iso > this.rangeStart && iso <= this._hoverDate) inRange = true;
          if (iso < this.rangeStart && iso >= this._hoverDate) inRange = true;
        }
      }

      const classes = ['day-btn'];
      if (!isCurrentMonth) classes.push('not-current-month');
      if (isToday) classes.push('today');
      if (isSelected) classes.push('selected');
      if (inRange) classes.push('in-range');

      html += `<button 
        type="button" 
        class="${classes.join(' ')}" 
        data-date="${iso}"
        tabindex="${isCurrentMonth && !isDisabled ? '0' : '-1'}"
        aria-label="${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}${isToday ? ' (Today)' : ''}"
        ${isDisabled ? 'disabled' : ''}
      >${d.getDate()}</button>`;
    }

    daysGrid.innerHTML = html;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-calendar')) {
  customElements.define('skyra-tech-calendar', SkyraTechCalendar);
}