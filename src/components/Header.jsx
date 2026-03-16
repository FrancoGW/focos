import React from 'react'

export default function Header() {
  return (
    <header style={{
      background: 'var(--text)',
      color: '#f5f3ee',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      borderBottom: '3px solid var(--ia)',
    }}>
      <div>
        <h1 style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Sistema de Detección de Focos de Incendio — Campo San José
        </h1>
        <div style={{ fontSize: 11, color: '#aaa9a2', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
          Corrientes, Argentina · Empresas Verdes Argentina S.A. · Feb/Mar 2026 · 26 focos
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge color="var(--ip)" label="i_Protección" />
        <Badge color="var(--ia)" label="Cámara IA" />
      </div>
    </header>
  )
}

function Badge({ color, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontFamily: "'DM Mono', monospace",
      padding: '4px 10px', borderRadius: 3, background: color, color: 'white'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
      {label}
    </div>
  )
}
