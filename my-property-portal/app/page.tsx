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

export default async function Page({ searchParams }: { searchParams: { page: string; limit: string } }) {
  const { page = "1", limit = "6" } = searchParams;

  // Parse page and limit to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Log parsed values for debugging
  console.log('Parsed searchParams:', { pageNumber, limitNumber });

  // Fetch the data from the server
  const data = await fetchData(pageNumber, limitNumber);

  // Log the fetched data for debugging
  console.log('Fetched Data:', data);

  return <Home {...data} />;  // Pass the fetched data to the Home Client Component
}
