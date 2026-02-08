import {
  FindOptionsWhere,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  ObjectLiteral,
} from 'typeorm';

export class QueryBuilderUtil {
  /**
   * Build a LIKE filter for search
   * @returns Partial where clause - empty if no search term provided
   */
  static buildSearchFilter<T extends ObjectLiteral>(
    field: keyof T,
    searchTerm?: string,
  ): Partial<FindOptionsWhere<T>> {
    if (!searchTerm) return {};
    return { [field]: Like(`%${searchTerm}%`) } as FindOptionsWhere<T>;
  }

  /**
   * Build a date range filter
   * @returns Partial where clause - empty if no dates provided
   */
  static buildDateRangeFilter<T extends ObjectLiteral>(
    field: keyof T,
    startDate?: Date,
    endDate?: Date,
  ): Partial<FindOptionsWhere<T>> {
    if (startDate && endDate) {
      return { [field]: Between(startDate, endDate) } as FindOptionsWhere<T>;
    }
    if (startDate) {
      return { [field]: MoreThanOrEqual(startDate) } as FindOptionsWhere<T>;
    }
    if (endDate) {
      return { [field]: LessThanOrEqual(endDate) } as FindOptionsWhere<T>;
    }
    return {};
  }

  /**
   * Build enum filter
   * @returns Partial where clause - empty if no value provided
   */
  static buildEnumFilter<T extends ObjectLiteral>(
    field: keyof T,
    value?: string,
  ): Partial<FindOptionsWhere<T>> {
    if (!value) return {};
    return { [field]: value } as FindOptionsWhere<T>;
  }
}
