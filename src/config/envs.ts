import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  USERS_MICROSERVICE_HOST: string;
  USERS_MICROSERVICE_PORT: number;

  NOTIFICATIONS_MICROSERVICE_HOST: string;
  NOTIFICATIONS_MICROSERVICE_PORT: number;

  CONTENT_MICROSERVICE_HOST: string;
  CONTENT_MICROSERVICE_PORT: number;

  SESSION_SECRET: string;
  JWT_SECRET: string;
  RABBIT_URL: string;
  REDIS_URL: string;

  R2_ENDPOINT: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  ANALYTICS_CALLBACK_URL?: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),

    NOTIFICATIONS_MICROSERVICE_HOST: joi.string().required(),
    NOTIFICATIONS_MICROSERVICE_PORT: joi.number().required(),

    CONTENT_MICROSERVICE_HOST: joi.string().required(),
    CONTENT_MICROSERVICE_PORT: joi.number().required(),

    SESSION_SECRET: joi.string().required(),
    JWT_SECRET: joi.string().default('riff-2026-secret'),
    RABBIT_URL: joi.string().required(),
    REDIS_URL: joi.string().required(),

    R2_ENDPOINT: joi.string().required(),
    R2_ACCESS_KEY: joi.string().required(),
    R2_SECRET_KEY: joi.string().required(),
    R2_BUCKET: joi.string().required(),
    R2_PUBLIC_URL: joi.string().required(),

    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
    ANALYTICS_CALLBACK_URL: joi.string().optional(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  usersMsHost: envVars.USERS_MICROSERVICE_HOST,
  usersMsPort: envVars.USERS_MICROSERVICE_PORT,

  notificationsMsHost: envVars.NOTIFICATIONS_MICROSERVICE_HOST,
  notificationsMsPort: envVars.NOTIFICATIONS_MICROSERVICE_PORT,

  contentMsHost: envVars.CONTENT_MICROSERVICE_HOST,
  contentMsPort: envVars.CONTENT_MICROSERVICE_PORT,

  sessionSecret: envVars.SESSION_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  // Ensure a heartbeat is present on the rabbit URL to reduce unexpected
  // connection closures due to short heartbeats/timeouts. If the user already
  // included query params, append using '&', otherwise use '?'.
  rabbitUrl: envVars.RABBIT_URL.includes('?')
    ? `${envVars.RABBIT_URL}&heartbeat=60`
    : `${envVars.RABBIT_URL}?heartbeat=60`,
  redisUrl: envVars.REDIS_URL,

  r2Endpoint: envVars.R2_ENDPOINT,
  r2AccessKey: envVars.R2_ACCESS_KEY,
  r2SecretKey: envVars.R2_SECRET_KEY,
  r2Bucket: envVars.R2_BUCKET,
  r2PublicUrl: envVars.R2_PUBLIC_URL,

  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: envVars.GOOGLE_CALLBACK_URL,
  analyticsCallbackUrl: envVars.ANALYTICS_CALLBACK_URL ?? '',
};
