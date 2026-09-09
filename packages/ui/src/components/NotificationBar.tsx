'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Bell, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface NotificationBarProps {
  /** Notification tone */
  type?: NotificationType;
  /** Title text */
  title: React.ReactNode;
  /** Detailed message text or rich node */
  message?: React.ReactNode;
  /** Optional response code badge (e.g. SUCCESS_200, ERR_404) */
  code?: string;
  /** Duration in ms before auto-dismissing. 0 means persistent */
  duration?: number;
  /** Callback fired on dismissal */
  onClose?: () => void;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  style?: React.CSSProperties;
}

const TYPE_CONFIG = {
  success: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-success)',
    barColor: 'var(--skyra-success)',
    iconColor: 'var(--skyra-success)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'var(--skyra-success)',
    defaultIcon: CheckCircle2,
  },
  error: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-danger)',
    barColor: 'var(--skyra-danger)',
    iconColor: 'var(--skyra-danger)',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeColor: 'var(--skyra-danger)',
    defaultIcon: AlertCircle,
  },
  warning: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-warning)',
    barColor: 'var(--skyra-warning)',
    iconColor: 'var(--skyra-warning)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'var(--skyra-warning)',
    defaultIcon: AlertTriangle,
  },
  info: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-info, var(--skyra-primary))',
    barColor: 'var(--skyra-info, var(--skyra-primary))',
    iconColor: 'var(--skyra-info, var(--skyra-primary))',
    badgeBg: 'rgba(10, 88, 202, 0.12)',
    badgeColor: 'var(--skyra-primary)',
    defaultIcon: Info,
  },
  neutral: {
    bg: 'var(--skyra-surface)',
    border: 'var(--skyra-border)',
    barColor: 'var(--skyra-text-muted)',
    iconColor: 'var(--skyra-text-muted)',
    badgeBg: 'var(--skyra-bg)',
    badgeColor: 'var(--skyra-text-muted)',
    defaultIcon: Bell,
  },
};

/**
 * @skyra/ui NotificationBar
 *
 * Enterprise response banner with synchronized duration countdown timer,
 * hover pause/resume, optional response code metadata, and accessible alert semantics.
 */
export function NotificationBar({
  type = 'info',
  title,
  message,
  code,
  duration = 5000,
  onClose,
  icon,
  className = '',
  style,
}: NotificationBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);

  // Stable ref for onClose — avoids stale closure causing timer reset on parent re-render
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Guard so onClose fires exactly once (not multiple ticks before state update)
  const firedRef = useRef(false);

  const config = TYPE_CONFIG[type];
  const IconComponent = config.defaultIcon;
  const TICK = 50;

  useEffect(() => {
    if (duration <= 0 || isDismissed || isPaused) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - TICK;
        if (next <= 0) {
          clearInterval(interval);
          if (!firedRef.current) {
            firedRef.current = true;
            setIsDismissed(true);
            onCloseRef.current?.();
          }
          return 0;
        }
        return next;
      });
    }, TICK);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isPaused, isDismissed]);

  const handleClose = () => {
    setIsDismissed(true);
    onClose?.();
  };

  if (isDismissed) return null;

  const progressPercent = duration > 0 ? (remainingTime / duration) * 100 : 0;

  return (
    <div
      role="alert"
      className={`skyra-notification-bar skyra-notification--${type} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        background: config.bg,
        border: `1px solid var(--skyra-border)`,
        borderLeft: `4px solid ${config.border}`,
        borderRadius: 'var(--skyra-radius-md)',
        boxShadow: 'var(--skyra-shadow-md)',
        overflow: 'hidden',
        fontFamily: 'var(--skyra-font-body)',
        outline: 'none',
        ...style,
      }}
    >
      {/* Top Countdown Progress Timer */}
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '3px',
            width: `${progressPercent}%`,
            background: config.barColor,
            transition: 'width 50ms linear',
          }}
        />
      )}

      {/* Main Content Area */}
      <div
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}
      >
        {/* Leading Icon */}
        <div style={{ color: config.iconColor, flexShrink: 0, marginTop: '2px' }}>
          {icon ?? <IconComponent size={18} />}
        </div>

        {/* Text and Metadata */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
              {title}
            </span>
            {code && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--skyra-font-mono, monospace)',
                  padding: '1px 6px',
                  borderRadius: 'var(--skyra-radius-xs, 3px)',
                  background: config.badgeBg,
                  color: config.badgeColor,
                }}
              >
                {code}
              </span>
            )}
          </div>
          {message && (
            <div style={{ fontSize: '0.82rem', color: 'var(--skyra-text-muted)', lineHeight: '1.4' }}>
              {message}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          aria-label="Close notification"
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            color: 'var(--skyra-text-subtle)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--skyra-radius-sm)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
