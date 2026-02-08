import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  category: 'income' | 'expense';

  @IsNotEmpty()
  @IsDateString()
  transactionDate: string;
}
