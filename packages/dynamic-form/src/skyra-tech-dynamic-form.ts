import { css } from './skyra-tech-dynamic-form.css';
import { FieldDef, FieldsetDef, DynamicFormFeatures, FormValues, FormErrors, FormTouched, FormDraftState } from './types';
import { getIn, setIn, cloneDeep, isDeepEqual } from './utils/nested';
import { evaluateCondition } from './utils/conditions';

// Import required internal Web Components to ensure registration
import '@skyra-tech-platform/input';
import '@skyra-tech-platform/textarea';
import '@skyra-tech-platform/dynamic-select';
import '@skyra-tech-platform/checkbox';
import '@skyra-tech-platform/radio';
import '@skyra-tech-platform/switch';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/date-time';

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} as typeof HTMLElement;

const DEFAULT_FEATURES: DynamicFormFeatures = {
  validation: true,
  conditionalFields: true,
  dependencies: true,
  repeatableGroups: true,
  nestedFields: true,
  dirtyTracking: true,
  draftState: true,
  submissionState: true,
  validationSummary: true,
  serverErrors: true,
  unsavedChanges: true,
};

export class SkyraTechDynamicForm extends BaseElement {
  static formAssociated = true;

  // Public Properties
  private _fields: FieldDef[] = [];
  private _fieldsets: FieldsetDef[] = [];
  private _initialValues: FormValues = {};
  private _features: DynamicFormFeatures = DEFAULT_FEATURES;
  private _validationMode: 'onChange' | 'onBlur' | 'onSubmit' = 'onSubmit';
  private _serverErrors: FormErrors = {};
  private _submitLabel?: string;

  // Form State
  private _values: FormValues = {};
  private _baselineValues: FormValues = {};
  private _initialized = false;
  private _dataInitialized = false;
  private _errors: FormErrors = {};
  private _touched: FormTouched = {};
  private _clearedServerErrors: Record<string, boolean> = {};
  private _isSubmitting = false;
  private _isSubmitted = false;
  private _submitError: string | null = null;
  // Custom Validation Logic
  public customValidator?: (values: FormValues) => FormErrors | Promise<FormErrors>;
  public onSubmitCallback?: (values: FormValues) => void | Promise<void>;

  // DOM References
  private _internals!: ElementInternals;
  private _formEl!: HTMLFormElement;
  private _summaryEl!: HTMLDivElement;
  private _formErrorEl!: HTMLDivElement;
  private _fieldsetsContainer!: HTMLDivElement;
  private _actionsContainer!: HTMLDivElement;
  
  // Field node map
  private _fieldWrappers = new Map<string, HTMLElement>();
  private _fieldInputs = new Map<string, HTMLElement>();
  private _repeatableContainers = new Map<string, HTMLElement>();
  
  constructor() {
    super();
  }

  connectedCallback() {
    if (this._initialized) return;
    
    if (typeof HTMLElement !== 'undefined') {
      this.attachShadow({ mode: 'open' });
      if ('attachInternals' in this) {
        this._internals = this.attachInternals();
      }
    }
    
    this._initialized = true;

    this.shadowRoot!.innerHTML = `
      <style>${css}</style>
      <form id="dynamic-form" class="skyra-dynamic-form" novalidate>
        <div id="validation-summary" class="skyra-validation-summary" role="alert" style="display: none;"></div>
        <div id="form-error" class="skyra-form-alert" role="alert" style="display: none;"></div>
        <div id="fieldsets-container"></div>
        <div id="actions-container" class="skyra-form-actions">
           <slot name="actions"></slot>
        </div>
      </form>
    `;
    
    this._formEl = this.shadowRoot!.querySelector('#dynamic-form') as HTMLFormElement;
    this._summaryEl = this.shadowRoot!.querySelector('#validation-summary') as HTMLDivElement;
    this._formErrorEl = this.shadowRoot!.querySelector('#form-error') as HTMLDivElement;
    this._fieldsetsContainer = this.shadowRoot!.querySelector('#fieldsets-container') as HTMLDivElement;
    this._actionsContainer = this.shadowRoot!.querySelector('#actions-container') as HTMLDivElement;

    this._formEl.addEventListener('submit', this._handleSubmit);
    this._buildDom();
  }
  
  // Getters/Setters
  get fields() { return this._fields; }
  set fields(val: FieldDef[]) {
    this._fields = val || [];
    this._buildDom();
  }

