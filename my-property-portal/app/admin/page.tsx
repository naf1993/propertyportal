"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Property } from "../types";
import Modal from "../components/Modal";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineHome } from "react-icons/ai";
import toast from "react-hot-toast";

interface PropertyResponse {
  properties: Property[];
  totalProperties: number;
  page: number;
  totalPages: number;
}

const API_URL=process.env.NEXT_BACKEND_API_URL
const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const markerPosition: [number, number] = [
    24.441832545639404, 54.422103264882296,
  ]; // Example coordinates

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fetchProperties = async (page: number = 1) => {
    setLoadingProducts(true);
    try {
      const response = await axios.get<PropertyResponse>(
        `${API_URL}/api/properties`,
        {
          params: {
            page,
            limit: 6, // Set the number of items per page
          },
        }
      );

      setProperties(response.data.properties);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch the properties when the page loads or when currentPage changes
  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUnload = () => {
    console.log("Map was unloaded!");
  };

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
        await axios.patch(
          `http://localhost:5000/api/properties/${id}`,
          formData
        );
        toast.success("Property Edited");
      } else {
        // Create a new property
        await axios.post(
          "http://localhost:5000/api/properties",
          formData,
          config
        );
        toast.success("New Property Added");
      }
      // Fetch the latest properties after saving
      await fetchProperties(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving property");
      console.error("Error saving property", error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`);
        toast.success("Property Deleted");
        await fetchProperties(currentPage);
      } catch (error) {
        toast.error("Error deleting property");
        console.error("Error deleting property", error);
      }
    }
  };

  return (
    <>
      <div>
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
              {properties &&
                properties.length > 0 &&
                properties.map((property) => (
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

export default AdminDashboard;
