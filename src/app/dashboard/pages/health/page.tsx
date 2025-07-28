"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import "./health.css";

export default function HealthPage() {
  const [garmin, setGarmin] = useState<GarminData | null>(null);
  const [garminAll, setGarminAll] = useState<GarminData[]>([]);
type GarminData = { passi: number; battito_medio: number; distanza_totale: number; calorie_totali: number };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Prendi tutti i record garmin per la media
        const garminAllRes = await fetch('/api/health/garmin?all=1');
        let debugMsg = '';
        if (!garminAllRes.ok) {
          const err = await garminAllRes.json();
          debugMsg += `Garmin API: ${garminAllRes.status} - ${err.error || JSON.stringify(err)}\n`;
        }
        if (debugMsg) {
          throw new Error(debugMsg);
        }
        const garminAllData = await garminAllRes.json();
        setGarminAll(Array.isArray(garminAllData) ? garminAllData : []);
        setGarmin(Array.isArray(garminAllData) && garminAllData.length > 0 ? garminAllData[0] : null);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Errore nel recupero dati');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  // Calcola la media dei giorni precedenti (escludendo il valore corrente)
  function calcolaMediaPrecedente(key: keyof GarminData): number | null {
    if (!garminAll.length || garminAll.length < 2) return null;
    // Escludi il primo record (corrente)
    const vals = garminAll.slice(1).map(g => g[key]).filter(v => typeof v === 'number');
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  // Calcola la differenza percentuale rispetto alla media dei giorni precedenti
  function diffPercent(val: number | undefined | null, media: number | null): string {
    if (typeof val !== 'number' || media === null || media === 0) return '-';
    const perc = ((val - media) / media) * 100;
    const sign = perc > 0 ? '+' : '';
    return sign + perc.toFixed(1) + '%';
  }

  // ...existing code...

  return (
    <>
      <Navbar />
      <main className="health-main">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Caricamento...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : (
        <>
          {/* HEROSECTION: grid 3 card Steps, BPM, Calories */}
          <section className="herosection">
            <div className="herosection-grid">
              <div className="herosection-card">
                <div className="herosection-label">steps</div>
                <div className="herosection-value-wrapper">
                  <span className="herosection-value">{garmin?.passi ?? '-'}</span>
                  <img className="herosection-icon" src="/icons/noun-steps-7053264.png" alt="steps" />
                </div>
                <div className="herosection-diff">
                  <span className={(() => {
                    const diff = diffPercent(garmin?.passi, calcolaMediaPrecedente('passi'));
                    if (diff.startsWith('+')) return 'diff-positive';
                    if (diff.startsWith('-')) return 'diff-negative';
                    return '';
                  })()}>
                    {diffPercent(garmin?.passi, calcolaMediaPrecedente('passi'))} compared to the avg
                  </span>
                </div>
              </div>
              <div className="herosection-card">
                <div className="herosection-label">calories</div>
                <div className="herosection-value-wrapper">
                  <span className="herosection-value">{garmin?.calorie_totali ?? '-'}</span>
                  <img className="herosection-icon" src="/icons/noun-calories-7053264.png" alt="Calories" />
                </div>

                <div className="herosection-diff">
                  <span className={(() => {
                    const diff = diffPercent(garmin?.calorie_totali, calcolaMediaPrecedente('calorie_totali'));
                    if (diff.startsWith('+')) return 'diff-positive';
                    if (diff.startsWith('-')) return 'diff-negative';
                    return '';
                  })()}>
                    {diffPercent(garmin?.calorie_totali, calcolaMediaPrecedente('calorie_totali'))} compared to the avg
                  </span>
                </div>
              </div>
              <div className="herosection-card">
                <div className="herosection-label">bpm</div>
                <div className="herosection-value-wrapper">
                  <span className="herosection-value">{garmin?.battito_medio ?? '-'}</span>
                  <img className="herosection-icon" src="/icons/noun-heart-7053264.png" alt="heart" />
                </div>
                <div className="herosection-diff">
                  <span className={(() => {
                    const diff = diffPercent(garmin?.battito_medio, calcolaMediaPrecedente('battito_medio'));
                    if (diff.startsWith('+')) return 'diff-positive';
                    if (diff.startsWith('-')) return 'diff-negative';
                    return '';
                  })()}>
                    {diffPercent(garmin?.battito_medio, calcolaMediaPrecedente('battito_medio'))} compared to the avg
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      </main>
    </>
  );
}
