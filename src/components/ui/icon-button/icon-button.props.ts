import type { ReactNode, SyntheticEvent } from 'react';

export interface IconButtonProps {
  ariaLabel: string;
  icon: ReactNode;
  isDisabled?: boolean;
  theme?: 'halo' | 'square';
  onClick: (evt: SyntheticEvent) => void;
}
