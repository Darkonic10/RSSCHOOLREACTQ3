import React from 'react';
import styles from './spinner.module.css';

class Spinner extends React.Component {
  render() {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
}

export default Spinner;
