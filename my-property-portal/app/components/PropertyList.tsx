"use client";
import { useState, useEffect, useRef } from "react";
import { Property } from "../types/index";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";
import axios from "axios";
import { API_URL } from "../apiUrl";

interface Props {
  properties: Property[]; // Initial paginated properties
  totalProperties: number; // Total properties count for pagination
  page: number;
  totalPages: number;
  filters: Record<string, string | undefined>;
}

const PropertyList = ({
  properties,
  totalProperties,
  page,
  totalPages,filters
}: Props) => {
 
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);
  const propertiesSectionRef = useRef<any>(null); // Ref for scrolling to property section
 
  const [sortOption, setSortOption] = useState<string>("");

  const getProperties = async (page: number, limit: number, filters: Record<string, string | undefined>) => {
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit,...filters},
    });
   
    setFilteredProperties(response.data.properties);
  };
  // Handle selection change for sorting
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  // const handlePageChange = (newPage: number) => {
  //   console.log('page number',newPage)
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     if (newPage >= 1 && newPage <= totalPages) {
  //       getProperties(newPage, 6); // Fetch properties for the new page
  //     }
  //   }
  // };

  useEffect(() => {
    let filtered = [...properties];

    // Apply sorting logic based on the selected option
    switch (sortOption) {
      case "newest":
        filtered = filtered.sort((a, b) => {
          const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bCreatedAt - aCreatedAt;
        });
        break;

      case "oldest":
        filtered = filtered.sort((a, b) => {
          const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return aCreatedAt - bCreatedAt;
        });
        break;

      case "featured":
        filtered = filtered.sort((a, b) => (b.isFeatured ? 1 : -1));
        break;

      case "pricelowtohigh":
        filtered = filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;

      case "pricehightolow":
        filtered = filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;

      default:
        break;
    }

    setFilteredProperties(filtered); // Update filtered properties
  }, [sortOption, properties]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update the client-side currentPage state
  };

  // Trigger fetch when currentPage changes
  useEffect(() => {
    console.log('this is current page',currentPage)
    getProperties(currentPage,6,filters); // Re-fetch data when the page changes
  }, [currentPage,filters]); // Dependency array ensures that useEffect runs when currentPage changes


  return (
    <>
      <div className="md:flex items-center justify-end mb-4">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-4 py-2 border bg-white text-sm text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="pricelowtohigh">Price Low to High</option>
          <option value="pricehightolow">Price High to Low</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ padding: "40px 0" }}
        ref={propertiesSectionRef}
      >
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
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </motion.div>
    </>
  );
};

export default PropertyList;
