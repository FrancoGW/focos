import React from 'react'
import { FOCOS, haversine, fmtDist } from '../data/focos'

const dists = FOCOS.map(f => haversine(f.lat1, f.lon1, f.lat2, f.lon2))
const avg = dists.reduce((a, b) => a + b, 0) / dists.length
const max = Math.max(...dists)
const min = Math.min(...dists)
const maxF = FOCOS[dists.indexOf(max)]
const minF = FOCOS[dists.indexOf(min)]
const close = dists.filter(d => d < 2000).length

export default function StatsBar() {
  const st = { display:'flex', gap:5, alignItems:'baseline' }
  const sv = { fontSize:13, fontWeight:500 }
  const sk = { color:'#aaa9a2' }

  return (
    <div style={{
      background: 'var(--text)', color: 'var(--bg)',
      padding: '6px 16px',
      display: 'flex', gap: 20, alignItems: 'center',
      flexShrink: 0,
      fontFamily: "'DM Mono', monospace", fontSize: 10,
      flexWrap: 'wrap',
    }}>
      <div style={st}><span style={sv}>26</span><span style={sk}>focos</span></div>
      <div style={st}><span style={{...sv, color:'#9FE1CB'}}>{fmtDist(avg)}</span><span style={sk}>prom.</span></div>
      <div style={st}><span style={{...sv, color:'#F0997B'}}>{fmtDist(max)}</span><span style={sk}>máx #{maxF.id}</span></div>
      <div style={st}><span style={{...sv, color:'#9FE1CB'}}>{fmtDist(min)}</span><span style={sk}>mín #{minF.id}</span></div>
      <div style={st}><span style={{...sv, color:'#9FE1CB'}}>{close}</span><span style={sk}>coincidencias &lt;2km</span></div>
      <div style={st}><span style={sv}>8.000 ha</span><span style={sk}>San José · Santa Rosa</span></div>
    </div>
  )
}
