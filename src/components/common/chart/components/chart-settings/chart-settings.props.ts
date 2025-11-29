export interface ChartSettingsProps {
  isLoading: boolean;
  handleExportChart: () => Promise<void>;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
}
