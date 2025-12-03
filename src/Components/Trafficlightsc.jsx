```jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Marker, useMap } from 'react-leaflet'
import L from 'leaflet'

// Traffic light cycle settings (seconds)
const CYCLE = {
  green: 15,
  yellow: 3,
  red: 12,
}
const TOTAL = CYCLE.green + CYCLE.yellow + CYCLE.red

function getPhaseAndRemaining(t) {
  // t is seconds since cycle start
  const s = ((t % TOTAL) + TOTAL) % TOTAL
  if (s < CYCLE.green) return { phase: 'green', remaining: Math.ceil(CYCLE.green - s) }
  if (s < CYCLE.green + CYCLE.yellow) return { phase: 'yellow', remaining: Math.ceil(CYCLE.green + CYCLE.yellow - s) }
  return { phase: 'red', remaining: Math.ceil(TOTAL - s) }
}

export default function TrafficLight({ id, position }) {
  const map = useMap()
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const iv = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 500)
    return () => clearInterval(iv)
  }, [])

  // Create a divIcon whenever the state changes
  const icon = useMemo(() => {
    // We'll offset the cycle start by the id hash so different lights are out-of-phase
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const startOffset = hash % TOTAL
    const { phase, remaining } = getPhaseAndRemaining(now + startOffset)

    const color = phase === 'green' ? '#2ecc71' : phase === 'yellow' ? '#f1c40f' : '#e74c3c'

    const html = `
      <div class="traffic-light-root" style="display:flex;flex-direction:column;align-items:center;">
        <div class="traffic-light" style="width:34px;height:86px;border-radius:8px;background:#111;padding:6px;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;flex-direction:column;justify-content:space-between;">
          <div style="width:22px;height:22px;border-radius:50%;background:${phase === 'red' ? color : '#333'};margin:0 auto;"></div>
          <div style="width:22px;height:22px;border-radius:50%;background:${phase === 'yellow' ? color : '#333'};margin:0 auto;"></div>
          <div style="width:22px;height:22px;border-radius:50%;background:${phase === 'green' ? color : '#333'};margin:0 auto;"></div>
        </div>
        <div style="margin-top:6px;background:rgba(255,255,255,0.95);padding:2px 6px;border-radius:6px;font-weight:700;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
          ${remaining}
        </div>
      </div>
    `

    return L.divIcon({
      className: 'traffic-light-icon',
      html,
      iconSize: [40, 110],
      iconAnchor: [20, 110],
    })
  }, [id, now])

  return <Marker position={position} icon={icon} />
}
```
