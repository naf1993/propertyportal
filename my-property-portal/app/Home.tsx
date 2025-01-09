'use client'
import { useState, useEffect, useRef,useCallback } from "react";
import axios from "axios";
import { Property } from "./types/index";
import Select from "react-select";
import { motion } from "framer-motion";
import PropertyCard from "./components/PropertyCard";
import MapComponent2 from "./components/MapComponent2";
import Pagination from "./components/Pagination";
import debounce from "lodash.debounce";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_URL;

interface Location {
    label: string;
    value: [number, number]; // Assuming the value is a coordinates array, adjust as necessary
  }


// Helper function to calculate distance in km using Haversine formula
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
interface HomeProps {
    properties: Property[]; // Initial paginated properties
    totalProperties: number; // Total properties count for pagination
    page: number;
    totalPages: number;
  }

  const Home = ({ properties, totalProperties, page, totalPages }: HomeProps)=>{
   console.log('total properties',totalProperties)
   console.log('total pages',totalPages)
   console.log('page',page)
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]); 
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [propertiesList, setPropertiesList] = useState<Property[]>(properties);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [roomCount, setRoomCount] = useState<number | string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const propertiesSectionRef = useRef<any>(null); // Ref for scrolling to property section
  const [currentPage, setCurrentPage] = useState<number>(page);
  // Function to apply the filters including location within 50km
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
  const handleSearch = () => {
    let filtered = [...propertiesList];

    // Filter by Location (Within 50 km)
    if (selectedLocation) {
      filtered = filtered.filter((property) => {
        const propertyCoordinates = property.coordinates.coordinates; // [longitude, latitude]
        const [propertyLng, propertyLat] = propertyCoordinates;

        const [selectedLng, selectedLat] = selectedLocation.value;

        // Calculate distance using Haversine formula
        const distance = getDistanceInKm(selectedLat, selectedLng, propertyLng, propertyLat);

        // Filter properties within 50 km radius
        return distance <= 50;
      });
    }

    // Filter by Property Type
    if (propertyType) {
      filtered = filtered.filter((property) => property.propertyType === propertyType);
    }

    // Filter by Price Range
    if (minPrice > 0) {
      filtered = filtered.filter((property) => property.price >= minPrice);
    }
    if (maxPrice < Infinity) {
      filtered = filtered.filter((property) => property.price <= maxPrice);
    }

    // Filter by Room Count
    if (roomCount) {
      filtered = filtered.filter((property) => property.bedrooms === parseInt(roomCount.toString()));
    }

    if (sortOption) {
        filtered = filtered.sort((a, b) => {
          const aCreatedAt = a.createdAt
            ? new Date(a.createdAt).getTime()
            : new Date(0).getTime();
          const bCreatedAt = b.createdAt
            ? new Date(b.createdAt).getTime()
            : new Date(0).getTime();
  
          if (sortOption === "newest") {
            return bCreatedAt - aCreatedAt;
          }
          if (sortOption === "oldest") {
            return aCreatedAt - bCreatedAt;
          }
          if (sortOption === "featured") {
            return b.isFeatured ? 1 : -1;
          }
          return 0;
        });
      }

    setFilteredProperties(filtered); // Update filtered properties
    if (propertiesSectionRef.current) {
      propertiesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handlePageChange = (newPage: number) => {
    console.log("next page is", newPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    if (propertiesSectionRef.current) {
      propertiesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSelectedLocation(null);
    setRoomCount("");
    setMinPrice(0);
    setMaxPrice(1000000);
    setPropertyType("");
    setSortOption("");
    setFilteredProperties(properties);
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
      <div className="flex justify-center mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
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
};


  

export default Home;
