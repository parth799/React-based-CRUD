import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Secure Assessment - Anti-Cheat System',
  description: 'High-stakes assessment platform with browser restrictions, event logging, and audit trail'
};

const antiCheatScript = `
(function() {
  // Block right-click immediately
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
  
  // Block copy
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
  
  // Block cut
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
  
  // Block paste
  document.addEventListener('paste', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
  
  // Block keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && ['c','v','x','a','p','s','u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    if (e.key === 'F12' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  
  // Block drag
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, true);
  
  // Block selection on non-input elements
  document.addEventListener('selectstart', function(e) {
    var tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      return false;
    }
  }, true);
  
  // Add anti-cheat class to body when DOM is ready
  if (document.body) {
    document.body.classList.add('anti-cheat-enabled');
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.classList.add('anti-cheat-enabled');
    });
  }
})();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: antiCheatScript }} />
      </head>
      <body style={{ margin: 0 }} className="anti-cheat-enabled">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
