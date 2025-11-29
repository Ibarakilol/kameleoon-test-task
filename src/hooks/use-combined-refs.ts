import { type Ref, useEffect, useRef } from 'react';

export const useCombinedRefs = <T>(...refs: Ref<T>[]) => {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as { current: T | null }).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
