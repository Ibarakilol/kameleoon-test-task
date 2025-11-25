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
    },
    post: {
      [ApiRoute.DATA]: () => {
        const { variations } = requestPayload;
        const data =
          variations && variations.length
            ? MOCK_API_DATA.map((dataItem) => {
                const filteredConversions = Object.fromEntries(
                  Object.entries(dataItem.conversions).filter(([variation]) =>
                    variations.includes(variation)
                  )
                );

                const filteredVisits = Object.fromEntries(
                  Object.entries(dataItem.visits).filter(([variation]) =>
                    variations.includes(variation)
                  )
                );

                return {
                  conversions: filteredConversions,
                  date: dataItem.date,
                  visits: filteredVisits,
                };
              })
            : MOCK_API_DATA;

        return { data };
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
