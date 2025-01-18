"use client";

import { useRouter } from "next/navigation";

const ButtonBack = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
    >
      Go Back
    </button>
  );
};

export default ButtonBack;
