import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './co2-countries.component.module.css';
import { createCo2DataLoader } from '@/services/co-2-data.service.ts';
import type { Co2YearRecord, CountryCo2Data } from '@/types/owid-co2-data.interface.ts';
import CountryRow from '@/components/country-table-row/country-table-row.component.tsx';

const getCo2Data = createCo2DataLoader();

type SortOrder = 'asc' | 'desc' | null;

const REQUIRED_COLUMNS: (keyof Co2YearRecord)[] = ['year', 'population', 'co2', 'co2_per_capita'] as const;

const ALL_KEYS_ORDER: (keyof Co2YearRecord)[] = [
  'year',
  'population',
  'co2',
  'co2_per_capita',
  'cement_co2',
  'cement_co2_per_capita',
  'cumulative_cement_co2',
  'land_use_change_co2',
  'land_use_change_co2_per_capita',
  'cumulative_luc_co2',
  'methane',
  'methane_per_capita',
  'nitrous_oxide',
  'nitrous_oxide_per_capita',
  'total_ghg',
  'total_ghg_excluding_lucf',
  'ghg_per_capita',
  'ghg_excluding_lucf_per_capita',
  'share_of_temperature_change_from_ghg',
  'temperature_change_from_co2',
  'temperature_change_from_ch4',
  'temperature_change_from_n2o',
  'temperature_change_from_ghg',
  'share_global_luc_co2',
  'share_global_cumulative_luc_co2',
] as const;

function Co2CountriesTable() {
  const data = use(getCo2Data());

  const availableYears = useMemo(() => {
    const first = Object.values<CountryCo2Data>(data)[0];
    return first ? first.data.map((d) => d.year) : [];
  }, [data]);

  const currentYear = new Date().getFullYear();
  const initialYear = useMemo(() => {
    if (availableYears.includes(currentYear)) return currentYear;
    const sorted = [...availableYears].sort((a, b) => b - a);
    return sorted.find((y) => y <= currentYear) ?? sorted[0] ?? currentYear;
  }, [availableYears, currentYear]);
  const minYear = useMemo(() => Math.min(...availableYears), [availableYears]);

  const [year, setYear] = useState(initialYear);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [extraColumns, setExtraColumns] = useState<(keyof Co2YearRecord)[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Co2YearRecord | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showModal, setShowModal] = useState(false);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

  const prevYearDataRef = useRef<Map<string, Co2YearRecord>>(new Map());

  useEffect(() => {
    const newMap = new Map<string, Co2YearRecord>();
    const newHighlighted = new Set<string>();

    Object.entries(data).forEach(([countryName, countryData]) => {
      const record = countryData.data.find((d) => d.year === year);
      if (record) {
        newMap.set(countryName, record);

        const prev = prevYearDataRef.current.get(countryName);
        if (prev) {
          ALL_KEYS_ORDER.forEach((col: keyof Co2YearRecord) => {
            const prevValue = prev[col];
            const currValue = record[col];
            if ((prevValue ?? null) !== (currValue ?? null)) {
              newHighlighted.add(`${countryName}-${col}`);
            }
          });
        }
      }
    });

    prevYearDataRef.current = newMap;

    if (newHighlighted.size) {
      setHighlighted(newHighlighted);

      const timer = setTimeout(() => {
        setHighlighted((prev) => {
          const copy = new Set(prev);
          newHighlighted.forEach((k) => copy.delete(k));
          return copy;
        });
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [year, data]);

  const handleSort = useCallback(
    (col: keyof Co2YearRecord) => {
      if (sortColumn === col) {
        setSortOrder((prev) => {
          if (prev === 'asc') return 'desc';
          if (prev === 'desc') {
            setSortColumn(null);
            return null;
          }
          return 'asc';
        });
      } else {
        setSortColumn(col);
        setSortOrder('asc');
      }
    },
    [sortColumn],
  );

  const toggleColumn = useCallback((col: keyof Co2YearRecord, checked: boolean) => {
    setExtraColumns((prev) => (checked ? [...prev, col] : prev.filter((c) => c !== col)));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleRegionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  }, []);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(e.target.value));
  }, []);

  const regions = useMemo(() => {
    return Object.keys(data).sort();
  }, [data]);

  const filteredCountries = useMemo(() => {
    let entries = Object.entries<CountryCo2Data>(data);
    if (search) {
      entries = entries.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()));
    }
    if (region !== 'all') {
      entries = entries.filter(([name]) => name === region);
    }
    return entries;
  }, [data, search, region]);

  const sortedCountries = useMemo(() => {
    if (!sortColumn || !sortOrder) return filteredCountries;
    return [...filteredCountries].sort(([aName, a], [bName, b]) => {
      const aYear = a.data.find((d) => d.year === year);
      const bYear = b.data.find((d) => d.year === year);

      let aVal: string | number | undefined = undefined;
      let bVal: string | number | undefined = undefined;

      if (sortColumn === 'country') {
        aVal = aName;
        bVal = bName;
      } else if (sortColumn === 'iso') {
        aVal = a.iso_code;
        bVal = b.iso_code;
      } else {
        aVal = aYear?.[sortColumn];
        bVal = bYear?.[sortColumn];
      }

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }
    });
  }, [filteredCountries, sortColumn, sortOrder, year]);

  const columns = useMemo(() => [...REQUIRED_COLUMNS, ...extraColumns], [extraColumns]);
  const allColumns = useMemo(() => {
    const keys = new Set<keyof Co2YearRecord>();

    for (const country of Object.values<CountryCo2Data>(data)) {
      for (const record of country.data) {
        Object.keys(record).forEach((k) => keys.add(k));
      }
    }

    return ALL_KEYS_ORDER.filter((key) => keys.has(key) && !REQUIRED_COLUMNS.includes(key));
  }, [data]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🌍 CO₂ by country — {year}</h2>
      <div className={styles.controls}>
        <div className={styles.yearContainer}>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={handleYearChange}
            className={styles.input}
            max={initialYear}
            min={minYear}
            step="1"
            onKeyDown={(e) => {
              if (!['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <input placeholder="Search country..." value={search} onChange={handleSearchChange} className={styles.input} />

        <select value={region} onChange={handleRegionChange} className={styles.input}>
          <option value="all">All regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <button onClick={() => setShowModal(true)} className={styles.button}>
          ⚙️ Choose columns
        </button>
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Select columns</h3>
            <div className={styles.columnList}>
              {allColumns.map((col) => (
                <label key={col} className={styles.checkbox}>
                  <input type="checkbox" checked={columns.includes(col)} onChange={(e) => toggleColumn(col, e.target.checked)} />
                  {col}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('country')} className={`${styles.th} ${sortColumn === 'country' ? styles.active : ''}`}>
              Country {sortColumn === 'country' && sortOrder ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('iso')} className={`${styles.th} ${sortColumn === 'iso' ? styles.active : ''}`}>
              ISO {sortColumn === 'iso' && sortOrder ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            {columns.map((col) => (
              <th key={col} onClick={() => handleSort(col)} className={`${styles.th} ${sortColumn === col ? styles.active : ''}`}>
                {col} {sortColumn === col && sortOrder ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedCountries.map(([name, { iso_code, data }]) => (
            <CountryRow
              key={name}
              countryName={name}
              iso_code={iso_code}
              yearData={data.find((d) => d.year === year)}
              columns={columns}
              highlighted={highlighted}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Co2CountriesTable;