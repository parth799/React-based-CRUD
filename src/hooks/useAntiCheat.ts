'use client';

import { useEffect, useCallback } from 'react';
import { AuditEventType } from '@/types/audit.types';

interface UseAntiCheatProps {
  onLog: (type: AuditEventType, extra?: Record<string, unknown>) => void;
  onWarning: (message: string) => void;
  enabled?: boolean;
}

export function useAntiCheat({ 
  onLog, 
  onWarning, 
  enabled = true 
}: UseAntiCheatProps): void {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isInputField = tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
    const isCmdOrCtrl = event.ctrlKey || event.metaKey;
    
    if (isCmdOrCtrl) {
      const key = event.key.toLowerCase();
      
      if (key === 'c') {
        if (!isInputField) {
          event.preventDefault();
          event.stopPropagation();
          onLog('COPY_ATTEMPT', { key: event.key });
          onWarning('Copying content is not allowed during the assessment');
          return;
        }
      }
      
      if (key === 'v') {
        if (!isInputField) {
          event.preventDefault();
          event.stopPropagation();
          onLog('PASTE_ATTEMPT', { key: event.key });
          onWarning('Pasting is not allowed during the assessment');
          return;
        }
      }
      
      if (key === 'x') {
        if (!isInputField) {
          event.preventDefault();
          event.stopPropagation();
          onLog('CUT_ATTEMPT', { key: event.key });
          onWarning('Cutting content is not allowed during the assessment');
          return;
        }
      }

      if (key === 'a') {
        if (!isInputField) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
    }
  }, [enabled, onLog, onWarning]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    onLog('RIGHT_CLICK_ATTEMPT', {
      targetElement: tagName,
      targetClass: target.className,
    });
    onWarning('Right-click is disabled during the assessment');
  }, [enabled, onLog, onWarning]);

  const handleCopy = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    onLog('COPY_ATTEMPT', { source: 'clipboard_event' });
    onWarning('Copying content is not allowed during the assessment');
  }, [enabled, onLog, onWarning]);

  const handleCut = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    onLog('CUT_ATTEMPT', { source: 'clipboard_event' });
    onWarning('Cutting content is not allowed during the assessment');
  }, [enabled, onLog, onWarning]);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    onLog('PASTE_ATTEMPT', { source: 'clipboard_event' });
    onWarning('Pasting is not allowed during the assessment');
  }, [enabled, onLog, onWarning]);

  const handleSelectStart = useCallback((event: Event) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }

    const isProtected = target.closest('.protected-content');
    if (isProtected) {
      event.preventDefault();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const style = document.createElement('style');
    style.id = 'anti-cheat-styles';
    style.textContent = `
      .protected-content,
      .protected-content * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      .protected-content input,
      .protected-content textarea,
      .protected-content [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('anti-cheat-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('selectstart', handleSelectStart, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
    };
  }, [enabled, handleKeyDown, handleContextMenu, handleCopy, handleCut, handlePaste, handleSelectStart]);
}
