export type AuditEventType =
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'CUT_ATTEMPT'
  | 'RIGHT_CLICK_ATTEMPT'
  | 'TAB_BLUR'
  | 'TAB_FOCUS'
  | 'WINDOW_BLUR'
  | 'WINDOW_FOCUS'
  | 'FULLSCREEN_ENTER'
  | 'FULLSCREEN_EXIT'
  | 'HEARTBEAT'
  | 'TIME_EXPIRED'
  | 'PAGE_REFRESH'
  | 'TEST_START'
  | 'TEST_SUBMIT';

export interface BrowserMetadata {
  browser: string;
  os: string;
  focusState: boolean;
  fullscreen: boolean;
  extra?: Record<string, unknown>;
}

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: number;
  attemptId: string;
  userId: string;
  questionId?: string;
  metadata: BrowserMetadata;
  synced?: boolean;
}

export interface AssessmentState {
  remainingTime: number;
  totalTime: number;
  isFullscreen: boolean;
  isSubmitted: boolean;
  currentQuestionId?: string;
}

export interface AssessmentConfig {
  duration: number;
  userId: string;
  attemptId: string;
  heartbeatInterval?: number;
  syncInterval?: number;
}

export interface AuditLogSyncPayload {
  events: AuditEvent[];
  attemptId: string;
  userId: string;
}

export interface AuditLogSyncResponse {
  success: boolean;
  syncedCount: number;
  serverTimestamp: number;
  errors?: string[];
}
