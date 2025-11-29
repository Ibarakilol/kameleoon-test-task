import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import SelectDropdown from './components/select-dropdown';
import ChevronIcon from '@/assets/icons/chevron.svg';

import { Position } from '@/constants';
import { useElementPosition, useOnClickOutside } from '@/hooks';
import type { ISelectOption } from '@/interfaces';
import type { SelectProps } from './select.props';

import './select.scss';

const Select = ({
  className,
  allLabel,
  isDisabled,
  isOptional,
  items,
  prefix,
  value,
  onSelect,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectDropdownHeight, setSelectDropdownHeight] = useState<number>(0);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownPosition = useElementPosition(selectRef, Position.BOTTOM, selectDropdownHeight);
  const isSelectDisabled = isDisabled || !items.length;
  const isMultiSelect = useMemo(() => Array.isArray(value), [value]);

  useEffect(() => {
    if (selectDropdownRef.current) {
      setSelectDropdownHeight(selectDropdownRef.current.offsetHeight);
    }
  }, [isOpen]);

  useOnClickOutside([selectRef, selectDropdownRef], () => setIsOpen(false), !isOpen);

  const handleClick = () => setIsOpen(!isOpen);

  const handleChange = (item: ISelectOption | null) => {
    onSelect(item?.id ?? '', item);

    if (!isMultiSelect) {
      setIsOpen(false);
    }
  };

  const currentValueLabel = useMemo(() => {
    if (!isMultiSelect) {
      const valueLabel = items.find((item) => item.id === value)?.value;

      if (!valueLabel) {
        return '';
      }

      return `${prefix ? `${prefix} ` : ''}${valueLabel}`;
    }

    if (items.length === value.length || !value.length) {
      return allLabel ?? 'All';
    }

    return items
      .filter((item) => value.includes(item.id))
      .map((item) => item.value)
      .join(', ');
  }, [allLabel, isMultiSelect, items, prefix, value]);

  return (
    <div
      className={clsx('select', className, {
        select_disabled: isSelectDisabled,
        select_open: isOpen,
      })}
      ref={selectRef}
    >
      <button className="select__button" disabled={isSelectDisabled} onClick={handleClick}>
        <span className="select__button-value">{currentValueLabel}</span>
        <ChevronIcon className="select__button-icon" />
      </button>
      {isOpen && (
        <SelectDropdown
          ref={selectDropdownRef}
          isMultiSelect={isMultiSelect}
          isOptional={isOptional}
          items={items}
          position={dropdownPosition}
          value={value}
          handleChange={handleChange}
        />
      )}
    </div>
  );
};

export default Select;
