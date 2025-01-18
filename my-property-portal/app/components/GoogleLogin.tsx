'use client'; // This makes it a client-side component

import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../slices/authSlice'; // Import your google login action
import { AppDispatch } from '../store';

const GoogleLoginBtn = () => {
  const dispatch = useDispatch<AppDispatch>(); 

  const handleGoogleLogin = (response: any) => {
    const token = response.credential;
    if (token) {
      dispatch(googleLogin(token));  // Dispatch googleLogin action with the token
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed'); // No error argument expected
  };

  return (
    <GoogleLogin 
      onSuccess={handleGoogleLogin} 
      onError={handleGoogleLoginError}  // Now handleGoogleLoginError has no arguments
    />
  );
};

export default GoogleLoginBtn;
