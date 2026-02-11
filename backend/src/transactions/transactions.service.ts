import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionSummaryDto } from './dto/transaction-summary.dto';
import { GetTransactionsQueryDto } from './dto/transaction-query.dto';
import { PaginatedTransactionsResponseDto } from './dto/paginated-transactions-response.dto';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = this.transactionRepo.create({
      ...createTransactionDto,
      user: { id: userId },
    });

    const savedTxn = await this.transactionRepo.save(transaction);

    return plainToInstance(TransactionResponseDto, savedTxn, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByUser(
    userId: string,
    query: GetTransactionsQueryDto,
  ): Promise<PaginatedTransactionsResponseDto> {
    const {
      page = 1,
      limit = 30,
      category,
      search,
      year,
      month,
      order = 'desc',
    } = query;

    // Build where clause
    const where: FindOptionsWhere<Transaction> = {
      user: { id: userId },
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.description = Like(`%${search}%`);
    }

    // Filter by year and/or month
    if (year || month) {
      const startDate = new Date(
        year || new Date().getFullYear(),
        month ? month - 1 : 0,
        1,
      );
      const endDate = new Date(
        year || new Date().getFullYear(),
        month ? month : 12,
        0,
      );

      where.transactionDate = Between(startDate, endDate);
    }

    // Convert order string to uppercase for TypeORM
    const orderDirection = order.toUpperCase() as 'ASC' | 'DESC';

    // Use pagination service
    const result = await this.paginationService.paginate(this.transactionRepo, {
      page,
      limit,
      where,
      order: { updatedAt: orderDirection },
    });

    // Transform to DTOs
    const data = plainToInstance(TransactionResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return {
      data,
      meta: result.meta,
    };
  }

  async findOne(id: string, userId: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction not found`);
    }

    if (transaction.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this transaction',
      );
    }

    return plainToInstance(TransactionResponseDto, transaction, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    await this.findOne(id, userId);

    await this.transactionRepo.update(id, updateTransactionDto);

    const updatedTransaction = await this.transactionRepo.findOne({
      where: { id },
    });

    return plainToInstance(TransactionResponseDto, updatedTransaction, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.transactionRepo.delete(id);
  }

  async getSummary(userId: string): Promise<TransactionSummaryDto> {
    interface QueryResult {
      category: string;
      total: string;
      count: string;
    }

    // get all transactions for this user
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'total')
      .addSelect('COUNT(transaction.id)', 'count')
      .where('transaction.userId = :userId', { userId })
      .groupBy('transaction.category')
      .getRawMany<QueryResult>();

    // Initialize summary
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0,
      balance: 0,
    };

    // Process the aggregated results
    result.forEach((row) => {
      const total = parseFloat(row.total) || 0;
      const count = parseInt(row.count, 10) || 0;

      if (row.category === 'income') {
        summary.totalIncome = total;
      } else if (row.category === 'expense') {
        summary.totalExpense = total;
      }

      summary.transactionCount += count;
    });

    // Calculate balance (income - expense)
    summary.balance = summary.totalIncome - summary.totalExpense;

    // Round to 2 decimal places
    summary.totalIncome = Math.round(summary.totalIncome * 100) / 100;

    summary.totalExpense = Math.round(summary.totalExpense * 100) / 100;

    summary.balance = Math.round(summary.balance * 100) / 100;

    return plainToInstance(TransactionSummaryDto, summary, {
      excludeExtraneousValues: true,
    });
  }
}
