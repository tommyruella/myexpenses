"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

interface SpeseContextType {
  spese: Spesa[];
  loading: boolean;
  fetchSpese: () => Promise<void>;
  setSpese: React.Dispatch<React.SetStateAction<Spesa[]>>;
}

const SpeseContext = createContext<SpeseContextType | undefined>(undefined);

export function useSpese() {
  const ctx = useContext(SpeseContext);
  if (!ctx) throw new Error("useSpese must be used within SpeseProvider");
  return ctx;
}

export function SpeseProvider({ children }: { children: ReactNode }) {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpese = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/spese");
      const data = await res.json();
      if (Array.isArray(data)) setSpese(data.map((s: Spesa) => ({ ...s, importo: Number(s.importo) })));
      else setSpese([]);
    } catch {
      setSpese([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpese();
  }, []);

  return (
    <SpeseContext.Provider value={{ spese, loading, fetchSpese, setSpese }}>
      {children}
    </SpeseContext.Provider>
  );
}