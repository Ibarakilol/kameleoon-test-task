export interface IChartVariation {
  id?: number;
  name: string;
}

export interface IChartData {
  conversions: Record<string, number>;
  date: string;
  visits: Record<string, number>;
}

export interface IChartLine {
  conversionRate: number;
  date: Date;
}

export interface IChartPopupConversionRate {
  conversionRate: number;
  variationName: string;
  variationColor: string;
}

export interface IChartPopupData {
  conversionRates: IChartPopupConversionRate[];
  date: string;
  xAxis: number;
  yAxis: number;
}
