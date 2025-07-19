import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './paginator.component.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const goToPage = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.paginator}>
      <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
        Prev
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
