import { useEffect } from 'react';
import { useCurrentValue } from '@/hooks/useCurrentValue.ts';

export function useOnUnMount(callback: () => void) {
  const savedCallBackRef = useCurrentValue(callback);
  useEffect(() => () => savedCallBackRef.current(), [savedCallBackRef]);
}
