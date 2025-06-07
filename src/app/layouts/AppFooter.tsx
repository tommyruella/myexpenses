import React from "react";

export default function AppFooter() {
  return (
    <footer style={{
      width: '100vw',
      margin: 0,
      padding: '18px 0 12px 0',
      textAlign: 'center',
      color: '#181818',
      background: '#fff',
      fontSize: 14,
      letterSpacing: 0.2,
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <span>© {new Date().getFullYear()} Spese Minimal</span>
    </footer>
  );
}
