// app/page.tsx (Server Component)
import React from 'react';
import Filter from './components/FilterComponent';
import Locations from './components/Locations';
import { API_URL } from './apiUrl';
import { Property } from './types';
import Featured from './components/Featured';

const Page = async () => {
  try {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/api/properties`);
    console.log(response)
    
    // Check for non-2xx HTTP status codes
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (
      <>
        <Filter />
        <Featured properties={data.properties} />
        <Locations properties={data.properties} />
      </>
    );
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // You can return a fallback UI or empty state if the data fails to load
    return <div>Failed to load properties. Please try again later.</div>;
  }
};

export default Page