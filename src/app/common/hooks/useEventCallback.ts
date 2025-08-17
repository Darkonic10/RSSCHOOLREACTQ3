import { useCallback, useLayoutEffect, useRef } from 'react';

export function useEventCallback<TArgs extends unknown[], TReturn>(callback: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn {
  const fnRef = useRef(callback);

  useLayoutEffect(() => {
    fnRef.current = callback;
  }, [callback]);

  return useCallback((...args: TArgs): TReturn => {
    return fnRef.current(...args);
  }, []);
}
