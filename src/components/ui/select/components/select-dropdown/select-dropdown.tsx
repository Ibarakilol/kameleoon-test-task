import { forwardRef, useCallback } from 'react';
import clsx from 'clsx';

import Checkbox from '@/components/ui/checkbox';

import type { SelectDropdownProps } from './select-dropdown.props';

import './select-dropdown.scss';

const SelectDropdown = forwardRef<HTMLDivElement, SelectDropdownProps>(
  ({ isMultiSelect, isOptional, items, position = 'bottom', value, handleChange }, ref) => {
    const getIsItemActive = useCallback(
      (itemId: string) => {
        if (!isMultiSelect) {
          return itemId === value;
        }

        return value.includes(itemId);
      },
      [isMultiSelect, value]
    );

    return (
      <div
        className={clsx(
          'select-dropdown',
          position === 'bottom' ? 'select-dropdown_bottom' : 'select-dropdown_top'
        )}
        ref={ref}
      >
        <div className="select-dropdown__wrapper scrollbar">
          <div className="select-dropdown__container">
            {isOptional && (
              <button className="select-dropdown__item" onClick={() => handleChange(null)}>
                -
              </button>
            )}
            {items.map((item) => {
              const isItemActive = getIsItemActive(item.id);

              return isMultiSelect ? (
                <Checkbox
                  className={clsx('select-dropdown__item', {
                    'select-dropdown__item_checkbox': isMultiSelect,
                  })}
                  key={item.id}
                  isChecked={isItemActive}
                  label={item.value}
                  onChange={() => handleChange(item)}
                />
              ) : (
                <button
                  className={clsx('select-dropdown__item', {
                    'select-dropdown__item_active': isItemActive,
                    'select-dropdown__item_empty': !item.value,
                  })}
                  key={item.id}
                  tabIndex={isItemActive ? -1 : 0}
                  onClick={() => handleChange(item)}
                >
                  {item.value}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

export default SelectDropdown;
