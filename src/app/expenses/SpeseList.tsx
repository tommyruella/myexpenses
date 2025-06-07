import React from "react";
import SpesaItem from "./SpesaItem";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

interface SpeseListProps {
  spese: Spesa[];
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function SpeseList({ spese, onDelete, loading }: SpeseListProps) {
  if (spese.length === 0) {
    return (
      <div style={{ color: '#181818', textAlign: 'center', marginTop: 60, fontSize: 18, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        nessuna spesa
      </div>
    );
  }
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 18, 
      minHeight: 60, 
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      width: '100%', // ora occupa tutto lo spazio della colonna
      alignSelf: 'flex-start',
    }}>
      {spese.map(spesa => (
        <SpesaItem key={spesa.id} spesa={spesa} onDelete={onDelete} loading={loading} />
      ))}
    </div>
  );
}
