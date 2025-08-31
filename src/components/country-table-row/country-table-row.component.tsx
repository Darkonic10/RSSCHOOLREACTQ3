import type { Co2YearRecord } from '@/types/owid-co2-data.interface.ts';
import styles from './country-table-row.component.module.css';
import * as React from 'react';

type Props = {
  countryName: string;
  iso_code?: string;
  yearData?: Co2YearRecord;
  columns: (keyof Co2YearRecord)[];
  highlighted: Set<string>;
};

function CountryRow({ countryName, iso_code, yearData, columns, highlighted }: Props) {
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>{countryName}</td>
      <td className={styles.td}>{iso_code ?? 'N/A'}</td>
      {columns.map((col) => {
        const value = yearData?.[col];
        const key = `${countryName}-${col}`;
        return (
          <td key={col} className={`${styles.td} ${highlighted.has(key) ? styles.highlight : ''}`}>
            {value != null ? value : 'N/A'}
          </td>
        );
      })}
    </tr>
  );
}

export default React.memo(CountryRow);