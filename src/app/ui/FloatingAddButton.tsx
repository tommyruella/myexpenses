"use client";

import React, { useState } from "react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const [open, setOpen] = useState(false);

  // Solo bottone floating + animato, pronto per espansione futura
  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 24,
        zIndex: 1002,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'auto',
      }}
      className="animate-scale-in"
    >
      <button
        aria-label={open ? "Chiudi menu" : "Aggiungi spesa"}
        onClick={() => {
          setOpen(false);
          onClick();
        }}
        style={{
          width: 52,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#fff',
          color: '#181818',
          border: '2px solid #181818',
          boxShadow: 'none',
          fontSize: 28,
          fontWeight: 800,
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: '#181818', fontFamily: 'inherit' }}>+</span>
      </button>
    </div>
  );
}
