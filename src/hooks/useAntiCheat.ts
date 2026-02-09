'use client';

import { useEffect, useCallback, useRef } from 'react';
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
  
  const initialized = useRef(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    const isCmdOrCtrl = event.ctrlKey || event.metaKey;
    
    if (isCmdOrCtrl) {
      const key = event.key.toLowerCase();
      
      if (key === 'c') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onLog('COPY_ATTEMPT', { 
          key: event.key, 
          source: 'keyboard',
          target: (event.target as HTMLElement)?.tagName 
        });
        onWarning('Copying is not allowed during the assessment');
        return false;
      }
      
      if (key === 'v') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onLog('PASTE_ATTEMPT', { 
          key: event.key, 
          source: 'keyboard',
          target: (event.target as HTMLElement)?.tagName 
        });
        onWarning('Pasting is not allowed during the assessment');
        return false;
      }
      
      if (key === 'x') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onLog('CUT_ATTEMPT', { 
          key: event.key, 
          source: 'keyboard',
          target: (event.target as HTMLElement)?.tagName 
        });
        onWarning('Cutting is not allowed during the assessment');
        return false;
      }

      if (key === 'a') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onLog('SELECT_ALL_ATTEMPT', { 
          key: event.key, 
          source: 'keyboard',
          target: (event.target as HTMLElement)?.tagName 
        });
        return false;
      }

      if (key === 'p') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onLog('PRINT_ATTEMPT', { key: event.key });
        onWarning('Printing is not allowed during the assessment');
        return false;
      }

      if (key === 's') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    }

    if (event.key === 'F12') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onLog('DEVTOOLS_ATTEMPT', { key: event.key });
      onWarning('Developer tools are not allowed during the assessment');
      return false;
    }

    if (event.shiftKey && event.key === 'F10') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onLog('RIGHT_CLICK_ATTEMPT', { source: 'keyboard_f10' });
      onWarning('Context menu is disabled during the assessment');
      return false;
    }
  }, [enabled, onLog, onWarning]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    const target = event.target as HTMLElement;
    onLog('RIGHT_CLICK_ATTEMPT', {
      targetElement: target.tagName.toLowerCase(),
      targetClass: target.className,
    });
    onWarning('Right-click is disabled during the assessment');
    return false;
  }, [enabled, onLog, onWarning]);

  const handleCopy = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    if (event.clipboardData) {
      event.clipboardData.clearData();
    }
    
    const target = event.target as HTMLElement;
    onLog('COPY_ATTEMPT', { 
      source: 'clipboard_event',
      target: target.tagName.toLowerCase()
    });
    onWarning('Copying is not allowed during the assessment');
    return false;
  }, [enabled, onLog, onWarning]);

  const handleCut = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    if (event.clipboardData) {
      event.clipboardData.clearData();
    }
    
    const target = event.target as HTMLElement;
    onLog('CUT_ATTEMPT', { 
      source: 'clipboard_event',
      target: target.tagName.toLowerCase()
    });
    onWarning('Cutting is not allowed during the assessment');
    return false;
  }, [enabled, onLog, onWarning]);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    const target = event.target as HTMLElement;
    onLog('PASTE_ATTEMPT', { 
      source: 'clipboard_event',
      target: target.tagName.toLowerCase(),
      hadData: !!event.clipboardData?.getData('text')
    });
    onWarning('Pasting is not allowed during the assessment');
    return false;
  }, [enabled, onLog, onWarning]);

  const handleSelectStart = useCallback((event: Event) => {
    if (!enabled) return;
    
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, [enabled]);

  const handleDragStart = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    onLog('DRAG_ATTEMPT', { 
      target: (event.target as HTMLElement)?.tagName?.toLowerCase() 
    });
    return false;
  }, [enabled, onLog]);

  const handleDrop = useCallback((event: DragEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    onLog('DROP_ATTEMPT', { 
      target: (event.target as HTMLElement)?.tagName?.toLowerCase() 
    });
    onWarning('Drag and drop is not allowed during the assessment');
    return false;
  }, [enabled, onLog, onWarning]);

  useEffect(() => {
    if (!enabled) return;

    const styleId = 'anti-cheat-global-styles';
    
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Global protection - disable all selection and context menu */
      body, body * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      /* Only allow text input in form fields - but block selection of their content for copying */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        /* Allow typing but still block context menu via JS */
      }
      
      /* Disable image dragging */
      img {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Disable all dragging */
      * {
        -webkit-user-drag: none !important;
        user-drag: none !important;
      }
    `;
    document.head.appendChild(style);

    // Add body class for CSS-based protection
    document.body.classList.add('anti-cheat-enabled');

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
      // Remove body class
      document.body.classList.remove('anti-cheat-enabled');
    };
  }, [enabled]);

  // Set up all event listeners
  useEffect(() => {
    if (!enabled || initialized.current) return;

    // Use capture phase (true) to intercept events before they reach any element
    const options = { capture: true, passive: false };

    // Keyboard events
    document.addEventListener('keydown', handleKeyDown, options);
    
    // Context menu
    document.addEventListener('contextmenu', handleContextMenu, options);
    
    // Clipboard events - attach to both document and window for maximum coverage
    document.addEventListener('copy', handleCopy, options);
    document.addEventListener('cut', handleCut, options);
    document.addEventListener('paste', handlePaste, options);
    window.addEventListener('copy', handleCopy as EventListener, options);
    window.addEventListener('cut', handleCut as EventListener, options);
    window.addEventListener('paste', handlePaste as EventListener, options);
    
    // Selection events
    document.addEventListener('selectstart', handleSelectStart, options);
    
    // Drag and drop events
    document.addEventListener('dragstart', handleDragStart, options);
    document.addEventListener('drop', handleDrop, options);
    document.addEventListener('dragover', (e) => {
      if (enabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, options);

    // Also set oncontextmenu directly on document.body and document.documentElement
    document.body.oncontextmenu = () => false;
    document.documentElement.oncontextmenu = () => false;

    // Block clipboard API directly if available
    if (navigator.clipboard) {
      const originalRead = navigator.clipboard.read;
      const originalReadText = navigator.clipboard.readText;
      const originalWrite = navigator.clipboard.write;
      const originalWriteText = navigator.clipboard.writeText;

      navigator.clipboard.read = async () => {
        onLog('CLIPBOARD_API_READ', { source: 'navigator.clipboard.read' });
        onWarning('Clipboard access is blocked during the assessment');
        return [];
      };
      
      navigator.clipboard.readText = async () => {
        onLog('CLIPBOARD_API_READ', { source: 'navigator.clipboard.readText' });
        onWarning('Clipboard access is blocked during the assessment');
        return '';
      };
      
      navigator.clipboard.write = async () => {
        onLog('CLIPBOARD_API_WRITE', { source: 'navigator.clipboard.write' });
        onWarning('Clipboard access is blocked during the assessment');
      };
      
      navigator.clipboard.writeText = async () => {
        onLog('CLIPBOARD_API_WRITE', { source: 'navigator.clipboard.writeText' });
        onWarning('Clipboard access is blocked during the assessment');
      };

      // Store original methods for cleanup
      (window as unknown as Record<string, unknown>).__originalClipboard = {
        read: originalRead,
        readText: originalReadText,
        write: originalWrite,
        writeText: originalWriteText
      };
    }

    initialized.current = true;

    return () => {
      const cleanupOptions = { capture: true };
      
      document.removeEventListener('keydown', handleKeyDown, cleanupOptions);
      document.removeEventListener('contextmenu', handleContextMenu, cleanupOptions);
      document.removeEventListener('copy', handleCopy, cleanupOptions);
      document.removeEventListener('cut', handleCut, cleanupOptions);
      document.removeEventListener('paste', handlePaste, cleanupOptions);
      window.removeEventListener('copy', handleCopy as EventListener, cleanupOptions);
      window.removeEventListener('cut', handleCut as EventListener, cleanupOptions);
      window.removeEventListener('paste', handlePaste as EventListener, cleanupOptions);
      document.removeEventListener('selectstart', handleSelectStart, cleanupOptions);
      document.removeEventListener('dragstart', handleDragStart, cleanupOptions);
      document.removeEventListener('drop', handleDrop, cleanupOptions);

      // Restore context menu handlers
      document.body.oncontextmenu = null;
      document.documentElement.oncontextmenu = null;

      // Restore clipboard API
      const origClipboard = (window as unknown as Record<string, unknown>).__originalClipboard as Record<string, unknown>;
      if (origClipboard && navigator.clipboard) {
        navigator.clipboard.read = origClipboard.read as () => Promise<ClipboardItems>;
        navigator.clipboard.readText = origClipboard.readText as () => Promise<string>;
        navigator.clipboard.write = origClipboard.write as (data: ClipboardItems) => Promise<void>;
        navigator.clipboard.writeText = origClipboard.writeText as (text: string) => Promise<void>;
      }

      initialized.current = false;
    };
  }, [enabled, handleKeyDown, handleContextMenu, handleCopy, handleCut, handlePaste, handleSelectStart, handleDragStart, handleDrop, onLog, onWarning]);
}
