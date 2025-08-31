export interface Co2YearRecord {
  year: number;
  population?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_cement_co2?: number;
  land_use_change_co2?: number;
  land_use_change_co2_per_capita?: number;
  cumulative_luc_co2?: number;
  methane?: number;
  methane_per_capita?: number;
  nitrous_oxide?: number;
  nitrous_oxide_per_capita?: number;
  total_ghg?: number;
  total_ghg_excluding_lucf?: number;
  ghg_per_capita?: number;
  ghg_excluding_lucf_per_capita?: number;
  share_of_temperature_change_from_ghg?: number;
  temperature_change_from_co2?: number;
  temperature_change_from_ch4?: number;
  temperature_change_from_n2o?: number;
  temperature_change_from_ghg?: number;

  share_global_luc_co2?: number;
  share_global_cumulative_luc_co2?: number;

  [key: string]: number | undefined;
}

export interface CountryCo2Data {
  iso_code: string;
  data: Co2YearRecord[];
}

export interface Co2Dataset {
  [countryName: string]: CountryCo2Data;
}