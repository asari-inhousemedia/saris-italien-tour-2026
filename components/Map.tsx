"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const createIcon = (color: string, label: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="position:relative;width:28px;height:28px">
      <div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
      <div style="position:absolute;top:34px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:600;color:#2C1810;text-shadow:0 0 4px white,0 0 4px white,0 0 4px white">${label}</div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });

const stops = [
  {
    name: "Tübingen",
    coords: [48.5216, 9.0576] as [number, number],
    day: "Start",
    color: "#2C1810",
    info: "Abfahrt am 29. Mai",
  },
  {
    name: "Pisa",
    coords: [43.7228, 10.4017] as [number, number],
    day: "Tag 1",
    color: "#C45A3C",
    info: "Schiefer Turm besichtigen",
  },
  {
    name: "Castellare di Tonda",
    coords: [43.4683, 10.9167] as [number, number],
    day: "Tag 1–2",
    color: "#D4A843",
    info: "2 Nächte in der Toskana",
  },
  {
    name: "Florenz",
    coords: [43.7696, 11.2558] as [number, number],
    day: "Tag 3",
    color: "#C45A3C",
    info: "Ponte Vecchio, Duomo, Hop-on Hop-off",
  },
  {
    name: "Siena",
    coords: [43.3188, 11.3308] as [number, number],
    day: "Tag 4",
    color: "#5C6B4E",
    info: "Optional: Piazza del Campo",
  },
  {
    name: "Piombino",
    coords: [42.9264, 10.5286] as [number, number],
    day: "Tag 4",
    color: "#D4A843",
    info: "Hotel am Fährhafen",
  },
  {
    name: "Elba — Ortano",
    coords: [42.8003, 10.4117] as [number, number],
    day: "Tag 5–7",
    color: "#C45A3C",
    info: "3 Nächte All-Inclusive",
  },
];

const routeCoords = stops.map((s) => s.coords);

export default function RouteMap() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MapContainer
      center={[44.5, 10.5]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: "#C45A3C",
          weight: 3,
          dashArray: "8 6",
          opacity: 0.7,
        }}
      />
      {stops.map((stop) => (
        <Marker
          key={stop.name}
          position={stop.coords}
          icon={createIcon(stop.color, stop.name)}
        >
          <Popup>
            <div
              style={{
                fontFamily: "system-ui",
                textAlign: "center",
                padding: "4px",
              }}
            >
              <strong
                style={{
                  fontSize: "14px",
                  color: "#C45A3C",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {stop.name}
              </strong>
              <span
                style={{
                  fontSize: "11px",
                  color: "#8B7D6B",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {stop.day}
              </span>
              <span style={{ fontSize: "12px", color: "#2C1810" }}>
                {stop.info}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
