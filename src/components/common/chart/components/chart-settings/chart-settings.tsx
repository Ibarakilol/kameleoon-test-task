import { observer } from 'mobx-react-lite';

import IconButton from '@/components/ui/icon-button';
import Select from '@/components/ui/select';
import MinusIcon from '@/assets/icons/minus.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';

import { useTheme } from '@/contexts/theme-context';
import { ThemeScheme } from '@/constants';
import chartStore from '@/stores/chart-store';

import './chart-settings.scss';

const ChartSettings = observer(() => {
  const { theme, toggleTheme } = useTheme();
  const {
    chartIntervalOptions,
    chartLineStyleOptions,
    chartVariationOptions,
    isChartDataLoading,
    isChartVariationsLoading,
    selectedInterval,
    selectedLineStyle,
    selectedVariations,
    setSelectedInterval,
    setSelectedLineStyle,
    toggleVariation,
  } = chartStore;

  const isLoading = isChartVariationsLoading || isChartDataLoading;

  return (
    <div className="chart-settings">
      <div className="chart-settings__filters">
        <Select
          className="chart-settings__variations"
          allLabel="All variations selected"
          isDisabled={isChartVariationsLoading}
          items={chartVariationOptions}
          value={selectedVariations}
          onSelect={toggleVariation}
        />
        <Select
          isDisabled={isLoading}
          items={chartIntervalOptions}
          value={selectedInterval}
          onSelect={setSelectedInterval}
        />
      </div>
      <div className="chart-settings__options">
        <Select
          isDisabled={isLoading}
          items={chartLineStyleOptions}
          prefix="Line style:"
          value={selectedLineStyle}
          onSelect={setSelectedLineStyle}
        />
        <div className="chart-settings__actions">
          <div className="chart-settings__features">
            <IconButton
              ariaLabel="Toggle theme"
              icon={theme === ThemeScheme.LIGHT ? <></> : <></>}
              onClick={toggleTheme}
            />
            <IconButton
              ariaLabel="Export chart"
              icon={<></>}
              isDisabled={isLoading}
              onClick={() => {}}
            />
          </div>

          <div className="chart-settings__zoom">
            <IconButton
              className="chart-settings__zoom-out"
              ariaLabel="Zoom out"
              icon={<MinusIcon />}
              isDisabled={isLoading}
              onClick={() => {}}
            />
            <IconButton
              className="chart-settings__zoom-in"
              ariaLabel="Zoom in"
              icon={<PlusIcon />}
              isDisabled={isLoading}
              onClick={() => {}}
            />
            <IconButton
              ariaLabel="Reset zoom"
              icon={<RefreshIcon />}
              isDisabled={isLoading}
              theme="halo"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChartSettings;
