"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface GarminData {
  id: number;
  data: string;
  passi: number;
  battito_medio: number;
  battito_riposo: number;
  calorie: number;
  distanza: number;
  created_at: string;
}

const HealthPage: React.FC = () => {
  const [garminData, setGarminData] = useState<GarminData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchGarminData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('dati_garmin')
        .select('*')
        .order('data', { ascending: false })
        .limit(30);

      if (error) throw error;

      setGarminData(data || []);
    } catch (error) {
      console.error('Errore nel recupero dati Garmin:', error);
      setError('Errore nel caricamento dei dati. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGarminData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('it-IT').format(num);
  };

  const getLatestData = () => {
    if (garminData.length === 0) return null;
    return garminData[0];
  };

  const calculateAverage = (field: keyof GarminData) => {
    if (garminData.length === 0) return 0;
    const validData = garminData.filter(item => typeof item[field] === 'number' && item[field] > 0);
    if (validData.length === 0) return 0;
    const sum = validData.reduce((acc, item) => acc + (item[field] as number), 0);
    return Math.round(sum / validData.length);
  };

  const latestData = getLatestData();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#ffffff", 
        padding: "40px 20px",
        fontFamily: "inherit"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", paddingTop: "100px" }}>
            <div style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              border: "2px solid #f3f3f3",
              borderTop: "2px solid #181818",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "16px"
            }}></div>
            <p style={{ 
              color: "#666", 
              margin: 0,
              fontSize: "16px"
            }}>
              Caricamento dati health...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#ffffff", 
      padding: "40px 20px",
      fontFamily: "inherit"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "50px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#181818",
            margin: "0 0 12px 0",
            letterSpacing: "-2px",
            lineHeight: 1.1
          }}>
            Health Dashboard
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#666",
            margin: 0,
            fontWeight: 400
          }}>
            I tuoi dati biometrici dal database
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px"
          }}>
            <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {latestData && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "50px"
          }}>
            {/* Passi */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "30px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#eee";
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#181818",
                margin: "0 0 16px 0"
              }}>
                Passi
              </h3>
              <p style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#181818",
                margin: "0 0 8px 0",
                letterSpacing: "-1px"
              }}>
                {formatNumber(latestData.passi)}
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                margin: 0
              }}>
                Media: {formatNumber(calculateAverage('passi'))}
              </p>
            </div>

            {/* Battito Medio */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "30px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#eee";
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#181818",
                margin: "0 0 16px 0"
              }}>
                Battito Cardiaco
              </h3>
              <p style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#181818",
                margin: "0 0 8px 0",
                letterSpacing: "-1px"
              }}>
                {latestData.battito_medio} bpm
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                margin: 0
              }}>
                Riposo: {latestData.battito_riposo} bpm
              </p>
            </div>

            {/* Calorie */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "30px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#eee";
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#181818",
                margin: "0 0 16px 0"
              }}>
                Calorie
              </h3>
              <p style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#181818",
                margin: "0 0 8px 0",
                letterSpacing: "-1px"
              }}>
                {formatNumber(latestData.calorie)}
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                margin: 0
              }}>
                Media: {formatNumber(calculateAverage('calorie'))}
              </p>
            </div>

            {/* Distanza */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "30px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#eee";
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#181818",
                margin: "0 0 16px 0"
              }}>
                Distanza
              </h3>
              <p style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#181818",
                margin: "0 0 8px 0",
                letterSpacing: "-1px"
              }}>
                {(latestData.distanza / 1000).toFixed(1)} km
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                margin: 0
              }}>
                Media: {(calculateAverage('distanza') / 1000).toFixed(1)} km
              </p>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #eee",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "30px",
            borderBottom: "1px solid #eee"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#181818",
              margin: "0 0 8px 0"
            }}>
              Storico Dati
            </h2>
            <p style={{
              fontSize: "14px",
              color: "#666",
              margin: 0
            }}>
              Ultimi 30 giorni
            </p>
          </div>

          {garminData.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <p style={{ color: "#999", margin: 0 }}>Nessun dato disponibile</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    <th style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Data
                    </th>
                    <th style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Passi
                    </th>
                    <th style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Battito
                    </th>
                    <th style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Calorie
                    </th>
                    <th style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Distanza
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: "#ffffff" }}>
                  {garminData.map((item, index) => (
                    <tr key={item.id} style={{
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index === 0 ? "#f8faff" : "#ffffff";
                    }}>
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        fontWeight: index === 0 ? 600 : 400,
                        color: "#181818"
                      }}>
                        {formatDate(item.data)}
                      </td>
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#181818"
                      }}>
                        {formatNumber(item.passi)}
                      </td>
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#181818"
                      }}>
                        {item.battito_medio} bpm
                        <span style={{ color: "#666", marginLeft: "8px" }}>
                          ({item.battito_riposo})
                        </span>
                      </td>
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#181818"
                      }}>
                        {formatNumber(item.calorie)}
                      </td>
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#181818"
                      }}>
                        {(item.distanza / 1000).toFixed(1)} km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={fetchGarminData}
            disabled={isLoading}
            style={{
              background: "#181818",
              color: "#ffffff",
              border: "1px solid #181818",
              borderRadius: "6px",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: isLoading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#181818";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = "#181818";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
          >
            {isLoading ? 'Aggiornamento...' : 'Aggiorna Dati'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
