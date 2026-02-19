import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { envs } from 'src/config';

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
        }
      }
    ])
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}