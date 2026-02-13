import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';
import { envs } from './config/index.js';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {

  const logger = new Logger('Client-GateWay')

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  // Configurar sesiones
  app.use(
    session({
      secret: envs.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 24 horas
      },
    }),
  );

  // Inicializar Passport y sesiones
  app.use(passport.initialize());
  app.use(passport.session());

  // Serializar y deserializar usuario
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  await app.listen(envs.port);

  logger.log(`Client-GateWay is running on port ${envs.port}`);
}
bootstrap();
