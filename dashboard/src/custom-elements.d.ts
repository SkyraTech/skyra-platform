import React from 'react';
import type { FieldDef, FieldsetDef, DynamicFormFeatures } from '@skyra-tech-platform/dynamic-form';

declare global {
  interface SkyraTechDateFieldElement extends HTMLElement {
    disabledDate?: (date: Date) => boolean;
  }
  
  interface SkyraTechCalendarElement extends HTMLElement {
    disabledDate?: (date: Date) => boolean;
  }
  
  interface SkyraTechDynamicFormElement extends HTMLElement {
    fields: FieldDef[];
    fieldsets: FieldsetDef[];
    features: DynamicFormFeatures;
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'skyra-tech-dialog': any;
        'skyra-tech-app-shell': any;
        'skyra-tech-dynamic-form': any;
        'skyra-tech-data-table': any;
        'skyra-tech-button': any;
        'skyra-tech-input': any;
        'skyra-tech-textarea': any;
        'skyra-tech-checkbox': any;
        'skyra-tech-radio': any;
        'skyra-tech-switch': any;
        'skyra-tech-dynamic-select': any;
        'skyra-notification-bar': any;
        'skyra-tech-pdf-viewer': any;
        'skyra-tech-qr-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
          value?: string;
          'error-correction-level'?: string;
          margin?: number;
          scale?: number;
          'color-dark'?: string;
          'color-light'?: string;
          'module-shape'?: string;
          'finder-shape'?: string;
          'finder-color'?: string;
        }, HTMLElement>;
        'skyra-tech-time-field': any;
        'skyra-tech-time-range-field': any;
        'skyra-tech-date-field': any;
        'skyra-tech-date-range-field': any;
        'skyra-tech-date-time-field': any;
        'skyra-tech-calendar': any;
        'skyra-spinner': any;
        'skyra-progress': any;
        'skyra-circular-progress': any;
        'skyra-skeleton': any;
        'skyra-skeleton-avatar': any;
        'skyra-skeleton-text': any;
        'skyra-skeleton-table': any;
        'skyra-tabs': any;
        'skyra-tab': any;
        'skyra-tab-panel': any;
        'skyra-accordion': any;
        'skyra-accordion-item': any;
        'skyra-collapsible': any;
        'skyra-popover': any;
        'skyra-tech-popover': any;
        'skyra-dropdown-menu': any;
        'skyra-tech-dropdown-menu': any;
        'skyra-dropdown-item': any;
        'skyra-tech-dropdown-item': any;
        'skyra-dropdown-separator': any;
        'skyra-tech-dropdown-separator': any;
        'skyra-dropdown-group': any;
        'skyra-tech-dropdown-group': any;
        'skyra-context-menu': any;
        'skyra-tech-context-menu': any;
        'skyra-context-menu-item': any;
        'skyra-tech-context-menu-item': any;
        'skyra-context-menu-separator': any;
        'skyra-tech-context-menu-separator': any;
        'skyra-context-menu-group': any;
        'skyra-tech-context-menu-group': any;
        'skyra-command-palette': any;
        'skyra-tech-command-palette': any;
      }
    }
  }
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-dialog': any;
      'skyra-tech-app-shell': any;
      'skyra-tech-dynamic-form': any;
      'skyra-tech-data-table': any;
      'skyra-tech-button': any;
      'skyra-tech-input': any;
      'skyra-tech-textarea': any;
      'skyra-tech-checkbox': any;
      'skyra-tech-radio': any;
      'skyra-tech-switch': any;
      'skyra-tech-dynamic-select': any;
      'skyra-notification-bar': any;
      'skyra-tech-pdf-viewer': any;
      'skyra-tech-qr-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        value?: string;
        'error-correction-level'?: string;
        margin?: number;
        scale?: number;
        'color-dark'?: string;
        'color-light'?: string;
        'module-shape'?: string;
        'finder-shape'?: string;
        'finder-color'?: string;
      }, HTMLElement>;
      'skyra-tech-time-field': any;
      'skyra-tech-time-range-field': any;
      'skyra-tech-date-field': any;
      'skyra-tech-date-range-field': any;
      'skyra-tech-date-time-field': any;
      'skyra-tech-calendar': any;
      'skyra-spinner': any;
      'skyra-progress': any;
      'skyra-circular-progress': any;
      'skyra-skeleton': any;
      'skyra-skeleton-avatar': any;
      'skyra-skeleton-text': any;
      'skyra-skeleton-table': any;
      'skyra-tabs': any;
      'skyra-tab': any;
      'skyra-tab-panel': any;
      'skyra-accordion': any;
      'skyra-accordion-item': any;
      'skyra-collapsible': any;
      'skyra-popover': any;
      'skyra-tech-popover': any;
      'skyra-dropdown-menu': any;
      'skyra-tech-dropdown-menu': any;
      'skyra-dropdown-item': any;
      'skyra-tech-dropdown-item': any;
      'skyra-dropdown-separator': any;
      'skyra-tech-dropdown-separator': any;
      'skyra-dropdown-group': any;
      'skyra-tech-dropdown-group': any;
      'skyra-context-menu': any;
      'skyra-tech-context-menu': any;
      'skyra-context-menu-item': any;
      'skyra-tech-context-menu-item': any;
      'skyra-context-menu-separator': any;
      'skyra-tech-context-menu-separator': any;
      'skyra-context-menu-group': any;
      'skyra-tech-context-menu-group': any;
      'skyra-command-palette': any;
      'skyra-tech-command-palette': any;
    }
  }
}
