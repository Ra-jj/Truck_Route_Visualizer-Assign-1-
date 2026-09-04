import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routeData } from '../data/route';
import { useTruckSimulation } from '../hooks/useTruckSimulation';
import TruckStatusPanel from './TruckStatusPanel';
import ControlToolbar from './ControlToolbar';

// Truck icon factory
const getTruckIcon = (isFinished) => new L.DivIcon({
  className: 'custom-icon',
  html: `
    <div style="
      background-color: #4f46e5; /* Indigo 600 */
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 2px solid white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      ${isFinished ? 'transform: translate(-35px, -25px);' : ''}
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 17h4V5H2v12h3"></path>
        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path>
        <path d="M14 17h1"></path>
        <circle cx="7.5" cy="17.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom icons for markers
const createCustomIcon = (color, type) => {
  if (type === 'origin') {
    return new L.DivIcon({
      className: 'custom-icon',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  // Pin marker for delivery points
  return new L.DivIcon({
    className: 'custom-icon',
    html: `
      <div style="
        position: relative;
        width: 24px;
        height: 32px;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          background-color: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: 6px;
          left: 6px;
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          z-index: 2;
        "></div>
      </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
  });
};

const iconColors = {
  origin: '#22c55e', // Green
  d1: '#ef4444',    // Red
  d2: '#f97316',    // Orange
  d3: '#64748b'     // Gray
};

const MapComponent = ({ isDarkMode, onToggleTheme }) => {
  // Center map around Bangalore based on Origin coordinates
  const initialCenter = [routeData[0].lat, routeData[0].lng];
  const polylinePositions = routeData.map(point => [point.lat, point.lng]);

  const simulation = useTruckSimulation(routeData);

  // Switched completely away from CartoDB to OSM as the sole provider
  const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="w-full h-full relative">
      <MapContainer center={initialCenter} zoom={12} zoomControl={false} className="w-full h-full">
        <ZoomControl position="bottomleft" />
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className={isDarkMode ? "map-tiles-dark-mode" : ""}
        />

        {/* Draw dashed polyline connecting points */}
        <Polyline 
          positions={polylinePositions} 
          color="#3b82f6" 
          weight={4} 
          dashArray="10, 10" 
          opacity={0.8}
        />

        {/* Render markers for each point */}
        {routeData.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]}
            icon={createCustomIcon(iconColors[point.status], point.status)}
          >
            <Popup>
              <strong>{point.name}</strong>
            </Popup>
          </Marker>
        ))}

        {/* Animated Truck Marker */}
        {simulation.currentPosition && (
          <Marker 
            position={[simulation.currentPosition.lat, simulation.currentPosition.lng]}
            icon={getTruckIcon(simulation.isFinished)}
            zIndexOffset={1000} // Keep truck on top
          >
            <Popup>Current Truck Location</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Top Left Minimal Legend Pill */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-full shadow-lg z-[1000] border border-gray-100 dark:border-slate-700/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-indigo-600 dark:bg-indigo-500"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Truck</span>
        </div>
      </div>

      <ControlToolbar 
        isPaused={simulation.isPaused}
        isFinished={simulation.isFinished}
        isDarkMode={isDarkMode}
        onPause={simulation.pause}
        onResume={simulation.resume}
        onReset={simulation.reset}
        onToggleTheme={onToggleTheme}
      />

      <TruckStatusPanel 
        currentLegIndex={simulation.currentLegIndex}
        distanceCovered={simulation.distanceCovered}
        totalDistance={simulation.totalDistance}
        nextStop={simulation.nextStop}
        completedStops={simulation.completedStops}
        totalStops={simulation.totalStops}
        isPaused={simulation.isPaused}
        isFinished={simulation.isFinished}
      />
    </div>
  );
};

export default MapComponent;
