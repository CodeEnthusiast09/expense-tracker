import { config as dotenvConfig } from 'dotenv';
import { Module } from '@nestjs/common';
import * as pg from 'pg';

dotenvConfig({ path: '.env', quiet: true });

const sql = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
