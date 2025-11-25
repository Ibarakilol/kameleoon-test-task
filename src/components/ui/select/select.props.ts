import type { ISelectOption } from '@/interfaces';

export interface SelectProps {
  className?: string;
  allLabel?: string;
  isDisabled?: boolean;
  isOptional?: boolean;
  items: ISelectOption[];
  prefix?: string;
  value: string | string[];
  onSelect: (id: string, value: ISelectOption | null) => void;
}
