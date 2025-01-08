"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./components/PropertyCard";
import Select from "react-select";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import debounce from "lodash.debounce";
import { Property } from "./types/index";
import MapComponent2 from "./components/MapComponent2";
// import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_URL;
const API_URL=process.env.NEXT_BACKEND_API_URL

interface Location {
  label: string;
  value: [number, number]; // Assuming the value is a coordinates array, adjust as necessary
}

interface PropertyResponse {
  properties: Property[];
  totalProperties: number;
  page: number;
  totalPages: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]); // Array of locations with label and value
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  ); // typed as Location | null
  const [loading, setLoading] = useState(false);
  const [roomCount, setRoomCount] = useState<number | string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [propertyType, setPropertyType] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Start from page 1

  const [totalPages, setTotalPages] = useState<number>(1);
  const propertiesSectionRef = useRef<HTMLDivElement | null>(null);

  const fetchProperties = async (page: number = 1) => {
    setLoadingProducts(true);
    try {
      const response = await axios.get<PropertyResponse>(
        `${API_URL}/api/properties`,
        {
          params: {
            page,
            limit: 12, // Set the number of items per page
          },
        }
      );

      setProperties(response.data.properties);
      setFilteredProperties(response.data.properties);

      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);

      console.log("total pages", response.data.totalPages);
      console.log("current page", response.data.page);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch the properties when the page loads or when currentPage changes
  useEffect(() => {
    console.log("current page is", currentPage);
    fetchProperties(currentPage);
  }, [currentPage]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    console.log("next page is", newPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    if (propertiesSectionRef.current) {
      propertiesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetLocations = async (query: string) => {
    if (!query || query.length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            country: "ae", // Limit search to UAE
            types: "address,poi,neighborhood,locality", // Include street names, points of interest, neighborhoods
          },
        }
      );

      const result = response.data.features.slice(0, 5).map((feature: any) => ({
        label: feature.place_name,
        value: feature.geometry.coordinates,
      }));

      setLocations(result);
    } catch (error) {
      console.error("Error fetching locations", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchLocations = useCallback(
    debounce(handleGetLocations, 300),
    []
  );

  const handleInputChange = (newValue: any) => {
    setSearchQuery(newValue);
    debouncedFetchLocations(newValue);
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      debouncedFetchLocations(searchQuery);
    }
  }, [searchQuery, debouncedFetchLocations]);

  const handleLocationSelect = (selectedOption: any) => {
    setSelectedLocation(selectedOption);
  };

  const getDistanceInKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;  // Distance in kilometers
  };
  
  const toRadians = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  

  const handleSearch = () => {
    console.log("Filtering properties with:");
    console.log("this is by location", searchQuery);
    console.log("this is by property type", propertyType);
    console.log("this is my min price max price", minPrice, maxPrice);
    console.log("this is by sort option", sortOption);
    // Check if the selectedLocation is defined and has coordinates
    if (selectedLocation) {
      console.log("Selected Location Coordinates:", selectedLocation.value);
    } else {
      console.log("No location selected. Skipping location-based filter.");
    }

    if (propertiesSectionRef.current) {
      propertiesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }

    let filtered = [...properties];

    if (selectedLocation) {
      console.log("Filtering properties by location...");
    
      filtered = filtered.filter((property) => {
        const propertyCoordinates = property.coordinates.coordinates; // [longitude, latitude]
        const [propertyLng, propertyLat] = propertyCoordinates;  // Correctly extract the property coordinates
    
        const [selectedLng, selectedLat] = selectedLocation.value; // Assuming selectedLocation is [longitude, latitude]
    
        // Calculate the distance using Haversine formula (correct order: lat, lng for both)
        const distance = getDistanceInKm(selectedLat, selectedLng, propertyLng, propertyLat);
        console.log(`Distance between property at [${propertyLat}, ${propertyLng}] and selected location at [${selectedLat}, ${selectedLng}] is: ${distance} km`);
    
        // Set a reasonable distance threshold (e.g., 50 km)
        const isWithinRange = distance <= 50; // Properties within 50 km radius
    
        if (isWithinRange) {
          console.log(`Property ${property.title} is within 50 km.`);
        } else {
          console.log(`Property ${property.title} is too far from the selected location.`);
        }
    
        return isWithinRange;
      });
    
      console.log("Filtered properties by location:", filtered.length);
    }

    // Filter by property type
    if (propertyType) {
      filtered = filtered.filter(
        (property) =>
          property.propertyType?.toLowerCase() === propertyType.toLowerCase()
      );
    }

    // Filter by room count
    if (roomCount) {
      filtered = filtered.filter(
        (property) => property.bedrooms === Number(roomCount)
      );
    }

    if (minPrice > 0) {
      filtered = filtered.filter((property) => property.price >= minPrice);
    }

    if (maxPrice < 1000000) {
      filtered = filtered.filter((property) => property.price <= maxPrice);
    }

    // Filter by createdAt (New vs. Old)
    // Assuming you want to filter by recently added properties
    filtered = filtered.filter(
      (property) =>
        property.createdAt &&
        new Date(property.createdAt) >= new Date("2024-01-01")
    );

    // Apply sorting based on selected sortOption
    if (sortOption === "newest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortOption === "oldest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    } else if (sortOption === "featured") {
      filtered = filtered.sort(
        (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      );
    }

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation(null);
    setRoomCount("");
    setMinPrice(0);
    setMaxPrice(1000000);
    setPropertyType("");
    setSortOption("");
    setFilteredProperties(properties); // Reset to show all properties
  };

  return (
    <div className="max-w-7xl mx-auto my-12">
      {/* Hero Section */}
      <div
        className="relative w-full h-[80vh] sm:h-screen bg-cover bg-center rounded-lg shadow-xl mb-8"
        style={{ backgroundImage: "url(/image4.jpg)" }}
      >
        <div className="absolute overflow-hidden inset-0 bg-black opacity-40 rounded-lg sm:bg-transparent"></div>

        <div className="absolute overflow-hidden left-0 right-0 top-0 sm:top-24 text-white z-10 p-3 sm:p-6 rounded-xl bg-white bg-opacity-20 backdrop-blur shadow-xl w-full">
          <h2 className=" text-xl sm:text-4xl font-semibold mb-4 text-center tracking-wide">
            Find Your Dream Property in UAE
          </h2>
          <p className="text-sm sm:text-lg mb-6 text-center tracking-wide">
            Explore our extensive collection of apartments, houses, and more.
          </p>

          {/* Search Form */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-[600px] mx-auto">
              <Select
                isLoading={loading}
                options={locations}
                value={selectedLocation}
                onChange={handleLocationSelect}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                onInputChange={handleInputChange}
                placeholder="Search By Location.."
                noOptionsMessage={() => "No Location found"}
                className="w-full text-sm"
              />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="p-2 border rounded-md w-full bg-white text-gray-800 text-sm"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">House</option>
                <option value="penthouse">Pent House</option>
              </select>

              <select
                value={roomCount}
                onChange={(e) => setRoomCount(e.target.value)}
                className="p-2 border rounded-md w-full bg-white text-gray-800 text-sm"
              >
                <option value="">Rooms</option>
                <option value={1}>1 Room</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3 Rooms</option>
                <option value={4}>4 Rooms</option>
                <option value={5}>5+ Rooms</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:w-[600px] sm:mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:gap-1">
                <label
                  htmlFor="minPrice"
                  className="text-xs uppercase font-light text-white mb-2"
                >
                  low
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min Price"
                  className="p-2 border rounded-md w-full sm:w-auto bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none "
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-1 w-full">
                <label
                  htmlFor="maxPrice"
                  className="text-xs uppercase font-light text-white mb-2"
                >
                  high
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max Price"
                  className="p-2 border rounded-md w-full sm:w-auto bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border rounded-md w-full  bg-white text-sm text-gray-800"
              >
                <option value="">Sort By</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:w-[600px] sm:mx-auto">
              <button
                onClick={handleSearch}
                className="bg-blue-400 text-white uppercase py-2 px-6 rounded-md text-xs font-light shadow-lg w-full"
              >
                Find Properties
              </button>
              <button
                onClick={resetFilters}
                className="bg-red-400 text-white uppercase py-2 px-6 rounded-md text-xs font-light shadow-lg w-full"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ padding: "40px 0" }}
        ref={propertiesSectionRef}
      >
        <h3 className="text-2xl tracking-wider text-center font-light uppercase mb-6">
          Properties
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingProducts && <p>loading properties...</p>}
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
        <div className="flex justify-center mt-8">
          <button
            onClick={() =>
              handlePageChange(Number(Number(currentPage) - Number(1)))
            }
            disabled={currentPage === 1}
            className="bg-blue-100 text-white px-2 py-2 text-sm rounded-md disabled:opacity-50 hover:bg-blue-600 transition duration-300"
          >
            Prev
          </button>
          <span className="mx-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              handlePageChange(Number(Number(currentPage) + Number(1)))
            }
            disabled={currentPage === totalPages}
            className="bg-blue-100 text-white text-sm px-2 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Map Section */}
      <h3 className="text-2xl tracking-wider text-center font-light uppercase mb-6">
        Our Locations
      </h3>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "500px" }}
      >
        <MapComponent2 properties={properties} />
      </div>
    </div>
  );
}
