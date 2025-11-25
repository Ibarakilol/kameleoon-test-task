import type { ISelectOption } from '@/interfaces';

export const getSelectOptions = (arr: string[]): ISelectOption[] => {
  return arr.map((item) => ({ id: item.toLowerCase(), value: item }));
};
