import React, { type MouseEventHandler } from 'react';
import styles from './custom-button.module.css';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

class CustomButton extends React.Component<CustomButtonProps> {
  render() {
    const { children, onClick, type = 'button' } = this.props;

    return (
      <button className={styles.button} type={type} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export default CustomButton;
