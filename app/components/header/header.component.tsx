'use client';

import React, { useCallback, useState } from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';
import { useThrottleCallback } from '@/common/hooks';
import { REQUEST_ANIME_DATA_DELAY } from '@/common/constants.ts';
import { useTheme } from '@/common/hooks/useTheme.ts';
import { useSearchStore } from '@/store/search-list-store.ts';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const HeaderComponent: React.FC = () => {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  const [currentUserInput, setCurrentUserInput] = useState<string>(query);
  const [canSearch, setCanSearch] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { theme, toggleTheme } = useTheme();

  const throttledNavigate = useThrottleCallback((query: string) => {
    setCanSearch(false);

    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');

    const newUrl = `/?${newParams.toString()}`;
    if (pathname === '/') {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }

    setTimeout(() => setCanSearch(true), REQUEST_ANIME_DATA_DELAY);
  }, REQUEST_ANIME_DATA_DELAY);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserInput(event.target.value.trim());
  }, []);

  const handleSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setQuery(currentUserInput);
      throttledNavigate(currentUserInput);
    },
    [currentUserInput, setQuery, throttledNavigate],
  );

  const handleClickNavigate = useCallback(() => {
    router.push('/about');
  }, [router]);

  return (
    <header className={styles.header}>
      <form className={styles['headerForm']} onSubmit={handleSearch} data-testid="headerForm">
        <CustomInput placeholder="Search by title" name="Search" value={currentUserInput} onChange={handleInputChange} />
        <CustomButton type="submit" disabled={!canSearch}>
          Search
        </CustomButton>
      </form>

      <div className={styles.rightButtons}>
        <CustomButton onClick={toggleTheme}>{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</CustomButton>

        <CustomButton onClick={handleClickNavigate}>About us</CustomButton>
      </div>
    </header>
  );
};

export default HeaderComponent;
