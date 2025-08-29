import { create } from 'zustand';

export type MyFormData = {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  country: string;
  agreement: boolean;
  file: File;
};

type State = {
  data: MyFormData[];
  countries: string[];
  setData: (data: MyFormData) => void;
};

export const useFormStore = create<State>((set) => ({
  countries: ['Russia', 'Belarus', 'Kazakhstan'],
  data: [],
  setData: (newData) =>
    set((state) => ({
      data: [...state.data, newData],
    })),
}));