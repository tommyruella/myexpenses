"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Filter } from 'lucide-react';

const CATEGORIE = ["CIBO", "MEZZI", "GYM", "OTHERS"];

const PASTEL_COLORS = {
  primary: '#1a1a1a',
  secondary: '#6b7280',
  background: '#ffffff',
  surface: '#f8fafc',
  accent: '#e0e7ff',
  success: '#dcfce7',
  danger: '#fef2f2',
  warning: '#fef3c7',
  info: '#dbeafe',
  
  // Pastel chart colors
  chart: ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] as string[],
  
  // Category colors
  CIBO: '#fbbf24' as string,
  MEZZI: '#06b6d4' as string, 
  GYM: '#10b981' as string,
  OTHERS: '#a855f7' as string
} as const;

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

function getSaldoIniziale() {
  return 1000;
}

function calcolaSaldo(spese: Spesa[]) {
  let saldo = getSaldoIniziale();
  for (const s of spese) {
    saldo += s.tipo === "ENTRATA" ? Number(s.importo) : -Number(s.importo);
  }
  return saldo;
}

function getStats(spese: Spesa[]) {
  const totali: Record<string, number> = {};
  for (const cat of CATEGORIE) totali[cat] = 0;
  let entrate = 0,
    uscite = 0;
  for (const s of spese) {
    if (s.tipo === "USCITA") {
      totali[s.categoria] += Number(s.importo);
      uscite += Number(s.importo);
    } else {
      entrate += Number(s.importo);
    }
  }
  return { totali, entrate, uscite };
}

export default function Home() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [form, setForm] = useState({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: CATEGORIE[0],
    tipo: "USCITA" as "USCITA" | "ENTRATA",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'ENTRATA' | 'USCITA'>('ALL');

  useEffect(() => {
    fetchSpese();
  }, []);

  async function fetchSpese() {
    setLoading(true);
    try {
      const res = await fetch("/api/spese");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSpese(data);
      } else if (data && data.error) {
        setSpese([]);
        alert("Errore API: " + data.error);
      } else {
        setSpese([]);
        alert("Errore sconosciuto nella risposta API");
      }
    } catch (err) {
      setSpese([]);
      alert("Errore di rete o server: " + (err as Error).message);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/spese", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descrizione: form.descrizione,
        importo: parseFloat(form.importo),
        data_spesa: form.data_spesa,
        categoria: form.categoria,
        tipo: form.tipo,
      }),
    });
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: CATEGORIE[0], tipo: "USCITA" });
    setModal(false);
    fetchSpese();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch(`/api/spese/${id}`, { method: "DELETE" });
    fetchSpese();
  }

  const saldo = calcolaSaldo(spese);
  const stats = getStats(spese);
  
  // Prepare chart data
  const categoryData = CATEGORIE.map(cat => ({
    name: cat,
    value: stats.totali[cat],
    color: PASTEL_COLORS[cat as keyof Pick<typeof PASTEL_COLORS, 'CIBO' | 'MEZZI' | 'GYM' | 'OTHERS'>]
  })).filter(item => item.value > 0);

  const filteredSpese = spese.filter(spesa => 
    filterType === 'ALL' ? true : spesa.tipo === filterType
  );

  const monthlyData = spese.reduce((acc, spesa) => {
    const month = spesa.data_spesa.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, entrate: 0, uscite: 0 };
    }
    if (spesa.tipo === 'ENTRATA') {
      acc[month].entrate += spesa.importo;
    } else {
      acc[month].uscite += spesa.importo;
    }
    return acc;
  }, {} as Record<string, { month: string; entrate: number; uscite: number }>);

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Expenses</h1>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-fade-in">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Saldo Attuale</p>
            <div className="text-3xl font-bold mb-4">
              {showBalance ? (
                <span className={`transition-colors duration-300 ${saldo >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  €{saldo.toFixed(2)}
                </span>
              ) : (
                <span className="text-gray-400">••••••</span>
              )}
            </div>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2 mx-auto transition-transform hover:scale-110">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-500">Entrate</p>
                <p className="text-sm font-semibold text-green-600">€{stats.entrate.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mb-2 mx-auto transition-transform hover:scale-110">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xs text-gray-500">Uscite</p>
                <p className="text-sm font-semibold text-red-500">€{stats.uscite.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 && (
        <div className="max-w-md mx-auto px-4 pb-6 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spese per Categoria</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">€{item.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Trend */}
      {monthlyChartData.length > 1 && (
        <div className="max-w-md mx-auto px-4 pb-6 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Mensile</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="entrate" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uscite" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Entrate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Uscite</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="flex gap-2">
          {(['ALL', 'ENTRATA', 'USCITA'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'ALL' ? 'Tutti' : type === 'ENTRATA' ? 'Entrate' : 'Uscite'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="space-y-3">
          {filteredSpese.map((spesa, index) => (
            <div
              key={spesa.id}
              onClick={() => setActiveId(activeId === spesa.id ? null : spesa.id)}
              className={`bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer transform hover:scale-[1.01] animate-fade-in ${
                activeId === spesa.id
                  ? 'border-black shadow-lg scale-[1.02]'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125"
                      style={{ backgroundColor: PASTEL_COLORS[spesa.categoria as keyof Pick<typeof PASTEL_COLORS, 'CIBO' | 'MEZZI' | 'GYM' | 'OTHERS'>] }}
                    />
                    <span className="font-medium text-gray-900 truncate">{spesa.descrizione}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{new Date(spesa.data_spesa).toLocaleDateString('it-IT')}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{spesa.categoria}</span>
                  </div>
                </div>
                <div className={`text-lg font-semibold transition-colors duration-200 ${
                  spesa.tipo === 'ENTRATA' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {spesa.tipo === 'ENTRATA' ? '+' : '-'}€{spesa.importo.toFixed(2)}
                </div>
              </div>
              
              {activeId === spesa.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(spesa.id);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-all duration-200 disabled:opacity-50 hover:bg-red-50 px-3 py-2 rounded-lg -ml-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Elimina</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {filteredSpese.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-scale">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nessun movimento trovato</p>
              <p className="text-sm text-gray-400 mt-1">Tocca il pulsante + per aggiungerne uno</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 flex items-center justify-center z-50 hover:shadow-xl animate-pulse-scale"
        aria-label="Aggiungi movimento"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {modal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 animate-slide-up shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nuovo Movimento</h2>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45 transition-transform duration-200" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <input
                  type="text"
                  placeholder="Es. Spesa supermercato"
                  value={form.descrizione}
                  onChange={(e) => setForm(f => ({ ...f, descrizione: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importo</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.importo}
                  onChange={(e) => setForm(f => ({ ...f, importo: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={form.data_spesa}
                  onChange={(e) => setForm(f => ({ ...f, data_spesa: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                >
                  {CATEGORIE.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <div className="flex gap-3">
                  {(['USCITA', 'ENTRATA'] as const).map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tipo }))}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 ${
                        form.tipo === tipo
                          ? tipo === 'ENTRATA'
                            ? 'bg-green-50 border-green-200 text-green-700 scale-105'
                            : 'bg-red-50 border-red-200 text-red-700 scale-105'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      {tipo === 'ENTRATA' ? 'Entrata' : 'Uscita'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                'Salva Movimento'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
