import React, { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { FOCOS, CAMARAS, haversine, USO_COLORS, LINE_COLORS } from '../data/focos'

const FOCOS_WITH_DIST = FOCOS.map(f => ({
  ...f,
  dist: haversine(f.lat1, f.lon1, f.lat2, f.lon2),
}))

function makeIcon(id, type, hl = false) {
  const sz = hl ? 28 : 22
  const fs = hl ? 11 : 9
  return L.divIcon({
    className: '',
    html: `<div class="mk-${type}${hl ? ' hl' : ''}" style="width:${sz}px;height:${sz}px;font-size:${fs}px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-family:'DM Mono',monospace;font-weight:500;color:white;">${id}</div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  })
}

export default function MapView({ selectedId, onSelect, cameraFilter, linesVisible, layers }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersIPRef = useRef({})
  const markersIARef = useRef({})
  const linesRef = useRef({})
  const cameraMarkersRef = useRef({})
  const cameraLinesRef = useRef({})
  const gisRef = useRef({ usos: null, lineas: null, campos: null })
  const prevSelectedRef = useRef(null)

  const getProp = useCallback((obj, ...keys) => {
    for (const key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key]
    }
    return null
  }, [])

  const getVisibleCamaras = useCallback(() => {
    return cameraFilter === 'all' ? CAMARAS : CAMARAS.filter(c => c.id === cameraFilter)
  }, [cameraFilter])

  // Init map once
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(containerRef.current).setView([-28.45, -57.95], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map

    // Load GIS layers
    Promise.all([
      fetch('/data/usos.json').then(r => r.json()),
      fetch('/data/lineas.json').then(r => r.json()),
      fetch('/data/campos.json').then(r => r.json()),
    ]).then(([usos, lineas, campos]) => {
      gisRef.current.usos = L.geoJSON(usos, {
        style: f => ({
          fillColor: USO_COLORS[getProp(f.properties, 'tipouso', 'TIPOUSO')] || '#aaa',
          fillOpacity: 0.55,
          color: '#666',
          weight: 0.4,
          opacity: 0.6,
        }),
        onEachFeature: (f, layer) => {
          const p = f.properties
          const tipoUso = getProp(p, 'tipouso', 'TIPOUSO') || '—'
          const supHa = getProp(p, 'sup_ha', 'SUP_HA')
          const especie = getProp(p, 'especie', 'ESPECIE')
          const rodal = getProp(p, 'rodal', 'RODAL', 'COD_RODAL')
          layer.bindTooltip(
            `<b>${tipoUso}</b><br>${supHa ?? '—'} ha${especie ? ' — ' + especie : ''}${rodal ? ' — Rodal ' + rodal : ''}`,
            { sticky: true, opacity: 0.95 }
          )
        },
      }).addTo(map)

      gisRef.current.lineas = L.geoJSON(lineas, {
        style: f => ({
          color: LINE_COLORS[getProp(f.properties, 'tipo', 'TIPO')] || '#888',
          weight: getProp(f.properties, 'tipo', 'TIPO') === 'Camino principal' ? 2.5 : 1.5,
          opacity: 0.85,
        }),
        onEachFeature: (f, layer) => {
          const p = f.properties
          const tipo = getProp(p, 'tipo', 'TIPO') || 'Línea'
          const metros = getProp(p, 'metros', 'METROS')
          layer.bindTooltip(
            `<b>${tipo}</b><br>${((metros || 0) / 1000).toFixed(2)} km`,
            { sticky: true, opacity: 0.95 }
          )
        },
      }).addTo(map)

      gisRef.current.campos = L.geoJSON(campos, {
        style: {
          fillColor: 'transparent',
          fillOpacity: 0,
          color: '#1a1916',
          weight: 2.5,
          opacity: 0.9,
          dashArray: '8,4',
        },
      }).addTo(map)
    })

    // Add focos markers
    FOCOS_WITH_DIST.forEach(f => {
      const mip = L.marker([f.lat1, f.lon1], { icon: makeIcon(f.id, 'ip'), zIndexOffset: 500 }).addTo(map)
      const mia = L.marker([f.lat2, f.lon2], { icon: makeIcon(f.id, 'ia'), zIndexOffset: 500 }).addTo(map)
      const ln = L.polyline([[f.lat1, f.lon1], [f.lat2, f.lon2]], {
        color: '#555', weight: 1.5, dashArray: '5,4', opacity: 0.6,
      }).addTo(map)

      mip.on('click', () => onSelect(f.id))
      mia.on('click', () => onSelect(f.id))
      ln.on('click', () => onSelect(f.id))

      markersIPRef.current[f.id] = mip
      markersIARef.current[f.id] = mia
      linesRef.current[f.id] = ln
    })

    CAMARAS.forEach((cam, idx) => {
      const marker = L.circleMarker([cam.lat, cam.lon], {
        radius: 7,
        color: '#8a0022',
        weight: 2,
        fillColor: '#d61b4b',
        fillOpacity: 0.85,
      }).addTo(map)
      marker.bindTooltip(`<b>${cam.nombre}</b><br>${cam.etiqueta}`, { sticky: true, opacity: 0.95 })
      marker.bindPopup(`<b>${cam.nombre}</b><br>Posición ${idx + 1}`)
      cameraMarkersRef.current[cam.id] = marker
    })

    // Legend
    const legend = L.control({ position: 'bottomleft' })
    legend.onAdd = () => {
      const div = L.DomUtil.create('div')
      div.style.cssText = 'background:white;padding:8px 10px;border-radius:5px;border:1px solid #ccc;font-size:11px;font-family:monospace;line-height:1.9;max-width:170px;'
      div.innerHTML = '<b style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;">Uso del suelo</b><br>' +
        Object.entries(USO_COLORS).map(([k, v]) =>
          `<span style="display:inline-block;width:10px;height:10px;background:${v};border-radius:2px;margin-right:5px;vertical-align:middle;"></span>${k}`
        ).join('<br>')
      return div
    }
    legend.addTo(map)

    // Initial fit
    const allCoords = [
      ...FOCOS_WITH_DIST.flatMap(f => [[f.lat1, f.lon1], [f.lat2, f.lon2]]),
      ...CAMARAS.map(c => [c.lat, c.lon]),
    ]
    map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] })
  }, [getProp, onSelect]) // eslint-disable-line

  // React to selectedId changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Deselect previous
    if (prevSelectedRef.current) {
      const pid = prevSelectedRef.current
      markersIPRef.current[pid]?.setIcon(makeIcon(pid, 'ip', false))
      markersIARef.current[pid]?.setIcon(makeIcon(pid, 'ia', false))
    }

    if (selectedId) {
      markersIPRef.current[selectedId]?.setIcon(makeIcon(selectedId, 'ip', true))
      markersIARef.current[selectedId]?.setIcon(makeIcon(selectedId, 'ia', true))
      const f = FOCOS_WITH_DIST.find(x => x.id === selectedId)
      if (f) {
        const boundsCoords = [[f.lat1, f.lon1], [f.lat2, f.lon2], ...getVisibleCamaras().map(c => [c.lat, c.lon])]
        map.fitBounds(L.latLngBounds(boundsCoords), { padding: [100, 100] })
      }
    } else {
      const allCoords = [
        ...FOCOS_WITH_DIST.flatMap(f => [[f.lat1, f.lon1], [f.lat2, f.lon2]]),
        ...CAMARAS.map(c => [c.lat, c.lon]),
      ]
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] })
    }

    prevSelectedRef.current = selectedId
  }, [selectedId, getVisibleCamaras])

  // Toggle connection lines
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    Object.values(linesRef.current).forEach(l => {
      linesVisible ? l.addTo(map) : map.removeLayer(l)
    })
  }, [linesVisible])

  // Toggle GIS layers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    Object.entries(layers).forEach(([key, visible]) => {
      const layer = gisRef.current[key]
      if (!layer) return
      visible ? layer.addTo(map) : map.removeLayer(layer)
    })
  }, [layers])

  // Draw red straight lines from selected cameras to selected foco
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    Object.values(cameraLinesRef.current).forEach(line => map.removeLayer(line))
    cameraLinesRef.current = {}

    if (!selectedId) return
    const foco = FOCOS_WITH_DIST.find(f => f.id === selectedId)
    if (!foco) return

    getVisibleCamaras().forEach(cam => {
      const line = L.polyline([[cam.lat, cam.lon], [foco.lat2, foco.lon2]], {
        color: '#d1002f',
        weight: 2.5,
        opacity: 0.95,
      }).addTo(map)
      line.bindTooltip(`${cam.nombre} → Foco #${foco.id}`, { sticky: true, opacity: 0.95 })
      cameraLinesRef.current[cam.id] = line
    })
  }, [selectedId, getVisibleCamaras])

  return <div ref={containerRef} style={{ flex: 1 }} />
}
