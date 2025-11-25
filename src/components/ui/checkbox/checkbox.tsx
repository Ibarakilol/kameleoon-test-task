import { type FormEvent, type KeyboardEvent, useId } from 'react';
import clsx from 'clsx';

import { Key } from '@/constants';
import type { CheckboxProps } from './checkbox.props';

import './checkbox.scss';

const Checkbox = ({ className, isChecked, isDisabled, label, onChange }: CheckboxProps) => {
  const id = useId();

  const handleChange = (evt: FormEvent<HTMLInputElement>) => onChange(evt.currentTarget.checked);

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === Key.ENTER) {
      onChange(!evt.currentTarget.checked);
    }
  };

  return (
    <div
      className={clsx('checkbox', className, {
        checkbox_checked: isChecked,
        checkbox_disabled: isDisabled,
        'checkbox_with-content': label,
      })}
      onClick={(evt) => evt.stopPropagation()}
    >
      <input
        className="checkbox__input"
        id={id}
        checked={isChecked}
        disabled={isDisabled}
        type="checkbox"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <label className="checkbox__label" htmlFor={id}>
        <span className="checkbox__icon-wrapper">
          <span className="checkbox__square-icon">
            <span className="checkbox__check-icon" />
          </span>
        </span>
        {label && <span className="checkbox__label-text">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
