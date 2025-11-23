import { type SyntheticEvent, useCallback } from 'react';
import clsx from 'clsx';

import type { IconButtonProps } from './icon-button.props';

import './icon-button.scss';

const IconButton = ({
  className,
  ariaLabel,
  icon,
  isDisabled,
  theme = 'square',
  onClick,
}: IconButtonProps) => {
  const handleClick = useCallback(
    (evt: SyntheticEvent) => {
      evt.preventDefault();
      evt.stopPropagation();

      onClick(evt);
    },
    [onClick]
  );

  return (
    <button
      className={clsx('icon-button', `icon-button_${theme}`, className, {
        ['icon-button_disabled']: isDisabled,
      })}
      aria-label={ariaLabel}
      disabled={isDisabled}
      title={ariaLabel}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};

export default IconButton;
