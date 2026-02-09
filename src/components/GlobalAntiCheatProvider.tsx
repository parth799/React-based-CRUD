'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastState {
  open: boolean;
  message: string;
}

export function GlobalAntiCheatProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState>({ open: false, message: '' });
  const initialized = useRef(false);

  const showWarning = useCallback((message: string) => {
    setToast({ open: true, message });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isCmdOrCtrl = event.ctrlKey || event.metaKey;
    
    if (isCmdOrCtrl) {
      const key = event.key.toLowerCase();
      
      if (key === 'c') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showWarning('Copying is not allowed');
        return false;
      }
      
      if (key === 'v') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showWarning('Pasting is not allowed');
        return false;
      }
      
      if (key === 'x') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showWarning('Cutting is not allowed');
        return false;
      }

      if (key === 'a') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }

      if (key === 'p') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showWarning('Printing is not allowed');
        return false;
      }

      if (key === 's') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }

      if (key === 'u') {
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
      showWarning('Developer tools are not allowed');
      return false;
    }

    if (event.shiftKey && event.key === 'F10') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, [showWarning]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showWarning('Right-click is disabled');
    return false;
  }, [showWarning]);

  const handleCopy = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.clipboardData) {
      event.clipboardData.clearData();
    }
    showWarning('Copying is not allowed');
    return false;
  }, [showWarning]);

  const handleCut = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.clipboardData) {
      event.clipboardData.clearData();
    }
    showWarning('Cutting is not allowed');
    return false;
  }, [showWarning]);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showWarning('Pasting is not allowed');
    return false;
  }, [showWarning]);

  const handleSelectStart = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragStart = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showWarning('Drag and drop is not allowed');
    return false;
  }, [showWarning]);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  useEffect(() => {
    if (initialized.current) return;

    document.body.classList.add('anti-cheat-enabled');

    const styleId = 'global-anti-cheat-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Global protection - disable all selection */
        body, body * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        
        /* Allow text input in form fields */
        input, textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
        
        /* Disable all dragging */
        * {
          -webkit-user-drag: none !important;
        }
        
        img {
          -webkit-user-drag: none !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const options = { capture: true, passive: false };

    document.addEventListener('keydown', handleKeyDown, options);
    
    document.addEventListener('contextmenu', handleContextMenu as unknown as EventListener, options);
    window.addEventListener('contextmenu', handleContextMenu as unknown as EventListener, options);
    
    document.addEventListener('copy', handleCopy as unknown as EventListener, options);
    document.addEventListener('cut', handleCut as unknown as EventListener, options);
    document.addEventListener('paste', handlePaste as unknown as EventListener, options);
    window.addEventListener('copy', handleCopy as unknown as EventListener, options);
    window.addEventListener('cut', handleCut as unknown as EventListener, options);
    window.addEventListener('paste', handlePaste as unknown as EventListener, options);
    
    document.addEventListener('selectstart', handleSelectStart, options);
    
    document.addEventListener('dragstart', handleDragStart as unknown as EventListener, options);
    document.addEventListener('drop', handleDrop as unknown as EventListener, options);
    document.addEventListener('dragover', handleDragOver as unknown as EventListener, options);

    document.body.oncontextmenu = () => false;
    document.documentElement.oncontextmenu = () => false;
    document.body.oncopy = () => false;
    document.body.oncut = () => false;
    document.body.onpaste = () => false;
    document.documentElement.oncopy = () => false;
    document.documentElement.oncut = () => false;
    document.documentElement.onpaste = () => false;

    if (navigator.clipboard) {
      const originalRead = navigator.clipboard.read;
      const originalReadText = navigator.clipboard.readText;
      const originalWrite = navigator.clipboard.write;
      const originalWriteText = navigator.clipboard.writeText;

      navigator.clipboard.read = async () => {
        showWarning('Clipboard access is blocked');
        return [];
      };
      
      navigator.clipboard.readText = async () => {
        showWarning('Clipboard access is blocked');
        return '';
      };
      
      navigator.clipboard.write = async () => {
        showWarning('Clipboard access is blocked');
      };
      
      navigator.clipboard.writeText = async () => {
        showWarning('Clipboard access is blocked');
      };

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
      document.removeEventListener('contextmenu', handleContextMenu as unknown as EventListener, cleanupOptions);
      window.removeEventListener('contextmenu', handleContextMenu as unknown as EventListener, cleanupOptions);
      document.removeEventListener('copy', handleCopy as unknown as EventListener, cleanupOptions);
      document.removeEventListener('cut', handleCut as unknown as EventListener, cleanupOptions);
      document.removeEventListener('paste', handlePaste as unknown as EventListener, cleanupOptions);
      window.removeEventListener('copy', handleCopy as unknown as EventListener, cleanupOptions);
      window.removeEventListener('cut', handleCut as unknown as EventListener, cleanupOptions);
      window.removeEventListener('paste', handlePaste as unknown as EventListener, cleanupOptions);
      document.removeEventListener('selectstart', handleSelectStart, cleanupOptions);
      document.removeEventListener('dragstart', handleDragStart as unknown as EventListener, cleanupOptions);
      document.removeEventListener('drop', handleDrop as unknown as EventListener, cleanupOptions);
      document.removeEventListener('dragover', handleDragOver as unknown as EventListener, cleanupOptions);

      document.body.oncontextmenu = null;
      document.documentElement.oncontextmenu = null;
      document.body.oncopy = null;
      document.body.oncut = null;
      document.body.onpaste = null;
      document.documentElement.oncopy = null;
      document.documentElement.oncut = null;
      document.documentElement.onpaste = null;

      document.body.classList.remove('anti-cheat-enabled');

      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }

      const origClipboard = (window as unknown as Record<string, unknown>).__originalClipboard as Record<string, unknown>;
      if (origClipboard && navigator.clipboard) {
        navigator.clipboard.read = origClipboard.read as () => Promise<ClipboardItems>;
        navigator.clipboard.readText = origClipboard.readText as () => Promise<string>;
        navigator.clipboard.write = origClipboard.write as (data: ClipboardItems) => Promise<void>;
        navigator.clipboard.writeText = origClipboard.writeText as (text: string) => Promise<void>;
      }

      initialized.current = false;
    };
  }, [handleKeyDown, handleContextMenu, handleCopy, handleCut, handlePaste, handleSelectStart, handleDragStart, handleDrop, handleDragOver, showWarning]);

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
