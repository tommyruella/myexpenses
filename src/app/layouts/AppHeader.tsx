import React from "react";

export default function AppHeader() {
  return (
    <header style={{
      width: '100vw',
      margin: 0,
      padding: '32px 0 0 0',
      background: 'none',
      textAlign: 'center',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, margin: 0, color: '#181818', fontFamily: 'inherit' }}>spese</h1>
      <div style={{ color: '#181818', fontSize: 15, marginTop: 4, marginBottom: 8, fontFamily: 'inherit' }}>Il tuo tracker minimal di uscite e entrate</div>
    </header>
  );
}
