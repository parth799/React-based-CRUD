import { NextRequest, NextResponse } from 'next/server';
import { AuditEvent, AuditLogSyncPayload, AuditLogSyncResponse } from '@/types/audit.types';

let serverAuditLogs: AuditEvent[] = [];

function validateEvent(event: unknown): event is AuditEvent {
  if (!event || typeof event !== 'object') return false;
  
  const e = event as Record<string, unknown>;
  
  return (
    typeof e.id === 'string' &&
    typeof e.type === 'string' &&
    typeof e.timestamp === 'number' &&
    typeof e.attemptId === 'string' &&
    typeof e.userId === 'string' &&
    e.metadata !== undefined &&
    typeof e.metadata === 'object'
  );
}

function validatePayload(body: unknown): body is AuditLogSyncPayload {
  if (!body || typeof body !== 'object') return false;
  
  const payload = body as Record<string, unknown>;
  
  return (
    Array.isArray(payload.events) &&
    typeof payload.attemptId === 'string' &&
    typeof payload.userId === 'string'
  );
}

export async function POST(request: NextRequest): Promise<NextResponse<AuditLogSyncResponse>> {
  try {
    const body = await request.json();
    
    if (!validatePayload(body)) {
      return NextResponse.json(
        {
          success: false,
          syncedCount: 0,
          serverTimestamp: Date.now(),
          errors: ['Invalid payload structure'],
        },
        { status: 400 }
      );
    }

    const { events, attemptId, userId } = body;

    const validEvents: AuditEvent[] = [];
    const errors: string[] = [];

    for (let i = 0; i < events.length; i++) {
      if (validateEvent(events[i])) {
        const event = events[i] as AuditEvent;
        if (event.attemptId !== attemptId || event.userId !== userId) {
          errors.push(`Event ${i}: attemptId/userId mismatch`);
          continue;
        }
        validEvents.push(event);
      } else {
        errors.push(`Event ${i}: Invalid event structure`);
      }
    }

    if (validEvents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          syncedCount: 0,
          serverTimestamp: Date.now(),
          errors: errors.length > 0 ? errors : ['No valid events to sync'],
        },
        { status: 400 }
      );
    }

    const existingIds = new Set(serverAuditLogs.map(e => e.id));
    const newEvents = validEvents.filter(e => !existingIds.has(e.id));
    serverAuditLogs = [...serverAuditLogs, ...newEvents];

    return NextResponse.json({
      success: true,
      syncedCount: newEvents.length,
      serverTimestamp: Date.now(),
      ...(errors.length > 0 && { errors }),
    });

  } catch {
    return NextResponse.json(
      {
        success: false,
        syncedCount: 0,
        serverTimestamp: Date.now(),
        errors: ['Internal server error'],
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ logs: serverAuditLogs, count: serverAuditLogs.length });
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
