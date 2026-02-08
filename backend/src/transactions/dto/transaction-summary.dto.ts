import { Expose } from 'class-transformer';

export class TransactionSummaryDto {
  @Expose()
  totalIncome: number;

  @Expose()
  totalExpense: number;

  @Expose()
  balance: number; // income - expense
}
