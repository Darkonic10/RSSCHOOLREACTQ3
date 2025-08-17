import { useCallback, useRef } from 'react';

export function useThrottleCallback<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delay: number): (...args: TArgs) => void {
  const lastCalled = useRef<number>(0);

  return useCallback(
    (...args: TArgs) => {
      const now = Date.now();
      if (now - lastCalled.current >= delay) {
        lastCalled.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );
}
