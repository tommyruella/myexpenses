'use client';

import React from "react";

export default function GlobalLoading() {
  return (
    <div>
      {/* 3 dot animati */}
      <div className="dots" role="status" aria-label="Caricamento" aria-live="polite">
        <span />
        <span />
        <span />
      </div>
      {/* Testo accessibile; visivamente gestito dal CSS (::before) */}
      <p>mmm we are currently loading</p>

      <style jsx>{`
        .dots {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dots span {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.25;
          animation: dotPulse 1.2s infinite ease-in-out;
        }
        .dots span:nth-child(2) { animation-delay: 0.15s; }
        .dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
