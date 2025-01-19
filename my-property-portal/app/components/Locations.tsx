"use client";
import React, { useEffect, useState } from "react";
import MapComponent2 from "./MapComponent2";
import { Property } from "../types";
interface LocationProps {
    properties:Property[]
}
const Locations:React.FC<LocationProps> = ({properties}) => {
  return (
    <>
      <h3 className="text-2xl tracking-wider text-center font-light uppercase mb-6">
        Our Locations
      </h3>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "500px" }}
      >
        <MapComponent2 properties={properties} />
      </div>
    </>
  );
};
export default Locations;
