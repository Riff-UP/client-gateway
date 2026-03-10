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

  // Configurar CORS con más opciones
  app.enableCors({
    origin: [
      'https://riffmx.lat',    // Dominio de producción
      'http://localhost:3000', // Pruebas en local
      'http://localhost:4000', // Frontend y backend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,         // Necesario si usas cookies o sesiones
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,              // Cache preflight por 1 hora
  });

  // Middleware para logging de peticiones (debugging)
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
    next();
  });

  app.setGlobalPrefix('api');

  // Configurar sesiones
  // Redis client for session store
  const redisClient = createRedisClient({
    url: envs.redisUrl,
    socket: {
      connectTimeout: 5000, // 5 seconds timeout
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.error('Redis reconnection failed after 3 attempts');
          return false; // Stop reconnecting
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  let storeInstance: any = undefined;

  try {
    await redisClient.connect();
    logger.log('Redis connected successfully for session store');

    // Use the RedisStore class exported by connect-redis
    const RedisStoreClass = ConnectRedis;
    storeInstance = new RedisStoreClass({
      client: redisClient as any,
      ttl: 86400, // 24 horas en segundos
    });
  } catch (err) {
    // If Redis is not available, app will still run with MemoryStore (not recommended)
    // In production ensure REDIS_URL is reachable.
    logger.warn(
      '⚠️  Could not connect to Redis for session store. Using MemoryStore (not recommended for production)',
    );
    logger.warn(`Redis error: ${err?.message || err}`);
  }

  app.use(
    session({
      store: storeInstance,
      secret: envs.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 24 horas
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
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
