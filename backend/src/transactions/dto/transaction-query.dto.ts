import { IsOptional, IsEnum, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TransactionSortBy)
  sortBy?: TransactionSortBy = TransactionSortBy.UPDATED;
}
