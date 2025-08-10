// src/components/Pagination.jsx
import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="d-flex justify-content-between pt-5">
      <ul className="hint-text">
        Showing <b>{Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)}</b> out of <b>{totalItems}</b> entries
      </ul>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a href="#" className="page-link" onClick={(e) => { e.preventDefault(); handlePrevious(); }}>Trước</a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a 
              href="#" 
              className="page-link" 
              onClick={(e) => { e.preventDefault(); onPageChange(number); }}
            >
              {number}
            </a>
          </li>
        ))}
        <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
          <a href="#" className="page-link" onClick={(e) => { e.preventDefault(); handleNext(); }}>Sau</a>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;