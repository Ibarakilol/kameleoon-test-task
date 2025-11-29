import { useEffect, useState } from 'react';

import LoaderIcon from '@/assets/icons/loader.svg';

import type { LoaderProps } from './loader.props';

import './loader.scss';

const DEBOUNCE_INTERVAL = 300;

const Loader = ({ debounceTime = DEBOUNCE_INTERVAL }: LoaderProps) => {
  const [showComponent, setShowComponent] = useState(!!debounceTime);

  useEffect(() => {
    const timer = setTimeout(() => setShowComponent(true), debounceTime);
    return () => clearTimeout(timer);
  }, [debounceTime]);

  return showComponent ? (
    <div className="loader">
      <LoaderIcon className="loader__spinner" />
    </div>
  ) : null;
};

export default Loader;
