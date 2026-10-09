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
    }
  }
}
