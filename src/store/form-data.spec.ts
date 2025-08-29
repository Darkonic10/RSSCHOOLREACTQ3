import { beforeEach, describe, expect, it } from 'vitest';
import { type MyFormData, useFormStore } from './form-data';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      data: [],
      countries: ['Russia', 'Belarus', 'Kazakhstan'],
      setData: useFormStore.getState().setData,
    });
  });

  it('initializes with empty data and predefined countries', () => {
    const state = useFormStore.getState();
    expect(state.data).toEqual([]);
    expect(state.countries).toEqual(['Russia', 'Belarus', 'Kazakhstan']);
  });

  it('adds new data correctly', () => {
    const newData: MyFormData = {
      name: 'John',
      age: 30,
      email: 'john@test.com',
      password: 'P@ss1234',
      gender: 'male',
      country: 'Russia',
      agreement: true,
      file: new File(['dummy'], 'dummy.png', { type: 'image/png' }),
    };

    useFormStore.getState().setData(newData);
    const state = useFormStore.getState();
    expect(state.data).toHaveLength(1);
    expect(state.data[0]).toEqual(newData);
  });

  it('appends multiple items correctly', () => {
    const first: MyFormData = {
      name: 'Alice',
      age: 25,
      email: 'alice@test.com',
      password: 'P@ss1111',
      gender: 'female',
      country: 'Belarus',
      agreement: true,
      file: new File(['a'], 'a.png', { type: 'image/png' }),
    };

    const second: MyFormData = {
      name: 'Bob',
      age: 40,
      email: 'bob@test.com',
      password: 'P@ss2222',
      gender: 'male',
      country: 'Kazakhstan',
      agreement: true,
      file: new File(['b'], 'b.png', { type: 'image/png' }),
    };

    useFormStore.getState().setData(first);
    useFormStore.getState().setData(second);

    const state = useFormStore.getState();
    expect(state.data).toHaveLength(2);
    expect(state.data).toEqual([first, second]);
  });
});