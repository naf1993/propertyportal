"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import mapboxgl from "mapbox-gl";
import { IoHome } from "react-icons/io5";
import { LuDelete } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { root } from "postcss";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_URL;
interface Location {
  label: string;
  value: [number, number]; // Assuming the value is a coordinates array, adjust as necessary
}
const Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [roomCount, setRoomCount] = useState<number | string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [textSearch, setTextSearch] = useState<string>("");

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

  const handleSearchText = () => {
    console.log('hello')
    console.log('this is text qeuery',textSearch)
    const query:{[key:string]:string} = {}
    if(textSearch.length > 10){
      query.textQuery = textSearch
    }
    console.log(query)

    const queryString = new URLSearchParams(Object.entries(query).map(([key,value])=>[key,String(value)])).toString()
    if(pathname !== `/properties?${queryString}`){
      router.push(`/properties?${queryString}`)
    }
  }

  const handleSearch = () => {
    const updatedQuery: { [key: string]: string | number | boolean } = {};

    // Filter by Location (Within 50 km)
    if (selectedLocation) {
      const lat = selectedLocation.value[1];
      const lng = selectedLocation.value[0];
      updatedQuery.latitude = lat;
      updatedQuery.longitude = lng;
    }
    if (minPrice) updatedQuery.minPrice = minPrice;
    if (maxPrice) updatedQuery.maxPrice = maxPrice;
    if (propertyType) updatedQuery.propertyType = propertyType;
    if (roomCount) updatedQuery.bedrooms = roomCount;
    console.log(updatedQuery);
    const queryString = new URLSearchParams(
      Object.entries(updatedQuery).map(([key, value]) => [key, String(value)])
    ).toString();
    if (pathname !== `/properties?${queryString}`) {
      router.push(`/properties?${queryString}`);
    }
  };

  const resetFilters = () => {
    setTextSearch('')
    setSelectedLocation(null);
    setRoomCount("");
    setMinPrice(0);
    setMaxPrice(1000000);
    setPropertyType("");
    setSortOption("");
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

          <div className="flex flex-col gap-2 sm:gap-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-[600px] mx-auto relative">
              <input
                type="text"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                placeholder="I want 3 bedroom apartment in Dubai"
                className="flex-1 p-2 border rounded-md w-full sm:w-auto bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none "
              />
              <button className="absolute top-3 right-3 bg-none border-0" onClick={handleSearchText}>
                <IoSearchOutline className="search-icon w-4 h-4 text-blue-500" />
              </button>

              <button
                onClick={handleSearch}
                className="hidden sm:block bg-blue-400 text-white uppercase py-2 px-6 rounded-md text-xs font-light shadow-lg"
              >
                Find Properties
              </button>
            </div>

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

            <div className="flex flex-col sm:flex-row gap-1 mt-4 sm:w-[600px] sm:mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
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
              <button
                onClick={handleSearch}
                className="hidden sm:block bg-blue-400 text-white uppercase py-2 px-6 rounded-md text-xs font-light shadow-lg"
              >
                <IoHome className="w-4 h-4" />
              </button>
              <button
                onClick={resetFilters}
                className="hidden sm:block bg-red-400 text-white uppercase py-2 px-6 rounded-md text-xs font-light shadow-lg"
              >
                <LuDelete className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:hidden">
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
    </div>
  );
};

export default Filter;
