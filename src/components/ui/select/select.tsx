import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import SelectDropdown from './components/select-dropdown';
import ChevronIcon from '@/assets/icons/chevron.svg';

import { useElementPosition, useOnClickOutside } from '@/hooks';
import type { ISelectOption } from '@/interfaces';
import type { SelectProps } from './select.props';

import './select.scss';

const Select = ({ isDisabled, isOptional, items, prefix, value, onSelect }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectDropdownHeight, setSelectDropdownHeight] = useState<number>(0);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownPosition = useElementPosition(selectRef, selectDropdownHeight);

  useEffect(() => {
    if (selectDropdownRef.current) {
      setSelectDropdownHeight(selectDropdownRef.current.offsetHeight);
    }
  }, [isOpen]);

  useOnClickOutside([selectRef, selectDropdownRef], () => setIsOpen(false), !isOpen);

  const handleClick = () => setIsOpen(!isOpen);

  const handleChange = (item: ISelectOption | null) => {
    onSelect(item?.id ?? '', item);
    setIsOpen(false);
  };

  const currentValueLabel = useMemo(() => {
    const valueLabel = items.find((item) => item.id === value)?.value;

    if (!valueLabel) {
      return '';
    }

    return `${prefix ? `${prefix} ` : ''}${valueLabel}`;
  }, [items, prefix, value]);

  return (
    <div
      className={clsx('select', {
        select_disabled: isDisabled,
        select_open: isOpen,
      })}
      ref={selectRef}
    >
      <button className="select__button" disabled={isDisabled} onClick={handleClick}>
        <span className="select__button-value">{currentValueLabel}</span>
        <ChevronIcon className="select__button-icon" />
      </button>
      {isOpen && (
        <SelectDropdown
          ref={selectDropdownRef}
          handleChange={handleChange}
          isOptional={isOptional}
          items={items}
          position={dropdownPosition}
          value={value}
        />
      )}
    </div>
  );
};

export default Select;
