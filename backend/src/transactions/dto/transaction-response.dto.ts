import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  category: 'income' | 'expense';

  @Expose()
  amount: number;

  @Expose()
  transactionDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
