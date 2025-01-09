import axios from 'axios';
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

export default async function Page({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  // No need to await `searchParams`, just destructure them directly
  const { page = '1', limit = '6' } = searchParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Fetch data using the extracted values
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
