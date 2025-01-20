import axios from "axios";
import PropertyList from "../components/PropertyList"; // Assuming PropertyList is a client component
import { API_URL } from "../apiUrl";

// Define the type for fetched data
interface FetchedData {
  properties: any[];
  totalProperties: number;
  totalPages: number;
  page: number;
}

const fetchData = async (page: number, limit: number, filters: Record<string, string | undefined>): Promise<FetchedData> => {
  try {
    console.log("Fetching data with filters:", filters); // Debug log
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit, ...filters },
    });

    const totalProperties = Number(response.data.totalProperties);
    const totalPages = response.data.totalPages || Math.ceil(totalProperties / limit);
    console.log("Total properties:", totalProperties); // Debug log

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
  searchParams,
}: {
  params: { page: string; limit: string; filters: Record<string, string> };
  searchParams: Record<string, string>;
}) {
  // Await searchParams to ensure it is fully resolved
  const resolvedSearchParams = await Promise.resolve(searchParams);
  console.log("Resolved filters in searchParams:", resolvedSearchParams); // Debug log

  // Await params to ensure it is fully resolved
  const resolvedParams = await Promise.resolve(params);
  const { page = "1", limit = "12", filters = {} } = resolvedParams;
  console.log("Resolved filters in params:", filters); // Debug log

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Fetch data from API with filters
  const data = await fetchData(pageNumber, limitNumber, resolvedSearchParams);

  return (
    <div className="max-w-7xl mx-auto my-12">
      {data.properties.length > 0 ? (
        <PropertyList {...data} filters={resolvedSearchParams} />
      ) : (
        <div>No properties found.</div>
      )}
    </div>
  );
}
