'use client';

import { useCallback, useEffect, useRef } from 'react';
import { AuditEvent, AuditEventType, AssessmentConfig } from '@/types/audit.types';
import { getBrowserMetadata } from '@/utils/browserDetect';
import { appendEvent, getUnSyncedEvents, markEventsSynced } from '@/utils/auditStorage';

interface UseEventLoggerProps {
  config: AssessmentConfig;
  currentQuestionId?: string;
}

interface UseEventLoggerReturn {
  logEvent: (type: AuditEventType, extra?: Record<string, unknown>) => Promise<void>;
  syncEvents: () => Promise<void>;
  getUnsyncedCount: () => Promise<number>;
}

export function useEventLogger({ 
  config, 
  currentQuestionId 
}: UseEventLoggerProps): UseEventLoggerReturn {
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

  const syncEvents = useCallback(async (): Promise<void> => {
    if (isSyncingRef.current) return;
    
    try {
      isSyncingRef.current = true;
      
      const unsynced = await getUnSyncedEvents();
      if (unsynced.length === 0) return;

      const attemptEvents = unsynced.filter(e => e.attemptId === config.attemptId);
      if (attemptEvents.length === 0) return;

      const response = await fetch('/api/audit/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: attemptEvents,
          attemptId: config.attemptId,
          userId: config.userId,
        }),
      });

      if (response.ok) {
        const eventIds = attemptEvents.map(e => e.id);
        await markEventsSynced(eventIds);
      }
    } catch (error) {
      console.error('[Audit] Sync error:', error);
    } finally {
      isSyncingRef.current = false;
    }
  }, [config.attemptId, config.userId]);

  const logEvent = useCallback(async (
    type: AuditEventType, 
    extra?: Record<string, unknown>
  ): Promise<void> => {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: Date.now(),
      attemptId: config.attemptId,
      userId: config.userId,
      questionId: currentQuestionId,
      metadata: getBrowserMetadata(extra),
      synced: false,
    };

    await appendEvent(event);
  }, [config.attemptId, config.userId, currentQuestionId]);

  const getUnsyncedCount = useCallback(async (): Promise<number> => {
    const events = await getUnSyncedEvents();
    return events.filter(e => e.attemptId === config.attemptId).length;
  }, [config.attemptId]);

  useEffect(() => {
    const intervalMs = (config.syncInterval || 30) * 1000;
    
    syncIntervalRef.current = setInterval(() => {
      syncEvents();
    }, intervalMs);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncEvents, config.syncInterval]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const events = getUnSyncedEvents();
      events.then(unsynced => {
        const attemptEvents = unsynced.filter(e => e.attemptId === config.attemptId);
        if (attemptEvents.length > 0) {
          navigator.sendBeacon('/api/audit/logs', JSON.stringify({
            events: attemptEvents,
            attemptId: config.attemptId,
            userId: config.userId,
          }));
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [config.attemptId, config.userId]);

  return {
    logEvent,
    syncEvents,
    getUnsyncedCount,
  };
}
