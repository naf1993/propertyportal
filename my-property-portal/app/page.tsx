// app/page.tsx (Server Component)
import React from 'react';
import Filter from './components/FilterComponent';
import Locations from './components/Locations';
import { API_URL } from './apiUrl';
import { Property } from './types';
interface PageProps {
  properties: Property[];
}
const Page = async () => {
  // Fetch properties server-side
  const response = await fetch(`${API_URL}/api/properties`);
  const data = await response.json();
  return (
    <>
      <Filter />
      <Locations properties={data.properties} />
    </>
  );
};

export default Page;