  get fieldsets() { return this._fieldsets; }
  set fieldsets(val: FieldsetDef[]) {
    this._fieldsets = val || [];
    this._buildDom();
  }

  get initialValues() { return this._initialValues; }
  set initialValues(val: FormValues) {
    this._initialValues = val || {};
    this.reset();
  }
  
  get values() { return cloneDeep(this._values); }
  set values(val: FormValues) {
    this._values = cloneDeep(val);
    this._syncValuesToDom();
    this._updateVisibility();
  }

  get features() { return this._features; }
  set features(val: DynamicFormFeatures) {
    this._features = { ...DEFAULT_FEATURES, ...val };
  }

  get validationMode() { return this._validationMode; }
  set validationMode(val: 'onChange' | 'onBlur' | 'onSubmit') {
    this._validationMode = val;
  }
  
  get submitLabel() { return this._submitLabel; }
  set submitLabel(val: string | undefined) {
    this._submitLabel = val;
    this._buildDom();
  }

  get serverErrors() { return this._serverErrors; }
  set serverErrors(val: FormErrors) {
    this._serverErrors = val || {};
    this._clearedServerErrors = {};
    this._updateErrorsDisplay();
  }
  
  get isDirty() {
    if (!this._features.dirtyTracking) return false;
    return !isDeepEqual(this._values, this._baselineValues);
  }
  
  get errors() { return cloneDeep(this._errors); }
  get isSubmitting() { return this._isSubmitting; }
  get isSubmitted() { return this._isSubmitted; }

  // Expose API
  public getValue(name: string) { return cloneDeep(getIn(this._values, name)); }
  public getValues() { return this.values; }
  public setValue(name: string, value: unknown) { 
    this._handleFieldValueChange(name, value); 
    this._syncValuesToDom();
  }
  public setValues(newVals: Partial<FormValues>) {
    this._values = { ...this._values, ...newVals };
    this._syncValuesToDom();
    for (const [path, wrapper] of this._repeatableContainers.entries()) {
      const field = this._findFieldDef(path);
      if (field) this._renderRepeatableList(field, path, wrapper);
    }
    this._updateVisibility();
    this._dispatchEvent('skyra-change', { values: this.values });
  }
  public reset(newValues?: Partial<FormValues>) {
    const base = this._computeDefaultValues();
    const resetTarget = newValues ? { ...base, ...newValues } : base;
    this._baselineValues = cloneDeep(resetTarget);
    this._values = cloneDeep(resetTarget);
    this._touched = {};
    this._errors = {};
    this._clearedServerErrors = {};
    this._submitError = null;
    this._isSubmitting = false;
    this._syncValuesToDom();
    for (const [path, wrapper] of this._repeatableContainers.entries()) {
      const field = this._findFieldDef(path);
      if (field) this._renderRepeatableList(field, path, wrapper);
    }
    this._updateVisibility();
    this._updateErrorsDisplay();
    this._dispatchEvent('skyra-change', { values: this.values });
  }
  
  public async validate(): Promise<boolean> {
    const errs = await this._runValidation();
    this._errors = errs;
    this._updateErrorsDisplay();
    return Object.keys(errs).length === 0;
  }
  
  public submit() {
    this._formEl.requestSubmit();
  }

  private _computeDefaultValues() {
    let base: Record<string, unknown> = {};
    for (const field of this._allFields) {
      const key = field.name ?? field.key;
      if (!key) continue;
      if (field.defaultValue !== undefined) {
        base = setIn(base, key, field.defaultValue);
      } else if (field.type === 'repeatable') {
        base = setIn(base, key, []);
      }
    }
    return { ...base, ...this._initialValues };
  }
  
  private get _allFields(): FieldDef[] {
    const list: FieldDef[] = [];
    const sets = this._fieldsets.length > 0 ? this._fieldsets : [{ id: 'default', title: '', fields: this._fields }];
    for (const fs of sets) {
      list.push(...fs.fields);
    }
    return list;
  }

