export interface ChartSettingsProps {
  isLoading: boolean;
  handleChartExport: () => Promise<void>;
  handleChartZoom: (zoom: 'in' | 'out' | 'reset') => void;
}
