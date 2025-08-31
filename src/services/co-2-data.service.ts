import type { Co2Dataset } from '@/types/owid-co2-data.interface.ts';

export function createCo2DataLoader() {
  let co2DataPromise: Promise<Co2Dataset> | null = null;

  return function getCo2Data() {
    if (!co2DataPromise) {
      co2DataPromise = (async () => {
        const res = await fetch('./src/assets/data/owid-co2-data.json');
        if (!res.ok) {
          throw new Error('Error load Co2 Data');
        }
        return res.json();
      })();
    }
    return co2DataPromise;
  };
}