  private _buildDom() {
    if (typeof HTMLElement === 'undefined') return;
    this._fieldsetsContainer.innerHTML = '';
    this._fieldWrappers.clear();
    this._fieldInputs.clear();
    this._repeatableContainers.clear();
    
    const normalized = this._fieldsets.length > 0 
      ? this._fieldsets 
      : [{ id: 'default', title: '', fields: this._fields }];
      
    for (let i = 0; i < normalized.length; i++) {
      const fsDef = normalized[i];
      if (!fsDef || !fsDef.fields || fsDef.fields.length === 0) continue;
      
      const isFramed = Boolean(fsDef.title || fsDef.subtitle);
      const fsEl = document.createElement('fieldset');
      fsEl.className = `skyra-fieldset-card ${isFramed ? 'framed' : ''}`;
      
      if (isFramed) {
        const legend = document.createElement('legend');
        legend.className = 'skyra-fieldset-legend';
        legend.innerHTML = `
          <div class="skyra-fieldset-title-row">
            <div>
              <h3 class="skyra-fieldset-title">${fsDef.title}</h3>
              ${fsDef.subtitle ? `<p class="skyra-fieldset-subtitle">${fsDef.subtitle}</p>` : ''}
            </div>
          </div>
        `;
        fsEl.appendChild(legend);
      }
      
      const bodyEl = document.createElement('div');
      bodyEl.className = isFramed ? 'skyra-fieldset-body' : '';
      
      const gridEl = document.createElement('div');
      gridEl.className = 'skyra-form-grid';
      
      for (const field of fsDef.fields) {
        this._buildFieldDom(field, gridEl);
      }
      
      bodyEl.appendChild(gridEl);
      fsEl.appendChild(bodyEl);
      this._fieldsetsContainer.appendChild(fsEl);
    }
    
    // Clear placeholders
    for (const key of Object.keys(this as any)) {
      if (key.startsWith('_placeholder_')) {
        delete (this as any)[key];
      }
    }
    
    // Merge missing default values for dynamically added fields
    const defaultValues = this._computeDefaultValues();
    for (const key of Object.keys(defaultValues)) {
      if (getIn(this._values, key) === undefined && getIn(defaultValues, key) !== undefined) {
        this._values = setIn(this._values, key, getIn(defaultValues, key));
        this._baselineValues = setIn(this._baselineValues, key, getIn(defaultValues, key));
      }
    }
    
    // Baseline initialization if not initialized
    if (!this._dataInitialized) {
      this._dataInitialized = true;
      this.reset();
    } else {
      this._syncValuesToDom();
      this._updateVisibility();
    }
  }

  private _buildFieldDom(field: FieldDef, parent: HTMLElement, pathPrefix: string = '') {
    const key = field.name ?? field.key ?? '';
    const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    
    const wrapper = document.createElement('div');
    wrapper.className = `skyra-field-wrap ${field.className ?? ''}`.trim();
    if (field.full) wrapper.style.gridColumn = '1 / -1';
    if (field.hidden) wrapper.style.display = 'none';
    
    if (field.type === 'repeatable') {
      this._buildRepeatableDom(field, fullPath, wrapper);
      parent.appendChild(wrapper);
      if (fullPath) this._fieldWrappers.set(fullPath, wrapper);
      return;
    }
    
    if (field.type === 'custom') {
      const slot = document.createElement('slot');
      slot.name = `custom-${fullPath.replace(/\./g, '-')}`;
      wrapper.appendChild(slot);
      parent.appendChild(wrapper);
      if (fullPath) this._fieldWrappers.set(fullPath, wrapper);
      return;
    }
    
    let el: HTMLElement;
    
    // Map types to elements
    if (['text', 'email', 'tel', 'url', 'number', 'password', 'search'].includes(field.type)) {
      const tag = field.type === 'number' ? 'skyra-tech-number-input' 
                : field.type === 'password' ? 'skyra-tech-password-input'
                : field.type === 'search' ? 'skyra-tech-search-input'
                : 'skyra-tech-input';
      el = document.createElement(tag);
      if (field.type !== 'number' && field.type !== 'password' && field.type !== 'search') {
        el.setAttribute('type', field.type);
      }
    } else if (field.type === 'textarea') {
      el = document.createElement('skyra-tech-textarea');
      if (field.rows) el.setAttribute('rows', String(field.rows));
      if (field.autoResize) el.setAttribute('auto-resize', '');
    } else if (field.type === 'select' || field.type === 'multi-select') {
      el = document.createElement('skyra-tech-dynamic-select');
      el.setAttribute('mode', field.mode ?? (field.type === 'multi-select' ? 'multiple' : 'single'));
      (el as any).options = field.options ?? [];
    } else if (field.type === 'checkbox') {
      el = document.createElement('skyra-tech-checkbox');
    } else if (field.type === 'switch') {
      el = document.createElement('skyra-tech-switch');
    } else if (field.type === 'date') {
      el = document.createElement('skyra-tech-date-field');
    } else if (field.type === 'date-range') {
      el = document.createElement('skyra-tech-date-range-field');
    } else if (field.type === 'time') {
      el = document.createElement('skyra-tech-time-field');
    } else if (field.type === 'datetime') {
      el = document.createElement('skyra-tech-date-time-field');
    } else {
      // Fallback
      el = document.createElement('skyra-tech-input');
    }
    
    // Common attributes
    el.setAttribute('id', `field-${fullPath.replace(/\./g, '-')}`);
    if (field.label && field.type !== 'checkbox' && field.type !== 'switch') {
      el.setAttribute('label', field.label);
    } else if (field.label) {
      el.textContent = field.label; // Checkbox/Switch uses slot content for label
    }
    if (field.placeholder) el.setAttribute('placeholder', field.placeholder);
    if (field.description || field.helper || field.helpText) el.setAttribute('helper-text', (field.description || field.helper || field.helpText)!);
    if (field.disabled || field.readOnly) el.setAttribute('disabled', '');
    if (field.required) el.setAttribute('required', '');
    
    // Listeners
    el.addEventListener('skyra-change', (e: any) => this._handleFieldValueChange(fullPath, e.detail?.value ?? e.target.value ?? e.target.checked));
    el.addEventListener('skyra-blur', () => this._handleFieldBlur(fullPath));
    
    wrapper.appendChild(el);
    parent.appendChild(wrapper);
    
    if (fullPath) {
      this._fieldWrappers.set(fullPath, wrapper);
      this._fieldInputs.set(fullPath, el);
    }
  }

