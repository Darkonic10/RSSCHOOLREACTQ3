import { useLayoutEffect } from 'react';
import { useCurrentValue } from '@/hooks/useCurrentValue.ts';

export function useOnMount(callback: () => void): void {
  const savedCallbackRef = useCurrentValue(callback);

  useLayoutEffect(() => savedCallbackRef.current(), [savedCallbackRef]);
}
