import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionSortBy {
  DATE = 'createdAt',
  AMOUNT = 'amount',
  UPDATED = 'updatedAt',
}

// Extend the base pagination DTO
export class GetTransactionsQueryDto extends PaginationQueryDto {
  // Add transaction-specific filters
  @IsOptional()
  @IsEnum(TransactionType)
  category?: TransactionType;

  // Filter by year
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  // Filter by month (1-12)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
}
