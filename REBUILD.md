# Rebuild Guide — MyExpenses (Vanilla JS/CSS/HTML)

Questo documento ti guida a ricreare la home/dashboard del progetto in puro HTML, CSS e JavaScript, mantenendo lo stile attuale in tema chiaro, con blocchi flessibili e responsive. Include struttura, stile base, funzioni minime, API/variabili d’ambiente e deploy su Vercel.

## Obiettivi
- UI chiara e responsive, stessa gerarchia: saldo, in/out, lista spese, grafico.
- Distanza fissa tra i due blocchi in/out e allineamento verticale con il grafico.
- Nessuno scroll orizzontale su mobile; tipografia leggibile.
- Funzioni minime: lista spese (GET), aggiunta spesa (POST), grafico saldo.
- Deploy rapido su Vercel con variabili d’ambiente.

## Stack e dipendenze
- HTML5 + CSS3 + JavaScript (ES6+).
- Chart.js via CDN (per il grafico del saldo) — opzionale ma consigliato.
- Backend dati (scegline uno):
  1) Supabase (consigliato) via REST: più semplice per CRUD e persistenza.
  2) Vercel Serverless Functions (Node/Express-like) con un DB esterno o KV.

## Variabili d’ambiente (placeholders)
Non inserire chiavi reali nel codice. Usa variabili d’ambiente locali (.env) e su Vercel (Project Settings → Environment Variables).

Se usi Supabase (consigliato per il minimo prodotto):
- SUPABASE_URL= https://<YOUR-PROJECT>.supabase.co
- SUPABASE_ANON_KEY= <YOUR-SUPABASE-ANON-KEY>

Se abiliti autenticazione (opzionale):
- SUPABASE_SERVICE_ROLE= <YOUR-SUPABASE-SERVICE-ROLE-KEY> (solo lato server)

Se in futuro aggiungi integrazioni salute (opzionali):
- GARMIN_CLIENT_ID= <YOUR-GARMIN-CLIENT-ID>
- GARMIN_CLIENT_SECRET= <YOUR-GARMIN-CLIENT-SECRET>
- WEBHOOK_SECRET= <YOUR-WEBHOOK-SECRET>

Note sicurezza:
- Non commitare .env.
- Su Vercel definisci le env per gli ambienti Development/Preview/Production.

## Struttura minima del progetto
```
myexpenses-vanilla/
├─ public/
│  ├─ icons/ ... (svg/png opzionali)
│  └─ chart.js (CDN non necessario se usi <script src="...">)
├─ api/               # (solo se usi Vercel Functions)
│  ├─ spese/index.js  # GET/POST spese
│  └─ spese/[id].js   # DELETE/PUT spesa (opzionale)
├─ index.html         # Dashboard
├─ styles.css         # Stili
└─ app.js             # Logica UI + chiamate API
```

## HTML base (index.html)
```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MyExpenses</title>
    <link rel="stylesheet" href="./styles.css" />
    <!-- Chart.js (opzionale ma consigliato) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" defer></script>
    <script defer src="./app.js"></script>
  </head>
  <body>
    <nav class="navbar">
      <div class="logo">myexpenses</div>
      <button id="add-expense-btn" class="btn">+ add expense</button>
    </nav>

    <main class="dashboard-root">
      <div class="dashboard-grid">
        <!-- Riga 1: balance | in/out -->
        <section class="dashboard-balance-row">
          <div class="balance-block">
            <div class="balance-label">current balance</div>
            <div id="balance-value" class="balance-value">€0.00</div>
          </div>
          <div class="inout-blocks">
            <div class="single-inout-block">
              <div class="inout-label">in</div>
              <div class="inout-value"><span id="in-value">€0.00</span><span id="in-perc" class="percentage-inout"></span></div>
            </div>
            <div class="single-inout-block">
              <div class="inout-label muted">out</div>
              <div class="inout-value muted"><span id="out-value">€0.00</span><span id="out-perc" class="percentage-inout"></span></div>
            </div>
          </div>
        </section>

        <!-- Riga 2: expenses | chart -->
        <section class="dashboard-main-row">
          <div class="expenses-list-block">
            <div class="section-title">last expenses</div>
            <ul id="expenses-list" class="expenses-list"></ul>
          </div>
          <div class="chart-block">
            <div class="section-title">balance chart</div>
            <div class="balance-chart-container">
              <canvas id="balance-chart" height="220"></canvas>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal min (semplice) -->
    <dialog id="add-modal">
      <form id="add-form" method="dialog">
        <label>Descrizione <input name="descrizione" required /></label>
        <label>Importo <input name="importo" type="number" step="0.01" required /></label>
        <label>Data <input name="data_spesa" type="date" required /></label>
        <label>Categoria <input name="categoria" required /></label>
        <label>Tipo
          <select name="tipo">
            <option value="USCITA">USCITA</option>
            <option value="ENTRATA">ENTRATA</option>
          </select>
        </label>
        <menu>
          <button type="submit" class="btn">Salva</button>
          <button type="button" id="close-modal" class="btn ghost">Annulla</button>
        </menu>
      </form>
    </dialog>
  </body>
</html>
```

