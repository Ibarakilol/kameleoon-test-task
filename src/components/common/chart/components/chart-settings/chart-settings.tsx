import { observer } from 'mobx-react-lite';

import IconButton from '@/components/ui/icon-button';
import Select from '@/components/ui/select';
import MinusIcon from '@/assets/icons/minus.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import UnselectIcon from '@/assets/icons/unselect.svg';

import chartStore from '@/stores/chart-store';

import './chart-settings.scss';

const ChartSettings = observer(() => {
  const {
    chartIntervalOptions,
    chartLineStyleOptions,
    chartVariationOptions,
    isChartDataLoading,
    isLoading,
    selectedInterval,
    selectedLineStyle,
    selectedVariation,
    setSelectedInterval,
    setSelectedLineStyle,
    setSelectedVariation,
  } = chartStore;

  return (
    <div className="chart-settings">
      <div className="chart-settings__filters">
        <Select
          isDisabled={isLoading}
          items={chartVariationOptions}
          value={selectedVariation}
          onSelect={setSelectedVariation}
        />
        <Select
          isDisabled={isLoading || isChartDataLoading}
          items={chartIntervalOptions}
          value={selectedInterval}
          onSelect={setSelectedInterval}
        />
      </div>
      <div className="chart-settings__options">
        <Select
          isDisabled={isLoading || isChartDataLoading}
          items={chartLineStyleOptions}
          prefix="Line style:"
          value={selectedLineStyle}
          onSelect={setSelectedLineStyle}
        />
        <div className="chart-settings__actions">
          <IconButton ariaLabel="Unselect" icon={<UnselectIcon />} isDisabled onClick={() => {}} />

          <div className="chart-settings__zoom">
            <IconButton
              className="chart-settings__zoom-out"
              ariaLabel="Zoom out"
              icon={<MinusIcon />}
              isDisabled={isLoading || isChartDataLoading}
              onClick={() => {}}
            />
            <IconButton
              className="chart-settings__zoom-in"
              ariaLabel="Zoom in"
              icon={<PlusIcon />}
              isDisabled={isLoading || isChartDataLoading}
              onClick={() => {}}
            />
            <IconButton
              ariaLabel="Reset zoom"
              icon={<RefreshIcon />}
              isDisabled={isLoading || isChartDataLoading}
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
