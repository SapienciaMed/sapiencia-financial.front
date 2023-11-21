import React, { useState } from 'react';

const PaginatorComponent = ({ elements }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 2;
  const indexOfLastElement = currentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;
  const currentElements = elements.slice(indexOfFirstElement, indexOfLastElement);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(elements.length / elementsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="paginator-container">
      <div className="elements-container">
        {currentElements.map((element, index) => (
          <div key={index}>{element}</div>
        ))}
      </div>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => handlePaginationClick(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginatorComponent;
