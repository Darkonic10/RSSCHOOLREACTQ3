import React from 'react';
import styles from './spinner.module.css';

const Spinner: React.FC = () => {
  return (
    <div className={styles.loaderContainer} data-testid="spinner-container">
      <div className={styles.spinner} data-testid="spinner"></div>
    </div>
  );
};

export default Spinner;
