import { Expose, Transform, Type } from 'class-transformer';
import { transformToNumber } from 'src/common/utils/transform-helpers';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  category: 'income' | 'expense';

  @Expose()
  @Transform(transformToNumber)
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
