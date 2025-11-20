import type { InternalAxiosRequestConfig } from 'axios';

import { MOCK_API_DATA } from './data';
import { MOCK_API_VARIATIONS } from './variations';

import { ApiResponseStatus, ApiRoute } from '@/constants';
import { parseJSON } from '@/utils';

export const getMockedApiResponse = ({
  data,
  method,
  url,
  params = {},
}: Required<InternalAxiosRequestConfig>) => {
  let requestPayload: any = {};

  if (data) {
    if (data instanceof FormData) {
      data.forEach((value, key) => {
        requestPayload[key] = parseJSON(value);
      });
    } else {
      requestPayload = JSON.parse(data);
    }
  }

  const mockedResponses: Record<string, Record<string, any>> = {
    get: {
      [ApiRoute.DATA]: () => {
        const { variation = '0' } = params || {};
        const data = MOCK_API_DATA.map((dataItem) => ({
          conversions: dataItem.conversions[variation] || 0,
          date: dataItem.date,
          visits: dataItem.visits[variation] || 0,
        }));

        return { data };
      },
      [ApiRoute.VARIATIONS]: () => {
        return { data: MOCK_API_VARIATIONS };
      },
    },
  };

  const response = mockedResponses[method]?.[url];

  if (response) {
    return {
      status: ApiResponseStatus.SUCCESS,
      ...response(),
    };
  }
};
