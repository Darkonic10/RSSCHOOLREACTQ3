import { useState } from 'react';
import styles from './autocomplete.module.css';

export type AutocompleteProps = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Autocomplete({ id, label, options, value, onChange }: AutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = query.trim() === '' ? options : options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={styles.autocomplete}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={query}
        type="text"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 100);
        }}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={filtered.length > 0}
      />
      {isOpen && filtered.length > 0 && (
        <ul role="listbox" className={styles.dropdown}>
          {filtered.map((opt) => (
            <li
              key={opt}
              role="option"
              onMouseDown={() => {
                setQuery(opt);
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}