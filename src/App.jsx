import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import ComparePanel from './components/ComparePanel'
import StatsBar from './components/StatsBar'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [linesVisible, setLinesVisible] = useState(true)
  const [layers, setLayers] = useState({ usos: true, lineas: true, campos: true })

  const handleToggleLayer = useCallback((name) => {
    setLayers(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          selectedId={selectedId}
          onSelect={setSelectedId}
          linesVisible={linesVisible}
          onToggleLines={() => setLinesVisible(v => !v)}
          layers={layers}
          onToggleLayer={handleToggleLayer}
        />
        <MapView
          selectedId={selectedId}
          onSelect={setSelectedId}
          linesVisible={linesVisible}
          layers={layers}
        />
        <ComparePanel selectedId={selectedId} />
      </div>
      <StatsBar />
    </div>
  )
}
