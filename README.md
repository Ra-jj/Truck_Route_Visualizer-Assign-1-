# Logistics Truck Route Visualizer

![Route Visualizer](https://via.placeholder.com/1200x600.png?text=Logistics+Truck+Route+Visualizer) 

A high-performance, responsive React application built as a frontend assignment submission. It simulates real-time truck tracking along a predefined delivery route, demonstrating strong component architecture, custom state management, and an eye for premium UI/UX.

[**Live Demo**](#) *(Placeholder: Update with Vercel link)*

## 🚀 Key Features & What It Demonstrates

1. **State Management & Simulation Engine**: 
   - Uses a custom tick-based React hook (`useTruckSimulation`) to process route progression. 
   - Calculates geographic distance on the fly using the **Haversine formula**.
   - Linearly interpolates (LERP) the truck's coordinates between origin and delivery points for buttery smooth animation.
2. **Map Integration**: 
   - Implements `react-leaflet` combined with fully custom HTML/CSS markers (no default blurry map pins).
   - Features an auto-panning camera that tracks the vehicle during transit.
3. **Advanced HUD & Telemetry**: 
   - A glassmorphism-styled dashboard displays real-time telemetry.
   - Calculates exact **ETA** in minutes, formatting, and live transit status.
   - Fully interactive with Play, Pause, and Reset controls perfectly synced with the simulation state.
4. **Premium UI/UX & Dark Mode**: 
   - Designed mobile-first using Tailwind CSS.
   - Seamlessly transitions between Light and Dark mode, actively swapping out the Leaflet tile providers (`Voyager` vs `Dark_All`) for an integrated aesthetic.

## 🛠️ Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet + React-Leaflet
- **Icons**: Lucide-React
- **Deployment**: Vercel ready

## 🧠 Stated Assumptions

- **ETA Calculation**: Since we are lacking real-world traffic data, the ETA dynamically divides the remaining physical distance of the route by an assumed average truck speed of **40 km/h**.
- **Mock GPS Pinging**: Rather than immediately snapping the truck across large chunks, the engine runs on a 100ms interval (`setInterval`), simulating continuous GPS tracking pings being sent from a truck hardware unit.
- **Route Coordinates**: The coordinates used (Origin, D1, D2, D3) are hardcoded locations across Bangalore, India to provide a realistic map footprint, rather than pulling from a live geocoding backend API.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Truck_Route_Visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`.
