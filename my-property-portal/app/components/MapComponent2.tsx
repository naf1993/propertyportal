"use client";

import React, { useEffect, useRef, useState,useMemo } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Property } from "../types"; // Adjust the import based on where your Property type is located
import { FaLocationPin } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_URL;

interface MapComponentProps {
  properties: Property[];
}

const MapComponent2: React.FC<MapComponentProps> = React.memo(({ properties }) => {
 
  const mapRef = useRef<any>(null);
  const [viewport, setViewport] = useState({
    latitude: 24.441832545639404, // Default center in UAE (Dubai area)
    longitude: 54.422103264882296,
    zoom: 10, // Suitable zoom for UAE level view
    width: 0, // Default width, will update with window size
    height: 0, // Default height, will update with window size
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Set the viewport width and height after component mounts (client-side only)
  useEffect(() => {
    const handleResize = () => {
      setViewport((prev) => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    };

    // Initial resize on mount
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this runs once on mount

   // Memoize the computation of viewport whenever the properties change
   const computedViewport = useMemo(() => {
    if (properties.length > 0) {
      const latitudes = properties.map((property) => property.coordinates.coordinates[0]);
      const longitudes = properties.map((property) => property.coordinates.coordinates[1]);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      const zoomLevel = latitudes.length > 1 ? 10 : 12;

      return {
        latitude: centerLat,
        longitude: centerLng,
        zoom: zoomLevel,
      };
    }
    return viewport; // Return default if properties are empty
  }, [properties]); // Recalculate only when properties change

  useEffect(() => {
    // Merge computedViewport with the current width and height from state
    setViewport((prev) => ({
      ...prev, // Keep the previous state
      ...computedViewport, // Overwrite the latitude, longitude, and zoom values
    }));
  }, [computedViewport]);

  // Use onMove and onMoveEnd to update the viewport (replaces onViewportChange)
  const handleMove = (event: any) => {
    const { longitude, latitude, zoom } = event.viewState;
    setViewport((prev) => ({
      ...prev,
      longitude,
      latitude,
      zoom,
    }));
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={MAPBOX_TOKEN} // Correct token prop
      onMove={handleMove} // Use onMove instead of onViewportChange
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
    >
      {/* Loop through the properties and create markers */}
      {properties.length > 0 &&
        properties.map((property) => {
        

          if (property.coordinates && property.coordinates.coordinates) {
            return (
              <Marker
                key={property._id}
                latitude={property.coordinates.coordinates[0]} // Latitude
                longitude={property.coordinates.coordinates[1]} // Longitude
              >
                <div
                  className="flex justify-center items-center w-8 h-8 bg-primary-100 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-125 hover:bg-blue-600"
                  onClick={() => setSelectedProperty(property)}
                >
                  <FaLocationPin className="text-white text-xl" />
                </div>
              </Marker>
            );
          } else {
            // Log error if coordinates are missing or malformed
            console.error(`Invalid coordinates for property ${property._id}`);
            return null;
          }
        })}

      {/* Popup for selected property */}
      {selectedProperty && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-4 w-72 sm:w-80 md:w-96 lg:w-1/3 xl:w-1/4 max-w-full">
          {/* Close Button */}
          <div className="absolute top-2 right-2">
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedProperty(null)}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 items-center">
            {/* Property Image */}
            <img
              src={selectedProperty.image} // Assuming your `Property` type has an `image` field
              alt={selectedProperty.title}
              className="w-full h-36 sm:h-48 object-cover rounded-lg"
            />
            {/* Property Title */}
            <h3 className="text-lg font-semibold text-center">
              {selectedProperty.title}
            </h3>

            {/* Grid Layout for Property Info */}
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-center text-gray-600 mb-2">
              <p>
                <strong>Price:</strong> {selectedProperty.price}{" "}
                {selectedProperty.currency}
              </p>
              <p>
                <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
              </p>
              <p>
                <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
              </p>
            </div>
          </div>
        </div>
      )}
    </ReactMapGL>
  );
});

export default MapComponent2;