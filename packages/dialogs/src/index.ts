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

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps, ConfirmDialogVariant } from './ConfirmDialog';

export { Modal } from './Modal';
export type { ModalProps, ModalSize } from './Modal';

export { Drawer } from './Drawer';
export type { DrawerProps, DrawerSide } from './Drawer';

