import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/index.js';
import session from 'express-session';
import passport from 'passport';
const _connectRedis = require('connect-redis');
const ConnectRedis = (_connectRedis && _connectRedis.default) ? _connectRedis.default : _connectRedis;
import { createClient as createRedisClient } from 'redis';
import { UsersClientService } from './users/services/users-client.service.js';
import { RpcCustomExceptionFilter } from './common/index.js';

async function bootstrap() {
  const logger = new Logger('Client-GateWay');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Configurar sesiones
  // Redis client for session store
  const redisClient = createRedisClient({ url: envs.redisUrl });
  try {
    await redisClient.connect();
  } catch (err) {
    // If Redis is not available, app will still run with MemoryStore (not recommended)
    // In production ensure REDIS_URL is reachable.
    // eslint-disable-next-line no-console
    console.warn(
      'Could not connect to Redis for session store:',
      err?.message || err,
    );
  }

  // Use the RedisStore class exported by connect-redis
  const RedisStoreClass = ConnectRedis;
  const storeInstance = redisClient ? new RedisStoreClass({ client: redisClient as any }) : undefined;

  app.use(
    session({
      store: storeInstance as any,
      secret: envs.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 24 horas
      },
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Inicializar Passport y sesiones
  app.use(passport.initialize());
  app.use(passport.session());

  // Serializar y deserializar usuario
  // Serialize only the user id to keep session small
  passport.serializeUser((user: any, done) => {
    done(null, user?.id ?? user?.userId ?? null);
  });

  // Deserialize: fetch full user via UsersClientService
  const usersClient = app.get(UsersClientService);
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await usersClient.findUserById(id);
      done(null, user);
    } catch (err) {
      done(err as any, null);
    }
  });

  await app.listen(envs.port);

  logger.log(`Client-GateWay is running on port ${envs.port}`);
}
void bootstrap();
