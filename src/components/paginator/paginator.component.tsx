import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './paginator.component.module.css';
import { useSearchStore } from '@/store/search-list-store.ts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setPage = useSearchStore((state) => state.setPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setPage(page);
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
