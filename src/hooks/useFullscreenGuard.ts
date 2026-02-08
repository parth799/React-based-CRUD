'use client';

import { useEffect, useCallback, useState } from 'react';
import { AuditEventType } from '@/types/audit.types';

interface UseFullscreenGuardProps {
  onLog: (type: AuditEventType, extra?: Record<string, unknown>) => void;
  onWarning: (message: string) => void;
  enabled?: boolean;
}

interface UseFullscreenGuardReturn {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

export function useFullscreenGuard({
  onLog,
  onWarning,
  enabled = true,
}: UseFullscreenGuardProps): UseFullscreenGuardReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (!enabled || typeof document === 'undefined') return;

    try {
      const elem = document.documentElement;
      
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (elem as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((elem as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (elem as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
      
      setIsFullscreen(true);
      onLog('FULLSCREEN_ENTER');
    } catch (error) {
      console.error('[Fullscreen] Failed to enter fullscreen:', error);
      onWarning('Please click "Enter Fullscreen" to start the assessment');
    }
  }, [enabled, onLog, onWarning]);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error('[Fullscreen] Failed to exit fullscreen:', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      
      if (!isNowFullscreen && isFullscreen) {
        onLog('FULLSCREEN_EXIT');
        onWarning('Fullscreen mode exited. Please return to fullscreen to continue.');
      }
      
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    setIsFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [enabled, isFullscreen, onLog, onWarning]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
