# Get Map Coordinates Advanced Widget

A custom ArcGIS Experience Builder widget for displaying and navigating map coordinates with RD projection support (adapted based on get-coordinates default function on <https://developers.arcgis.com/experience-builder/guide/get-map-coordinates/>).

## Features

- ? **Real-time Coordinate Display**: Hover over the map to view coordinates in both WGS84 (Lat/Lon) and RD (EPSG:28992) projections
- ? **Coordinate Navigation**: Input latitude, longitude, and optional zoom level to navigate to specific locations
- ? **RD Projection Support**: Automatically converts coordinates to Dutch RD coordinate system (EPSG:28992)
- ? **Map Widget Integration**: Easy connection to any map widget through the settings panel

## Requirements

- ArcGIS Experience Builder 1.16.0 or higher
- React
- TypeScript

## Installation

1. Copy the `get-map-coordinates-advanced` folder to your Experience Builder's widget directory:
   ```
   client/your-extensions/widgets/get-map-coordinates-advanced
   ```

2. Restart the Experience Builder development server

3. The widget will appear in the widget list when creating an Experience

## Usage

### Configuration

1. Add the widget to your Experience
2. Open the widget settings panel
3. Select a map widget to connect with

### Runtime Features

**Coordinate Display:**
- Hover your mouse over the map to see real-time coordinates
- View both WGS84 (Lat/Lon) and RD (X, Y) coordinates

**Navigation:**
1. Enter latitude and longitude values
2. Optionally enter a zoom level (1-20)
3. Click "Go" to navigate to the location
