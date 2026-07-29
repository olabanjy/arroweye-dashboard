import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <div className="mt-4 flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Previous page"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronLeft />
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Next page"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
