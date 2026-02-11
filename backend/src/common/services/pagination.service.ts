import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export interface PaginationOptions<T extends ObjectLiteral> {
  page: number;
  limit: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: FindManyOptions<T>['order'];
  baseUrl?: string; // Optional: for generating next/prev URLs
}

@Injectable()
export class PaginationService {
  /**
   * Generic pagination method that works with any entity
   * Returns flat pagination structure (no nested "meta")
   */
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions<T>,
  ): Promise<PaginatedResponseDto<T>> {
    const { page, limit, where, order, baseUrl } = options;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count
    const total = await repository.count({ where });

    // Get data
    const data = await repository.find({
      where,
      order,
      skip,
      take: limit,
    });

    // Calculate metadata
    const lastPage = Math.ceil(total / limit);
    const hasMorePages = page < lastPage;
    const hasPreviousPage = page > 1;

    // Build pagination URLs (optional)
    let nextPageUrl: string | null = null;
    let previousPageUrl: string | null = null;

    if (baseUrl) {
      if (hasMorePages) {
        nextPageUrl = `${baseUrl}?page=${page + 1}&limit=${limit}`;
      }
      if (hasPreviousPage) {
        previousPageUrl = `${baseUrl}?page=${page - 1}&limit=${limit}`;
      }
    }

    // Return flat structure (no nested "meta")
    return {
      data,
      currentPage: page,
      perPage: limit,
      total,
      lastPage,
      hasMorePages,
      hasPreviousPage,
      nextPageUrl,
      previousPageUrl,
      url: baseUrl,
    };
  }

  /**
   * Helper to build pagination metadata only
   * Useful when you already have the data
   */
  buildPaginationMeta(
    page: number,
    limit: number,
    total: number,
    baseUrl?: string,
  ): Omit<PaginatedResponseDto<any>, 'data'> {
    const lastPage = Math.ceil(total / limit);
    const hasMorePages = page < lastPage;
    const hasPreviousPage = page > 1;

    let nextPageUrl: string | null = null;
    let previousPageUrl: string | null = null;

    if (baseUrl) {
      if (hasMorePages) {
        nextPageUrl = `${baseUrl}?page=${page + 1}&limit=${limit}`;
      }
      if (hasPreviousPage) {
        previousPageUrl = `${baseUrl}?page=${page - 1}&limit=${limit}`;
      }
    }

    return {
      currentPage: page,
      perPage: limit,
      total,
      lastPage,
      hasMorePages,
      hasPreviousPage,
      nextPageUrl,
      previousPageUrl,
      url: baseUrl,
    };
  }
}
