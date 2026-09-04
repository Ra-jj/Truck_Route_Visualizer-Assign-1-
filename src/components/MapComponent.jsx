import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routeData } from '../data/route';
import { useTruckSimulation } from '../hooks/useTruckSimulation';
import TruckStatusPanel from './TruckStatusPanel';
import { Truck, MapPin, CircleDot } from 'lucide-react';

// Truck icon
const truckIcon = new L.DivIcon({
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

// Component to handle auto-panning (Bonus polish)
const MapController = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.panTo([position.lat, position.lng], { animate: true, duration: 0.5 });
    }
  }, [position, map]);
  return null;
};

const MapComponent = ({ isDarkMode }) => {
  // Center map around Bangalore based on Origin coordinates
  const initialCenter = [routeData[0].lat, routeData[0].lng];
  const polylinePositions = routeData.map(point => [point.lat, point.lng]);

  const simulation = useTruckSimulation(routeData);

  const tileUrl = isDarkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full relative">
      <MapContainer center={initialCenter} zoom={12} className="w-full h-full">
        <MapController position={simulation.currentPosition} />
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
            position={
              simulation.isFinished 
                ? [simulation.currentPosition.lat + 0.0005, simulation.currentPosition.lng] 
                : [simulation.currentPosition.lat, simulation.currentPosition.lng]
            }
            icon={truckIcon}
            zIndexOffset={1000} // Keep truck on top
          >
            <Popup>Current Truck Location</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Title Overlay */}
      <div className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg z-[1000] border border-gray-100 dark:border-slate-700">
        <h1 className="text-gray-800 dark:text-gray-100 font-semibold text-lg tracking-wide flex items-center gap-2">
          <Truck size={20} className="text-indigo-600 dark:text-indigo-400" />
          Logistics Route Visualizer
        </h1>
      </div>

      {/* Legend Overlay */}
      <div className="absolute top-[10px] left-[10px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 rounded-xl shadow-lg z-[1000] border border-gray-100 dark:border-slate-700 flex flex-col gap-2 md:gap-3">
        <h3 className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0 md:mb-1">Legend</h3>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
          <CircleDot size={16} className="text-green-500" /> Origin
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
          <MapPin size={16} className="text-red-500" /> Delivery Point
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-indigo-600 dark:bg-indigo-500 rounded flex items-center justify-center">
            <Truck size={10} className="text-white" />
          </div> Truck (Live)
        </div>
      </div>

      <TruckStatusPanel 
        currentLegIndex={simulation.currentLegIndex}
        distanceCovered={simulation.distanceCovered}
        totalDistance={simulation.totalDistance}
        nextStop={simulation.nextStop}
        completedStops={simulation.completedStops}
        totalStops={simulation.totalStops}
        isPaused={simulation.isPaused}
        isFinished={simulation.isFinished}
        onPause={simulation.pause}
        onResume={simulation.resume}
        onReset={simulation.reset}
      />
    </div>
  );
};

export default MapComponent;
