import type { ISelectOption } from '@/interfaces';

export interface SelectDropdownProps {
  isOptional?: boolean;
  items: ISelectOption[];
  position: 'top' | 'bottom';
  value: string;
  handleChange: (item: ISelectOption | null) => void;
}
