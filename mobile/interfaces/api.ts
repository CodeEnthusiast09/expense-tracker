import { AxiosResponse } from "axios";

export interface ApiError extends Error {
  message: string;
}

export interface APIResponse extends AxiosResponse {
  success?: boolean;
  message?: string;
  data: any;
}

export interface ErrorObject {
  message?: string;
}

export interface ServerErrorResponse {
  error?: string;
  message?: string;
  errors?: Record<string, ErrorObject | ErrorObject[] | string>;
}
