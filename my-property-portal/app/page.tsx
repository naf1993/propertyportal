import axios from "axios";
import Home from "./Home";  // Import the Client Component

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
// Server-side data fetching
const fetchData = async (page: number, limit: number) => {
  try {
    const propertiesResponse = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit },
    });

    // Log the API response for debugging
    console.log('API Response:', propertiesResponse.data);

    // Get the actual data from the API response
    const totalProperties = Number(propertiesResponse.data.totalProperties); // The correct key
    const totalPages = propertiesResponse.data.totalPages || Math.ceil(totalProperties / limit);

    // Ensure totalProperties is a valid number
    if (isNaN(totalProperties)) {
      console.error('Invalid totalProperties:', propertiesResponse.data.totalProperties);
    }

    return {
      properties: propertiesResponse.data.properties,
      totalProperties: totalProperties || 0, // Default to 0 if NaN
      totalPages,
      page
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      properties: [],
      totalProperties: 0,
      totalPages: 1,
      page
    };
  }
};

export default async function Page({ params }: { params: Promise<{ page: string, limit: string }> }) {
  // Wait for the Promise to resolve, then destructure with fallback defaults
  const { page = '1', limit = '12' } = await params;

  // Convert page and limit to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Fetch data
  const data = await fetchData(pageNumber, limitNumber);
  console.log('Fetched Data:', data);

  return (
    <>
      <Home
        {...data} // Pass properties and pagination data to the Home component
      />
    </>
  );
}

