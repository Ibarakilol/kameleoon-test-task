import { type RefObject, useEffect } from 'react';

export const useOnClickOutside = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement | null>[],
  onClick: (e?: any) => void,
  isListenerStopped: boolean = false
) => {
  useEffect(() => {
    const listener = (e: any) => {
      if (Array.isArray(ref)) {
        if (ref.some((ref) => !ref?.current || ref.current.contains(e.target))) {
          return;
        }
      } else {
        if (!ref?.current || ref.current.contains(e.target)) {
          return;
        }
      }

      onClick(e);
    };

    if (!isListenerStopped) {
      document.addEventListener('mousedown', listener);
    } else {
      document.removeEventListener('mousedown', listener);
    }

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, onClick, isListenerStopped]);
};
