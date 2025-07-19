import { useEffect } from 'react';
import { useCurrentValue } from '@/common/hooks/useCurrentValue.ts';

export function useOnUnMount(callback: () => void) {
  const savedCallBackRef = useCurrentValue(callback);
  useEffect(() => () => savedCallBackRef.current(), [savedCallBackRef]);
}
