import React, { useCallback, useState } from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';
import { useLocalStorage, useThrottleCallback } from '@/common/hooks';
import { REQUEST_ANIME_DATA_DELAY } from '@/common/constants.ts';
import { useLocation, useNavigate } from 'react-router-dom';

const HeaderComponent: React.FC = () => {
  const [searchValue, setSearchValue] = useLocalStorage<string>('lastSearch', '');
  const [canSearch, setCanSearch] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const throttledNavigate = useThrottleCallback((query: string) => {
    setCanSearch(false);

    const newParams = new URLSearchParams();
    newParams.set('q', query);
    newParams.set('page', '1');

    if (location.pathname === '/') {
      navigate({ search: `?${newParams.toString()}` }, { replace: true });
    } else {
      navigate({
        pathname: '/',
        search: `?${newParams.toString()}`,
      });
    }

    setTimeout(() => setCanSearch(true), REQUEST_ANIME_DATA_DELAY);
  }, REQUEST_ANIME_DATA_DELAY);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value.trim());
    },
    [setSearchValue],
  );

  const handleSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      throttledNavigate(searchValue);
    },
    [searchValue, throttledNavigate],
  );

  return (
    <header className={styles.header}>
      <form className={styles.headerForm} onSubmit={handleSearch} data-testid="headerForm">
        <CustomInput placeholder="Search by title" name="Search" value={searchValue} onChange={handleInputChange} />
        <CustomButton type="submit" disabled={!canSearch}>
          Search
        </CustomButton>
      </form>

      <CustomButton onClick={() => navigate('about')}>About us</CustomButton>
    </header>
  );
};

export default HeaderComponent;
