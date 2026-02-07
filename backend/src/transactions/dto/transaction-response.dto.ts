import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  amount: number;

  @Expose()
  category: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
