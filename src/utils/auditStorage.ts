import { AuditEvent } from '@/types/audit.types';

const DB_NAME = 'audit_logs_db';
const STORE_NAME = 'audit_events';
const DB_VERSION = 1;
const LOCALSTORAGE_FALLBACK_KEY = 'audit_events_fallback';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('attemptId', 'attemptId', { unique: false });
      }
    };
  });
}

export async function appendEvent(event: AuditEvent): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const eventToStore = { ...event, synced: false };
      const request = store.add(eventToStore);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      transaction.oncomplete = () => db.close();
    });
  } catch {
    appendEventToLocalStorage(event);
  }
}

function appendEventToLocalStorage(event: AuditEvent): void {
  if (typeof localStorage === 'undefined') return;
  
  const existing = localStorage.getItem(LOCALSTORAGE_FALLBACK_KEY);
  const events: AuditEvent[] = existing ? JSON.parse(existing) : [];
  events.push({ ...event, synced: false });
  localStorage.setItem(LOCALSTORAGE_FALLBACK_KEY, JSON.stringify(events));
}

export async function getUnSyncedEvents(): Promise<AuditEvent[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      transaction.oncomplete = () => db.close();
    });
  } catch {
    return getUnSyncedEventsFromLocalStorage();
  }
}

function getUnSyncedEventsFromLocalStorage(): AuditEvent[] {
  if (typeof localStorage === 'undefined') return [];
  
  const existing = localStorage.getItem(LOCALSTORAGE_FALLBACK_KEY);
  if (!existing) return [];
  
  const events: AuditEvent[] = JSON.parse(existing);
  return events.filter(e => !e.synced);
}

export async function markEventsSynced(eventIds: string[]): Promise<void> {
  if (eventIds.length === 0) return;
  
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      eventIds.forEach(id => store.delete(id));
      
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    markEventsSyncedInLocalStorage(eventIds);
  }
}

function markEventsSyncedInLocalStorage(eventIds: string[]): void {
  if (typeof localStorage === 'undefined') return;
  
  const existing = localStorage.getItem(LOCALSTORAGE_FALLBACK_KEY);
  if (!existing) return;
  
  const events: AuditEvent[] = JSON.parse(existing);
  const remaining = events.filter(e => !eventIds.includes(e.id));
  localStorage.setItem(LOCALSTORAGE_FALLBACK_KEY, JSON.stringify(remaining));
}

export async function getAllEvents(): Promise<AuditEvent[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      transaction.oncomplete = () => db.close();
    });
  } catch {
    if (typeof localStorage === 'undefined') return [];
    const existing = localStorage.getItem(LOCALSTORAGE_FALLBACK_KEY);
    return existing ? JSON.parse(existing) : [];
  }
}

export async function clearAllEvents(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      transaction.oncomplete = () => db.close();
    });
  } catch {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCALSTORAGE_FALLBACK_KEY);
    }
  }
}
