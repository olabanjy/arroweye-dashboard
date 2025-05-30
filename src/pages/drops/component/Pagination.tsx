import React from "react";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
      >
        <GrFormPreviousLink />
      </button>
      <p className="text-sm">
        Page {currentPage} of {totalPages}
      </p>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
      >
        <GrFormNextLink />
      </button>
    </div>
  );
};

export default Pagination;
