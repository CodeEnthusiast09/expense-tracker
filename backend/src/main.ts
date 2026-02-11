import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: false,
      },
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`The application is running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Unhandled error in bootstrap:', error);

  process.exit(1);
});
