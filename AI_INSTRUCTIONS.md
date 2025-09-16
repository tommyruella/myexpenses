# Istruzioni per ricreare il sito (AI)

Breve guida per ricreare l'app "Expenses2": struttura, API e come fetchare correttamente le spese.

## Overview progetto
- Framework: Next.js 13+ (App Router) con React.
- Cartelle principali:
  - /src/app/dashboard/pages/home: pagina principale (page.tsx) e CSS (homepage.css)
  - /src/app/loading.tsx: componente di caricamento (Client Component se usa styled-jsx)
  - /src/app/api/spese: endpoint API (GET, POST, DELETE opzionale)
  - /src/components: componenti riutilizzabili (Navbar, FloatingMenu, Modal, Charts)

## Contratto API `/api/spese`
- GET /api/spese
  - Response: 200 OK
  - Body: JSON array di oggetti Spesa
  - Oggetto Spesa:
    {
      id: number,
      descrizione: string,
      importo: number | string, // alcuni back-end restituiscono come stringa
      data_spesa: string, // ISO date o YYYY-MM-DD
      categoria: string,
      tipo: "USCITA" | "ENTRATA"
    }

- POST /api/spese
  - Body request: JSON
    {
      descrizione: string,
      importo: number,
      data_spesa: string (YYYY-MM-DD),
      categoria: string,
      tipo: "USCITA" | "ENTRATA"
    }
  - Response: 201 Created (opzionale) con risorsa creata o 200 OK.

- DELETE /api/spese/:id (opzionale)
  - Elimina la spesa con l'id e ritorna 204 No Content o 200 OK.

## Come fetchare correttamente le spese (frontend)
- Note generali:
  - Normalizza i campi ricevuti (es. importo come number).
  - Tenere conto di date in formati diversi: preferire ISO (YYYY-MM-DD).
  - Gestire errori di rete e stati di loading.
  - Usare min-width / min-width:0 e box-sizing per evitare overflow e overlap negli elementi di lista.

Esempio pratico (fetch GET + normalizzazione):

```js
async function fetchSpese() {
  try {
    const res = await fetch('/api/spese');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    // Normalizza importo a number e controlla campi
    return data.map(s => ({
      id: Number(s.id),
      descrizione: String(s.descrizione ?? ''),
      importo: Number(s.importo ?? 0),
      data_spesa: String(s.data_spesa ?? new Date().toISOString().slice(0,10)),
      categoria: String(s.categoria ?? 'OTHERS'),
      tipo: s.tipo === 'ENTRATA' ? 'ENTRATA' : 'USCITA'
    }));
  } catch (err) {
    console.error('fetchSpese error', err);
    return [];
  }
}
```

Esempio POST per aggiungere una spesa:

```js
async function addSpesa(form) {
  const body = {
    descrizione: form.descrizione,
    importo: Number(form.importo),
    data_spesa: form.data_spesa, // preferibilmente YYYY-MM-DD
    categoria: form.categoria,
    tipo: form.tipo,
  };

  const res = await fetch('/api/spese', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Errore creazione spesa');
  return await res.json();
}
```

## Consigli per l'AI che ricrea il sito
- Seguire la separazione Server/Client Components di Next.js:
  - Qualsiasi componente che usa stato React, event handlers o styled-jsx deve avere in testa "use client".
  - API routes sono serverless functions (Server Components).
- CSS:
  - Usare CSS modulare o file .css importati (come homepage.css). Per styled-jsx assicurarsi che il componente sia client.
  - Aggiungere regole globali utili: box-sizing: border-box; min-width: 0; overflow handling per liste lunghe.
- Accessibilità:
  - Lista delle spese: aria-live="polite" quando i contenuti cambiano.
  - Pulsanti e link con aria-label quando necessario.
- Layout mobile:
  - Limitare max-height per la lista e abilitare overflow-y: auto; garantire spazio per scrollbar.
  - Evitare grid a troppi colonne su mobile: ridurre a 1-2 colonne.

## Esempio di normalizzazione data / calcolo mese corrente
```js
function monthKeyFromDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// Uso:
const currentMonth = monthKeyFromDate(new Date());
const spesaMonth = monthKeyFromDate(spesa.data_spesa);
```

## Test e validazione
- Testare con chunk di dati grandi per verificare overflow/overlap.
- Testare date non valide e importi come stringhe.
- Verificare comportamento offline / errori di rete.

---
File suggeriti per l'AI:
- src/app/dashboard/pages/home/page.tsx
- src/app/dashboard/pages/home/homepage.css
- src/app/loading.tsx
- src/app/api/spese/route.ts (o index.js) - implementazione GET/POST
- src/components/* (Modal, Navbar, FloatingMenu, Charts)

Fine. Usa questa guida per ricreare il progetto e per sapere come interrogare l'API correttamente.