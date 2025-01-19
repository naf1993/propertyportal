// pages/about.tsx

import React from "react";
import Image from "next/image"; // For optimized images
import Link from "next/link";

const About = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-primary-500 sm:text-4xl">
          About GoodHomes
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600">
          Discover your dream property with GoodHomes, your trusted portal for finding the best real estate options in the UAE.
        </p>
        
        {/* Section with Image and Text */}
        <div className="mt-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <img
              src="image4.jpg"
              alt="Properties in the UAE"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-12">
            <h2 className="text-2xl font-semibold text-gray-800">Properties in the UAE</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Whether you are looking for a luxurious apartment in Dubai or a family-friendly villa in Abu Dhabi, GoodHomes provides a variety of properties across the UAE. Our goal is to help you find the perfect home that fits your lifestyle.
            </p>
            <Link href="/properties">
              <p className="mt-6 inline-block bg-primary-500 text-white px-5 py-2 rounded-lg hover:bg-primary-600">
                Explore Properties
              </p>
            </Link>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-primary-500">500+ Properties</h3>
            <p className="mt-2 text-base text-gray-600">Available for sale and rent</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-primary-500">Top Agents</h3>
            <p className="mt-2 text-base text-gray-600">Experienced real estate professionals</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-primary-500">10+ Locations</h3>
            <p className="mt-2 text-base text-gray-600">Covering all major cities in the UAE</p>
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="mt-12 bg-primary-500 text-white py-10">
          <h2 className="text-2xl font-semibold">Join GoodHomes Today</h2>
          <p className="mt-4 text-base sm:text-lg">Start your property search now and find your dream home in the UAE.</p>
          <Link href="/register">
            <p className="mt-6 inline-block bg-white text-primary-500 px-5 py-2 rounded-lg hover:bg-primary-100">
              Register Now
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
