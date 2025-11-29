import type { Position } from '@/constants';
import type { ISelectOption } from '@/interfaces';

export interface SelectDropdownProps {
  isMultiSelect: boolean;
  isOptional?: boolean;
  items: ISelectOption[];
  position: Position;
  value: string | string[];
  handleChange: (item: ISelectOption | null) => void;
}