## Stili base (styles.css)
```css
:root {
  --main: #181818;
  --secondary: #666;
  --line: #eee;
  --gap: 32px;
  --inout-gap: 40px;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; overflow-x: hidden; color: var(--main); font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }

.navbar { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--line); }
.logo { font-weight:700; letter-spacing:-0.5px; }
.btn { padding:8px 12px; border:1px solid var(--main); background:#fff; color:var(--main); border-radius:8px; cursor:pointer; }
.btn.ghost { border-color: var(--secondary); color: var(--secondary); }

.dashboard-root { padding-inline: clamp(16px, 4vw, 48px); max-width: 1200px; margin: 0 auto; }
.dashboard-grid { display:grid; grid-template-columns: 1fr 1fr; grid-template-areas: "balance inout" "expenses chart"; column-gap: var(--gap); row-gap: var(--gap); }
.dashboard-balance-row, .dashboard-main-row { display: contents; }

.balance-block { grid-area: balance; display:flex; flex-direction:column; align-items:flex-start; }
.balance-label { font-size: clamp(28px, 5vw, 52px); letter-spacing:-2px; font-weight:700; }
.balance-value { font-size: clamp(20px, 3vw, 30px); letter-spacing:-1px; font-weight:700; }

.inout-blocks { grid-area: inout; display:grid; grid-auto-flow: column; grid-auto-columns:minmax(160px,1fr); gap: var(--inout-gap); align-items:start; }
.single-inout-block { display:flex; flex-direction:column; }
.inout-label { font-size: clamp(24px,4vw,42px); font-weight:700; letter-spacing:-1px; }
.inout-label.muted, .inout-value.muted { color: #999; }
.inout-value { font-size: clamp(18px, 3vw, 28px); font-weight:700; letter-spacing:-1px; white-space:nowrap; }
.percentage-inout { font-size: 14px; margin-left:8px; }

.expenses-list-block { grid-area: expenses; display:flex; flex-direction:column; align-items:flex-start; }
.section-title { font-size: clamp(24px, 4vw, 42px); font-weight:700; letter-spacing:-1.5px; }
.expenses-list { list-style:none; padding:0; margin:0; width:100%; max-width: 640px; }
.expense-item { display:grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 12px; padding:12px 0; border-bottom:1px solid var(--line); align-items:center; }
.expense-desc { font-size:14px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.expense-cat, .expense-amount { font-size:14px; text-align:center; }
.expense-date { font-size:12px; color:var(--secondary); text-align:right; }

.chart-block { grid-area: chart; display:flex; flex-direction:column; gap:12px; }
.balance-chart-container { width:100%; border: 1px solid var(--line); border-radius:12px; overflow:hidden; }

@media (max-width: 599px) {
  .dashboard-grid { grid-template-columns: 1fr; grid-template-areas: "balance" "inout" "expenses" "chart"; }
  .inout-blocks { grid-auto-flow: row; grid-template-columns: 1fr 1fr; }
}
```

## Logica minima (app.js)
```js
// Config: scegli backend. Qui esempio con Supabase REST + Chart.js.
const SUPABASE_URL = window.ENV?.SUPABASE_URL || ""; // injecta via <script> o sostituisci in build
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || "";
const SPESA_TABLE = "spese"; // colonne: id, descrizione(text), importo(decimal), data_spesa(date), categoria(text), tipo(text: 'USCITA'|'ENTRATA')

// Helpers Supabase REST
async function sbFetch(path, init = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...init.headers,
  };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function listSpese() {
  // order by data_spesa desc
  return sbFetch(`${SPESA_TABLE}?select=*&order=data_spesa.desc`);
}

async function addSpesa(spesa) {
  return sbFetch(`${SPESA_TABLE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(spesa),
  });
}

// UI bindings
const els = {
  balance: document.getElementById("balance-value"),
  inValue: document.getElementById("in-value"),
  outValue: document.getElementById("out-value"),
  inPerc: document.getElementById("in-perc"),
  outPerc: document.getElementById("out-perc"),
  list: document.getElementById("expenses-list"),
  addBtn: document.getElementById("add-expense-btn"),
  modal: document.getElementById("add-modal"),
  form: document.getElementById("add-form"),
};

let chart;

function renderList(spese = []) {
  els.list.innerHTML = spese.slice(0, 5).map(s => `
    <li class="expense-item">
      <span class="expense-desc">${s.descrizione}</span>
      <span class="expense-cat">${s.categoria}</span>
      <span class="expense-amount ${s.tipo === 'USCITA' ? 'out' : 'in'}">${s.tipo === 'USCITA' ? '-' : '+'}€${Number(s.importo).toFixed(2)}</span>
      <span class="expense-date">${String(s.data_spesa).slice(0,10)}</span>
    </li>
  `).join("");
}

