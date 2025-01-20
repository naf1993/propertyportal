"use client"; // This makes it a client-side component

import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";

import { googleLogin } from "../slices/authSlice"; // Import your google login action
import { AppDispatch } from "../store";
import { useRouter } from "next/navigation";

const GoogleLoginBtn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSuccess = (response: any) => {
    console.log("Google login successful. Token:", response.credential);
    // Debugging log
    dispatch(googleLogin(response.credential))
      .then(() => {
        console.log("Login successful, redirecting...");
        router.push("/");
      })
      .catch((error) => {
        console.error("Google login failed:", error);
      });
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed"); // No error argument expected
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleGoogleLoginError} // Now handleGoogleLoginError has no arguments
    />
  );
};

export default GoogleLoginBtn;
