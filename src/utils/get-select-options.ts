import type { ISelectOption } from '@/interfaces';

export const getSelectOptions = (arr: string[]): ISelectOption[] => {
  return arr.map((item, idx) => ({ id: (idx + 1).toString(), value: item }));
};