function computeMetrics(spese = [], baseSaldo = 1200) {
  let saldo = baseSaldo;
  let inMonth = 0, outMonth = 0;
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  const history = [];
  const sorted = [...spese].sort((a,b) => String(a.data_spesa).localeCompare(String(b.data_spesa)));
  let run = baseSaldo;
  for (const s of sorted) {
    run += s.tipo === 'ENTRATA' ? Number(s.importo) : -Number(s.importo);
    history.push({ date: String(s.data_spesa).slice(0,10), saldo: run });
    if (String(s.data_spesa).startsWith(ym)) {
      if (s.tipo === 'ENTRATA') inMonth += Number(s.importo); else outMonth += Number(s.importo);
    }
  }
  saldo = run;
  return { saldo, inMonth, outMonth, history };
}

function renderChart(history) {
  const ctx = document.getElementById('balance-chart');
  if (!ctx || !window.Chart) return;
  const labels = history.map(h => h.date);
  const data = history.map(h => h.saldo);
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Saldo', data, borderColor: '#181818', tension: 0.25 }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { display: false } } }
  });
}

async function refresh() {
  try {
    const spese = await listSpese();
    renderList(spese);
    const { saldo, inMonth, outMonth, history } = computeMetrics(spese);
    els.balance.textContent = `€${saldo.toFixed(2)}`;
    els.inValue.textContent = `€${inMonth.toFixed(2)}`;
    els.outValue.textContent = `€${outMonth.toFixed(2)}`;
    renderChart(history.length ? history : [{ date: new Date().toISOString().slice(0,10), saldo: 1200 }]);
  } catch (e) {
    console.error(e);
  }
}

// Modal add
els.addBtn?.addEventListener('click', () => els.modal.showModal());
els.form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(els.form);
  const spesa = {
    descrizione: fd.get('descrizione'),
    importo: Number(fd.get('importo')),
    data_spesa: fd.get('data_spesa'),
    categoria: fd.get('categoria'),
    tipo: fd.get('tipo'),
  };
  try { await addSpesa(spesa); await refresh(); els.modal.close(); els.form.reset(); } catch (e) { console.error(e); }
});

document.getElementById('close-modal')?.addEventListener('click', () => els.modal.close());

// First load
refresh();
```

## Opzione B: API lato Vercel Functions (senza Supabase)
Se preferisci funzioni serverless, crea `api/spese/index.js` (GET/POST) e `api/spese/[id].js` (DELETE/PUT). Collega un DB esterno (es. Supabase/Postgres) o un KV. Invoca poi `/api/spese` da `app.js`.

Esempio firma endpoint:
- GET `/api/spese` → `[{ id, descrizione, importo, data_spesa, categoria, tipo }]`
- POST `/api/spese` → body JSON con i campi sopra, ritorna record creato.

## Deploy su Vercel
1) Installazione CLI (opzionale):
   - `npm i -g vercel`
2) Login: `vercel login`
3) Deploy iniziale: `vercel` (scegli il progetto/cartella)
4) Imposta variabili d’ambiente dal dashboard Vercel (Project → Settings → Environment Variables):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5) Promuovi a Production: `vercel --prod`

Note:
- Se usi funzioni in `api/`, Vercel le esporrà come `/api/...` automaticamente.
- Per cache/headers, puoi aggiungere `vercel.json` con configurazioni avanzate.

## Linee guida di stile
- Colori: `#181818` (testo), `#666` (secondario), `#eee` (linee), sfondo bianco.
- Tipografia: forte, con clamp per titoli (28–52px) e valori (18–30px), letter-spacing leggermente negativo.
- Layout: grid a due colonne su desktop (balance|in-out) / (expenses|chart); una colonna su mobile.
- Spaziature: gap principale 32px; gap in/out fisso 40px.
- Mobile: nessuno scroll orizzontale; contenitori `max-width:100%`.

## Modello dati
```
spese (
  id bigint primary key,
  descrizione text not null,
  importo numeric(12,2) not null,
  data_spesa date not null,
  categoria text not null,
  tipo text check (tipo in ('USCITA','ENTRATA')) not null
)
```

## Test rapido locale
- Apri `index.html` in un server statico (es. VS Code Live Server) per evitare CORS/file://.
- Inietta `window.ENV = { SUPABASE_URL: '...', SUPABASE_ANON_KEY: '...' }` con uno `<script>` inline in `index.html` durante lo sviluppo.

## TODO opzionali
- Autenticazione (Supabase Auth) e filtri utente.
- Categorie con colori.
- Paginazione/spinner.
- Accessibilità: focus states, aria-label per pulsanti.

---
Questa guida contiene placeholders per API keys: sostituisci con le tue chiavi nei rispettivi ambienti e non inserirle nel repository.
