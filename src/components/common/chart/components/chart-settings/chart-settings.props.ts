export interface ChartSettingsProps {
  handleExportChart: () => Promise<void>;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
}
