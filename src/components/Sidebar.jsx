import React from 'react'
import { FOCOS, haversine, fmtDist, distClass } from '../data/focos'

const s = {
  sidebar: {
    width: 280, flexShrink: 0,
    background: 'var(--panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  section: {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  label: {
    fontSize: 10, fontFamily: "'DM Mono', monospace",
    color: 'var(--muted)', textTransform: 'uppercase',
    letterSpacing: '0.08em', display: 'block', marginBottom: 5,
  },
  select: {
    width: '100%', padding: '6px 8px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
    border: '1px solid var(--border)', borderRadius: 4,
    background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
  },
  btnRow: { display: 'flex', gap: 5, marginTop: 6 },
  btn: {
    flex: 1, padding: '6px 4px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
    borderRadius: 4, cursor: 'pointer',
    border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--text)',
    transition: 'all 0.15s',
  },
  btnActive: {
    background: 'var(--text)', color: 'var(--bg)',
  },
  list: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  item: (selected) => ({
    padding: '8px 12px', cursor: 'pointer',
    borderLeft: `3px solid ${selected ? 'var(--ip)' : 'transparent'}`,
    background: selected ? '#eef4fb' : 'transparent',
    display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.1s',
  }),
  num: {
    fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
    color: 'white', background: 'var(--text)',
    width: 20, height: 20, borderRadius: 3,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  layerRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 5, fontSize: 12, cursor: 'pointer',
  },
}

const FOCOS_WITH_DIST = FOCOS.map(f => ({
  ...f,
  dist: haversine(f.lat1, f.lon1, f.lat2, f.lon2),
}))

export default function Sidebar({
  selectedId,
  onSelect,
  cameraFilter,
  onChangeCameraFilter,
  linesVisible,
  onToggleLines,
  layers,
  onToggleLayer,
}) {
  return (
    <div style={s.sidebar}>

      {/* Foco filter */}
      <div style={s.section}>
        <label style={s.label}>Filtrar foco</label>
        <select
          style={s.select}
          value={selectedId ?? 'all'}
          onChange={e => onSelect(e.target.value === 'all' ? null : parseInt(e.target.value))}
        >
          <option value="all">— Todos los focos —</option>
          {FOCOS_WITH_DIST.map(f => (
            <option key={f.id} value={f.id}>
              #{f.id} — {f.fecha} ({fmtDist(f.dist)})
            </option>
          ))}
        </select>
        <label style={{ ...s.label, marginTop: 8 }}>Camara de vigilancia</label>
        <select
          style={s.select}
          value={cameraFilter}
          onChange={e => onChangeCameraFilter(e.target.value)}
        >
          <option value="all">— Ambas camaras —</option>
          <option value="cam-1">Camara 1</option>
          <option value="cam-2">Camara 2</option>
        </select>
        <div style={s.btnRow}>
          <button style={s.btn} onClick={() => onSelect(null)}>Ver todos</button>
          <button
            style={{ ...s.btn, ...(!linesVisible ? s.btnActive : {}) }}
            onClick={onToggleLines}
          >
            {linesVisible ? 'Ocultar líneas' : 'Mostrar líneas'}
          </button>
        </div>
      </div>

      {/* Layer controls */}
      <div style={s.section}>
        <label style={s.label}>Capas GIS</label>
        <LayerRow id="usos" label="Uso del suelo"
          swatch={<div style={{ width:14,height:14,borderRadius:2,background:'#5a8a3a',opacity:.75,border:'1px solid #3a6a1a' }} />}
          checked={layers.usos} onChange={() => onToggleLayer('usos')} />
        <LayerRow id="lineas" label="Caminos / líneas"
          swatch={<div style={{ width:14,height:4,borderRadius:0,background:'#8B4513',border:'1px solid #5a2a00',margin:'5px 0' }} />}
          checked={layers.lineas} onChange={() => onToggleLayer('lineas')} />
        <LayerRow id="campos" label="Límite del campo"
          swatch={<div style={{ width:14,height:14,borderRadius:2,background:'transparent',border:'2px dashed #1a1916' }} />}
          checked={layers.campos} onChange={() => onToggleLayer('campos')} />
      </div>

      {/* Foco list */}
      <div style={s.list}>
        {FOCOS_WITH_DIST.map(f => (
          <div
            key={f.id}
            style={s.item(selectedId === f.id)}
            onClick={() => onSelect(f.id)}
            onMouseEnter={e => { if (selectedId !== f.id) e.currentTarget.style.background = 'var(--bg)' }}
            onMouseLeave={e => { if (selectedId !== f.id) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={s.num}>{f.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 500 }}>{f.fecha}</div>
              <div className={distClass(f.dist)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, marginTop: 1 }}>
                {fmtDist(f.dist)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LayerRow({ id, label, swatch, checked, onChange }) {
  return (
    <label style={s.layerRow} htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ cursor: 'pointer' }} />
      {swatch}
      <span>{label}</span>
    </label>
  )
}
