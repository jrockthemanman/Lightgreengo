```jsx
import React from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import TrafficLight from './components/TrafficLight'

// fix default icon path problems for some setups
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: undefined,
  iconUrl: undefined,
  shadowUrl: undefined,
})

export default function App() {
  // Example intersections (lat, lng) — change as you like
  const intersections = [
    { id: 'a', pos: [37.7749, -122.4194] }, // San Francisco
    { id: 'b', pos: [37.7756, -122.4180] },
    { id: 'c', pos: [37.7750, -122.4172] },
  ]

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer center={[37.7752, -122.4186]} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {intersections.map((it) => (
          <TrafficLight key={it.id} id={it.id} position={it.pos} />
        ))}
      </MapContainer>
    </div>
  )
}
```
