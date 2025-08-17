import { useCurrentValue } from '@/common/hooks/useCurrentValue.ts';
import { useLayoutEffect } from 'react';

export function useOnMount(callback: () => void): void {
  const savedCallbackRef = useCurrentValue(callback);

  useLayoutEffect(() => savedCallbackRef.current(), [savedCallbackRef]);
}
