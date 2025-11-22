import { forwardRef } from 'react';
import clsx from 'clsx';

import type { SelectDropdownProps } from './select-dropdown.props';

import './select-dropdown.scss';

const SelectDropdown = forwardRef<HTMLDivElement, SelectDropdownProps>(
  ({ isOptional, items, position = 'bottom', value, handleChange }, ref) => {
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
              const isActive = item.id === value;

              return (
                <button
                  className={clsx('select-dropdown__item', {
                    ['select-dropdown__item_active']: isActive,
                    ['select-dropdown__item_empty']: !item.value,
                  })}
                  key={item.id}
                  tabIndex={isActive ? -1 : 0}
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
