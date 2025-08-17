import { useCurrentValue } from '@/common/hooks/useCurrentValue.ts';
import { useEffect } from 'react';

export function useOnUnMount(callback: () => void) {
  const savedCallBackRef = useCurrentValue(callback);
  useEffect(() => () => savedCallBackRef.current(), [savedCallBackRef]);
}
