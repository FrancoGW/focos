import React from 'react'
import { haversine, fmtDist, distColor, FOCOS } from '../data/focos'

const FOCOS_WITH_DIST = FOCOS.map(f => ({
  ...f,
  dist: haversine(f.lat1, f.lon1, f.lat2, f.lon2),
  dLat: Math.abs(f.lat2 - f.lat1),
  dLon: Math.abs(f.lon2 - f.lon1),
  dHora: Math.abs(parseInt(f.hIP.replace(':', '')) - parseInt(f.hIA.replace(':', ''))),
}))

const MAX_DIST = Math.max(...FOCOS_WITH_DIST.map(f => f.dist))

export default function ComparePanel({ selectedId }) {
  const f = selectedId ? FOCOS_WITH_DIST.find(x => x.id === selectedId) : null

  return (
    <div style={{
      width: 295, flexShrink: 0,
      background: 'var(--panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 12px', borderBottom: '1px solid var(--border)',
        background: 'var(--text)', color: 'var(--bg)', flexShrink: 0,
      }}>
        <h2 style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Comparación de sistemas
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {!f ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)', fontSize:12, textAlign:'center', gap:8 }}>
            <div style={{ fontSize: 28, opacity: 0.2 }}>⊕</div>
            <div>Seleccioná un foco<br />en el mapa o en la lista</div>
          </div>
        ) : (
          <FocoDetail f={f} />
        )}
      </div>
    </div>
  )
}

function FocoDetail({ f }) {
  const dc = distColor(f.dist)
  const dLatM = f.dLat * 111320
  const dLonM = f.dLon * 111320 * Math.cos(f.lat1 * Math.PI / 180)

  return (
    <>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, marginBottom: 2 }}>
        Foco #{f.id}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
        {f.fecha}
      </div>

      <SysBlock title="i_Protección" titleColor="#0d4a8a" bg="#e8f0fb" border="#b8d0f0">
        <Row k="Latitud"  v={f.lat1.toFixed(6)} />
        <Row k="Longitud" v={f.lon1.toFixed(6)} />
        <Row k="Hora"     v={f.hIP} />
      </SysBlock>

      <SysBlock title="Cámara IA" titleColor="#9c3318" bg="#faeae6" border="#f0c0b0">
        <Row k="Latitud"  v={f.lat2.toFixed(6)} />
        <Row k="Longitud" v={f.lon2.toFixed(6)} />
        <Row k="Hora"     v={f.hIA} />
      </SysBlock>

      <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:5, padding:12, margin:'10px 0', textAlign:'center' }}>
        <div style={{ fontSize:9, fontFamily:"'DM Mono', monospace", color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
          Distancia entre sistemas
        </div>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:24, fontWeight:500, color:dc }}>
          {fmtDist(f.dist)}
        </div>
        <div style={{ fontSize:10, color:'var(--muted)', marginTop:3 }}>
          {(f.dist / MAX_DIST * 100).toFixed(1)}% del máximo registrado
        </div>
      </div>

      <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:5, padding:10 }}>
        <div style={{ fontSize:9, fontFamily:"'DM Mono', monospace", color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
          Desglose de diferencias
        </div>
        <DiffRow label="ΔLat"  val={dLatM}  max={MAX_DIST} color={dc} fmt={fmtDist} />
        <DiffRow label="ΔLon"  val={dLonM}  max={MAX_DIST} color={dc} fmt={fmtDist} />
        <DiffRow label="ΔHora" val={f.dHora} max={60}      color="#888" fmt={v => `${v} min`} />
      </div>
    </>
  )
}

function SysBlock({ title, titleColor, bg, border, children }) {
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:5, padding:10, marginBottom:8 }}>
      <div style={{ fontSize:9, fontFamily:"'DM Mono', monospace", fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:titleColor, marginBottom:6 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
      <span style={{ color:'var(--muted)' }}>{k}</span>
      <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, fontWeight:500 }}>{v}</span>
    </div>
  )
}

function DiffRow({ label, val, max, color, fmt }) {
  const pct = Math.min(val / max * 100, 100).toFixed(0)
  return (
    <div style={{ display:'flex', alignItems:'center', fontSize:11, marginBottom:5, gap:6 }}>
      <span style={{ color:'var(--muted)', width:38, flexShrink:0 }}>{label}</span>
      <div style={{ flex:1, height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2 }} />
      </div>
      <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, fontWeight:500, minWidth:55, textAlign:'right' }}>
        {fmt(val)}
      </span>
    </div>
  )
}
