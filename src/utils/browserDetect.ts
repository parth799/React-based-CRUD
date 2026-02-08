import { BrowserMetadata } from '@/types/audit.types';

export function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Server';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/(\d+)/);
    return `Edge ${match?.[1] || 'Unknown'}`;
  }
  if (ua.includes('Chrome/')) {
    const match = ua.match(/Chrome\/(\d+)/);
    return `Chrome ${match?.[1] || 'Unknown'}`;
  }
  if (ua.includes('Firefox/')) {
    const match = ua.match(/Firefox\/(\d+)/);
    return `Firefox ${match?.[1] || 'Unknown'}`;
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    const match = ua.match(/Version\/(\d+)/);
    return `Safari ${match?.[1] || 'Unknown'}`;
  }
  
  return 'Unknown Browser';
}

export function detectOS(): string {
  if (typeof window === 'undefined') return 'Server';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'Unknown OS';
}

export function isFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return !!document.fullscreenElement;
}

export function hasFocus(): boolean {
  if (typeof document === 'undefined') return true;
  return document.hasFocus();
}

export function getBrowserMetadata(extra?: Record<string, unknown>): BrowserMetadata {
  return {
    browser: detectBrowser(),
    os: detectOS(),
    focusState: hasFocus(),
    fullscreen: isFullscreen(),
    ...(extra && { extra }),
  };
}
