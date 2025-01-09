import axios from 'axios';
import AdminLayout from './layout';
import Home from './Home'; // Client Component
import { Property } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const fetchData = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties`, {
      params: { page, limit },
    });

    const totalProperties = Number(response.data.totalProperties);
    const totalPages = response.data.totalPages || Math.ceil(totalProperties / limit);

    return {
      properties: response.data.properties,
      totalProperties: totalProperties || 0,
      totalPages,
      page
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      properties: [],
      totalProperties: 0,
      totalPages: 1,
      page
    };
  }
};

interface PageProps {
  searchParams: { page?: string; limit?: string };
}

export default async function Page({ searchParams }: PageProps) {
  // Destructure searchParams with fallback defaults
  const { page = '1', limit = '6' } = searchParams;

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
