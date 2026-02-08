import { TransactionResponseDto } from './transaction-response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

// Just extend the generic type - no need to redefine everything!
export class PaginatedTransactionsResponseDto extends PaginatedResponseDto<TransactionResponseDto> {}
