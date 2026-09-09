'use client';

import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export interface PrintButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Target DOM element ID to print, or window print if omitted */
  target?: string;
  /** Custom print handler */
  onPrint?: () => void | Promise<void>;
  /** Hook before print */
  onBeforePrint?: () => void;
  /** Hook after print */
  onAfterPrint?: () => void;
  /** Custom button label */
  children?: React.ReactNode;
}

/**
 * @skyra/ui PrintButton
 *
 * Reusable print action button supporting DOM target printing or window.print().
 */
export function PrintButton({
  target,
  onPrint,
  onBeforePrint,
  onAfterPrint,
  children = 'Print',
  variant = 'outline',
  leftIcon = <Printer size={16} />,
  ...rest
}: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      onBeforePrint?.();

      if (onPrint) {
        await onPrint();
      } else if (target && typeof document !== 'undefined') {
        const el = document.getElementById(target);
        if (el) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Print Document</title>
                  <style>
                    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; }
                    @media print { body { margin: 0; } }
                  </style>
                </head>
                <body>
                  ${el.innerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }
        }
      } else if (typeof window !== 'undefined') {
        window.print();
      }

      onAfterPrint?.();
    } catch (err) {
      console.error('Print failed:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      leftIcon={leftIcon}
      isLoading={isPrinting}
      onClick={handlePrint}
      {...rest}
    >
      {children}
    </Button>
  );
}
