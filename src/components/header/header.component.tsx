import React, { useCallback, useState } from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';
import { useLocalStorage, useOnMount, useThrottleCallback } from '@/hooks';
import { REQUEST_ANIME_DATA_DELAY } from '@/common/constants.ts';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useLocalStorage<string>('lastSearch', '');
  const [canSearch, setCanSearch] = useState<boolean>(true);

  const throttledSearch = useThrottleCallback((query: string) => {
    onSearch(query);
    setCanSearch(false);
    setTimeout(() => setCanSearch(true), REQUEST_ANIME_DATA_DELAY);
  }, REQUEST_ANIME_DATA_DELAY);

  useOnMount(() => {
    onSearch(searchValue);
  });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value.trim());
    },
    [setSearchValue],
  );

  const handleSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      throttledSearch(searchValue);
    },
    [searchValue, throttledSearch],
  );

  return (
    <header className={styles.header}>
      <form className={styles.headerForm} onSubmit={handleSearch} data-testid="headerForm">
        <CustomInput placeholder="Search by title" name="Search" value={searchValue} onChange={handleInputChange} />
        <CustomButton type="submit" disabled={!canSearch}>
          Search
        </CustomButton>
      </form>
    </header>
  );
};

export default HeaderComponent;
