import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import ChartSettings from './components/chart-settings';

import chartStore from '@/stores/chart-store';

import './chart.scss';

const Chart = observer(() => {
  const { chartData, clearStore, init } = chartStore;

  console.log(chartData);

  useEffect(() => {
    void init();

    return () => {
      clearStore();
    };
  }, [clearStore, init]);

  return (
    <div className="chart">
      <ChartSettings />
    </div>
  );
});

export default Chart;
