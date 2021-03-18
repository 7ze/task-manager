import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const port: number = config.get('server.port');
  const logger = new Logger('⚡ Server');
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? port;

  await app.listen(PORT);

  logger.log(`alive on http://localhost:${PORT}`);
}

bootstrap();
