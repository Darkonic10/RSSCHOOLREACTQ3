'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  return (
    <main style={{ padding: 20 }}>
      <h1>{t('about-head')}</h1>
      <p>{t('author')}: Дмитрий (Darkonic10)</p>
      <p>
        {t('created')}{' '}
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          RS School React {t('course')}
        </a>
        .
      </p>
    </main>
  );
}
