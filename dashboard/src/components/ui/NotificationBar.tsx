import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/notification';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface NotificationBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  type?: NotificationType;
  title: React.ReactNode;
  message?: React.ReactNode;
  code?: string;
  duration?: number;
  onClose?: () => void;
  icon?: React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-notification-bar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        code?: string;
        duration?: number;
      };
    }
  }
}

export const NotificationBar = React.forwardRef<HTMLElement, NotificationBarProps>((props, ref) => {
  const {
    type = 'info',
    title,
    message,
    code,
    duration = 5000,
    onClose,
    icon,
    className = '',
    style,
    ...rest
  } = props;

  const innerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const el = (ref as React.MutableRefObject<HTMLElement>)?.current || innerRef.current;
    if (!el) return;

    const handleClose = () => {
      onClose?.();
    };

    el.addEventListener('skyra-close', handleClose);
    return () => {
      el.removeEventListener('skyra-close', handleClose);
    };
  }, [onClose, ref]);

  return (
    // @ts-ignore
    <skyra-notification-bar
      ref={ref || innerRef}
      type={type}
      code={code}
      duration={duration}
      className={`skyra-notification--${type} ${className}`}
      style={style}
      {...rest}
    >
      <span slot="title">{title}</span>
      {message && <span>{message}</span>}
      {icon && <span slot="icon">{icon}</span>}
    {/* @ts-ignore */}
    </skyra-notification-bar>
  );
});

NotificationBar.displayName = 'NotificationBar';
