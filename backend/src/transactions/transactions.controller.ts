import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PayloadType } from 'src/interface/payload-types';
import { successResponse } from 'src/common/utils/response-helper';
import { GetTransactionsQueryDto } from './dto/transaction-query.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: PayloadType,
  ) {
    const response = await this.transactionsService.create(
      createTransactionDto,
      user.userId,
    );
    return successResponse('Transaction created successfully!', response);
  }

  @Get()
  async findAll(
    @GetUser() user: PayloadType,
    @Query() query: GetTransactionsQueryDto,
  ) {
    const response = await this.transactionsService.findAllByUser(
      user.userId,
      query,
    );

    return successResponse('Transactions retrieved successfully', response);
  }

  @Get('summary')
  async getSummary(@GetUser() user: PayloadType) {
    const response = await this.transactionsService.getSummary(user.userId);
    return successResponse('Summary retrieved successfully', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: PayloadType) {
    const response = await this.transactionsService.findOne(id, user.userId);
    return successResponse('Transaction retrieved successfully', response);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: PayloadType,
  ) {
    const response = await this.transactionsService.update(
      id,
      user.userId,
      updateTransactionDto,
    );
    return successResponse('Transaction updated successfully', response);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @GetUser() user: PayloadType) {
    await this.transactionsService.remove(id, user.userId);
  }
}
