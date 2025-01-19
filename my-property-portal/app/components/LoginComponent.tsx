"use client"; // This makes it a client-side component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from '../slices/authSlice';  // Import your login action
import GoogleLoginBtn from './GoogleLogin';  // Import Google login button
import { AppDispatch } from '../store';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store"; // Import RootState type

import Link from "next/link";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, user: authenticatedUser, loading } = user;

  useEffect(() => {
    // Only redirect if not loading and user is authenticated
    if (!loading && isAuthenticated) {
      router.push("/"); // Redirect to home if already authenticated
    }
  }, [isAuthenticated, loading, router]); // Triggered when isAuthenticated or loading changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Dispatch the login action
      const result = await dispatch(loginUser({ email, password })).unwrap();

      // If successful, you can perform any additional logic
      console.log('Login successful', result);
      router.push('/')

    } catch (error: any) {  // TypeScript can now infer that `error` is `any`
      // If error, set the error message
      if (error && error.message) {
        setError(error.message);  // Assuming `error` has a `message` property
      } else {
        setError('Login failed');  // Fallback error message
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col items-center mt-10">
      <Link href={"/"}>
        <h2 className="uppercase text-3xl font-semibold mb-4 text-center tracking-wide text-primary-400">
          Good Homes
        </h2>
      </Link>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full p-3 bg-primary-900 text-white rounded-md transition-all duration-300 hover:bg-primary-700 focus:outline-none"
        >
          Login
        </button>
      </form>

      {/* Google Login Button */}
      {/* <div className="mt-6 w-full">
        <GoogleLoginBtn /> 
      </div> */}

      <div className="mt-6 w-full flex items-center justify-center">
        <p className="text-sm font-light text-gray-700">Don't have an account <Link href={'/register'}><span className="text-md font-light text-primary-900">Register</span></Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
