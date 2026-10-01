import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-button': any;
      'skyra-tech-input': any;
      'skyra-tech-textarea': any;
      'skyra-tech-checkbox': any;
      'skyra-tech-radio': any;
      'skyra-tech-switch': any;
      'skyra-tech-dynamic-select': any;
    }
  }
}
