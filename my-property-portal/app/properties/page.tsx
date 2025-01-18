import axios from "axios";
import PropertyList from "../components/PropertyList";
import { API_URL } from "../apiUrl";

// Define the Filters interface to handle query parameters
interface Filters {
  propertyType?: string;
  latitude?: string;
  longitude?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  [key: string]: string | undefined;
}

// Server-side data fetching function
const fetchData = async (
  page: number,
  limit: number,
  filters: Record<string, string | undefined>
) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit, ...filters },
    });

    const totalProperties = Number(response.data.totalProperties);
    const totalPages = response.data.totalPages || Math.ceil(totalProperties / limit);

    return {
      properties: response.data.properties,
      totalProperties: totalProperties || 0,
      totalPages,
      page,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      properties: [],
      totalProperties: 0,
      totalPages: 1,
      page,
    };
  }
};

// This is a server component that gets searchParams as part of the context
const PropertiesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  // Await the searchParams to resolve its values
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page || "1"; // Default page to 1 if undefined
  const limit = resolvedSearchParams.limit || "6"; // Default limit to 9 if undefined

  // Build filters object based on searchParams
  const filters: Filters = {
    propertyType: resolvedSearchParams.propertyType,
    latitude: resolvedSearchParams.latitude,
    longitude: resolvedSearchParams.longitude,
    bedrooms: resolvedSearchParams.bedrooms,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
  };

  // Filter out undefined values from filters
  const filteredParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  console.log("Calling API with", pageNumber, limitNumber, filteredParams);

  // Fetch data from API (server-side)
  const data = await fetchData(pageNumber, limitNumber, filteredParams);
 


  return (
    <div className="max-w-7xl mx-auto my-12">
      {data.properties.length > 0 ? (
        <PropertyList {...data}  filters={filteredParams}  />
      ) : (
        <div>No properties found.</div>
      )}
    </div>
  );
};

export default PropertiesPage;
