interface IApiSuccessResponse<T> {
  data: T;
  error?: never;
  isSuccess: true;
}

interface IApiErrorResponse {
  data?: never;
  error?: string;
  isSuccess: false;
}

export type TApiResponse<T = never> =
  | ([T] extends [never] ? Omit<IApiSuccessResponse<T>, 'data'> : IApiSuccessResponse<T>)
  | IApiErrorResponse;
