import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        open?: boolean;
        mode?: string;
        size?: string;
        side?: string;
        'drawer-width'?: string;
        'close-on-backdrop'?: boolean;
        'close-on-escape'?: boolean;
        'hide-close-button'?: boolean;
      };
    }
  }
}
