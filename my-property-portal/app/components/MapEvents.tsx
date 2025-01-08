import React,{ useEffect } from "react";
import { useMapEvent } from "react-leaflet";

interface MapEventsProps {
  onUnload: () => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onUnload }) => {
  useMapEvent('unload', () => {
    onUnload();
  });
  return null;
};

export default MapEvents;
