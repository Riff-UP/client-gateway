import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';
import { envs } from './config/index.js';

async function bootstrap() {

  const logger = new Logger('Client-GateWay')

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  await app.listen(envs.port);

  logger.log(`Client-GateWay is running on port ${envs.port}`);
}
bootstrap();
