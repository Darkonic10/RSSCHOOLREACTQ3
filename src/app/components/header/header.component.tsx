'use client';

import React, { useCallback, useState } from 'react';
import styles from './header.component.module.css';
import CustomInput from '../ui/custom-input/custom-input.tsx';
import CustomButton from '../ui/custom-button/custom-button.tsx';
import { useThrottleCallback } from '@/common/hooks';
import { REQUEST_ANIME_DATA_DELAY } from '@/common/constants.ts';
import { useTheme } from '@/common/hooks/useTheme.ts';
import { useSearchStore } from '@/store/search-list-store.ts';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '~/i18n/navigation.ts';
import { useLocale, useTranslations } from 'next-intl';
import { routing } from '~/i18n/routing.ts';

const HeaderComponent: React.FC = () => {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  const [currentUserInput, setCurrentUserInput] = useState<string>(query);
  const [canSearch, setCanSearch] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Header');
  const locale = useLocale();

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

  const handleLocaleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = event.target.value;
      router.push(pathname + '?' + searchParams.toString(), { locale: newLocale });
    },
    [pathname, router, searchParams],
  );

  return (
    <header className={styles.header}>
      <Link href="/">
        <CustomButton>{t('button-main')}</CustomButton>
      </Link>
      <form className={styles['headerForm']} onSubmit={handleSearch} data-testid="headerForm">
        <CustomInput placeholder={t('input-search')} name="Search" value={currentUserInput} onChange={handleInputChange} />
        <CustomButton type="submit" disabled={!canSearch}>
          {t('button-search')}
        </CustomButton>
      </form>

      <div className={styles.rightButtons}>
        <CustomButton onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</CustomButton>

        <Link href="/about">
          <CustomButton>{t('button-about')}</CustomButton>
        </Link>
        <select value={locale} onChange={handleLocaleChange} className={styles.langSelect}>
          {routing.locales.map((loc) => (
            <option key={loc} value={loc}>
              {loc.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default HeaderComponent;
