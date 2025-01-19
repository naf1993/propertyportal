import axios from "axios";
import { API_URL } from "../apiUrl";
import RoleProtectedHome from "../components/RoleProtectedHome";
const fetchData = async (page: number, limit: number) => {
  try {
    console.log(API_URL);
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit },
    });

    const totalProperties = Number(response.data.totalProperties);
    const totalPages =
      response.data.totalPages || Math.ceil(totalProperties / limit);

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

export default async function Page({
  params,
}: {
  params: Promise<{ page: string; limit: string }>;
}) {
  // Wait for the Promise to resolve, then destructure with fallback defaults
  const { page = "1", limit = "12" } = await params;

  // Convert page and limit to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Fetch data
  const data = await fetchData(pageNumber, limitNumber);
  console.log("Fetched Data:", data);

  return (
    <>
      {data.properties.length === 0 && <p>No Properties to show</p>}
      {data.properties && data.properties.length > 0 && (
        <RoleProtectedHome
          properties={data.properties}
          totalProperties={data.totalProperties}
          totalPages={data.totalPages}
          page={data.page}
        />
      )}
    </>
  );
}
