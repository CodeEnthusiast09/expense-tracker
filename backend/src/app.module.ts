import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validate: validate,
    }),
    TransactionsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
