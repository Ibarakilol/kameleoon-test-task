import { makeAutoObservable, reaction } from 'mobx';

import { fetchChartData, fetchChartVariations } from '@/api';
import { CHART_INTERVALS, CHART_LINE_STYLES } from '@/constants';
import { getSelectOptions } from '@/utils';
import type { IChartData, IChartVariation, ISelectOption } from '@/interfaces';

class ChartStore {
  async init() {
    await this.loadChartVariations();
  }

  chartData: IChartData[] = [];
  chartVariations: IChartVariation[] = [];
  isChartDataLoading: boolean = false;
  isChartVariationsLoading: boolean = false;
  selectedInterval: string = this.chartIntervalOptions[0].id;
  selectedLineStyle: string = this.chartLineStyleOptions[0].id;
  selectedVariations: string[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.selectedVariations,
      (selectedVariations) => {
        this.loadChartData(selectedVariations);
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

  setIsChartVariationsLoading(isChartVariationsLoading: boolean) {
    this.isChartVariationsLoading = isChartVariationsLoading;
  }

  setSelectedInterval(selectedInterval: string) {
    this.selectedInterval = selectedInterval;
  }

  setSelectedLineStyle(selectedLineStyle: string) {
    this.selectedLineStyle = selectedLineStyle;
  }

  setSelectedVariations(selectedVariations: string[]) {
    this.selectedVariations = selectedVariations;
  }

  toggleVariation(selectedVariation: string) {
    if (this.selectedVariations.includes(selectedVariation)) {
      this.setSelectedVariations(
        this.selectedVariations.filter((item) => selectedVariation !== item)
      );
    } else {
      this.setSelectedVariations([...this.selectedVariations, selectedVariation]);
    }
  }

  clearStore() {
    this.setChartData([]);
    this.setChartVariations([]);
    this.setIsChartDataLoading(false);
    this.setIsChartVariationsLoading(false);
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
    this.setIsChartVariationsLoading(true);

    const { data, isSuccess } = await fetchChartVariations();

    if (isSuccess) {
      this.setChartVariations(data);
      this.setSelectedVariations([this.chartVariationOptions[0].id]);
    }

    this.setIsChartVariationsLoading(false);
  }

  async loadChartData(variations?: string[]) {
    this.setIsChartDataLoading(true);

    const { data, isSuccess } = await fetchChartData(variations);

    if (isSuccess) {
      this.setChartData(data);
    }

    this.setIsChartDataLoading(false);
  }
}

export default new ChartStore();
