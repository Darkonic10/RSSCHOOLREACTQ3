import Co2CountriesComponent from '@/components/co2-countries/co2-countries.component.tsx';
import { Suspense } from 'react';

function HomePage() {
  return (
    <Suspense fallback={<div>⏳ Load CO₂ data...</div>}>
      <Co2CountriesComponent></Co2CountriesComponent>
    </Suspense>
  );
}

export default HomePage;