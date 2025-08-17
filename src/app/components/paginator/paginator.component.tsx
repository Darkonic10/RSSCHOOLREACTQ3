'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '~/i18n/navigation.ts';
import { useSearchStore } from '@/store/search-list-store';
import styles from './paginator.component.module.css';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setPage = useSearchStore((state) => state.setPage);
  const t = useTranslations('Paginator');

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
        {t('prev')}
      </button>
      <span>{`${t('page')} ${currentPage} ${t('of')} ${totalPages}`}</span>
      <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
        {t('next')}
      </button>
    </div>
  );
};

export default Pagination;
