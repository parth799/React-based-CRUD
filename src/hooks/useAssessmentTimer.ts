'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AuditEventType } from '@/types/audit.types';

interface UseAssessmentTimerProps {
  duration: number;
  onLog: (type: AuditEventType, extra?: Record<string, unknown>) => void;
  onTimeExpired: () => void;
  heartbeatInterval?: number;
  autoStart?: boolean;
}

interface UseAssessmentTimerReturn {
  remainingTime: number;
  formattedTime: string;
  isRunning: boolean;
  hasExpired: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function useAssessmentTimer({
  duration,
  onLog,
  onTimeExpired,
  heartbeatInterval = 60,
  autoStart = false,
}: UseAssessmentTimerProps): UseAssessmentTimerReturn {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasExpired, setHasExpired] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatCounterRef = useRef(0);
  const hasLoggedExpiryRef = useRef(false);

  const start = useCallback(() => {
    if (hasExpired) return;
    setIsRunning(true);
  }, [hasExpired]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemainingTime(duration);
    setHasExpired(false);
    setIsRunning(false);
    heartbeatCounterRef.current = 0;
    hasLoggedExpiryRef.current = false;
  }, [duration]);

  useEffect(() => {
    if (!isRunning || hasExpired) return;

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        
        heartbeatCounterRef.current += 1;
        if (heartbeatCounterRef.current >= heartbeatInterval) {
          heartbeatCounterRef.current = 0;
          onLog('HEARTBEAT', { remainingTime: newTime });
        }

        if (newTime <= 0) {
          if (!hasLoggedExpiryRef.current) {
            hasLoggedExpiryRef.current = true;
            onLog('TIME_EXPIRED', { totalDuration: duration });
            setHasExpired(true);
            setIsRunning(false);
            onTimeExpired();
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, hasExpired, duration, heartbeatInterval, onLog, onTimeExpired]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onLog('TAB_BLUR');
      } else {
        onLog('TAB_FOCUS');
      }
    };

    const handleWindowBlur = () => {
      onLog('WINDOW_BLUR');
    };

    const handleWindowFocus = () => {
      onLog('WINDOW_FOCUS');
    };

    const handleBeforeUnload = () => {
      onLog('PAGE_REFRESH');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onLog]);

  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    isRunning,
    hasExpired,
    start,
    pause,
    reset,
  };
}
