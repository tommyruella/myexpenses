import React from "react";

interface BalanceCardsProps {
  saldo: number;
  entrate: number;
  uscite: number;
}

export default function BalanceCards({ saldo, entrate, uscite }: BalanceCardsProps) {
  return (
    <section style={{
      width: '100vw',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: 32,
      padding: '0 12px',
      marginTop: 32,
      marginBottom: 32,
      position: 'relative',
      minHeight: 180,
      fontFamily: 'inherit',
      paddingLeft: 100,
      paddingRight: 100,
    }}>
      {/* Balance a sinistra, occupa il 50% */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minWidth: 0,
        flex: '0 0 50%',
        maxWidth: '50%',
        position: 'relative',
      }}>
        <span style={{
          fontSize: 60,
          fontWeight: 800,
          letterSpacing: -1.5,
          color: '#181818',
          fontFamily: 'inherit',
          marginBottom: 2,
          paddingBottom: 10,
          lineHeight: 1.1,
        }}>current balance</span>
        <span style={{
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -2.5,
          color: '#181818',
          fontFamily: 'inherit',
          lineHeight: 1.05,
        }}>€{saldo.toFixed(2)}</span>
      </div>
      {/* Cards entrate/uscite insieme, occupano il 50% */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        gap: 16,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
      }}>
        {/* Card entrate minimal/bold */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          color: '#181818',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          fontFamily: 'inherit',
          position: 'relative',
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            opacity: 0.7,
            marginBottom: 8,
            alignSelf: 'flex-end',
            position: 'relative',
            top: '30px',
          }}>Entrate</span>
          <span style={{
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: -1.5,
            color: '#181818',
            fontFamily: 'inherit',
            lineHeight: 1.05,
            alignSelf: 'flex-end',
            position: 'relative',
            top: '30px',
          }}>+€{entrate.toFixed(2)}</span>
        </div>
        {/* Card uscite minimal/bold */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          color: '#181818',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          fontFamily: 'inherit',
          position: 'relative',
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            opacity: 0.7,
            marginBottom: 8,
            alignSelf: 'flex-end',
            position: 'relative',
            top: '30px',
          }}>Uscite</span>
          <span style={{
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: -1.5,
            color: '#181818',
            fontFamily: 'inherit',
            lineHeight: 1.05,
            alignSelf: 'flex-end',
            position: 'relative',
            top: '30px',
          }}>-€{uscite.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
