// app/login/layout.tsx
export default function RegisterLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex h-screen bg-white p-20">
        {/* Left side - Property image */}
        <div className="w-1/2 hidden md:block border-sm">
          <img
            src="image4.jpg" // Update with the correct path to your property image
            alt="Property"
            className="h-full object-cover w-full"
          />
        </div>
  
        {/* Right side - Form container */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
          {children} {/* The actual login form */}
        </div>
      </div>
    );
  }
  