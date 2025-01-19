'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Update the import path accordingly

const Protected = (WrappedComponent: any, allowedRoles: string[]) => {
  const RoleProtectedComponent = (props: any) => {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        router.push('/login'); // Redirect to the login page or any other page
      }
    }, [user, isAuthenticated, router]);

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
      return null; // Prevent rendering the wrapped component
    }

    return <WrappedComponent {...props} />;
  };

  return RoleProtectedComponent;
};

export default Protected;
