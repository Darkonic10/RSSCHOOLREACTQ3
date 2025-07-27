import { useLayoutEffect, useRef } from 'react';

export function useCurrentValue<TValue>(value: TValue) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  });

  return valueRef;
}
