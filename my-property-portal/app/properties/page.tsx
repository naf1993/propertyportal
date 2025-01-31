import axios from "axios";
import PropertyList from "../components/PropertyList"; // Assuming PropertyList is a client component
import { API_URL } from "../apiUrl";
import { Suspense } from "react";
import Spinner from "../components/Spinner";

// Define the type for fetched data
interface FetchedData {
  properties: any[];
  totalProperties: number;
  totalPages: number;
  page: number;
}

const fetchData = async (
  page: number,
  limit: number,
  filters: Record<string, string | undefined>
): Promise<FetchedData> => {
  try {
    console.log("Fetching data with filters:", filters); // Debug log
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit, ...filters },
    });
    console.log("page", page);
    console.log("limit", limit);
    console.log("Request URL:", response.config.url); // Debug log URL being requested
    const totalProperties = Number(response.data.totalProperties)
      ? Number(response.data.totalProperties)
      : Number(response.data.totalProperties.value);
    const totalPages =
      response.data.totalPages || Math.ceil(totalProperties / limit);
    console.log("Total properties:", typeof totalProperties); // Debug log

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
  params: Promise<{
    page: string;
    limit: string;
    filters: Record<string, string>;
  }>;
  searchParams: Promise<Record<string, string>>;
}) {
  // Await params and searchParams to ensure they are fully resolved
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  console.log("Resolved filters in searchParams:", resolvedSearchParams); // Debug log
  console.log("Resolved filters in params:", resolvedParams); // Debug log

  const { page = 1, limit = 6, filters = {} } = resolvedParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Fetch data from API with filters
  const data = await fetchData(pageNumber, limitNumber, resolvedSearchParams);

  return (
    <Suspense fallback={<Spinner />}>
      <div className="max-w-7xl mx-auto my-12">
        {data.properties && data.properties.length > 0 ? (
          <PropertyList {...data} filters={resolvedSearchParams} />
        ) : (
          <div>No properties found.</div>
        )}
      </div>
    </Suspense>
  );
}
