import React, { type MouseEventHandler, useState } from 'react';
import styles from './custom-button.module.css';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  isNeedError?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = 'button',
  isNeedError = false,
  disabled = false,
}) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isNeedError) {
      setShouldThrow(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  if (shouldThrow) {
    throw new Error('💣 Simulated error in render after click!');
  }

  return (
    <button className={styles.button} type={type} onClick={handleClick} disabled={disabled} data-testid="custom-button">
      {children}
    </button>
  );
};

export default CustomButton;
