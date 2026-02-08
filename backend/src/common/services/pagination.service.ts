import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  PaginatedResponseDto,
  PaginationMeta,
} from '../dto/paginated-response.dto';

export interface PaginationOptions<T extends ObjectLiteral> {
  page: number;
  limit: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: FindManyOptions<T>['order'];
}

@Injectable()
export class PaginationService {
  /**
   * Generic pagination method that works with any entity
   */
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions<T>,
  ): Promise<PaginatedResponseDto<T>> {
    const { page, limit, where, order } = options;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count
    const totalItems = await repository.count({ where });

    // Get data
    const data = await repository.find({
      where,
      order,
      skip,
      take: limit,
    });

    // Calculate metadata
    const meta: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      hasNextPage: page < Math.ceil(totalItems / limit),
      hasPreviousPage: page > 1,
    };

    return { data, meta };
  }

  /**
   * Helper to build pagination metadata only (useful when you already have data)
   */
  buildMeta(page: number, limit: number, totalItems: number): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
