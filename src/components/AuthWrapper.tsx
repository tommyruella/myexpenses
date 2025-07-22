"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Controlla se l'utente è già autenticato
    const authStatus = localStorage.getItem("isAuthenticated");
    const authTime = localStorage.getItem("authTime");
    
    if (authStatus === "true" && authTime) {
      const loginTime = parseInt(authTime);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      // L'autenticazione scade dopo 24 ore
      if (now - loginTime < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Sessione scaduta
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("authTime");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (password: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
        setError("");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("authTime", Date.now().toString());
      } else {
        setError(result.error || "Seems like u are not allowed here");
        setIsAuthenticated(false);
      }
    } catch (_error) {
      setError("Connection error. Please try again.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra un loading mentre controlla l'autenticazione
  if (isAuthenticated === null) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#0f0f0f",
        color: "white"
      }}>
        Loading...
      </div>
    );
  }

  // Mostra il form di login se non autenticato
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />;
  }

  // Mostra il contenuto se autenticato
  return <>{children}</>;
}
