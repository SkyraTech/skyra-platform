'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { NotificationBar, NotificationType } from './NotificationBar';

/* ─── Toast Types & Interfaces ─── */

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  /** Label for the action button */
  label: string;
  /** Callback fired on action click */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible alternative text for screen readers */
  altText?: string;
}

export interface ToastOptions {
  /** Explicit custom identifier */
  id?: string;
  /** Toast semantic category */
  type?: NotificationType;
  /** Title or primary headline */
  title: ReactNode;
  /** Description or body text */
  message?: ReactNode;
  /** Optional response or error code badge */
  code?: string;
  /** Duration in ms before auto-dismissal. 0 or persistent means no auto-dismissal */
  duration?: number;
  /** Whether the notification remains until user dismisses manually */
  persistent?: boolean;
  /** Optional interactive action button */
  action?: ToastAction;
  /** Custom icon override */
  icon?: ReactNode;
  /** Callback fired when toast is closed */
  onClose?: () => void;
  /** Custom CSS class */
  className?: string;
  /** Custom inline styles */
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

/* ─── Global Event Dispatch for Imperative toast() Helper ─── */

type ToastListener = {
  add: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
};

let globalToastListener: ToastListener | null = null;

/**
 * Imperative toast function to trigger notifications from anywhere in the application.
 */
export function toast(options: ToastOptions): string {
  if (globalToastListener) {
    return globalToastListener.add(options);
  }
  console.warn('[Skyra Toast] toast() called outside of <ToastProvider>. Notification was not displayed.');
  return '';
}

toast.dismiss = (id: string) => {
  globalToastListener?.dismiss(id);
};

toast.dismissAll = () => {
  globalToastListener?.dismissAll();
};

toast.update = (id: string, options: Partial<ToastOptions>) => {
  globalToastListener?.update(id, options);
};

/* ─── ToastProvider ─── */

export interface ToastProviderProps {
  /** Maximum number of toasts visible simultaneously (default: 5) */
  maxVisible?: number;
  /** Default viewport position (default: 'top-right') */
  position?: ToastPosition;
  children: ReactNode;
}

let toastIdCounter = 0;

export function ToastProvider({
  maxVisible = 5,
  position = 'top-right',
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...options } : t))
    );
  }, []);

  const add = useCallback(
    (options: ToastOptions): string => {
      const id = options.id || `skyra-toast-${++toastIdCounter}-${Date.now()}`;
      const newToast: ToastData = {
        ...options,
        id,
        createdAt: Date.now(),
        duration: options.persistent ? 0 : (options.duration ?? 5000),
      };

      setToasts((prev) => {
        // If an existing toast with this id exists, update it
        const exists = prev.some((t) => t.id === id);
        if (exists) {
          return prev.map((t) => (t.id === id ? newToast : t));
        }
        // Otherwise append and enforce maxVisible limit
        const updated = [...prev, newToast];
        if (updated.length > maxVisible) {
          return updated.slice(updated.length - maxVisible);
        }
        return updated;
      });

      return id;
    },
    [maxVisible]
  );

  // Register global listener for imperative helper
  useEffect(() => {
    globalToastListener = { add, dismiss, dismissAll, update };
    return () => {
      globalToastListener = null;
    };
  }, [add, dismiss, dismissAll, update]);

  return (
    <ToastContext.Provider value={{ toasts, toast: add, dismiss, dismissAll, update }}>
      {children}
      <ToastViewport position={position} toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ─── useToast Hook ─── */

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}

/* ─── ToastViewport ─── */

export interface ToastViewportProps {
  position?: ToastPosition;
  toasts?: ToastData[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function ToastViewport({
  position = 'top-right',
  toasts: controlledToasts,
  onDismiss,
  className = '',
}: ToastViewportProps) {
  const context = useContext(ToastContext);
  const activeToasts = controlledToasts ?? context?.toasts ?? [];
  const handleDismiss = onDismiss ?? context?.dismiss ?? (() => {});

  if (activeToasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className={`skyra-toast-viewport skyra-toast-viewport--${position} ${className}`}
    >
      <div className="skyra-toast-stack">
        {activeToasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            data={toastItem}
            onDismiss={() => {
              toastItem.onClose?.();
              queueMicrotask(() => {
                handleDismiss(toastItem.id);
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── ToastItem (Orchestrating NotificationBar) ─── */

interface ToastItemProps {
  data: ToastData;
  onDismiss: () => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const { action, ...barProps } = data;

  // Custom action button rendered inside message or footer slot
  const customMessage = (
    <div className="skyra-toast-body">
      {data.message && <div className="skyra-toast-message">{data.message}</div>}
      {action && (
        <div className="skyra-toast-action-wrapper" style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            className="skyra-toast-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(e);
            }}
            aria-label={action.altText || action.label}
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="skyra-toast-item">
      <NotificationBar
        type={barProps.type}
        title={barProps.title}
        message={customMessage}
        code={barProps.code}
        duration={barProps.duration}
        icon={barProps.icon}
        onClose={onDismiss}
        className={`skyra-toast-notification ${barProps.className || ''}`}
        style={barProps.style}
      />
    </div>
  );
}