  private _buildRepeatableDom(field: FieldDef, fullPath: string, wrapper: HTMLElement) {
    wrapper.className = 'skyra-repeatable-group';
    wrapper.innerHTML = `
      <div class="skyra-repeatable-header">
        <div>
          <h4 class="skyra-repeatable-title">${field.label}</h4>
          <span class="skyra-repeatable-count" id="count-${fullPath}"></span>
        </div>
        <button type="button" class="add-btn" id="add-${fullPath}" style="padding: 0.25rem 0.75rem; border-radius: var(--skyra-radius-md); background: transparent; border: 1px solid var(--skyra-border); cursor: pointer;">
          ${field.repeatable?.addButtonText || field.repeatableConfig?.addButtonText || '+ Add'}
        </button>
      </div>
      <div id="list-${fullPath}" class="skyra-repeatable-list"></div>
    `;
    
    const addBtn = wrapper.querySelector(`#add-${fullPath}`) as HTMLButtonElement;
    addBtn.addEventListener('click', () => {
      const items = (getIn(this._values, fullPath) as any[]) || [];
      const next = [...items, {}];
      this._handleFieldValueChange(fullPath, next);
      this._renderRepeatableList(field, fullPath, wrapper);
    });
    
    this._repeatableContainers.set(fullPath, wrapper);
    this._renderRepeatableList(field, fullPath, wrapper);
  }
  
  private _renderRepeatableList(field: FieldDef, fullPath: string, wrapper: HTMLElement) {
    const listEl = wrapper.querySelector(`#list-${fullPath}`) as HTMLDivElement;
    const countEl = wrapper.querySelector(`#count-${fullPath}`) as HTMLSpanElement;
    const addBtn = wrapper.querySelector(`#add-${fullPath}`) as HTMLButtonElement;
    listEl.innerHTML = '';
    
    const items = (getIn(this._values, fullPath) as any[]) || [];
    countEl.textContent = `${items.length} entries`;
    
    const config = field.repeatable || field.repeatableConfig;
    if (addBtn) {
      if (config?.max && items.length >= config.max) {
        addBtn.style.display = 'none';
      } else {
        addBtn.style.display = 'inline-block';
      }
    }
    
    if (items.length === 0) {
      listEl.innerHTML = `<p class="skyra-repeatable-empty">No entries added yet.</p>`;
      return;
    }
    
    const fields = config?.fields || [];
    
    for (let i = 0; i < items.length; i++) {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'skyra-repeatable-item';
      
      const header = document.createElement('div');
      header.className = 'skyra-repeatable-item-header';
      
      const canRemove = items.length > (config?.min || 0);
      
      const defaultTitle = field.label ? `${field.label} #${i + 1}` : `Item #${i + 1}`;
      
      header.innerHTML = `
        <h5 class="skyra-repeatable-item-title">${config?.itemTitle ? config.itemTitle(i, items[i]) : defaultTitle}</h5>
        ${canRemove ? `<button type="button" class="remove-btn" style="color: var(--skyra-danger); background: transparent; border: none; cursor: pointer;">${config?.removeButtonText || 'Remove'}</button>` : ''}
      `;
      
      if (canRemove) {
        header.querySelector('.remove-btn')!.addEventListener('click', () => {
          const next = [...items];
          next.splice(i, 1);
          this._handleFieldValueChange(fullPath, next);
          this._renderRepeatableList(field, fullPath, wrapper);
        });
      }
      
      const grid = document.createElement('div');
      grid.className = 'skyra-repeatable-item-grid';
      
      for (const subField of fields) {
        this._buildFieldDom(subField, grid, `${fullPath}.${i}`);
      }
      
      itemWrapper.appendChild(header);
      itemWrapper.appendChild(grid);
      listEl.appendChild(itemWrapper);
    }
    
    // Resync values into newly built fields
    this._syncValuesToDom();
  }

