import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
