import { makeAutoObservable, reaction } from 'mobx';

import { fetchChartData, fetchChartVariations } from '@/api';
import { CHART_INTERVALS, CHART_LINE_STYLES } from '@/constants';
import { getSelectOptions } from '@/utils';
import type { IChartData, IChartVariation, ISelectOption } from '@/interfaces';

class ChartStore {
  async init() {
    this.setIsLoading(true);

    await Promise.all([this.loadChartVariations(), this.loadChartData()]);

    this.setIsLoading(false);
  }

  chartData: IChartData[] = [];
  chartVariations: IChartVariation[] = [];
  isChartDataLoading: boolean = false;
  isLoading: boolean = false;
  selectedInterval: string = this.chartIntervalOptions[0].id;
  selectedLineStyle: string = this.chartLineStyleOptions[0].id;
  selectedVariation: string = '';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.selectedVariation,
      (selectedVariation) => {
        this.loadChartData(selectedVariation);
      }
    );
  }

  setChartData(chartData: IChartData[]) {
    this.chartData = chartData;
  }

  setChartVariations(chartVariations: IChartVariation[]) {
    this.chartVariations = chartVariations;
  }

  setIsChartDataLoading(isChartDataLoading: boolean) {
    this.isChartDataLoading = isChartDataLoading;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setSelectedInterval(selectedInterval: string) {
    this.selectedInterval = selectedInterval;
  }

  setSelectedLineStyle(selectedLineStyle: string) {
    this.selectedLineStyle = selectedLineStyle;
  }

  setSelectedVariation(selectedVariation: string) {
    this.selectedVariation = selectedVariation;
  }

  clearStore() {
    this.setChartData([]);
    this.setChartVariations([]);
    this.setIsChartDataLoading(false);
    this.setIsLoading(false);
  }

  get chartIntervalOptions() {
    return getSelectOptions(CHART_INTERVALS);
  }

  get chartLineStyleOptions() {
    return getSelectOptions(CHART_LINE_STYLES);
  }

  get chartVariationOptions(): ISelectOption[] {
    return this.chartVariations.map(({ id, name }) => ({
      id: typeof id === 'number' ? id.toString() : '0',
      value: name,
    }));
  }

  async loadChartVariations() {
    const { data, isSuccess } = await fetchChartVariations();

    if (isSuccess) {
      this.setChartVariations(data);

      if (!this.selectedVariation) {
        this.setSelectedVariation(this.chartVariationOptions[0].id);
      }
    }
  }

  async loadChartData(variation?: string) {
    this.setIsChartDataLoading(true);

    const { data, isSuccess } = await fetchChartData(variation);

    if (isSuccess) {
      this.setChartData(data);
    }

    this.setIsChartDataLoading(false);
  }
}

export default new ChartStore();
