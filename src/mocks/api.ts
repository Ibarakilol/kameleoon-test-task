import type { InternalAxiosRequestConfig } from 'axios';

import { MOCK_API_DATA } from './data';
import { MOCK_API_VARIATIONS } from './variations';

import { ApiResponseStatus, ApiRoute } from '@/constants';
import { parseJSON } from '@/utils';

export const getMockedApiResponse = ({
  data,
  method,
  url,
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
      [ApiRoute.VARIATIONS]: () => {
        return { data: MOCK_API_VARIATIONS };
      },
      [ApiRoute.DATA]: () => {
        return { data: MOCK_API_DATA };
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
