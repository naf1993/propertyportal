"use client";
import { useState, useRef } from "react";
import { Property } from "../types/index";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";

interface HomeProps {
  properties: Property[]; // Initial paginated properties
}

const Featured = ({ properties }: HomeProps) => {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties.filter((prop:Property)=>prop.isFeatured).slice(0,6));
  const propertiesSectionRef = useRef<any>(null);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ padding: "40px 0" }}
        ref={propertiesSectionRef}
      >
        <h3 className="text-2xl tracking-wider text-center font-light uppercase mb-6">
          Recommended For You
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties &&
            filteredProperties.length > 0 &&
            filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <PropertyCard key={property._id} property={property} />
              </motion.div>
            ))}
        </div>

        {/* Pagination Controls */}
      </motion.div>
    </div>
  );
  
};

export default Featured;