  private _handleFieldValueChange(name: string, value: unknown) {
    let nextValues = this._features.nestedFields && name.includes('.') 
      ? setIn(this._values, name, value) 
      : { ...this._values, [name]: value };
      
    // Dependencies
    if (this._features.dependencies) {
      for (const field of this._allFields) {
        if (field.dependsOn?.field === name) {
          if (field.dependsOn.clearOnParentChange) {
            nextValues = setIn(nextValues, field.name ?? field.key!, '');
          }
          if (field.dependsOn.onChange) {
            const extra = field.dependsOn.onChange(value, nextValues);
            nextValues = { ...nextValues, ...extra };
          }
        }
      }
    }
    
    this._values = nextValues;
    this._syncValuesToDom();
    this._dispatchEvent('skyra-change', { name, value, values: this._values });
    
    // Clear server error
    this._clearedServerErrors[name] = true;
    if (this._errors[name]) {
      delete this._errors[name];
    }
    this._updateErrorsDisplay();
    
    this._updateVisibility();
    
    if (this._validationMode === 'onChange') {
      this._runValidation(name).then(errs => {
        if (errs[name]) this._errors[name] = errs[name];
        else delete this._errors[name];
        this._updateErrorsDisplay();
      });
    }
  }

  private _handleFieldBlur(name: string) {
    this._touched[name] = true;
    if (this._validationMode === 'onBlur') {
      this._runValidation(name).then(errs => {
        if (errs[name]) this._errors[name] = errs[name];
        else delete this._errors[name];
        this._updateErrorsDisplay();
      });
    }
  }

  private _syncValuesToDom() {
    for (const [path, el] of this._fieldInputs.entries()) {
      const val = getIn(this._values, path);
      if (el.tagName.includes('CHECKBOX') || el.tagName.includes('SWITCH')) {
        if (val) el.setAttribute('checked', '');
        else el.removeAttribute('checked');
      } else if (el.tagName.includes('DYNAMIC-SELECT') || el.tagName.includes('DATE') || el.tagName.includes('TIME')) {
        (el as any).value = val;
      } else {
        (el as any).value = val ?? '';
      }
    }
  }

  private _isFieldVisible(field: FieldDef, path: string): boolean {
    if (field.hidden) return false;
    if (!this._features.conditionalFields) return true;
    
    if (field.visibleWhen) {
      return evaluateCondition(field.visibleWhen, this._values);
    } else if (field.dependsOn && field.dependsOn.value !== undefined) {
      const parentVal = getIn(this._values, field.dependsOn.field);
      return parentVal === field.dependsOn.value;
    }
    return true;
  }

