"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Activity, CreditCard, Sparkles, Grid, Layers } from 'lucide-react';

const CATEGORIES = ["FOOD", "TRANSPORT", "FITNESS", "MISC"];

const THEME = {
  gradients: {
    primary: 'var(--gradient-primary)',
    secondary: 'var(--gradient-secondary)', 
    surface: 'var(--gradient-surface)',
    accent: 'var(--gradient-accent)',
    success: 'var(--gradient-success)',
    danger: 'var(--gradient-danger)',
  },
  colors: {
    background: '#0a0a0a',
    surface: '#121212',
    border: '#1f1f1f',
    text: '#fafafa',
    textMuted: '#a3a3a3',
    textDimmed: '#525252',
  },
  categories: {
    FOOD: '#f97316',
    TRANSPORT: '#06b6d4',
    FITNESS: '#10b981',
    MISC: '#8b5cf6'
  },
  chartColors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
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
  for (const cat of CATEGORIES) totali[cat] = 0;
  let entrate = 0, uscite = 0;
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
    categoria: CATEGORIES[0],
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
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: CATEGORIES[0], tipo: "USCITA" });
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
  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: stats.totali[cat],
    color: THEME.categories[cat as keyof typeof THEME.categories]
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
    <div className="page-background">
      {/* Header */}
      <header className="glass-surface border-primary border-b sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="header-icon flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Flux</h1>
                <p className="text-xs text-secondary">Expense Tracker</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="icon-button"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Balance Card */}
        <div className="balance-card glass-surface card-shadow">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-secondary" />
              <p className="text-sm text-secondary font-medium">Current Balance</p>
            </div>
            <div className="text-4xl font-mono font-bold leading-none">
              {showBalance ? (
                <span className={`text-gradient ${saldo >= 0 ? 'success' : 'danger'}`}>
                  €{saldo.toFixed(2)}
                </span>
              ) : (
                <span className="text-secondary">••••••</span>
              )}
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon success">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-secondary">Income</p>
                  <p className="text-sm font-semibold text-success">€{stats.entrate.toFixed(2)}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon danger">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-secondary">Expenses</p>
                  <p className="text-sm font-semibold text-danger">€{stats.uscite.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards Grid */}
        {Object.entries(stats.totali).some(([_, value]) => value > 0) && (
          <div className="card-grid">
            {Object.entries(stats.totali)
              .filter(([_, value]) => value > 0)
              .map(([category, amount], index) => (
                <div 
                  key={category} 
                  className="category-card glass-surface card-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="category-dot"
                        style={{ backgroundColor: THEME.categories[category as keyof typeof THEME.categories] }}
                      />
                      <span className="text-sm font-medium text-primary">{category}</span>
                    </div>
                    <Activity className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-primary">
                    €{amount.toFixed(0)}
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-bar-fill"
                      style={{ 
                        width: `${(amount / Math.max(...Object.values(stats.totali))) * 100}%`,
                        backgroundColor: THEME.categories[category as keyof typeof THEME.categories]
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Charts Section */}
        {categoryData.length > 0 && (
          <div className="chart-container glass-surface card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Grid className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">Category Breakdown</h3>
            </div>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {categoryData.map((item, index) => (
                <div key={item.name} className="legend-item">
                  <div 
                    className="legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-secondary">{item.name}</span>
                  <span className="text-xs font-mono font-medium text-primary ml-auto">
                    €{item.value.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Trend */}
        {monthlyChartData.length > 1 && (
          <div className="chart-container glass-surface card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">Monthly Trend</h3>
            </div>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#a3a3a3' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#a3a3a3' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="entrate" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#incomeGradient)"
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uscite" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                <span className="text-xs text-secondary">Income</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: '#ef4444' }} />
                <span className="text-xs text-secondary">Expenses</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="filter-container">
          {(['ALL', 'ENTRATA', 'USCITA'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`filter-button ${filterType === type ? 'active' : ''}`}
            >
              {type === 'ALL' ? 'All' : type === 'ENTRATA' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="transactions-list">
          {filteredSpese.map((spesa, index) => (
            <div
              key={spesa.id}
              onClick={() => setActiveId(activeId === spesa.id ? null : spesa.id)}
              className={`transaction-item glass-surface card-shadow ${
                activeId === spesa.id ? 'active' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="category-indicator"
                      style={{ backgroundColor: THEME.categories[spesa.categoria as keyof typeof THEME.categories] }}
                    />
                    <span className="transaction-title">{spesa.descrizione}</span>
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-date">
                      {new Date(spesa.data_spesa).toLocaleDateString('en-US')}
                    </span>
                    <span className="transaction-separator">•</span>
                    <span className="transaction-category">{spesa.categoria}</span>
                  </div>
                </div>
                <div className={`transaction-amount ${spesa.tipo.toLowerCase()}`}>
                  {spesa.tipo === 'ENTRATA' ? '+' : '-'}€{spesa.importo.toFixed(2)}
                </div>
              </div>
              
              {activeId === spesa.id && (
                <div className="transaction-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(spesa.id);
                    }}
                    disabled={loading}
                    className="delete-button"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {filteredSpese.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <CreditCard className="w-8 h-8" />
              </div>
              <p className="empty-title">No transactions found</p>
              <p className="empty-subtitle">Tap the + button to add your first transaction</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setModal(true)}
        className="fab"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {modal && (
        <div 
          className="modal-overlay"
          onClick={() => setModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="modal-content glass-surface"
          >
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-icon">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="modal-title">New Transaction</h2>
              </div>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="icon-button"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  value={form.descrizione}
                  onChange={(e) => setForm(f => ({ ...f, descrizione: e.target.value }))}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.importo}
                  onChange={(e) => setForm(f => ({ ...f, importo: e.target.value }))}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={form.data_spesa}
                  onChange={(e) => setForm(f => ({ ...f, data_spesa: e.target.value }))}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}
                  required
                  className="form-input"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="type-buttons">
                  {(['USCITA', 'ENTRATA'] as const).map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tipo }))}
                      className={`type-button ${form.tipo === tipo ? 'active' : ''} ${tipo.toLowerCase()}`}
                    >
                      {tipo === 'ENTRATA' ? 'Income' : 'Expense'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  Saving...
                </div>
              ) : (
                'Save Transaction'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
