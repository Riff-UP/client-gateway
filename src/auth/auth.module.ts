import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleCallbackGuard } from './guards/google-callback.guard.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE, EVENTS_SERVICE } from '../config/services.js';
import { envs } from '../config/index.js';
import { PublisherService } from '../common/publisher.service.js';
import { AuthThrottlerGuard } from './guards/auth-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '24h' },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000, // 1 minuto en ms
        limit: 5
      }
    ]),

    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.usersMsHost,
          port: envs.usersMsPort,
        },
      },
      {
        name: EVENTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [envs.rabbitUrl],
          queue: 'riff_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, JwtStrategy, PublisherService, GoogleCallbackGuard, AuthThrottlerGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
