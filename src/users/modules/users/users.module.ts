import { Module } from '@nestjs/common';
import { UsersController } from '../../controllers/users/users.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../../config/services.js';
import { envs } from '../../../config/index.js';
import { UsersClientService } from '../../services/users-client.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersClientService],
  imports: [
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.usersMsHost,
          port: envs.usersMsPort,
        },
      },
    ]),
  ],
})
export class UsersModule {}
