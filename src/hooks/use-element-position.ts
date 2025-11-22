import { type RefObject, useEffect, useState } from 'react';

export const useElementPosition = (
  ref: RefObject<HTMLElement | null>,
  elementHeight?: number,
  externalElementId: string = '#root'
) => {
  const [elementPosition, setElementPosition] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    if (ref.current && elementHeight) {
      const refPosition = ref.current.getBoundingClientRect();
      const externalElement = ref.current.closest(externalElementId);

      if (externalElement) {
        const externalElementHeight = externalElement.getBoundingClientRect().bottom;
        const isElementOverExternalElement =
          externalElementHeight - refPosition.bottom + refPosition.height < elementHeight;

        if (isElementOverExternalElement) {
          setElementPosition('top');
        }
      }
    }
  }, [elementHeight, externalElementId, ref]);

  return elementPosition;
};
