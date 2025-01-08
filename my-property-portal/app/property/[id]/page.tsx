'use client'

import { useState, useEffect } from "react";
import { useParams,useRouter } from "next/navigation"; // useParams hook to get dynamic ID


const API_URL=process.env.NEXT_PUBLIC_BACKEND_API_URL

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams();  // Get the property ID from the dynamic route
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        console.log(id)
      const fetchProperty = async () => {
        try {
          const res = await fetch(`${API_URL}/api/properties/${id}`);
          if (!res.ok) {
            throw new Error("Property not found");
          }
          const data = await res.json();
          setProperty(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
        <button
        onClick={() => router.back()}
        className="mb-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Go Back
      </button>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-1/2">
        <img src={`${property.image}`}
            alt={property.title}
            className="rounded-lg shadow-lg w-full object-cover h-[400px] md:h-[500px]"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold text-gray-800">{property.title}</h1>
          <p className="text-md  text-gray-600 mt-2">{property.description}</p>
          <div className="flex items-center mt-4">
            <span className="text-xl font-bold text-gray-800">
              {property.currency} {property.price}
            </span>
           
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-lg font-light text-gray-600">
              <strong>Property Type:</strong> {property.propertyType}
            </p>
            <p className="text-md font-light text-gray-600">
              <strong>Status:</strong> {property.status}
            </p>
            <p className="text-md font-light text-gray-600">
              <strong>Address:</strong> {property.address}, {property.city}, {property.state}, {property.country} {property.postalCode}
            </p>
            <p className="text-md font-light text-gray-600">
              <strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}
            </p>
            <p className="text-md font-light text-gray-600">
              <strong>Floor:</strong> {property.floor} | <strong>Parking Spaces:</strong> {property.parkingSpaces}
            </p>
            <p className="text-md font-light text-gray-600">
              <strong>Balcony:</strong> {property.balcony ? "Yes" : "No"} | <strong>Garden:</strong> {property.garden ? "Yes" : "No"} | <strong>Furnished:</strong> {property.furnished ? "Yes" : "No"}
            </p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
