// components/MapView.tsx
'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import amanaData from '@/lib/amanaData';

// Fix default marker assets
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Red stop icon
const stopDivIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Bigger, visible bus icon
const busDivIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FFD60A;
      border: 2px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    ">
      🚌
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

// Helper: recenter map when bus changes
function RecenterMap({ coordinates }: { coordinates: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, 14, { animate: true });
  }, [coordinates, map]);
  return null;
}

export default function MapView({ selectedBus }: { selectedBus: any }) {
  // Get route points for this bus
  const routePoints: LatLngTuple[] = useMemo(
    () =>
      (selectedBus?.bus_stops ?? []).map(
        (s: any) => [s.latitude, s.longitude] as LatLngTuple
      ),
    [selectedBus]
  );

  // Current bus location = first stop (you can change this logic)
  const busLocation =
    routePoints.length > 0 ? routePoints[0] : null;

  return (
    <MapContainer
      center={[3.1519, 101.7077]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ height: '430px', width: '100%' }}
      key={selectedBus?.id} // force rerender when bus changes
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Recenter map on selected bus */}
      {busLocation && <RecenterMap coordinates={busLocation} />}

      {/* Route polyline */}
      {routePoints.length > 1 && (
        <Polyline positions={routePoints} color="#111" weight={4} opacity={0.9} />
      )}

      {/* Stops */}
      {(selectedBus?.bus_stops ?? []).map((stop: any) => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={stopDivIcon}
        >
          <Popup>
            <div
              className="text-sm text-center text-white font-semibold p-2 rounded-md"
              style={{ backgroundColor: "rgba(220, 38, 38, 0.85)" }}
            >
              <div className="text-lg mb-1">{stop.name}</div>
              <div>Next Bus Arrival Time: {stop.estimated_arrival}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Bus location */}
      {busLocation && (
        <Marker position={busLocation} icon={busDivIcon}>
          <Popup>
            <div
              className="text-sm text-center text-white font-semibold p-2 rounded-md"
              style={{ backgroundColor: "rgba(193, 204, 42, 1)" }}
            >
              <div className="text-lg mb-1">{selectedBus?.name}</div>
              <div>Status: {selectedBus?.status}</div>
              <div>Capacity: {selectedBus?.passengers?.capacity ?? "N/A"}</div>
              <div>
                Next Stop:{" "}
                {selectedBus?.bus_stops.find((s: any) => s.is_next_stop)?.name ?? "N/A"}
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
