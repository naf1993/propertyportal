import React, { useEffect, useState, useRef } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationPin } from "react-icons/fa6";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_URL;
interface MapComponentProps {
  center: [number, number] | null;
  markerPosition: [number, number] | null;
}

const MapComponent1: React.FC<MapComponentProps> = ({
  center,
  markerPosition,
}) => {
  const mapRef = useRef<any>(null);
  const [viewport, setViewport] = useState({
    latitude: 24.441832545639404, // Default center in UAE (Dubai area)
    longitude: 54.422103264882296,
    zoom: 10, // Suitable zoom for UAE level view
    width: "100%", // Default width
    height: "100%", // Default height
  });

  useEffect(() => {
    if (center) {
      setViewport((prev) => ({
        ...prev,
        latitude: center[1], // Latitude
        longitude: center[0], // Longitude
      }));
    }
  }, [center]);

  const handleMove = (event: any) => {
    const { longitude, latitude, zoom } = event.viewState;
    setViewport((prev) => ({
      ...prev,
      latitude,
      longitude,
      zoom,
    }));
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={handleMove} // Handle map movement
      style={{ width: "100%", height: "100%" }}
    >
      {markerPosition && (
        <Marker latitude={markerPosition[1]} longitude={markerPosition[0]}>
          {/* Custom marker (can be an image or a more complex component) */}
          <div className="flex justify-center items-center w-8 h-8 bg-primary-900 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-125 hover:bg-blue-600">
            <FaLocationPin className="text-white text-xl" />
          </div>
        </Marker>
      )}
    </ReactMapGL>
  );
};

export default MapComponent1;
