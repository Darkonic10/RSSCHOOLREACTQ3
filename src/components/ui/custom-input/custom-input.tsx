import React from 'react';
import styles from './custom-input.module.css';

interface CustomInputProps {
  type?: 'text' | 'number' | 'date' | 'email';
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

class CustomInput extends React.Component<CustomInputProps> {
  render() {
    const { type = 'text', name, placeholder, value, onChange } = this.props;

    return (
      <input
        className={styles.input}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default CustomInput;
