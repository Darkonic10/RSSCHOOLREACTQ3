import { useEffect, useRef } from 'react';

export function usePreviousValue<TValue>(value: TValue) {
  const prevValue = useRef<TValue | null>(null);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return prevValue;
}
