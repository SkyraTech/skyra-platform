import { dataTableStyles } from './skyra-tech-data-table.css';
import { processTableData } from './processTableData';
import { BaseColumnDef, DataTableFeatures, 
  SortingState, 
  PaginationState, 
  VisibilityState, 
  RowSelectionState, 
  ColumnFiltersState,
  ColumnSizingState } from './types';

// Icons used in DataTable
const icons = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`,
  sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>`,
  chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"></path></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`,
  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>`,
  inbox: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`,
};

const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {} as typeof HTMLElement;
export class SkyraTechDataTable extends BaseClass {
  // Properties
  private _data: Record<string, unknown>[] = [];
  private _columns: BaseColumnDef<Record<string, unknown>, unknown>[] = [];
  private _features: DataTableFeatures = {};
  
  // State
  private _sorting: SortingState[] = [];
  private _pagination: PaginationState = { pageIndex: 0, pageSize: 10 };
  private _visibility: VisibilityState = {};
  private _selection: RowSelectionState = {};
  private _columnFilters: ColumnFiltersState = [];
  private _globalFilter: string = '';
  private _columnSizing: ColumnSizingState = {};
  
  // Other Settings
  private _isLoading = false;
  private _error = false;
  private _manualPagination = false;
  private _totalRows = 0;
  private _pageCount = 0;
  private _pageSizeOptions = [10, 20, 50, 100];
  private _isRowDisabled?: (row: Record<string, unknown>) => boolean;

  // Rendered Data
  private _processedData: Record<string, unknown>[] = [];
  private _pageRows: Record<string, unknown>[] = [];

  // DOM Elements
  private _root: ShadowRoot;
  private _tableContainer: HTMLElement;
  private _tbody: HTMLElement;
  private _thead: HTMLElement;
  private _toolbar: HTMLElement;
  private _footer: HTMLElement;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = dataTableStyles;
    this._root.appendChild(style);

    const container = document.createElement('div');
    container.className = 'skyra-data-table-container';
    
    this._toolbar = document.createElement('div');
    this._toolbar.className = 'skyra-data-table-toolbar';
    this._toolbar.style.display = 'none';

    this._tableContainer = document.createElement('div');
    this._tableContainer.className = 'skyra-data-table-wrapper';

    const table = document.createElement('table');
    table.className = 'skyra-data-table';
    this._thead = document.createElement('thead');
    this._tbody = document.createElement('tbody');
    table.appendChild(this._thead);
    table.appendChild(this._tbody);
    this._tableContainer.appendChild(table);

    this._footer = document.createElement('div');
    this._footer.className = 'skyra-data-table-footer';
    this._footer.style.display = 'none';

    container.appendChild(this._toolbar);
    container.appendChild(this._tableContainer);
    container.appendChild(this._footer);

