import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string | string[];
  data?: T;
}

/**
 * Standard success response (no pagination)
 */
export const successResponse = <T>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

/**
 * Paginated success response
 * Flattens pagination fields to root level
 */
export const paginatedSuccessResponse = <T>(
  message: string,
  paginatedData: PaginatedResponseDto<T>,
) => {
  return {
    success: true,
    message,
    data: paginatedData.data,
    currentPage: paginatedData.currentPage,
    perPage: paginatedData.perPage,
    total: paginatedData.total,
    lastPage: paginatedData.lastPage,
    hasMorePages: paginatedData.hasMorePages,
    hasPreviousPage: paginatedData.hasPreviousPage,
    nextPageUrl: paginatedData.nextPageUrl,
    previousPageUrl: paginatedData.previousPageUrl,
    url: paginatedData.url,
  };
};

export const errorResponse = (message: string | string[]): ApiResponse => ({
  success: false,
  message,
});
