import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT: number;

    NOTIFICATIONS_MICROSERVICE_HOST: string;
    NOTIFICATIONS_MICROSERVICE_PORT: number;

    SESSION_SECRET: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),

    NOTIFICATIONS_MICROSERVICE_HOST: joi.string().required(),
    NOTIFICATIONS_MICROSERVICE_PORT: joi.number().required(),

    SESSION_SECRET: joi.string().required(),
}).unknown(true)

const {error, value} = envSchema.validate(process.env)

if(error){
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars : EnvVars = value

export const envs = {
    port: envVars.PORT,
    usersMsHost: envVars.USERS_MICROSERVICE_HOST,
    usersMsPort: envVars.USERS_MICROSERVICE_PORT,

    notificationsMsHost: envVars.NOTIFICATIONS_MICROSERVICE_HOST,
    notificationsMsPort: envVars.NOTIFICATIONS_MICROSERVICE_PORT,

    sessionSecret: envVars.SESSION_SECRET,
}