import { doGet, doPost } from './axios-config';

import { ApiRoute } from '@/constants';
import type { IChartData, IChartVariation, TApiResponse } from '@/interfaces';

export const fetchChartVariations = async (): Promise<TApiResponse<IChartVariation[]>> => {
  try {
    const result = await doGet<IChartVariation[]>(ApiRoute.VARIATIONS);

    return { isSuccess: true, data: result.data };
  } catch (err: any) {
    console.log(err);
    return { isSuccess: false, error: err.response?.data?.message };
  }
};

export const fetchChartData = async (variation?: string): Promise<TApiResponse<IChartData[]>> => {
  try {
    const result = await doPost<IChartData[]>(ApiRoute.DATA, { variation });

    return { isSuccess: true, data: result.data };
  } catch (err: any) {
    console.log(err);
    return { isSuccess: false, error: err.response?.data?.message };
  }
};
