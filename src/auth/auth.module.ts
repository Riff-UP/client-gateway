import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE, EVENTS_SERVICE } from '../config/services.js';
import { envs } from '../config/index.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
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
  providers: [GoogleStrategy, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