    this._root.appendChild(container);
  }

  // --- Property Setters ---
  set data(val: Record<string, unknown>[]) { this._data = val || []; this.updateData(); }
  get data() { return this._data; }

  set columns(val: BaseColumnDef<Record<string, unknown>, unknown>[]) { this._columns = val || []; this.render(); }
  get columns() { return this._columns; }

  set features(val: DataTableFeatures) { this._features = val || {}; this.render(); }
  get features() { return this._features; }

  set sorting(val: SortingState[]) { this._sorting = val || []; this.updateData(); }
  get sorting() { return this._sorting; }

  set pagination(val: PaginationState) { this._pagination = val; this.updateData(); }
  get pagination() { return this._pagination; }

  set visibility(val: VisibilityState) { this._visibility = val || {}; this.render(); }
  get visibility() { return this._visibility; }

  set selection(val: RowSelectionState) { 
    this._selection = val || {}; 
    this.renderHead();
    this.renderBody(); 
    this.renderToolbar();
  }
  get selection() { return this._selection; }

  set columnFilters(val: ColumnFiltersState) { this._columnFilters = val || []; this.updateData(); }
  get columnFilters() { return this._columnFilters; }

  set globalFilter(val: string) { this._globalFilter = val || ''; this.updateData(); }
  get globalFilter() { return this._globalFilter; }

  set columnSizing(val: ColumnSizingState) { this._columnSizing = val || {}; this.renderHead(); this.renderBody(); }
  get columnSizing() { return this._columnSizing; }

  set isLoading(val: boolean) { this._isLoading = val; this.renderBody(); }
  get isLoading() { return this._isLoading; }

  set error(val: boolean) { this._error = val; this.renderBody(); }
  get error() { return this._error; }

  set manualPagination(val: boolean) { this._manualPagination = val; this.updateData(); }
  set totalRows(val: number) { this._totalRows = val; this.renderFooter(); }
  set pageCount(val: number) { this._pageCount = val; this.renderFooter(); }
  set pageSizeOptions(val: number[]) { this._pageSizeOptions = val || [10]; this.renderFooter(); }
  set isRowDisabled(val: ((row: Record<string, unknown>) => boolean) | undefined) { this._isRowDisabled = val; this.renderBody(); }

  getCurrentPageRows() {
    return this._pageRows || [];
  }

  // --- Internal Logic ---
  private updateData() {
    if (this._manualPagination) {
      this._processedData = this._data;
      this._pageRows = this._data;
    } else {
      this._processedData = processTableData(this._data, {
        columns: this._columns,
        globalFilter: this._features.globalSearch ? this._globalFilter : undefined,
        columnFilters: this._columnFilters,
        sorting: this._sorting,
      });

      if (this._features.pagination) {
        const start = this._pagination.pageIndex * this._pagination.pageSize;
        this._pageRows = this._processedData.slice(start, start + this._pagination.pageSize);
      } else {
        this._pageRows = this._processedData;
      }
    }
    
    // Notify consumer about visible rows
    this.dispatchEvent(new CustomEvent('skyra-page-data-change', {
      detail: { rows: this._pageRows, processedCount: this._processedData.length }
    }));

    this.renderBody();
    this.renderFooter();
  }

  private render() {
    this.renderToolbar();
    this.renderHead();
    this.updateData();
  }

  private get visibleCols() {
    return this._columns.filter(c => {
      const id = (c.id || c.accessor) as string;
      return !this._visibility[id];
    });
  }

  // --- Rendering ---
  private renderToolbar() {
    const hasSearch = !!this._features.globalSearch;
    const hasColVis = !!this._features.columnVisibility;
    const hasBulkActions = !!this._features.bulkActions;
    
    if (!hasSearch && !hasColVis && !hasBulkActions) {
      this._toolbar.style.display = 'none';
      return;
    }
    
    this._toolbar.style.display = 'flex';
    this._toolbar.innerHTML = '';

    const selectedCount = Object.keys(this._selection).length;
    if (selectedCount > 0 && this._features.bulkActions !== false) {
      const bulkDiv = document.createElement('div');
      bulkDiv.className = 'skyra-data-table-bulk';
      bulkDiv.innerHTML = `<span>${selectedCount} row${selectedCount === 1 ? '' : 's'} selected</span><slot name="bulk-actions"></slot>`;
      this._toolbar.appendChild(bulkDiv);
    } else if (hasSearch) {
        const searchDiv = document.createElement('div');
      searchDiv.className = 'skyra-data-table-search';
      searchDiv.innerHTML = `
        ${icons.search}
        <input type="text" placeholder="Search table..." aria-label="Search records" value="${this._globalFilter}" />
        ${this._globalFilter ? `<button aria-label="Clear search" class="skyra-clear-search">&times;</button>` : ''}
      `;
      const input = searchDiv.querySelector('input')!;
      const handleSearch = (e: Event) => {
        this._globalFilter = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new CustomEvent('skyra-global-filter-change', { detail: this._globalFilter }));
        if (this._features.pagination && !this._manualPagination) {
          this.pagination = { ...this._pagination, pageIndex: 0 };
          this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: this._pagination }));
        } else {
          this.updateData();
        }
      };
      input.addEventListener('input', handleSearch);
      input.addEventListener('change', handleSearch);
      
      const clearBtn = searchDiv.querySelector('.skyra-clear-search');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this._globalFilter = '';
          this.dispatchEvent(new CustomEvent('skyra-global-filter-change', { detail: '' }));
          if (this._features.pagination && !this._manualPagination) {
            this.pagination = { ...this._pagination, pageIndex: 0 };
            this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: this._pagination }));
          } else {
            this.updateData();
          }
          this.renderToolbar(); // re-render to remove the clear button
        });
      }
      this._toolbar.appendChild(searchDiv);
    } else {
      this._toolbar.appendChild(document.createElement('div'));
    }

    if (hasColVis) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'skyra-data-table-actions';
      
      const btn = document.createElement('button');
      btn.className = 'skyra-page-btn';
      btn.style.width = 'auto';
      btn.style.padding = '0 0.75rem';
      btn.setAttribute('aria-label', 'Toggle column visibility');
      btn.innerHTML = `${icons.sliders} <span style="margin-left:0.5rem">Columns</span>`;
      
      const dropdown = document.createElement('div');
      dropdown.className = 'col-vis-dropdown';
      
      this._columns.filter(c => c.hideable !== false).forEach(col => {
        const id = (col.id || col.accessor) as string;
        const label = document.createElement('label');
        label.className = 'col-vis-label';
        const isChecked = !this._visibility[id];
        label.innerHTML = `<input type="checkbox" aria-label="Toggle ${col.header || id} column" ${isChecked ? 'checked' : ''} /> ${col.header || id}`;
        
        label.querySelector('input')!.addEventListener('change', (e) => {
          const checked = (e.target as HTMLInputElement).checked;
          const newVis = { ...this._visibility };
          if (checked) {
            delete newVis[id];
          } else {
            newVis[id] = true;
          }
          this._visibility = newVis;
          this.dispatchEvent(new CustomEvent('skyra-visibility-change', { detail: newVis }));
          this.render();
        });
        dropdown.appendChild(label);
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!actionsDiv.contains(e.target as Node)) {
          dropdown.classList.remove('open');
        }
      });

      actionsDiv.appendChild(btn);
      actionsDiv.appendChild(dropdown);
      this._toolbar.appendChild(actionsDiv);
    }
  }

  private renderHead() {
    this._thead.innerHTML = '';
    const tr = document.createElement('tr');
    const cols = this.visibleCols;

    if (this._features.rowSelection) {
      const th = document.createElement('th');
      th.style.width = '48px';
      th.style.textAlign = 'center';
      
      const allSelected = this._pageRows.length > 0 && this._pageRows.every(r => this._selection[String(r.id)]);
      const someSelected = this._pageRows.some(r => this._selection[String(r.id)]);
      
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = allSelected;
      const isMixed = someSelected && !allSelected;
      cb.indeterminate = isMixed;
      cb.setAttribute('aria-checked', isMixed ? 'mixed' : (allSelected ? 'true' : 'false'));
      cb.setAttribute('aria-label', 'Select all rows');
      cb.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        const newSel = { ...this._selection };
        this._pageRows.forEach(r => {
          if (this._isRowDisabled && this._isRowDisabled(r)) return;
          if (checked) newSel[String(r.id)] = true;
          else delete newSel[String(r.id)];
        });
        this._selection = newSel;
        this.dispatchEvent(new CustomEvent('skyra-selection-change', { detail: newSel }));
        this.renderHead();
        this.renderBody();
        this.renderToolbar();
      });
      th.appendChild(cb);
      tr.appendChild(th);
    }

    cols.forEach(col => {
      const id = (col.id || col.accessor) as string;
      const th = document.createElement('th');
      const isSortable = this._features.sorting && col.sortable;
      const customWidth = this._columnSizing[id] || col.width;
      
      if (customWidth) th.style.width = typeof customWidth === 'number' ? `${customWidth}px` : customWidth;
      if (col.minWidth) th.style.minWidth = `${col.minWidth}px`;
      if (col.maxWidth) th.style.maxWidth = `${col.maxWidth}px`;
      if (col.align) th.style.textAlign = col.align;
      if (typeof col.header === 'string') th.setAttribute('aria-label', col.header);

      if (isSortable) {
        th.className = 'skyra-th-sortable';
        th.tabIndex = 0;
        th.addEventListener('click', () => this.handleSort(id));
        th.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSort(id);
          }
        });
      }

      let sortIcon = '';
      if (isSortable) {
        const sortState = this._sorting.find(s => s.id === id);
        if (sortState) {
          sortIcon = sortState.desc ? icons.chevronDown : icons.chevronUp;
          th.setAttribute('aria-sort', sortState.desc ? 'descending' : 'ascending');
        } else {
          th.setAttribute('aria-sort', 'none');
        }
      }

      th.innerHTML = `
        <div class="skyra-th-content" style="justify-content: ${col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'}">
          ${col.headerSlot ? `<slot name="${col.headerSlot}"></slot>` : col.header}
          ${sortIcon ? `<span style="color:var(--skyra-primary)">${sortIcon}</span>` : ''}
        </div>
      `;

      if (this._features.columnResizing && col.resizable !== false) {
        const resizer = document.createElement('div');
        resizer.className = 'skyra-resizer';
        resizer.setAttribute('role', 'separator');
        resizer.setAttribute('aria-orientation', 'vertical');
        resizer.setAttribute('aria-label', `Resize column ${col.header || id}`);
        resizer.tabIndex = 0;
        
        const currentSize = this._columnSizing[id] || (col.width as number) || 150;
        resizer.setAttribute('aria-valuenow', String(currentSize));
        resizer.setAttribute('aria-valuemin', '50');
        resizer.setAttribute('aria-valuemax', '1000');
        
        resizer.addEventListener('keydown', (e) => {
          let size = this._columnSizing[id] || (col.width as number) || 150;
          if (e.key === 'ArrowRight') size += 10;
          if (e.key === 'ArrowLeft') size -= 10;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const sizing = { ...this._columnSizing, [id]: size };
            this.dispatchEvent(new CustomEvent('skyra-column-sizing-change', { detail: sizing }));
          }
        });
        
        resizer.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          const size = this._columnSizing[id] || (col.width as number) || 150;
          this.dispatchEvent(new CustomEvent('skyra-column-sizing-change', { detail: { ...this._columnSizing, [id]: size } }));
        });
        
        th.appendChild(resizer);
      }

      tr.appendChild(th);
    });

    if (this._features.rowActions) {
      const th = document.createElement('th');
      th.style.width = '90px';
      th.setAttribute('role', 'columnheader');
      th.setAttribute('aria-label', 'Actions');
      th.innerHTML = '<span class="sr-only">Actions</span>';
      tr.appendChild(th);
    }

    this._thead.appendChild(tr);
  }

  private handleSort(id: string) {
    const existing = this._sorting.find(s => s.id === id);
    let newSort: SortingState[] = [];
    if (!existing) {
      newSort = [{ id, desc: false }];
    } else if (!existing.desc) {
      newSort = [{ id, desc: true }];
    } else {
      newSort = [];
    }
    
    this._sorting = newSort;
    this.dispatchEvent(new CustomEvent('skyra-sorting-change', { detail: newSort }));
    this.updateData();
    this.renderHead();
  }

  private renderBody() {
    this._tbody.innerHTML = '';
    const cols = this.visibleCols;

    if (this._isLoading) {
      for (let i=0; i<3; i++) {
        const tr = document.createElement('tr');
        if (this._features.rowSelection) tr.appendChild(document.createElement('td'));
        cols.forEach(() => {
          const td = document.createElement('td');
          td.innerHTML = `<div class="skyra-skeleton-bar"></div>`;
          tr.appendChild(td);
        });
        if (this._features.rowActions) tr.appendChild(document.createElement('td'));
        this._tbody.appendChild(tr);
      }
      return;
    }

    if (this._isLoading) {
      const rowsToRender = this._pagination.pageSize || 5;
      for (let i = 0; i < rowsToRender; i++) {
        const tr = document.createElement('tr');
        const numCols = this._columns.filter(c => this._visibility[c.id || String(c.accessor)] !== false).length + (this._features.rowSelection ? 1 : 0);
        for (let j = 0; j < numCols; j++) {
          const td = document.createElement('td');
          td.innerHTML = `<div class="skyra-skeleton-bar" style="height: 20px; background: #e0e0e0; border-radius: 4px; animation: pulse 1.5s infinite;"></div>`;
          tr.appendChild(td);
        }
        this._tbody.appendChild(tr);
      }
      return;
    }

    if (this._error || this._pageRows.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      let colSpan = cols.length;
      if (this._features.rowSelection) colSpan++;
      if (this._features.rowActions) colSpan++;
      td.colSpan = colSpan;
      td.innerHTML = `
        <div class="empty-state">
          ${icons.inbox}
          <div style="margin-top: 1rem; font-weight: 500;">
            <slot name="empty-state">No results found</slot>
          </div>
        </div>
      `;
      tr.appendChild(td);
      this._tbody.appendChild(tr);
      return;
    }

    this._pageRows.forEach(row => {
      const tr = document.createElement('tr');
      const isSelected = Boolean(this._selection[String(row.id)]);
      const disabled = Boolean(this._isRowDisabled?.(row));

      if (isSelected) tr.classList.add('selected');
      if (disabled) tr.style.opacity = '0.6';

      tr.addEventListener('click', (e) => {
        if (!disabled) {
          // Ignore clicks on inputs, buttons, or links, or clicks inside the actions/selection td
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' || 
            target.tagName === 'BUTTON' || 
            target.tagName === 'A' ||
            target.closest('.skyra-actions-cell') ||
            target.closest('.skyra-selection-cell')
          ) {
            return;
          }
          this.dispatchEvent(new CustomEvent('skyra-row-click', { detail: row }));
        }
      });

      if (this._features.rowSelection) {
        const td = document.createElement('td');
        td.className = 'skyra-selection-cell';
        td.style.textAlign = 'center';
        
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = isSelected;
        cb.disabled = disabled;
        cb.setAttribute('aria-label', `Select row ${String(row.id)}`);
        cb.addEventListener('change', (e) => {
          const checked = (e.target as HTMLInputElement).checked;
          const newSel = { ...this._selection };
          if (checked) newSel[String(row.id)] = true;
          else delete newSel[String(row.id)];
          
          this._selection = newSel;
          this.dispatchEvent(new CustomEvent('skyra-selection-change', { detail: newSel }));
          this.renderHead(); // Update header checkbox
          this.renderBody();
          this.renderToolbar();
        });
        td.appendChild(cb);
        tr.appendChild(td);
      }

      cols.forEach(col => {
        const id = (col.id || col.accessor) as string;
        const td = document.createElement('td');
        if (col.align) td.style.textAlign = col.align;
        
        if (col.cellSlot) {
          td.innerHTML = `<slot name="${col.cellSlot(row)}"></slot>`;
        } else {
          const val = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
          td.textContent = val !== undefined && val !== null ? String(val) : '-';
        }
        tr.appendChild(td);
      });

      if (this._features.rowActions) {
        const td = document.createElement('td');
        td.className = 'skyra-actions-cell';
        td.style.textAlign = 'right';
        td.innerHTML = `<slot name="row-actions-${String(row.id)}"></slot>`;
        tr.appendChild(td);
      }

      this._tbody.appendChild(tr);
    });
  }

  private renderFooter() {
    if (!this._features.pagination || this._isLoading) {
      this._footer.style.display = 'none';
      return;
    }

    const total = this._manualPagination ? (this._totalRows > 0 ? this._totalRows : (this._pageCount ? this._pageCount * this._pagination.pageSize : 0)) : this._processedData.length;
    if (total === 0 && !this._pageCount) {
      this._footer.style.display = 'none';
      return;
    }

    this._footer.style.display = 'flex';
    this._footer.innerHTML = '';

    const start = this._pagination.pageIndex * this._pagination.pageSize;
    const end = Math.min(start + this._pagination.pageSize, total);
    const totalPages = this._manualPagination && this._pageCount ? this._pageCount : Math.ceil(total / this._pagination.pageSize);

    const info = document.createElement('div');
    info.className = 'skyra-pagination-info';
    
    // Rows per page
    const sizeSelect = document.createElement('select');
    sizeSelect.setAttribute('aria-label', 'Rows per page');
    this._pageSizeOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = String(opt);
      option.textContent = String(opt);
      if (opt === this._pagination.pageSize) option.selected = true;
      sizeSelect.appendChild(option);
    });
    sizeSelect.addEventListener('change', (e) => {
      const size = Number((e.target as HTMLSelectElement).value);
      const newPag = { pageIndex: 0, pageSize: size };
      this.pagination = newPag;
      this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: newPag }));
    });
    
    info.innerHTML = `<span>Showing ${start + 1}–${end} of ${total}</span>`;
    const rowsWrap = document.createElement('div');
    rowsWrap.style.display = 'flex';
    rowsWrap.style.alignItems = 'center';
    rowsWrap.style.gap = '0.5rem';
    
    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Rows:';
    selectLabel.htmlFor = 'skyra-table-pagesize';
    sizeSelect.id = 'skyra-table-pagesize';
    
    rowsWrap.appendChild(selectLabel);
    rowsWrap.appendChild(sizeSelect);
    info.appendChild(rowsWrap);

    this._footer.appendChild(info);

    const nav = document.createElement('nav');
    nav.className = 'skyra-pagination-nav';
    nav.setAttribute('aria-label', 'Pagination Navigation');

    const prev = document.createElement('button');
    prev.className = 'skyra-page-btn';
    prev.disabled = this._pagination.pageIndex === 0;
    prev.innerHTML = icons.chevronLeft;
    prev.setAttribute('aria-label', 'Previous page');
    prev.addEventListener('click', () => {
      const newPag = { ...this._pagination, pageIndex: this._pagination.pageIndex - 1 };
      this.pagination = newPag;
      this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: newPag }));
    });
    nav.appendChild(prev);

    // Simple page numbers (simplified logic)
    const pagesToShow = new Set([
      0, 
      totalPages - 1, 
      this._pagination.pageIndex, 
      this._pagination.pageIndex - 1, 
      this._pagination.pageIndex + 1
    ]);

    Array.from(pagesToShow)
      .filter(p => p >= 0 && p < totalPages)
      .sort((a,b) => a - b)
      .forEach((p, idx, arr) => {
        if (idx > 0 && p - arr[idx-1]! > 1) {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          ellipsis.style.padding = '0 6px';
          nav.appendChild(ellipsis);
        }
        
        const btn = document.createElement('button');
        btn.className = `skyra-page-btn ${p === this._pagination.pageIndex ? 'active' : ''}`;
        btn.textContent = String(p + 1);
        btn.setAttribute('aria-label', `Page ${p + 1}`);
        if (p === this._pagination.pageIndex) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => {
          const newPag = { ...this._pagination, pageIndex: p };
          this.pagination = newPag;
          this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: newPag }));
        });
        nav.appendChild(btn);
      });

    const next = document.createElement('button');
    next.className = 'skyra-page-btn';
    next.disabled = this._pagination.pageIndex >= totalPages - 1;
    next.innerHTML = icons.chevronRight;
    next.setAttribute('aria-label', 'Next page');
    next.addEventListener('click', () => {
      const newPag = { ...this._pagination, pageIndex: this._pagination.pageIndex + 1 };
      this.pagination = newPag;
      this.dispatchEvent(new CustomEvent('skyra-pagination-change', { detail: newPag }));
    });
    nav.appendChild(next);

    this._footer.appendChild(nav);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-data-table')) {
  customElements.define('skyra-tech-data-table', SkyraTechDataTable);
}
