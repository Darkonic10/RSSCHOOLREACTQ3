import { useEffect, useState } from 'react';
import { useFormStore } from '@/store/form-data.ts';
import { Modal } from '@/components/modal/modal.tsx';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form.tsx';
import { ControlledForm } from '@/components/forms/controlled-form.tsx';
import { Card } from '@/components/card/card.tsx';
import styles from './home-page.module.css';
import cardStyles from '../../components/card/card.module.css';

export function HomePage() {
  const [modal, setModal] = useState<'uncontrolled' | 'controlled' | null>(null);
  const { data } = useFormStore();

  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const lastIndex = data.length - 1;
    setHighlightIndex(lastIndex);

    const timeout = setTimeout(() => {
      setHighlightIndex(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div className={styles.homePage}>
      <div className={styles.formButtonsContainer}>
        <button onClick={() => setModal('uncontrolled')}>Open Uncontrolled</button>
        <button onClick={() => setModal('controlled')}>Open Controlled</button>
      </div>

      {modal === 'uncontrolled' && (
        <Modal onClose={() => setModal(null)}>
          <UncontrolledForm onSuccess={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'controlled' && (
        <Modal onClose={() => setModal(null)}>
          <ControlledForm onSuccess={() => setModal(null)} />
        </Modal>
      )}

      <div className={styles.cards}>
        {data.map((item, index) => (
          <Card key={index} data={item} className={index === highlightIndex ? cardStyles.highlight : ''} />
        ))}
      </div>
    </div>
  );
}