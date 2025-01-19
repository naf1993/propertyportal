"use client"; // This makes it a client-side component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store'; // Import AppDispatch type
import { RootState } from '../store'; // Update the import path accordingly
import { loadToken, loadUser } from '../slices/authSlice'; // Import loadToken and loadUser actions
import Home from '../admin/Home'; // Import the Home component (this could be for both admin and agent)

const RoleProtectedHome = ({ properties, totalProperties, totalPages, page }: any) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type
  const { isAuthenticated, user: authenticatedUser, loading } = useSelector((state: RootState) => state.auth);

  // Fetch token and user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      dispatch(loadToken());
      dispatch(loadUser()); // Fetch user data after loading the token
    }
  }, [dispatch]);

  // Check authentication and role before rendering
  useEffect(() => {
    console.log('Authenticated User:', authenticatedUser);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Loading:', loading);

    if (!loading) {
      if (!isAuthenticated || (authenticatedUser?.role !== 'admin' && authenticatedUser?.role !== 'agent')) {
        router.push('/login'); // Redirect to login page if not admin or agent
      }
    }
  }, [isAuthenticated, authenticatedUser, loading, router]);

  // Show loading state if authentication is still being checked
  if (loading || !isAuthenticated || (authenticatedUser?.role !== 'admin' && authenticatedUser?.role !== 'agent')) {
    return <div>Loading...</div>; // Show loading state or a message while checking authentication
  }

  return (
    <>
      {/* Render the Home component for both 'admin' and 'agent' */}
      <Home
        properties={properties}
        totalProperties={totalProperties}
        totalPages={totalPages}
        page={page}
      />
    </>
  );
};

export default RoleProtectedHome;
