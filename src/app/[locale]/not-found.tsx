import { Link } from '~/i18n/navigation.ts';
import { useTranslations } from 'next-intl';
import styles from './not-found.module.css';
import CustomButton from '@/components/ui/custom-button/custom-button.tsx';

export default function Page404() {
  const t = useTranslations('404');
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 — {t('not-found')}</h1>
      <Link href="/">
        <CustomButton>{t('return')}</CustomButton>
      </Link>
    </div>
  );
}
