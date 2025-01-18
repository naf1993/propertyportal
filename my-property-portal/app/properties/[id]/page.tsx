import { notFound } from 'next/navigation';
import { API_URL } from '@/app/apiUrl';
import ButtonBack from '@/app/components/ButtonBack'; // Import GoBackLink

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to access id
    const { id } = await params;

    // Fetch property data for metadata like title, description, etc.
    const res = await fetch(`${API_URL}/api/properties/${id}`);
    if (!res.ok) throw new Error('Property not found');
    const property = await res.json();
    
    return {
      title: property.title,
      description: property.description,
    };
  } catch (error) {
    console.error(error);
    return {
      title: 'Property Not Found',
      description: 'Details for this property could not be found.',
    };
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to access id
    const { id } = await params;

    // Fetch property data on the server
    const res = await fetch(`${API_URL}/api/properties/${id}`);
    if (!res.ok) {
      throw new Error("Property not found");
    }
    const property = await res.json();

    // If the property is not found, show a 404 page
    if (!property) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          {/* Use the GoBackLink component */}
          <ButtonBack/>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2">
            <img
              src={property.image}
              alt={property.title}
              className="rounded-lg shadow-lg w-full object-cover h-[400px] md:h-[500px]"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-2xl font-semibold text-gray-800">{property.title}</h1>
            <p className="text-md text-gray-600 mt-2">{property.description}</p>
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
  } catch (error) {
    console.error(error);
    notFound(); // If the property is not found, show a 404 page
  }
}
