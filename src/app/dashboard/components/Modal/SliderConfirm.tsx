import React, { useRef, useState } from "react";

interface SliderConfirmProps {
  onConfirm: () => void;
  disabled?: boolean;
}

const SLIDER_WIDTH = 240;
const SLIDER_HEIGHT = 32;
const THUMB_SIZE = 28;

const SliderConfirm: React.FC<SliderConfirmProps> = ({ onConfirm, disabled }) => {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  function handleMouseDown() {
    if (disabled) return;
    setDragging(true);
  }
  
  function handleMouseUp() {
    if (!dragging) return;
    setDragging(false);
    if (dragX > SLIDER_WIDTH - THUMB_SIZE - 8) {
      setDragX(SLIDER_WIDTH - THUMB_SIZE);
      setTimeout(onConfirm, 150);
    } else {
      setDragX(0);
    }
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - THUMB_SIZE / 2;
    x = Math.max(0, Math.min(x, SLIDER_WIDTH - THUMB_SIZE));
    setDragX(x);
  }

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  });

  const progress = dragX / (SLIDER_WIDTH - THUMB_SIZE);
  
  return (
    <div
        ref={sliderRef}
        style={{
          width: SLIDER_WIDTH,
          height: SLIDER_HEIGHT,
          background: '#f5f5f7',
          borderRadius: 16,
          position: 'relative',
          margin: '18px auto 0 auto',
          userSelect: 'none',
          opacity: disabled ? 0.4 : 1,
          border: '1px solid #e5e5e7',
        }}
      >
        {/* Progress fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: dragX + THUMB_SIZE / 2,
            background: progress > 0.1 ? '#ff3b30' : 'transparent',
            borderRadius: 16,
            transition: dragging ? 'none' : 'all 0.25s ease',
            opacity: progress * 0.8 + 0.2,
          }}
        />
        
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: dragX,
            top: 2,
            width: THUMB_SIZE,
            height: SLIDER_HEIGHT - 4,
            background: '#ffffff',
            borderRadius: 14,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : 'grab',
            transition: dragging ? 'none' : 'left 0.25s ease',
            border: '0.5px solid #e5e5e7',
          }}
          onMouseDown={handleMouseDown}
        >
          <div 
            style={{
              fontSize: 12,
              color: progress > 0.8 ? '#ff3b30' : '#8e8e93',
              fontWeight: 500,
              transition: 'color 0.15s ease',
            }}
          >
            →
          </div>
        </div>
        
        {/* Text */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 400,
            fontSize: 13,
            color: progress > 0.5 ? '#ffffff' : '#8e8e93',
            pointerEvents: 'none',
            transition: 'color 0.15s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Trascina per eliminare
        </div>
      </div>
  );
};

export default SliderConfirm;