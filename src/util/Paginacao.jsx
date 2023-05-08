import React, { useState, useEffect } from 'react';

function Paginacao({ data, itemsPerPage, handleCurrentItems }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(data.length / itemsPerPage));
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    paginate(currentPage);
    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const indexLastItem = pageNumber * itemsPerPage;
    const indexFirstItem = indexLastItem - itemsPerPage;
    const itemsToDisplay = data.slice(indexFirstItem, indexLastItem);
    setCurrentItems(itemsToDisplay);
    handleCurrentItems(itemsToDisplay);
  };

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center mb-4">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className="page-item">
            <button
              className={`page-link ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Paginacao;
