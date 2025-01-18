'use client'

// Define the type for pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void; // The function to handle page changes
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  console.log('current page pagination component',currentPage)
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // Go to the previous page
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1); // Go to the next page
    }
  };


  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="bg-blue-100 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50 hover:bg-blue-600 transition duration-300"
      >
        Prev
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="bg-blue-100 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50 hover:bg-blue-600 transition duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
