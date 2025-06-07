import React, { useState } from "react";

// Icona hamburger animata (3 linee)
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 24, height: 24 }}>
    <span style={{
      width: 20,
      height: 3,
      background: '#fff',
      borderRadius: 2,
      marginBottom: 3,
      transition: 'all 0.25s',
      transform: open ? 'rotate(45deg) translateY(7px)' : 'none',
    }} />
    <span style={{
      width: 20,
      height: 3,
      background: '#fff',
      borderRadius: 2,
      marginBottom: 3,
      opacity: open ? 0 : 1,
      transition: 'all 0.25s',
    }} />
    <span style={{
      width: 20,
      height: 3,
      background: '#fff',
      borderRadius: 2,
      transition: 'all 0.25s',
      transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none',
    }} />
  </span>
);

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
