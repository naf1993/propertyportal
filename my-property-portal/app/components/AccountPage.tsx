"use client"; // This makes it a client-side component

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store"; // Import RootState
import { logout } from "../slices/authSlice"; // Import logout action

const AccountPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Fetching the user state from Redux
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Handler for logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Redirect to login after logout
  };

  // Redirect based on role (Admin or Agent)
 
  if (loading) {
    return <div>Loading...</div>; // Loading state while authentication is being checked
  }

  if (!isAuthenticated || !user) {
    return <div>Please log in to access this page.</div>; // If not authenticated, prompt login
  }

  return (
    <div className="max-w-4xl px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-l font-semibold text-gray-800">
        Welcome, {user.name}!
      </h1>

      <div className="mt-6">
        {/* Manage Properties button based on user role */}
        {(user.role === "admin" || user.role === "agent") && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() =>
                user.role === "admin" ? router.push("/admin") : router.push(`/agent/${user.id}`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md transition-all duration-300 hover:bg-primary-700"
            >
              Manage Properties
            </button>
          </div>
        )}
      </div>

      {/* Logout button visible only on small screens */}
      <div className="mt-6 sm:hidden">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-300 text-white rounded-md transition-all duration-300 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
