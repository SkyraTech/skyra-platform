'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import '@skyra-tech-platform/toast';
import { ToastOptions as CoreToastOptions, toast as coreToast } from '@skyra-tech-platform/toast';
import { NotificationType } from '@skyra-tech-platform/notification';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement> | Event) => void;
  altText?: string;
}

export interface ToastOptions {
  id?: string;
  type?: NotificationType;
  title: ReactNode;
  message?: ReactNode;
  code?: string;
  duration?: number;
  persistent?: boolean;
  action?: ToastAction;
  icon?: ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastData extends ToastOptions {
  id: string;
  createdAt: number;
}

export interface ToastContextValue {
  toasts: ToastData[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Wrapper that calls the core vanilla implementation for imperative calls
export function toast(options: ToastOptions): string {
  // Convert ReactNode to string/HTMLElement for vanilla if necessary
  // To preserve backwards compatibility with simple strings:
  return coreToast({
    ...options,
    title: options.title as any, // Simple fallback; proper React rendering requires portal/root
    message: options.message as any,
    action: options.action as any,
    icon: options.icon as any,
    style: options.style ? Object.keys(options.style).map(k => `${k}:${(options.style as any)[k]}`).join(';') : undefined
  });
}

toast.dismiss = coreToast.dismiss;
toast.dismissAll = coreToast.dismissAll;
toast.update = (id: string, options: Partial<ToastOptions>) => {
  coreToast.update(id, {
    ...options,
    title: options.title as any,
    message: options.message as any,
    action: options.action as any,
    icon: options.icon as any,
    style: options.style ? Object.keys(options.style).map(k => `${k}:${(options.style as any)[k]}`).join(';') : undefined
  });
};

export interface ToastProviderProps {
  maxVisible?: number;
  position?: ToastPosition;
  children: ReactNode;
}

export function ToastProvider({
  maxVisible = 5,
  position = 'top-right',
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // The React Provider now primarily serves as a bridge for React Context consumers
  // However, the actual DOM rendering is handled by the Web Component globally.

  useEffect(() => {
    // Set global viewport properties
    if (typeof window !== 'undefined') {
      let viewport = document.querySelector('skyra-toast-viewport');
      if (!viewport) {
        viewport = document.createElement('skyra-toast-viewport');
        document.body.appendChild(viewport);
      }
      viewport.setAttribute('max-visible', maxVisible.toString());
      viewport.setAttribute('position', position);
    }
  }, [maxVisible, position]);

  const add = useCallback((options: ToastOptions) => toast(options), []);
  const dismiss = useCallback((id: string) => toast.dismiss(id), []);
  const dismissAll = useCallback(() => toast.dismissAll(), []);
  const update = useCallback((id: string, options: Partial<ToastOptions>) => toast.update(id, options), []);

  return (
    <ToastContext.Provider value={{ toasts, toast: add, dismiss, dismissAll, update }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}

export interface ToastViewportProps {
  position?: ToastPosition;
  toasts?: ToastData[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function ToastViewport({
  position = 'top-right',
  className = '',
}: ToastViewportProps) {
  // We render the web component declaratively if consumers mount it manually,
  // otherwise it's created automatically by the imperative `toast()` call.
  return (
    // @ts-ignore
    <skyra-toast-viewport position={position} class={className}>
    {/* @ts-ignore */}
    </skyra-toast-viewport>
  );
}
