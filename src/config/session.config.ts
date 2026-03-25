import { Logger } from '@nestjs/common';
import session from 'express-session';
import { createClient as createRedisClient } from 'redis';
import { envs } from './index.js';

const logger = new Logger('SessionConfig');

const _connectRedis = require('connect-redis');
const ConnectRedis =
  _connectRedis && _connectRedis.default
    ? _connectRedis.default
    : _connectRedis;

export async function createSessionMiddleware() {
  const redisClient = createRedisClient({
    url: envs.redisUrl,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.error('Redis reconnection failed after 3 attempts');
          return false;
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  let storeInstance: any = undefined;

  try {
    await redisClient.connect();
    logger.log('Redis connected successfully for session store');
    storeInstance = new ConnectRedis({
      client: redisClient as any,
      ttl: 86400,
    });
  } catch (err) {
    logger.warn(
      'Could not connect to Redis for session store. Using MemoryStore (not recommended for production)',
    );
    logger.warn(`Redis error: ${err?.message || err}`);
  }

  return session({
    store: storeInstance,
    secret: envs.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  });
}