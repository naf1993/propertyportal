"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Property } from "@/app/types";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import dynamic from "next/dynamic";
import MapComponent2 from "./MapComponent2";
import MapComponent1 from "./MapComponent1";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineClose } from "react-icons/ai";



mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_URL

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  property?: Property;
}
interface LocationOption {
  value: string;
  label: string;
  center: [number, number];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, property }) => {
  console.log("this is property id", property?._id);
  const [formData, setFormData] = useState<Property>({
    _id: property?._id || "", // Generate a new ID if it's a new property
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    currency: property?.currency || "AED",
    propertyType: property?.propertyType || "",
    address: property?.address || "",
    city: property?.city || "",
    state: property?.state || "",
    country: property?.country || "",
    postalCode: property?.postalCode || "",
    coordinates: property?.coordinates || {
      type: "Point",
      coordinates: [0, 0],
    },
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    floor: property?.floor || 0,
    parkingSpaces: property?.parkingSpaces || 0,
    balcony: property?.balcony || false,
    garden: property?.garden || false,
    furnished: property?.furnished || false,
    image: property?.image || "",
    isFeatured: property?.isFeatured || false,
  });
  const [initialFormData, setInitialFormData] = useState(formData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [image, setImage] = useState<File | null>(null);

  // Handle location selection from the menu

  // Debounce function to limit API requests
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Get current user position
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        setCurrentPosition([latitude, longitude]);
        setFormData((prevData) => ({
          ...prevData,
          coordinates: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        }));
      });
    }
  }, []);

  // Get locations from Mapbox API
  const getLocations = async (searchText: string) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            limit: 5,
            proximity: "25.2048,55.2708", // Center around UAE
            country: "AE", // Limit to UAE
          },
        }
      );
      console.log(response.data);
      setLocations(
        response.data.features.map((loc: any) => ({
          value: loc.id,
          label: `${loc.text} in ${
            loc.context.find((c: any) => c.id.includes("place")).text
          }`,
          center: loc.center,
        }))
      );
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Debounced function to handle search input change
  const debouncedGetLocations = useCallback(debounce(getLocations, 300), []);

  // Handle search input change
  const handleSearchChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    if (inputValue.length > 3) {
      debouncedGetLocations(inputValue);
    }
  };
  const handleLocationSelect = (
    selectedOption: SingleValue<LocationOption>
  ) => {
    if (selectedOption) {
      const { center, label } = selectedOption;
      const [longitude, latitude] = center;
      const [streetName, city] = label.split(" in ").map((str) => str.trim());

      setFormData((prevData) => ({
        ...prevData,
        address: streetName,
        city: city,
        state: city,
        postalCode: "00000",
        country: "UAE", // Adjust as needed
        coordinates: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      }));

      setSelectedLocation(selectedOption); // Update selected location state
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value.trim() === "" ? 0 : Number(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Remove '0' when focusing on number input
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.value = ""; // Clear the input if it's 0
    }
  };

  // Reset to '0' if input is empty when unfocused
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      e.target.value = "0"; // Reset to '0' if input is empty
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: 0, // Update the state with 0
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    let isIdAppended = false;
    Object.entries(formData).forEach(([key, value]) => {
      const initialValue = initialFormData[key as keyof Property];
      if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
        if (key === "coordinates") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
        if (key === "_id") {
          isIdAppended = true;
        }
      }
    });
    if (!isIdAppended && formData._id) {
      formDataToSend.append("_id", formData._id);
    }
    if (formData._id === "" && image) {
      formDataToSend.append("image", image);
    }

    onSave(formDataToSend);

    setFormData({
      _id: "",
      title: "",
      description: "",
      price: 0,
      currency: "AED",
      propertyType: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      coordinates: { type: "Point", coordinates: [0, 0] },
      bedrooms: 0,
      bathrooms: 0,
      floor: 0,
      parkingSpaces: 0,
      balcony: false,
      garden: false,
      furnished: false,
      image: "",
      isFeatured: false,
    });
    setImage(null);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleClose = () => {
    setSelectedLocation(null);
    onClose();
  };
  if (typeof window === "undefined" || !isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div
        className="bg-white p-6 rounded-lg max-w-3xl w-full relative"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          <AiOutlineClose className="text-xl" />
        </button>
        <h2 className="font-semibold mb-4 tracking-wide text-md">
          {property ? "Edit Property" : "Add New Property"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Title"
            className="w-full p-2 border rounded-md"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            className="w-full p-2 border rounded-md"
          />

          <div className="flex flex-col gap-1 sm:gap-4 sm:flex-row">
            {/* Bedrooms Input */}
            <div className="w-full">
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={(e) => handleNumberChange(e, "bedrooms")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Number of bedrooms"
                className="w-full p-2 border rounded-md"
                style={{ textAlign: "left" }} // Ensures proper alignment
              />
            </div>

            {/* Bathrooms Input */}
            <div className="w-full">
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={(e) => handleNumberChange(e, "bathrooms")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Number of bathrooms"
                className="w-full p-2 border rounded-md"
                style={{ textAlign: "left" }} // Ensures proper alignment
              />
            </div>
          </div>

          {/* Floor Input */}
          <div className="flex flex-col gap-1 sm:gap-4 sm:flex-row">
            <div className="w-full mt-4">
              <label
                htmlFor="floor"
                className="block text-sm font-medium text-gray-700"
              >
                Floor
              </label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={(e) => handleNumberChange(e, "floor")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Floor number"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Parking Spaces Input */}
            <div className="w-full mt-4">
              <label
                htmlFor="parkingSpaces"
                className="block text-sm font-medium text-gray-700"
              >
                Parking Spaces
              </label>
              <input
                type="number"
                id="parkingSpaces"
                name="parkingSpaces"
                value={formData.parkingSpaces}
                onChange={(e) => handleNumberChange(e, "parkingSpaces")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Number of parking spaces"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Balcony Input */}

          {/* Furnished Input */}
          <div className="flex flex-col gap-1 sm:gap-4 sm:flex-row">
            <div className="w-full">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) => handleNumberChange(e, "price")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Price"
                className="w-full p-2 border rounded-md"
                style={{ textAlign: "left" }} // Ensures proper alignment
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.balcony}
                  onChange={(e) =>
                    setFormData({ ...formData, balcony: e.target.checked })
                  }
                />
                Balcony
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.garden}
                  onChange={(e) =>
                    setFormData({ ...formData, garden: e.target.checked })
                  }
                />
                Garden
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) =>
                    setFormData({ ...formData, furnished: e.target.checked })
                  }
                />
                Furnished
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                />
                Featured
              </label>
            </div>
          </div>

          <div>
            <Select
              value={selectedLocation} // Set selected location as value
              onInputChange={handleSearchChange}
              options={locations}
              onChange={handleLocationSelect}
              placeholder="Search for location..."
            />
          </div>
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "300px" }}
          >
            <MapComponent1
              center={
                selectedLocation
                  ? selectedLocation.center
                  : property?.coordinates?.coordinates || currentPosition
              }
              markerPosition={
                selectedLocation
                  ? selectedLocation.center
                  : property?.coordinates?.coordinates || currentPosition
              }
            />
          </div>
          {!property && (
            <div>
              <label className="block">Upload Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-md mt-4"
          >
            {property ? "Update Property" : "Create Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
