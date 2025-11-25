import type { ISelectOption } from '@/interfaces';

export interface SelectDropdownProps {
  isMultiSelect: boolean;
  isOptional?: boolean;
  items: ISelectOption[];
  position: 'top' | 'bottom';
  value: string | string[];
  handleChange: (item: ISelectOption | null) => void;
}
