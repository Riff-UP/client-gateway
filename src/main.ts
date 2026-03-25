import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/index.js';
import passport from 'passport';
import helmet from 'helmet';
import { helmetConfig, corsConfig, createSessionMiddleware } from './config/index.js';
import { loggerMiddleware } from './common/middleware/logger.middleware.js';
import { UsersClientService } from './users/services/users-client.service.js';
import { RpcCustomExceptionFilter } from './common/index.js';

async function bootstrap() {
  const logger = new Logger('Client-GateWay');

  const app = await NestFactory.create(AppModule);

  app.use(helmet(helmetConfig));
  app.enableCors(corsConfig);
  app.use(loggerMiddleware);
  app.setGlobalPrefix('api');

  app.use(await createSessionMiddleware());

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user?.id ?? user?.userId ?? null);
  });

  const usersClient = app.get(UsersClientService);
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await usersClient.findUserById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  await app.listen(envs.port);
  logger.log(`Client-GateWay is running on port ${envs.port}`);
}
void bootstrap();