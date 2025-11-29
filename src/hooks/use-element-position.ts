import { type RefObject, useEffect, useState } from 'react';

import { OppositePosition, Position } from '@/constants';

export const useElementPosition = (
  ref: RefObject<HTMLElement | null>,
  defaultPosition: Position,
  elementSize: number,
  externalElementId: string = '#root'
) => {
  const [elementPosition, setElementPosition] = useState<Position>(defaultPosition);

  useEffect(() => {
    if (ref.current && elementSize) {
      const elementClientRect = ref.current.getBoundingClientRect();
      const externalElement = ref.current.closest(externalElementId);

      if (externalElement) {
        const externalClientRect = externalElement.getBoundingClientRect();
        let shouldFlip = false;

        switch (defaultPosition) {
          case Position.BOTTOM:
            shouldFlip = elementClientRect.bottom + elementSize > externalClientRect.bottom;
            break;
          case Position.LEFT:
            shouldFlip = elementClientRect.left - elementSize < externalClientRect.left;
            break;
          case Position.RIGHT:
            shouldFlip = elementClientRect.right + elementSize > externalClientRect.right;
            break;
          case Position.TOP:
            shouldFlip = elementClientRect.top - elementSize < externalClientRect.top;
            break;
          default:
            return;
        }

        const newPosition = shouldFlip ? OppositePosition[defaultPosition] : defaultPosition;
        setElementPosition(newPosition);
      }
    }
  }, [defaultPosition, elementSize, externalElementId, ref]);

  return elementPosition;
};
