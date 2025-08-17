import React, { useCallback } from 'react';
import { usePickedCardStore } from '@/store/picked-card-store.ts';
import style from './selected-footer.component.module.css';
import CustomButton from '@/components/ui/custom-button/custom-button.tsx';
import { useTranslations } from 'next-intl';

const SelectedFooter: React.FC = () => {
  const selected = usePickedCardStore((s) => s.selected);
  const clearSelected = usePickedCardStore((s) => s.clearSelected);

  const t = useTranslations('Footer');

  const handleDownload = useCallback(async () => {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: selected }),
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.length}_items.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [selected]);

  if (selected.length === 0) return null;

  return (
    <div className={style.selectedFooterContainer}>
      <span>{`${t('picked')} ${selected.length} ${t('elements')}`}</span>
      <form className={style.buttonContainer} action={handleDownload}>
        <CustomButton onClick={clearSelected}>{t('cancel')}</CustomButton>
        <CustomButton disabled={selected.length === 0} type="submit">
          {t('load')}
        </CustomButton>
      </form>
    </div>
  );
};

export default SelectedFooter;
