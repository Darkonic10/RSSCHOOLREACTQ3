'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/search-list-store';
import styles from './paginator.component.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setPage = useSearchStore((state) => state.setPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setPage(page);

    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
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
