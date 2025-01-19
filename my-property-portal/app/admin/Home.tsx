"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Property } from "../types";
import Modal from "../components/Modal";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineHome } from "react-icons/ai";
import toast from "react-hot-toast";
import { API_URL } from "../apiUrl";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axios";
import Pagination from "../components/Pagination";

interface HomeProps {
  properties: Property[];
  totalProperties: number;
  page: number;
  totalPages: number;
}


const Home = ({ properties, totalProperties, page, totalPages }: HomeProps) => {
  
  const router = useRouter()
  const markerPosition: [number, number] = [
    24.441832545639404, 54.422103264882296,
  ]; // Example coordinates

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [propertiesList, setPropertiesList] = useState<Property[]>(properties);

  const fetchProperties = async (page: number,limit:number) => {
    try {
      const response = await axios.get(`${API_URL}/api/properties`, {
        params: { page, limit }, // Assume 6 properties per page
      });
      setPropertiesList(response.data.properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update the client-side currentPage state
  };
useEffect(()=>{
fetchProperties(currentPage,6)
},[currentPage])
  // Open modal for creating a new property
  const handleCreate = () => {
    console.log("create mode");
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  // Open modal for updating an existing property
  const handleEdit = (property: Property) => {
    console.log("edit started");
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleSaveProperty = async (formData: FormData) => {
    const isUpdate = formData.get("_id") !== null && formData.get("_id") !== "";
    console.log('formData.get("_id"):', formData.get("_id"));
    console.log("submitting on edit mode?", isUpdate);
    if (!isUpdate) {
      const requiredFields = [
        "title",
        "description",
        "price",
        "address",
        "city",
        "state",
        "country",
        "postalCode",
        "coordinates",
      ];

      for (const field of requiredFields) {
        if (!formData.get(field)) {
          alert(`Error: ${field} is required.`);
          return;
        }
      }
    }
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isUpdate) {
        console.log("updating");
        const id = formData.get("_id");
        console.log(id);
        // Edit existing property
        await axiosInstance.patch(
          `${API_URL}/api/properties/${id}`,
          formData
        );
        toast.success("Property Edited");
      } else {
        // Create a new property
        await axiosInstance.post(
          `${API_URL}/api/properties`,
          formData,
          config
        );
        toast.success("New Property Added");
      }
      // Fetch the latest properties after saving
      fetchProperties(currentPage,6);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving property");
      console.error("Error saving property", error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axiosInstance.delete(`${API_URL}/api/properties/${id}`);
        toast.success("Property Deleted");
        // Call the parent's delete handler to refresh the list
        fetchProperties(currentPage,6);
      } catch (error) {
        toast.error("Error deleting property");
        console.error("Error deleting property", error);
      }
    }
  };
  const handleGoBack = () => {
    router.replace("/"); // Replace current page with home page or a fallback route
  };
  return (
    <>
      <div>
      <button
      onClick={handleGoBack}
      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
    >
      Go Back
    </button>
        {/* Heading Section */}
        <h1 className="text-3xl text-gray-600 tracking-wide font-light mb-6">
          Manage Properties
        </h1>

        {/* Button to Create New Property */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleCreate}
            className="px-3 py-2 bg-blue-400 text-white rounded-md hover:bg-primary-900 text-xs font-light tracking-wide transition mb-4 flex items-center justify-between gap-2"
          >
            <AiOutlineHome />
            Add New Property
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="border-tertiary-10">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-sm text-gray-600 tracking-wide">
                  Image
                </th>
                <th className="py-3 px-6 text-left font-semibold text-sm text-gray-600 tracking-wide">
                  Title
                </th>
                <th className="py-3 px-6 text-left font-semibold text-sm text-gray-600 tracking-wide">
                  Price
                </th>

                <th className="py-3 px-6 text-left font-semibold text-sm text-gray-600 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {propertiesList &&
                propertiesList.length > 0 &&
                propertiesList.map((property) => (
                  <tr key={property._id} className="border-b">
                    <td className="py-3 px-6">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 tracking-wide font-light">
                      {property.title}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 tracking-wide font-semibold">
                      {property.currency} {property.price}
                    </td>

                    <td className="py-3 px-6 flex space-x-4">
                      <div className="flex justify-between mt-4 gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="bg-green-500 text-white p-2 rounded-md"
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={selectedProperty || undefined}
          onSave={handleSaveProperty}
        />
      )}
    </>
  );
};

export default Home;