  private _updateVisibility() {
    for (const [path, wrapper] of this._fieldWrappers.entries()) {
      // Find field def
      const field = this._findFieldDef(path);
      if (!field) continue;
      
      const isVisible = this._isFieldVisible(field, path);
      
      if (isVisible) {
        const placeholder = (this as any)[`_placeholder_${path}`];
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.replaceChild(wrapper, placeholder);
        }
      } else {
        if (wrapper.parentNode) {
          let placeholder = (this as any)[`_placeholder_${path}`];
          if (!placeholder) {
            placeholder = document.createComment(` placeholder for ${path} `);
            (this as any)[`_placeholder_${path}`] = placeholder;
          }
          wrapper.parentNode.replaceChild(placeholder, wrapper);
        }
      }
    }
  }
  
  private _findFieldDef(path: string): FieldDef | undefined {
    // Basic support for root fields and arrays
    const parts = path.split('.');
    const key = parts[parts.length - 1];
    return this._allFields.find(f => (f.name ?? f.key) === key);
  }

  private async _runValidation(targetField?: string): Promise<FormErrors> {
    if (!this._features.validation) return {};
    const errorMap: FormErrors = {};
    
    // 1. Field validation
    for (const field of this._allFields) {
      const key = field.name ?? field.key ?? '';
      if (!key) continue;
      if (targetField && key !== targetField && !targetField.startsWith(`${key}.`)) continue;
      if (!this._isFieldVisible(field, key)) continue;
      
      const val = getIn(this._values, key);
      
      if (field.required) {
        const isEmpty = val == null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          errorMap[key] = `${field.label} is required`;
          continue;
        }
      }
      
      if (field.validate) {
        try {
          const err = await field.validate(val, this._values);
          if (err) errorMap[key] = err;
        } catch (e: any) {
          errorMap[key] = e.message || 'Validation error';
        }
      }
    }
    
    // 2. Custom form validation
    if (this.customValidator && (!targetField || Object.keys(errorMap).length === 0)) {
      try {
        const formErrors = await this.customValidator(this._values);
        Object.assign(errorMap, formErrors);
      } catch (e: any) {
        errorMap._form = e.message || 'Validation failed';
      }
    }
    
    return errorMap;
  }
  
  private _updateErrorsDisplay() {
    const activeErrors: FormErrors = { ...this._errors };
    
    if (this._serverErrors) {
      for (const [k, v] of Object.entries(this._serverErrors)) {
        if (!this._clearedServerErrors[k] && v) activeErrors[k] = v;
      }
    }
    
    // Update fields
    for (const [path, el] of this._fieldInputs.entries()) {
      const err = activeErrors[path];
      if (err) el.setAttribute('error', err);
      else el.removeAttribute('error');
    }
    
    // Form level
    if (activeErrors._form || this._submitError) {
      this._formErrorEl.style.display = 'flex';
      this._formErrorEl.textContent = activeErrors._form || this._submitError || '';
    } else {
      this._formErrorEl.style.display = 'none';
    }
    
    // Summary
    if (this._features.validationSummary && Object.keys(activeErrors).length > 0) {
      this._summaryEl.style.display = 'block';
      let listHtml = '';
      let errorCount = 0;
      for (const [key, msg] of Object.entries(activeErrors)) {
        if (key === '_form') continue;
        errorCount++;
        const field = this._findFieldDef(key);
        const linkId = `field-${key.replace(/\./g, '-')}`;
        listHtml += `<li><a href="#${linkId}"><strong>${field?.label || key}:</strong> ${msg}</a></li>`;
      }
      const headerText = errorCount === 1 ? 'Please fix 1 error:' : `Please fix ${errorCount} errors:`;
      this._summaryEl.innerHTML = `
        <div class="skyra-validation-summary-header">${headerText}</div>
        <ul>${listHtml}</ul>
      `;
      
      this._summaryEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href')?.substring(1);
          if (targetId) {
            const el = this._fieldInputs.get(targetId.replace('field-', ''));
            if (el) {
              const innerInput = el.querySelector('input, select, textarea') as HTMLElement;
              if (innerInput) {
                innerInput.focus();
                innerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
        });
      });
    } else {
      this._summaryEl.style.display = 'none';
      this._summaryEl.innerHTML = '';
    }
  }

  private _handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (this._isSubmitting) return;
    
    this._isSubmitting = true;
    this._submitError = null;
    this._updateErrorsDisplay();
    
    try {
      const errs = await this._runValidation();
      if (Object.keys(errs).length > 0) {
        this._errors = errs;
        this._updateErrorsDisplay();
        this._isSubmitting = false;
        return;
      }
      
      if (this.onSubmitCallback) {
        await this.onSubmitCallback(this._values);
      }
      this._isSubmitted = true;
      this._dispatchEvent('skyra-submit', { values: this._values });
    } catch (e: any) {
      this._submitError = e.message || 'Submission failed';
      this._updateErrorsDisplay();
    } finally {
      this._isSubmitting = false;
    }
  };

  private _dispatchEvent(name: string, detail: any) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-dynamic-form')) {
  customElements.define('skyra-tech-dynamic-form', SkyraTechDynamicForm);
}
