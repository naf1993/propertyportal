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
      className="px-3 py-2 bg-primary-400 text-white rounded-lg hover:bg-stone-400"
    >
      Go Back
    </button>
  );
};

export default ButtonBack;
