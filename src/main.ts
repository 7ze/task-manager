import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('⚡ Server');

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  logger.log(`alive on http://localhost:${PORT}`);
}
bootstrap();
