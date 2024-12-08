import React, { useState } from 'react';
import './pagination.scss';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const [visibleRange, setVisibleRange] = useState([1, 5]);

  const handleClick = (pageNumber) => {
    onPageChange(pageNumber);
    updateVisibleRange(pageNumber);
  };

  const updateVisibleRange = (pageNumber) => {
    const newRangeStart = Math.max(1, Math.min(pageNumber - 2, totalPages - 4));
    const newRangeEnd = Math.min(totalPages, newRangeStart + 4);
    setVisibleRange([newRangeStart, newRangeEnd]);
  };

  const handlePrevious = () => {
    if (visibleRange[0] > 1) {
      setVisibleRange([visibleRange[0] - 5, visibleRange[1] - 5]);
    }
  };

  const handleNext = () => {
    if (visibleRange[1] < totalPages) {
      setVisibleRange([visibleRange[0] + 5, visibleRange[1] + 5]);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="nav-button"
        onClick={handlePrevious}
        disabled={visibleRange[0] === 1}
      >
        Trang trước
      </button>
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .slice(visibleRange[0] - 1, visibleRange[1])
          .map((page) => (
            <button
              key={page}
              className={`page-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => handleClick(page)}
            >
              {page}
            </button>
          ))}
      </div>
      <button
        className="nav-button"
        onClick={handleNext}
        disabled={visibleRange[1] === totalPages}
      >
        Trang sau
      </button>
    </div>
  );
};

export default Pagination;
