import { type RefObject, useEffect, useRef } from 'react';

export const useResizeObserver = (ref: RefObject<HTMLElement | null>, handler: () => void) => {
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!('ResizeObserver' in window)) {
      return;
    }

    if (observer && observer.current) {
      observer.current.disconnect();
    }

    observer.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          handler();
        }
      }
    });
  }, [handler]);

  useEffect(() => {
    if (!('ResizeObserver' in window)) {
      return;
    }

    if (!observer.current || !ref.current) {
      return;
    }

    observer.current.observe(ref.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref]);
};
