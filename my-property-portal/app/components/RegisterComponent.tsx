// app/register/page.tsx
"use client"; // This makes it a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAgent, setIsAgent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password,role: isAgent ? "agent" : "tenant" }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setError(data.message);
      } else {
        router.push("/login");
      }
    } catch (error) {
      setError("An error occurred");
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
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
         <div className="flex items-center">
          <input
            type="checkbox"
            id="isAgent"
            checked={isAgent}
            onChange={(e) => setIsAgent(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isAgent" className="text-sm text-gray-700">
            I am an agent
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full p-3 bg-primary-900 text-white rounded-md transition-all duration-300 hover:bg-primary-700 focus:outline-none"
        >
          Login
        </button>
      </form>

    

      <div className="mt-6 w-full flex items-center justify-center">
        <p className="text-sm font-light text-gray-700">
          Already have an account{" "}
          <Link href={"/login"}>
            <span className="text-md font-light text-primary-900">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
