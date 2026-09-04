# Logistics Truck Route Visualizer

![Live Preview](https://via.placeholder.com/1200x600.png?text=Logistics+Route+Visualizer)

A modern, highly-polished React application that visualizes a logistics truck's journey across multiple delivery points. Built with a focus on buttery-smooth animation physics, clean architecture, and a premium "glassmorphism" UI aesthetic.

## 🌟 Key Features

- **Constant-Velocity Physics Engine**: Unlike standard point-to-point animations, the truck's speed is calculated dynamically using the real-world **Haversine formula**. The truck travels at a simulated proportional speed across legs of vastly different lengths without stuttering or jumping.
- **Glassmorphism Dashboard**: A floating, highly-compact status panel built with Tailwind CSS v4, featuring a 2-column grid for live stats (Distance covered, ETA, Next Stop, and Progress).
- **Interactive Controls**: Users can **Pause**, **Resume**, and **Reset** the simulation at any point mid-route.
- **Flawless Dark Mode**: A custom CSS inversion filter (`filter: invert(1) hue-rotate(180deg)`) dynamically transforms standard OpenStreetMap tiles into a sleek dark aesthetic, completely eliminating the need for third-party mapping API keys or watermarks.
- **Responsive & Minimalist**: Includes a pill-shaped control toolbar, minimal legend overlays, and perfectly offset markers that adapt to any screen size.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (with `Inter` typography)
- **Mapping**: `react-leaflet` + `leaflet` (OpenStreetMap standard tiles)
- **Icons**: `lucide-react`

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+ recommended) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ra-jj/Truck_Route_Visualizer-Assign-1-.git
   cd Truck_Route_Visualizer-Assign-1-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🧠 Architectural Decisions

- **State Management**: The entire route simulation is decoupled from the UI rendering. `useTruckSimulation.js` acts as a pure state machine, running a 100ms interval tick that outputs exactly where the truck should be (via Linear Interpolation). 
- **React StrictMode Resilience**: Complex leg-transition logic is isolated in specific `useEffect` hooks to prevent React 18/19's StrictMode double-invocations from skipping legs.
- **API-Key Free**: By using base OpenStreetMap tiles and applying CSS inversion for dark mode, the application remains entirely free and open-source without displaying `API KEY REQUIRED` watermarks from providers like CartoDB or Mapbox.
- **Performance**: Disabled aggressive Leaflet auto-panning to prevent the DOM map tile renderer from fighting the 100ms SVG interpolation updates, resulting in buttery-smooth movement.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
