"use client";
import React, { useState, useEffect } from "react";

const TypewriterBackground = () => {
  const phrases = [
    ["tommy", "tegamino", "stats"],
    ["my", "personal", "tracker"],
    ["tommy", "expense", "tracker", "app"],
    ["tommy", "personal", "tracker"]
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentWord = currentPhrase[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // SCRITTURA
      if (charIndex < currentWord.length) {
        // Continua a scrivere
        timeout = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 120);
      } else {
        // Parola completata
        if (currentWordIndex === currentPhrase.length - 1) {
          // Ultima parola, inizia cancellazione
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, 1200);
        } else {
          // Passa alla prossima parola
          timeout = setTimeout(() => {
            setCurrentWordIndex(prev => prev + 1);
            setCharIndex(0);
          }, 200);
        }
      }
    } else {
      // CANCELLAZIONE
      if (charIndex > 0) {
        // Continua a cancellare caratteri
        timeout = setTimeout(() => {
          setCharIndex(prev => prev - 1);
        }, 60);
      } else {
        // Caratteri finiti
        if (currentWordIndex > 0) {
          // Vai alla parola precedente
          timeout = setTimeout(() => {
            setCurrentWordIndex(prev => prev - 1);
            setCharIndex(currentPhrase[currentWordIndex - 1].length);
          }, 150);
        } else {
          // Tutto cancellato, cambia frase e ricomincia
          timeout = setTimeout(() => {
            setIsDeleting(false);
            setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
            setCurrentWordIndex(0);
            setCharIndex(0);
          }, 800);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [currentWordIndex, charIndex, isDeleting, currentPhraseIndex, currentPhrase, phrases.length]);

  // Generate display words based on current state
  const displayedWords = currentPhrase.map((word, index) => {
    if (isDeleting) {
      // Durante cancellazione: mostra tutte le parole complete PRIMA della corrente
      if (index < currentWordIndex) {
        return word; // Parole precedenti complete (non cancellarle fino al loro turno)
      } else if (index === currentWordIndex) {
        return word.slice(0, charIndex); // Parola corrente in cancellazione
      } else {
        return ''; // Parole successive mai scritte
      }
    } else {
      // Durante scrittura: mostra parole complete + corrente parziale
      if (index < currentWordIndex) {
        return word; // Parole precedenti complete
      } else if (index === currentWordIndex) {
        return word.slice(0, charIndex);
      } else {
        return ''; // Parole successive non ancora scritte
      }
    }
  });

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimeout = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => clearInterval(cursorTimeout);
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: isMobile ? "20px" : "30%",
      left: isMobile ? "20px" : "50px",
      transform: isMobile ? "none" : "translateY(-50%)",
      zIndex: 0,
      userSelect: "none",
      pointerEvents: "none",
      fontFamily: "inherit",
      width: isMobile ? "calc(100vw - 40px)" : "auto",
      height: isMobile ? "auto" : "auto"
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "80vw" : "400px"
      }}>
        {displayedWords.map((word, index) => (
          <div key={index} style={{
            position: "absolute",
            top: isMobile ? `${index * 22}vw` : `${index * 140}px`,
            left: 0,
            fontSize: isMobile ? "18vw" : "120px",
            fontWeight: 700,
            color: "rgba(24, 24, 24, 1)",
            letterSpacing: isMobile ? "-3px" : "-4px",
            lineHeight: isMobile ? "1.1" : "1.1",
            whiteSpace: "nowrap",
            height: isMobile ? "20vw" : "130px",
            display: "flex",
            alignItems: "center"
          }}>
            {word}
            {index === currentWordIndex && (
              <span style={{
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
                color: "rgba(130, 130, 130, 0.5)",
                fontWeight: 100,
                fontSize: isMobile ? "16vw" : "100px",
                lineHeight: isMobile ? ".8" : ".5"
              }}>|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypewriterBackground;