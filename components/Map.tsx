"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const icons: Record<string, string> = {
  home: `<path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21V13h6v8" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  tower: `<rect x="9" y="4" width="6" height="17" rx="0.5" fill="none" stroke="white" stroke-width="1.8"/><line x1="9" y1="8" x2="15" y2="8" stroke="white" stroke-width="1.2"/><line x1="9" y1="12" x2="15" y2="12" stroke="white" stroke-width="1.2"/><circle cx="12" cy="16" r="1.2" fill="white"/>`,
  tree: `<path d="M12 3C9 3 7 5.5 7 8.5c0 2.5 1.5 4.5 3.5 5.5H12m0-11c3 0 5 2.5 5 5.5 0 2.5-1.5 4.5-3.5 5.5H12m0-11v11m0 0v5" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"/>`,
  church: `<path d="M12 3v4M10 5h4M6 21V11l6-4 6 4v10H6z" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="15" width="4" height="6" fill="none" stroke="white" stroke-width="1.5"/>`,
  castle: `<path d="M4 21V13h4V9h8v4h4v8H4z" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="6" width="2" height="3" fill="white" opacity="0.8"/><rect x="11" y="6" width="2" height="3" fill="white" opacity="0.8"/><rect x="16" y="6" width="2" height="3" fill="white" opacity="0.8"/>`,
  anchor: `<circle cx="12" cy="6" r="2.5" fill="none" stroke="white" stroke-width="1.8"/><line x1="12" y1="8.5" x2="12" y2="21" stroke="white" stroke-width="1.8"/><path d="M5 17c0-3.9 3.1-7 7-7s7 3.1 7 7" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="3.5" x2="15" y2="3.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>`,
  palm: `<path d="M12 8v13" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M12 8c-3-4-7-3-8-1 2-1 5 0 8 1z" fill="white" opacity="0.85"/><path d="M12 8c3-4 7-3 8-1-2-1-5 0-8 1z" fill="white" opacity="0.85"/><path d="M12 6c-4-2-7 0-7 2 1-1 4-1 7-2z" fill="white" opacity="0.7"/><path d="M12 6c4-2 7 0 7 2-1-1-4-1-7-2z" fill="white" opacity="0.7"/>`,
};

const createIcon = (color: string, label: string, icon: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="position:relative;width:22px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <svg width="22" height="32" viewBox="0 0 22 32">
        <path d="M11 0C5 0 0 4.8 0 10.7 0 18.7 11 32 11 32s11-13.3 11-21.3C22 4.8 17 0 11 0z" fill="${color}"/>
        <circle cx="11" cy="10.5" r="7" fill="rgba(0,0,0,0.15)"/>
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" style="position:absolute;top:4px;left:4px">
        ${icons[icon]}
      </svg>
      <div style="position:absolute;top:36px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:10px;font-weight:600;color:#2C1810;text-shadow:0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white">${label}</div>
    </div>`,
    iconSize: [22, 32],
    iconAnchor: [11, 32],
    popupAnchor: [0, -34],
  });

const stops = [
  {
    name: "Tübingen",
    coords: [48.5216, 9.0576] as [number, number],
    day: "Start",
    color: "#2C1810",
    icon: "home",
    info: "Abfahrt am 29. Mai",
  },
  {
    name: "Pisa",
    coords: [43.7228, 10.4017] as [number, number],
    day: "Tag 1",
    color: "#C45A3C",
    icon: "tower",
    info: "Schiefer Turm besichtigen",
  },
  {
    name: "Castellare di Tonda",
    coords: [43.4683, 10.9167] as [number, number],
    day: "Tag 1–2",
    color: "#5C6B4E",
    icon: "tree",
    info: "2 Nächte in der Toskana",
  },
  {
    name: "Florenz",
    coords: [43.7696, 11.2558] as [number, number],
    day: "Tag 3",
    color: "#C45A3C",
    icon: "church",
    info: "Ponte Vecchio, Duomo, Hop-on Hop-off",
  },
  {
    name: "Siena",
    coords: [43.3188, 11.3308] as [number, number],
    day: "Tag 4",
    color: "#D4A843",
    icon: "castle",
    info: "Optional: Piazza del Campo",
  },
  {
    name: "Piombino",
    coords: [42.9264, 10.5286] as [number, number],
    day: "Tag 4",
    color: "#4A7C9B",
    icon: "anchor",
    info: "Hotel am Fährhafen",
  },
  {
    name: "Elba — Ortano",
    coords: [42.8003, 10.4117] as [number, number],
    day: "Tag 5–7",
    color: "#C45A3C",
    icon: "palm",
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
          icon={createIcon(stop.color, stop.name, stop.icon)}
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
