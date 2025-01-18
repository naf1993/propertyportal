"use client";

import Link from "next/link";
import React from "react";
import { FC } from "react";
import { Property } from "../types/index";
import { FaBed, FaBath, FaCarSide, FaHome, FaEye } from "react-icons/fa"; // Import icons from react-icons
import { PiBuildingApartment } from "react-icons/pi";
import { BsHouseDoor } from "react-icons/bs";
const PropertyCard: FC<{ property: Property }> = ({ property }) => {
 
  return (
    <div className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
      {/* Eye Icon for Viewing Property */}
      <Link
        href={`/properties/${property._id}`}
        className="absolute top-3 right-3"
      >
        <div className="flex justify-center items-center w-7 h-7 rounded-full bg-primary-900 text-white hover:bg-primary-700 transition duration-300">
          <FaEye className="text-md" />
        </div>
      </Link>

      {/* Property Image */}
      <img
        src={`${property.image}`}
        className="w-full h-48 object-cover rounded-t-lg"
        alt={property.title}
      />

      {/* Property Content */}
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-3">{property.title}</h3>

        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            {property.propertyType === "Apartment" && (
              <PiBuildingApartment className="mr-1 text-gray-500" />
            )}
            {property.propertyType === "Villa" && (
              <FaHome className="mr-1 text-gray-500" />
            )}
            {property.propertyType === "Penthouse" && (
              <BsHouseDoor className="mr-1 text-gray-500" />
            )}
          </span>
          <span className="text-gray-500">
            {property.price} {property.currency}
          </span>
        </div>

        {/* Icons and Features */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FaBed className="mr-1 text-gray-500" />
            {property.bedrooms}{" "}
            {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1 text-gray-500" />
            {property.bathrooms}{" "}
            {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </div>
          {property.balcony && (
            <div className="flex items-center">
              <FaCarSide className="mr-1 text-gray-500" />
              {property.parkingSpaces}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
