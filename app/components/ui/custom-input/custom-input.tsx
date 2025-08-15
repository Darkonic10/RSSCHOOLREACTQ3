import React from 'react';
import styles from './custom-input.module.css';

interface CustomInputProps {
  type?: 'text' | 'number' | 'date' | 'email';
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ type = 'text', name, placeholder, value, onChange }) => {
  return (
    <input
      data-testid="custom-input"
      className={styles.input}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomInput;
